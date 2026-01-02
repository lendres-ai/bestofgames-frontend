'use client';

import { useEffect, useRef } from 'react';

interface ListViewTrackerProps {
  listType: 'games' | 'tag' | 'home' | 'search_results' | 'similar_games';
  itemCount: number;
  tag?: string;
  sortOrder?: string;
}

/**
 * Tracks list_view events when a list of games is displayed.
 * Place this component inside list pages to track impressions.
 */
export default function ListViewTracker({
  listType,
  itemCount,
  tag,
  sortOrder,
}: ListViewTrackerProps) {
  const hasTracked = useRef(false);

  useEffect(() => {
    if (hasTracked.current) return;
    if (typeof window === 'undefined' || !window.umami) return;

    hasTracked.current = true;
    window.umami.track('list_view', {
      list_type: listType,
      item_count: itemCount,
      ...(tag && { tag }),
      ...(sortOrder && { sort_order: sortOrder }),
    });
  }, [listType, itemCount, tag, sortOrder]);

  return null;
}
