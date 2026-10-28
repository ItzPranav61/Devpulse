import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = { title: 'Docs' };

const OPTIONS: [string, string, string][] = [
  ['theme', 'dark', 'dark, light, midnight (free) · dracula, nord, sunset, neon, forest, rose (Pro)'],
  ['show', 'all', 'Comma list of: profile, stats, graph, langs, repos'],
  ['repos', '4', 'Number of top repositories, 1–6'],
  ['radius', '16', 'Corner radius in px, 0–28'],
  ['transparent', '0', '1 makes the background transparent'],
  ['c_bg / c_fg / c_accent', '—', '6-digit hex without “#” — custom colors (Pro)'],
];

export default function DocsPage() {
  return (
    <div className="container narrow prose" style={{ paddingTop: 56 }}>
      <h1>Docs</h1>
      <p>Everything you need to embed DevPulse and use its API. Prefer clicking? Use the <Link className="accent" href="/builder">builder</Link>.</p>

      <h2>Script embed</h2>
      <p>The easiest option. It inserts a responsive iframe right after the script tag and resizes it automatically.</p>
      <div className="code">{`<script
  src="https://your-app.com/widget.js"
  data-username="octocat"
  data-theme="midnight"
  data-show="stats,graph,repos"
  async></script>`}</div>
      <p>Data attributes map to the options below (<code>data-bg</code>, <code>data-fg</code>, <code>data-accent</code> for custom colors).</p>

      <h2>iFrame embed</h2>
      <div className="code">{`<iframe src="https://your-app.com/embed/octocat?theme=dark"
  width="100%" height="520" style="border:0" loading="lazy"></iframe>`}</div>

      <h2>Notion</h2>
      <p>Type <code>/embed</code> in Notion, paste <code>https://your-app.com/embed/octocat</code> and choose “Embed link”.</p>

      <h2>SVG card (README &amp; email)</h2>
      <div className="code">{`![GitHub activity](https://your-app.com/api/card/octocat.svg?theme=dark)`}</div>
      <p>A static image showing profile, streaks, graph and top languages. Cached for 5 minutes.</p>

      <h2>Options</h2>
      <table>
        <thead><tr><th>Param</th><th>Default</th><th>Values</th></tr></thead>
        <tbody>
          {OPTIONS.map(([p, d, v]) => (
            <tr key={p}><td><code>{p}</code></td><td><code>{d}</code></td><td>{v}</td></tr>
          ))}
        </tbody>
      </table>

      <h2>JSON API</h2>
      <p><code>GET /api/github/:username</code> returns normalised data (CORS enabled, cached 15 min):</p>
      <div className="code">{`{
  "username": "octocat",
  "currentStreak": 12,
  "longestStreak": 41,
  "totalContributions": 1893,
  "topRepos": [{ "name": "…", "stars": 120, "language": "TypeScript" }],
  "languages": [{ "name": "TypeScript", "percent": 62.1 }],
  "weeks": [[{ "date": "2026-01-04", "count": 3, "level": 1 }]]
}`}</div>

      <h2>Pro features</h2>
      <ul>
        <li><b>Themes &amp; colors</b> — activated automatically for your username after purchase; no keys in your embed URLs.</li>
        <li><b>Analytics</b> — enter your username and license key on the <Link className="accent" href="/dashboard">dashboard</Link>. API: <code>GET /api/analytics/:username</code> with header <code>x-license-key</code>.</li>
        <li><b>Custom domain</b> — point a domain at the deployment and add it to <code>CUSTOM_DOMAINS</code>; its root serves your widget page.</li>
      </ul>
    </div>
  );
}
