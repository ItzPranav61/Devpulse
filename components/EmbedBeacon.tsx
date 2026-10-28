'use client';

import { useEffect } from 'react';

/** Reports iframe height to the parent page (for widget.js auto-resize) and logs one analytics view. */
export function EmbedBeacon({ username }: { username: string }) {
  useEffect(() => {
    const post = () => {
      const h = document.documentElement.scrollHeight;
      window.parent?.postMessage({ type: 'devpulse:height', height: h }, '*');
    };
    post();
    const ro = new ResizeObserver(post);
    ro.observe(document.body);

    // Inside an iframe, document.referrer is the page that embeds the widget.
    const referrer = document.referrer;
    fetch('/api/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, referrer }),
      keepalive: true,
    }).catch(() => undefined);

    return () => ro.disconnect();
  }, [username]);

  return null;
}
