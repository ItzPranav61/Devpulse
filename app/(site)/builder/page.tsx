import type { Metadata } from 'next';
import { Builder } from '@/components/Builder';

export const metadata: Metadata = { title: 'Widget builder' };

export default function BuilderPage({ searchParams }: { searchParams: { u?: string } }) {
  const u = typeof searchParams.u === 'string' ? searchParams.u.slice(0, 39) : '';
  return (
    <>
      <div className="container" style={{ paddingTop: 48 }}>
        <h1 className="page-title">Widget builder</h1>
        <p className="muted" style={{ margin: '8px 0 0' }}>Customize your widget, preview it live, then copy the embed snippet.</p>
      </div>
      <Builder initialUsername={u} />
    </>
  );
}
