import Link from 'next/link';
import { Logo } from '@/components/Logo';

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <header className="nav">
        <div className="container nav-in">
          <Link href="/" aria-label="DevPulse home"><Logo /></Link>
          <nav className="nav-links">
            <Link href="/#features" className="hide-sm">Features</Link>
            <Link href="/pricing">Pricing</Link>
            <Link href="/docs" className="hide-sm">Docs</Link>
            <Link href="/dashboard" className="hide-sm">Dashboard</Link>
            <Link href="/builder" className="btn btn-primary btn-sm">Build widget</Link>
          </nav>
        </div>
      </header>
      <main>{children}</main>
      <footer className="footer">
        <div className="container footer-in">
          <div>
            <div className="big-word">DevPulse</div>
            <small>© {new Date().getFullYear()} DevPulse. Made for developers, by developers.</small>
          </div>
          <div className="footer-links">
            <Link href="/builder">Builder</Link>
            <Link href="/pricing">Pricing</Link>
            <Link href="/docs">Docs</Link>
            <Link href="/dashboard">Dashboard</Link>
            <a href="/api/github/octocat">API</a>
          </div>
        </div>
      </footer>
    </>
  );
}
