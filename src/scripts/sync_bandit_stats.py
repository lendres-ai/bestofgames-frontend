#!/usr/bin/env python3
"""
Sync Hero Bandit Stats from Umami (Self-Hosted)

This script fetches hero_impression and hero_click events from a self-hosted
Umami instance for the last 10 days and updates the hero_bandit_stats table in Postgres.

Usage:
    python sync_bandit_stats.py

Environment Variables:
    UMAMI_URL          - Umami base URL (e.g., https://analytics.yourdomain.com)
    UMAMI_USERNAME     - Umami username
    UMAMI_PASSWORD     - Umami password
    UMAMI_WEBSITE_ID   - Website ID in Umami
    DATABASE_URL       - Postgres connection string
"""

import os
import sys
from datetime import datetime, timedelta, timezone
from collections import defaultdict

import httpx
import psycopg2
from psycopg2.extras import execute_values

# Configuration
LOOKBACK_DAYS = 10


def authenticate(base_url: str, username: str, password: str) -> str:
    """Authenticate with Umami and return JWT token."""
    url = f"{base_url}/api/auth/login"
    
    with httpx.Client(timeout=30) as client:
        response = client.post(url, json={
            "username": username,
            "password": password
        })
        response.raise_for_status()
        data = response.json()
        return data["token"]


def get_event_metrics(
    base_url: str, 
    website_id: str, 
    token: str,
    event_name: str,
    start_at: datetime, 
    end_at: datetime
) -> dict[str, int]:
    """
    Fetch event metrics from Umami API.
    Uses the /metrics endpoint with type=event and filters by event name.
    Returns a dict of {event_data_value: count}
    """
    url = f"{base_url}/api/websites/{website_id}/metrics"
    
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json",
    }
    
    params = {
        "startAt": int(start_at.timestamp() * 1000),
        "endAt": int(end_at.timestamp() * 1000),
        "type": "event",
    }
    
    with httpx.Client(timeout=30) as client:
        response = client.get(url, headers=headers, params=params)
        response.raise_for_status()
        data = response.json()
    
    # Filter for our specific event and aggregate
    # The response is [{"x": "event_name", "y": count}, ...]
    for item in data:
        if item.get("x") == event_name:
            return {"total": item.get("y", 0)}
    
    return {"total": 0}


def get_events_by_game(
    base_url: str,
    website_id: str,
    token: str,
    event_name: str,
    start_at: datetime,
    end_at: datetime,
    property_name: str = "game"
) -> dict[str, int]:
    """
    Fetch events and group by game from event data.
    Uses the /event-data/values endpoint to get aggregated counts per game.
    
    Per Umami docs: GET /api/websites/:websiteId/event-data/values
    Returns: [{ "value": "game-slug", "total": 28 }, ...]
    
    Args:
        property_name: The event data property to group by (e.g., "game" or "game_id")
    """
    url = f"{base_url}/api/websites/{website_id}/event-data/values"
    
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json",
    }
    
    params = {
        "startAt": int(start_at.timestamp() * 1000),
        "endAt": int(end_at.timestamp() * 1000),
        "event": event_name,
        "propertyName": property_name,
    }
    
    with httpx.Client(timeout=30) as client:
        response = client.get(url, headers=headers, params=params)
        
        # If event-data endpoint doesn't exist, fall back to metrics
        if response.status_code == 404:
            print(f"    /event-data/values endpoint not available, using /metrics fallback")
            return get_event_metrics_fallback(base_url, website_id, token, event_name, start_at, end_at)
        
        response.raise_for_status()
        data = response.json()
    
    # The response is a list: [{"value": "game-slug", "total": N}, ...]
    counts = {}
    
    if isinstance(data, list):
        for item in data:
            value = item.get("value")
            total = item.get("total", 0)
            if value:
                counts[value] = total
    elif isinstance(data, dict):
        # Handle paginated response if the API returns one
        items = data.get("data", [])
        for item in items:
            value = item.get("value")
            total = item.get("total", 0)
            if value:
                counts[value] = total
    
    return counts


def get_event_metrics_fallback(
    base_url: str,
    website_id: str,
    token: str,
    event_name: str,
    start_at: datetime,
    end_at: datetime
) -> dict[str, int]:
    """
    Fallback: Get total event count from metrics endpoint.
    Note: This won't give us per-game breakdown, just total count.
    """
    url = f"{base_url}/api/websites/{website_id}/metrics"
    
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json",
    }
    
    params = {
        "startAt": int(start_at.timestamp() * 1000),
        "endAt": int(end_at.timestamp() * 1000),
        "type": "event",
    }
    
    with httpx.Client(timeout=30) as client:
        response = client.get(url, headers=headers, params=params)
        response.raise_for_status()
        data = response.json()
    
    # Find our event in the list
    for item in data:
        if item.get("x") == event_name:
            # We can't get per-game breakdown from this endpoint
            print(f"    Warning: Using total count fallback, no per-game breakdown available")
            print(f"    Total {event_name}: {item.get('y', 0)}")
    
    # Return empty dict since we can't get per-game data
    return {}


def get_game_scores(conn) -> dict[str, float]:
    """Fetch review scores for all games."""
    with conn.cursor() as cur:
        cur.execute("""
            SELECT g.id, r.score
            FROM games g
            JOIN reviews r ON r.game_id = g.id
            WHERE r.is_published = true
        """)
        return {str(row[0]): float(row[1]) if row[1] else None for row in cur.fetchall()}


def convert_score_to_prior(score: float | None) -> tuple[float, float]:
    """Convert review score to Beta prior parameters."""
    if score is None:
        return 1.0, 1.0
    
    normalized = max(0, min(10, score)) / 10
    alpha = 0.5 + normalized  # Range: 0.5 to 1.5
    beta = 1.5 - normalized   # Range: 1.5 to 0.5
    
    return round(alpha, 2), round(beta, 2)


def get_game_id_by_slug(conn, slug: str) -> str | None:
    """Look up game UUID by slug."""
    with conn.cursor() as cur:
        cur.execute("SELECT id FROM games WHERE slug = %s", (slug,))
        row = cur.fetchone()
        return str(row[0]) if row else None


def upsert_bandit_stats(conn, impressions: dict[str, int], clicks: dict[str, int]):
    """Upsert stats into hero_bandit_stats table."""
    game_scores = get_game_scores(conn)
    
    # Build slug -> id mapping for all slugs we have events for
    all_slugs = set(impressions.keys()) | set(clicks.keys())
    slug_to_id = {}
    
    for slug in all_slugs:
        game_id = get_game_id_by_slug(conn, slug)
        if game_id:
            slug_to_id[slug] = game_id
        else:
            print(f"    Warning: Game slug '{slug}' not found in database")
    
    # Prepare rows
    rows = []
    for slug, game_id in slug_to_id.items():
        imp_count = impressions.get(slug, 0)
        click_count = clicks.get(slug, 0)
        score = game_scores.get(game_id)
        alpha, beta = convert_score_to_prior(score)
        
        rows.append((
            game_id,
            imp_count,
            click_count,
            alpha,
            beta,
            datetime.now(timezone.utc),
        ))
    
    if not rows:
        print("  No stats to update")
        return
    
    # Upsert using ON CONFLICT
    with conn.cursor() as cur:
        execute_values(
            cur,
            """
            INSERT INTO hero_bandit_stats (game_id, impressions_10d, clicks_10d, prior_alpha, prior_beta, updated_at)
            VALUES %s
            ON CONFLICT (game_id) DO UPDATE SET
                impressions_10d = EXCLUDED.impressions_10d,
                clicks_10d = EXCLUDED.clicks_10d,
                updated_at = EXCLUDED.updated_at
            """,
            rows
        )
    
    conn.commit()
    print(f"  Updated {len(rows)} games in hero_bandit_stats")


def main():
    """Main execution function."""
    # Load credentials
    UMAMI_URL = os.getenv("UMAMI_URL")
    UMAMI_USERNAME = os.getenv("UMAMI_USERNAME")
    UMAMI_PASSWORD = os.getenv("UMAMI_PASSWORD")
    UMAMI_WEBSITE_ID = os.getenv("UMAMI_WEBSITE_ID")
    DATABASE_URL = os.getenv("DATABASE_URL")
    
    # Validate environment
    missing = []
    if not UMAMI_URL:
        missing.append("UMAMI_URL")
    if not UMAMI_USERNAME:
        missing.append("UMAMI_USERNAME")
    if not UMAMI_PASSWORD:
        missing.append("UMAMI_PASSWORD")
    if not UMAMI_WEBSITE_ID:
        missing.append("UMAMI_WEBSITE_ID")
    if not DATABASE_URL:
        missing.append("DATABASE_URL")
    
    if missing:
        print(f"Error: Missing environment variables: {', '.join(missing)}")
        sys.exit(1)
    
    print(f"Syncing bandit stats for last {LOOKBACK_DAYS} days...")
    print(f"  Umami URL: {UMAMI_URL}")
    print(f"  Website ID: {UMAMI_WEBSITE_ID}")
    
    end_at = datetime.now(timezone.utc)
    start_at = end_at - timedelta(days=LOOKBACK_DAYS)
    
    print(f"  Time range: {start_at.isoformat()} to {end_at.isoformat()}")
    
    # Authenticate with Umami
    print("  Authenticating with Umami...")
    try:
        token = authenticate(UMAMI_URL, UMAMI_USERNAME, UMAMI_PASSWORD)
        print("  ✓ Authentication successful")
    except httpx.HTTPStatusError as e:
        print(f"  ✗ Authentication failed: {e}")
        sys.exit(1)
    
    # Fetch events from Umami
    # Note: hero_impression uses "game_id" property, hero_click uses "game" property
    print("  Fetching hero_impression events...")
    impressions = get_events_by_game(UMAMI_URL, UMAMI_WEBSITE_ID, token, "hero_impression", start_at, end_at, property_name="game_id")
    print(f"    Found impressions for {len(impressions)} games")
    
    print("  Fetching hero_click events...")
    clicks = get_events_by_game(UMAMI_URL, UMAMI_WEBSITE_ID, token, "hero_click", start_at, end_at)
    print(f"    Found clicks for {len(clicks)} games")
    
    if impressions:
        top_impressions = dict(sorted(impressions.items(), key=lambda x: -x[1])[:5])
        print(f"    Top impressions: {top_impressions}")
    
    if clicks:
        top_clicks = dict(sorted(clicks.items(), key=lambda x: -x[1])[:5])
        print(f"    Top clicks: {top_clicks}")
    
    # Update database
    print("  Updating database...")
    with psycopg2.connect(DATABASE_URL) as conn:
        upsert_bandit_stats(conn, impressions, clicks)
    
    print("Done! ✓")


if __name__ == "__main__":
    try:
        main()
    except Exception as e:
        print(f"Error: {e}", file=sys.stderr)
        import traceback
        traceback.print_exc()
        sys.exit(1)
