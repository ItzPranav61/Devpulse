export const fmt = (n: number) => n.toLocaleString('en-US');

export function esc(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export const todayISO = () => new Date().toISOString().slice(0, 10);

export function hostOf(url: string | null | undefined): string {
  if (!url) return 'direct';
  try {
    return new URL(url).hostname.replace(/^www\./, '').slice(0, 80) || 'direct';
  } catch {
    return 'direct';
  }
}
