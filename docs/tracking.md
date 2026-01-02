# Tracking Documentation

This document outlines all tracking events and configurations implemented in the application. We use **Umami** for general analytics and custom events, and **Google Ads (gtag)** for conversion tracking.

## Umami Events

These events are tracked via `window.umami.track(eventName, payload)` or declaratively via `data-umami-event` attributes. All custom events use `snake_case` naming.

| Event Name | Description | Trigger | Payload / Properties | File Location |
| :--- | :--- | :--- | :--- | :--- |
| **`filter_applied`** | Tracks when a user changes the sort order of a game list. | User selects a new option in the sort dropdown. | • `filter_type`: 'sort'<br>• `filter_value`: New sort value (e.g., 'score')<br>• `previous_value`: Previous sort value | `SortSelect.tsx` |
| **`hero_impression`** | Tracks views of the featured game carousel. | Once per page load when the featured carousel mounts and has games. | • `game_id`: Slug of the first game<br>• `variant`: Hero variant name<br>• `position`: 0 | `FeaturedCarousel.tsx` |
| **`hero_click`** | Tracks clicks on the featured game card. | User clicks on a game in the featured carousel. | • `game`: Game slug<br>• `variant`: Hero variant<br>• `position`: Index in carousel | `FeaturedGameCard.tsx` |
| **`search_used`** | Tracks usage of the search bar. | When a search query is executed (debounced) and results are returned. | • `query`: The search text<br>• `results_count`: Number of results found | `SearchBar.tsx` |
| **`search_result_click`** | Tracks clicks on search results. | User clicks on a game in the search dropdown. | • `game`: Game slug | `SearchBar.tsx` |
| **`list_view`** | Tracks impressions of game lists. | When a component containing a game list mounts. | • `list_type`: Type of list (e.g., 'curated', 'all')<br>• `item_count`: Number of games<br>• `tag`: (Optional) Filter tag<br>• `sort_order`: (Optional) Sort order | `ListViewTracker.tsx` |
| **`game_card_click`** | Tracks clicks on game cards. | User clicks on a game card in lists, reviews, or similar games sections. | • `game`: Game slug<br>• `source`: 'similar_games' (if applicable) | `ReviewCard.tsx`, `SimilarGames.tsx` |
| **`outbound_click`** | Tracks clicks to external stores (e.g., Steam). | User clicks the "View on Steam" button. | • `destination`: 'steam'<br>• `game`: Game slug<br>• `steam-id`: Steam App ID | `GameHero.tsx` |
| **`wishlist`** | Tracks additions/removals from wishlist. | User clicks the wishlist toggle button. | • `action`: 'add' or 'remove' | `WishlistButton.tsx` |
| **`sale_alerts`** | Tracks toggling of sale alerts. | User clicks the alert toggle. | • `action`: 'enable' or 'disable' | `AlertsToggle.tsx` |
| **`share`** | Tracks usages of share buttons. | User clicks a social share button. | • `platform`: 'Twitter', 'Facebook', 'Reddit', or 'Copy Link' | `ShareButtons.tsx` |
| **`surprise_me_click`** | Tracks usage of the random game button. | User clicks the "Surprise Turn" button. | N/A | `RandomGameButton.tsx` |
| **`newsletter_signup_success`** | Tracks successful newsletter subscriptions. | When the newsletter API returns a success response. | • `variant`: Form variant (e.g., 'default', 'footer') | `NewsletterSignup.tsx` |

## Google Ads (gtag)

The Google Tag (gtag.js) is loaded to enable Google Ads tracking and attribution.

### Configuration
*   **ID**: `AW-17843649268`
*   **Location**: `src/app/[lang]/layout.tsx`

> **Note**: Conversion events have been removed. Only the base gtag configuration is maintained for Google Ads attribution tracking.
