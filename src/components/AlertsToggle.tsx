"use client";

import { useEffect, useState, useTransition } from 'react';
import { getWishlistSlugs } from '@/lib/wishlist';

type AlertsToggleProps = {
  label?: string;
};

export default function AlertsToggle({ label }: AlertsToggleProps) {
  const [supported, setSupported] = useState<boolean>(false);
  const [enabled, setEnabled] = useState<boolean>(false);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    setSupported('serviceWorker' in navigator && 'PushManager' in window);
  }, []);

  async function subscribeAndSync() {
    if (!supported) return;
    const reg = await navigator.serviceWorker.ready;
    const vapid = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
    if (!vapid) {
      console.warn('Missing NEXT_PUBLIC_VAPID_PUBLIC_KEY; cannot subscribe to push notifications');
      return;
    }
    const sub = await reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: urlBase64ToUint8Array(vapid) });
    const res = await fetch('/api/push/subscribe', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ endpoint: sub.endpoint, keys: sub.toJSON().keys, userAgent: navigator.userAgent }) });
    if (!res.ok) return;
    const slugs = getWishlistSlugs();
    await fetch('/api/push/sync-wishlist', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ endpoint: sub.endpoint, slugs }) });
    setEnabled(true);
  }

  async function unsubscribeAll() {
    const reg = await navigator.serviceWorker.ready;
    const sub = await reg.pushManager.getSubscription();
    if (sub) {
      await fetch('/api/push/unsubscribe', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ endpoint: sub.endpoint }) });
      await sub.unsubscribe();
    }
    setEnabled(false);
  }

  useEffect(() => {
    if (!supported) return;
    (async () => {
      const reg = await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.getSubscription();
      setEnabled(Boolean(sub));
    })();
  }, [supported]);

  function onToggle() {
    startTransition(() => {
      if (enabled) {
        unsubscribeAll();
      } else {
        subscribeAndSync();
      }
    });
  }

  if (!supported) return null;

  const enabledText = label ? `${label} enabled` : 'Sale alerts enabled';
  const disabledText = label ? `Enable ${label.toLowerCase()}` : 'Enable sale alerts';

  return (
    <button
      type="button"
      onClick={onToggle}
      disabled={isPending}
      data-umami-event="Sale Alerts" data-umami-event-action={enabled ? "disable" : "enable"}
      className={`inline-flex items-center justify-center gap-2 rounded-2xl border px-5 py-2.5 text-sm font-semibold shadow-sm ring-1 ring-black/5 backdrop-blur transition-transform hover:scale-[1.02] focus:outline-none focus-visible:ring-2 ${enabled ? 'bg-emerald-600 text-white hover:brightness-110' : 'bg-white/60 text-gray-900 dark:bg-gray-900/60 dark:text-white'}`}
    >
      {enabled ? enabledText : disabledText}
    </button>
  );
}

function urlBase64ToUint8Array(base64String?: string) {
  if (!base64String) return new Uint8Array();
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}
