import Link from 'next/link';
import { demoActivity } from '@/lib/demo';
import { getTheme, THEMES } from '@/lib/themes';
import { DEFAULT_OPTIONS } from '@/lib/options';
import { Widget } from '@/components/Widget';
import { HeroForm } from '@/components/HeroForm';
import { PricingPlans } from '@/components/PricingPlans';

const TICKER = [
  'Live streaks', 'Contribution graph', 'Top repos', 'Language mix', 'Notion embed',
  'Visitor analytics', 'Custom domains', 'One script tag', 'SVG for READMEs', 'Cached 15 min',
];

const FAQ = [
  ['Is it really one snippet?', 'Yes. Paste one script tag where you want the widget. It creates a responsive iframe that resizes itself. For Notion, paste the embed URL.'],
  ['Does it need my GitHub login?', 'No. Only public data is used, so you just type your username. Nothing is ever written to your GitHub account.'],
  ['How fresh is the data?', 'Responses are cached for 15 minutes. That is near real-time and keeps you well inside GitHub’s API limits.'],
  ['What does Pro unlock?', 'All themes and custom colors, no “Powered by” badge, visitor analytics, and custom domain hosting.'],
  ['One-time or monthly?', 'Both. $5 once for lifetime Pro, or $3 a month. Pro is tied to your GitHub username.'],
  ['Can I self-host it?', 'It is a standard Next.js app. Add a GitHub token and deploy anywhere. The README has the steps.'],
];

export default function Home() {
  const demo = { ...demoActivity('octocat'), name: 'The Octocat', demo: false };
  const brutal = getTheme('brutal');
  const heroOpts = { ...DEFAULT_OPTIONS, repos: 2, radius: 0, show: ['profile', 'stats', 'graph', 'repos'] as typeof DEFAULT_OPTIONS.show };
  const miniCells = demo.weeks.slice(-20).flatMap((w) => w).map((d) => d.level);
  // render column-major: 20 columns x 7 rows
  const mini = Array.from({ length: 7 * 20 }, (_, i) => miniCells[(i % 20) * 7 + Math.floor(i / 20)] ?? 0);
  const ticker = [...TICKER, ...TICKER];

  return (
    <>
      <section className="hero">
        <div className="container hero-grid">
          <div>
            <h1>
              <span>Your commits.</span>
              <span className="hl">Live on your site.</span>
            </h1>
            <p className="lead">
              Paste one snippet and your streaks, contribution graph and top repos show up on your portfolio or Notion page, always current.
            </p>
            <HeroForm />
            <div className="hero-note">Free. No sign-in. Any public GitHub profile.</div>
          </div>

          <div className="tilt">
            <div className="stage-card">
              <div className="bar"><span>yourportfolio.dev</span><b>LIVE</b></div>
              <Widget data={demo} theme={brutal} options={heroOpts} badge={false} />
            </div>
          </div>
        </div>
      </section>

      <div className="ticker" aria-hidden>
        <div className="ticker-track">
          {ticker.map((t, i) => (
            <span key={i} style={{ display: 'contents' }}>
              <span>{t}</span>
              <span className="sep">■</span>
            </span>
          ))}
        </div>
      </div>

      <section className="band" id="how">
        <div className="container">
          <h2>Username in. Widget out.</h2>
          <p className="sub">Three steps, about a minute. No build step and no dependencies.</p>
          <div className="steps">
            <div className="step"><div className="n">1</div><h3>Type your username</h3><p>We read your public repos, languages, stars and the last year of contributions.</p></div>
            <div className="step"><div className="n">2</div><h3>Make it yours</h3><p>Pick a theme, toggle sections, tune the corners. The preview updates as you click.</p></div>
            <div className="step"><div className="n">3</div><h3>Paste the snippet</h3><p>Copy the script, iframe, SVG or Markdown embed into your site or Notion page.</p></div>
          </div>
        </div>
      </section>

      <section className="band band-ink" id="embed">
        <div className="container">
          <h2>One line. Any page.</h2>
          <p className="sub">The script drops in a responsive iframe and resizes it to fit. Use options as plain data attributes.</p>
          <div className="term">
            <div className="term-bar"><i /><i /><i /><span style={{ marginLeft: 8 }}>index.html</span></div>
            <pre>{`<!-- paste where the widget should appear -->
<script
  src="https://your-app.com/widget.js"
  data-username="octocat"
  data-theme="brutal"
  data-show="stats,graph,repos"
  async></script>`}</pre>
          </div>
          <div className="tags">
            {['Next.js', 'Framer', 'Webflow', 'Notion', 'GitHub README', 'Plain HTML', 'Email'].map((t) => (
              <span className="tag" key={t}>{t}</span>
            ))}
          </div>
        </div>
      </section>

      <section className="band band-lemon" id="features">
        <div className="container">
          <h2>What the widget shows</h2>
          <p className="sub">Pulled from the official GitHub GraphQL API, cached so your page stays fast.</p>
          <div className="bento">
            <div className="tile w4 cobalt">
              <div>
                <h3>Streaks that count</h3>
                <p>Current streak, longest streak, yearly contributions and pull requests, the numbers people check first.</p>
              </div>
              <div>
                <div className="bigstat" style={{ marginTop: 20 }}>{demo.longestStreak} days</div>
                <div className="mini-graph" aria-hidden>
                  {mini.map((lvl, i) => <i key={i} style={{ background: brutal.graph[lvl as 0 | 1 | 2 | 3 | 4] }} />)}
                </div>
              </div>
            </div>
            <div className="tile w2">
              <div><div className="icon">⚡</div><h3>Live data</h3></div>
              <p>Fresh within 15 minutes. If GitHub hiccups, the last good data is served.</p>
            </div>
            <div className="tile w2 pink">
              <div><div className="icon">📌</div><h3>Top repos</h3></div>
              <p>Your most-starred projects with language, stars and forks.</p>
            </div>
            <div className="tile w2">
              <div><div className="icon">🎨</div><h3>Themes</h3></div>
              <p>Four free themes, six more on Pro, and a color picker for your exact brand.</p>
            </div>
            <div className="tile w2 ink">
              <div><div className="icon">📈</div><h3>Analytics</h3></div>
              <p>See views and which sites embed your widget. Pro.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="band" id="themes">
        <div className="container">
          <h2>Match your site</h2>
          <p className="sub">Pick one that fits, or set your own colors on Pro.</p>
          <div className="theme-strip">
            {THEMES.map((t) => (
              <div key={t.id} className="swatch" style={{ background: t.bg, color: t.fg }}>
                {t.pro && <span className="tagpro">PRO</span>}
                {t.name}
                <div className="cells">{t.graph.map((c, i) => <i key={i} style={{ background: c }} />)}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="band band-cobalt" id="pricing">
        <div className="container">
          <h2>$3 a month. Or $5 once.</h2>
          <p className="sub">Free covers the essentials. Pro adds themes, analytics and custom domains.</p>
          <PricingPlans />
        </div>
      </section>

      <section className="band">
        <div className="container narrow faq">
          <h2>Questions</h2>
          <div style={{ marginTop: 32 }}>
            {FAQ.map(([q, a]) => (
              <details key={q}><summary>{q}</summary><p>{a}</p></details>
            ))}
          </div>
        </div>
      </section>

      <section className="band cta-band">
        <div className="container">
          <h2>Show your work.</h2>
          <Link href="/builder" className="btn btn-ink btn-lg">Build my widget</Link>
        </div>
      </section>
    </>
  );
}
