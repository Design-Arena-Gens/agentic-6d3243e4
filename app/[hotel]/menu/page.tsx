"use client";

import { useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { getHotel } from '../../../lib/hotels';
import type { MenuItem } from '../../../lib/types';

export default function MenuPage({ params }: { params: { hotel: string } }) {
  const hotel = getHotel(params.hotel);
  const searchParams = useSearchParams();
  const table = searchParams.get('table') || '1';

  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [customerName, setCustomerName] = useState('');
  const [noteByItem, setNoteByItem] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);

  const grouped = useMemo(() => {
    if (!hotel) return {} as Record<string, MenuItem[]>;
    return hotel.menu.reduce((acc, it) => {
      const key = it.category || 'Menu';
      (acc[key] ||= []).push(it);
      return acc;
    }, {} as Record<string, MenuItem[]>);
  }, [hotel]);

  const subtotalCents = useMemo(() => {
    if (!hotel) return 0;
    return Object.entries(quantities).reduce((sum, [id, qty]) => {
      const it = hotel.menu.find(i => i.id === id);
      return sum + (it ? it.priceCents * Math.max(1, qty) : 0);
    }, 0);
  }, [quantities, hotel]);

  if (!hotel) return <div className="card">Unknown hotel.</div>;

  async function placeOrder() {
    const items = Object.entries(quantities)
      .filter(([, q]) => q && q > 0)
      .map(([itemId, quantity]) => ({ itemId, quantity, notes: noteByItem[itemId] }));
    if (!items.length) return alert('Please select at least one item.');

    setSubmitting(true);
    try {
      const res = await fetch('/api/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ hotel: hotel.slug, table, items, customerName }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed');
      setOrderId(data.id);
    } catch (e: any) {
      alert(e.message || 'Something went wrong');
    } finally {
      setSubmitting(false);
    }
  }

  if (orderId) {
    return (
      <div className="card">
        <h2>Order placed!</h2>
        <p>Your order ID: <b>{orderId}</b>. Staff have been notified.</p>
        <p>
          Track status at the table. After your meal, please rate your experience.
        </p>
        <div style={{ display: 'flex', gap: 8 }}>
          <Link className="button" href={`/${hotel.slug}/rate?table=${encodeURIComponent(table)}&orderId=${orderId}`}>Rate now</Link>
          <Link className="button ghost" href={`/`}>Home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <h2 style={{ marginTop: 0 }}>{hotel.name} ? Table {table}</h2>
      <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
        <input className="input" placeholder="Your name (optional)" value={customerName} onChange={(e) => setCustomerName(e.target.value)} />
      </div>
      {Object.entries(grouped).map(([cat, items]) => (
        <div key={cat} style={{ marginBottom: 16 }}>
          <h3 style={{ margin: '8px 0' }}>{cat}</h3>
          <div className="grid">
            {items.map(it => (
              <div className="card" key={it.id}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <b>{it.name}</b>
                  <span>?{(it.priceCents/100).toFixed(2)}</span>
                </div>
                {it.description && <p style={{ marginTop: 8 }}>{it.description}</p>}
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <button className="button ghost" onClick={() => setQuantities(q => ({ ...q, [it.id]: Math.max(0, (q[it.id]||0) - 1) }))}>-</button>
                  <b>{quantities[it.id] || 0}</b>
                  <button className="button" onClick={() => setQuantities(q => ({ ...q, [it.id]: (q[it.id]||0) + 1 }))}>+</button>
                </div>
                <input className="input" placeholder="Add a note (optional)" value={noteByItem[it.id] || ''} onChange={(e) => setNoteByItem(x => ({ ...x, [it.id]: e.target.value }))} style={{ marginTop: 8 }} />
              </div>
            ))}
          </div>
        </div>
      ))}

      <div className="card" style={{ marginTop: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div><b>Subtotal:</b> ?{(subtotalCents/100).toFixed(2)}</div>
          <div className="badge" style={{ marginTop: 4 }}>No app ? No signup ? Instant</div>
        </div>
        <button disabled={submitting} className="button" onClick={placeOrder}>{submitting ? 'Placing?' : 'Place order'}</button>
      </div>
    </div>
  );
}
