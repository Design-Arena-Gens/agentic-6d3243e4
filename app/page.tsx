import Link from 'next/link';
import { hotels } from '../lib/hotels';

export default function HomePage() {
  return (
    <main>
      <section className="card" style={{ marginBottom: 16 }}>
        <h1 style={{ margin: 0 }}>Smart QR Ordering for Hotels & Restaurants</h1>
        <p style={{ marginTop: 8 }}>Scan, order, and rate ? no app required. Multi-hotel support with dashboards, menu control, table management, analytics, and printable QR codes.</p>
        <div style={{ display: 'flex', gap: 8, marginTop: 8, flexWrap: 'wrap' }}>
          <Link className="button" href="/dashboard">Open Dashboard</Link>
        </div>
      </section>

      <section className="grid">
        {hotels.map(h => (
          <div className="card" key={h.slug}>
            <h3 style={{ marginTop: 0 }}>{h.name}</h3>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <Link className="button" href={`/${h.slug}/menu?table=1`}>Try as customer</Link>
              <Link className="button secondary" href={`/dashboard/${h.slug}`}>Manage hotel</Link>
            </div>
            <div style={{ marginTop: 10 }}>
              <span className="badge">Tables: {h.tables}</span>
              <span className="badge" style={{ marginLeft: 8 }}>Items: {h.menu.length}</span>
            </div>
          </div>
        ))}
      </section>
    </main>
  );
}
