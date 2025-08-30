import os
from decimal import Decimal
from typing import List, Optional

from dotenv import load_dotenv
import psycopg2
from psycopg2.extras import RealDictCursor


def _ensure_sslmode_require(database_url: str) -> str:
    if "sslmode=" in database_url:
        return database_url
    separator = "&" if "?" in database_url else "?"
    return f"{database_url}{separator}sslmode=require"


def insert_full_review(
    *,
    database_url: str,
    game_slug: str,
    game_title: str,
    game_summary: str,
    developer: str,
    publisher: str,
    steam_appid: Optional[int] = None,
    platform_windows: bool,
    platform_mac: bool,
    platform_linux: bool,
    image_urls: Optional[List[str]] = None,
    review_title: str,
    description: str,
    introduction: str,
    gameplay_features: str,
    conclusion: str,
    score: Decimal,
    pros: List[str],
    cons: List[str],
    tags: List[str],
    user_opinion: str,
):
    dsn = _ensure_sslmode_require(database_url)

    with psycopg2.connect(dsn, cursor_factory=RealDictCursor) as conn:
        with conn.cursor() as cur:
            # Upsert game by slug
            cur.execute(
                """
                INSERT INTO games (slug, title, summary, developer, publisher, steam_appid)
                VALUES (%s, %s, %s, %s, %s, %s)
                ON CONFLICT (slug) DO UPDATE
                  SET title = EXCLUDED.title,
                      summary = EXCLUDED.summary,
                      developer = EXCLUDED.developer,
                      publisher = EXCLUDED.publisher,
                      steam_appid = EXCLUDED.steam_appid
                RETURNING id;
                """,
                (game_slug, game_title, game_summary, developer, publisher, steam_appid),
            )
            game_row = cur.fetchone()
            game_id = game_row["id"]

            # Platforms: upsert and link for those marked True
            desired_platforms = [
                ("Windows", platform_windows),
                ("Mac", platform_mac),
                ("Linux", platform_linux),
            ]
            for name, enabled in desired_platforms:
                if not enabled:
                    continue
                cur.execute(
                    """
                    INSERT INTO platforms (name)
                    VALUES (%s)
                    ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name
                    RETURNING id;
                    """,
                    (name,),
                )
                platform_row = cur.fetchone()
                platform_id = platform_row["id"]

                cur.execute(
                    """
                    INSERT INTO game_platforms (game_id, platform_id)
                    VALUES (%s, %s)
                    ON CONFLICT DO NOTHING;
                    """,
                    (game_id, platform_id),
                )

            # Game images: replace existing set if provided
            if image_urls:
                # Remove existing images to avoid duplicates on reseed
                cur.execute(
                    """
                    DELETE FROM game_images
                    WHERE game_id = %s;
                    """,
                    (game_id,),
                )
                for index, url in enumerate(image_urls):
                    cur.execute(
                        """
                        INSERT INTO game_images (game_id, url, sort_order)
                        VALUES (%s, %s, %s);
                        """,
                        (game_id, url, index),
                    )

            # Insert review
            cur.execute(
                """
                INSERT INTO reviews (
                  game_id, title, description, introduction, gameplay_features, conclusion, score, user_opinion
                ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
                RETURNING id;
                """,
                (
                    game_id,
                    review_title,
                    description,
                    introduction,
                    gameplay_features,
                    conclusion,
                    score,
                    user_opinion,
                ),
            )
            review_row = cur.fetchone()
            review_id = review_row["id"]

            # Pros
            for text in pros:
                cur.execute(
                    """
                    INSERT INTO review_pros_cons (review_id, text, type)
                    VALUES (%s, %s, 'pro');
                    """,
                    (review_id, text),
                )

            # Cons
            for text in cons:
                cur.execute(
                    """
                    INSERT INTO review_pros_cons (review_id, text, type)
                    VALUES (%s, %s, 'con');
                    """,
                    (review_id, text),
                )

            # Tags: upsert each, then connect
            for tag_name in tags:
                cur.execute(
                    """
                    INSERT INTO tags (name)
                    VALUES (%s)
                    ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name
                    RETURNING id;
                    """,
                    (tag_name,),
                )
                tag_row = cur.fetchone()
                tag_id = tag_row["id"]

                cur.execute(
                    """
                    INSERT INTO review_tags (review_id, tag_id)
                    VALUES (%s, %s)
                    ON CONFLICT DO NOTHING;
                    """,
                    (review_id, tag_id),
                )

            print("Inserted review", review_id, "for game", game_id)


if __name__ == "__main__":
    # Load DATABASE_URL from .env.local in project root
    project_root = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", ".."))
    env_path = os.path.join(project_root, ".env.local")
    if os.path.exists(env_path):
        load_dotenv(env_path)
    else:
        load_dotenv()  # fallback to default .env if present

    database_url = os.getenv("DATABASE_URL")
    if not database_url:
        raise RuntimeError("DATABASE_URL not set. Define it in .env.local or environment.")

    # Example data — adjust as needed
    insert_full_review(
        database_url=database_url,
        game_slug="hollow-knight-v3",
        game_title="Hollow Knight",
        game_summary="Atmospheric Metroidvania with tight combat and rich exploration.",
        developer="Team Cherry",
        publisher="Team Cherry",
        steam_appid=367520,
        platform_windows=True,
        platform_mac=True,
        platform_linux=False,
        image_urls=[
            "https://www.nintendo.com/eu/media/images/10_share_images/games_15/wiiu_download_software_5/H2x1_WiiUDS_HollowKnight.jpg",
        ],
        review_title="Hollow Knight Review",
        description="A masterclass in world-building and silky platforming.",
        introduction="Descend into Hallownest, a fallen kingdom teeming with secrets.",
        gameplay_features="Precise combat, vast interconnected map, optional challenge content",
        conclusion="A towering achievement that rewards curiosity and skill.",
        score=Decimal("2.5"),
        pros=[
            "Expansive world with meaningful exploration",
            "Excellent combat feedback and mobility",
            "Stunning art and evocative soundtrack",
        ],
        cons=[
            "Sparse guidance may frustrate some players",
            "Difficulty spikes in optional content",
        ],
        tags=["Metroidvania", "Indie", "Action", "Exploration"],
        user_opinion="Ich habe das Spiel sehr genossen. Es ist ein sehr schönes Spiel mit vielen tolle Features. Ich würde es jedem empfehlen.",
    )


