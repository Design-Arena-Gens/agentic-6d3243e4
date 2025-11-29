"use client";

import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { getHotel } from '../../../lib/hotels';
import type { Order } from '../../../lib/types';

export default function HotelDashboard({ params }: { params: { hotel: string } }) {
  const hotel = getHotel(params.hotel);
  const search = useSearchParams();
  const code = search.get('code') || '';

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const valid = hotel && code === hotel.adminCode;

  useEffect(() => {
    let timeout: any;
    async function fetchOrders() {
      if (!hotel) return;
      try {
        const res = await fetch(`/api/orders?hotel=${encodeURIComponent(hotel.slug)}`);
        const data = await res.json();
        if (res.ok) setOrders(data.orders || []);
      } catch {}
      timeout = setTimeout(fetchOrders, 3000);
    }
    setLoading(true);
    fetchOrders().finally(() => setLoading(false));
    return () => clearTimeout(timeout);
  }, [hotel?.slug]);

  const summary = useMemo(() => {
    const total = orders.length;
    const byStatus: Record<string, number> = {};
    for (const o of orders) byStatus[o.status] = (byStatus[o.status] || 0) + 1;
    const revenue = orders.reduce((sum, o) => sum + o.subtotalCents, 0);
    return { total, byStatus, revenue };
  }, [orders]);

  if (!hotel) return <div className="card">Unknown hotel.</div>;
  if (!valid) return <div className="card">Invalid admin code.</div>;

  async function setStatus(id: string, status: Order['status']) {
    await fetch(`/api/order/${id}/status`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status }) });
  }

  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ marginTop: 0 }}>{hotel.name} ? Dashboard</h2>
        <div style={{ display: 'flex', gap: 8 }}>
          <Link className="button ghost" href={`/dashboard/${hotel.slug}/qrcodes?code=${encodeURIComponent(code)}`}>QR Codes</Link>
          <Link className="button ghost" href={`/`}>Home</Link>
        </div>
      </div>

      <div className="grid" style={{ marginTop: 8 }}>
        <div className="card">
          <h3>Summary</h3>
          <div>Orders today: <b>{summary.total}</b></div>
          <div>Revenue: <b>?{(summary.revenue/100).toFixed(2)}</b></div>
          <div style={{ display: 'flex', gap: 8, marginTop: 6, flexWrap: 'wrap' }}>
            {Object.entries(summary.byStatus).map(([s, n]) => (<span key={s} className="badge">{s}: {n}</span>))}
          </div>
        </div>

        <div className="card" style={{ gridColumn: '1 / -1' }}>
          <h3>Incoming Orders</h3>
          {loading && <div>Loading?</div>}
          <table className="table">
            <thead>
              <tr>
                <th>Time</th>
                <th>Order ID</th>
                <th>Table</th>
                <th>Customer</th>
                <th>Subtotal</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(o => (
                <tr key={o.id}>
                  <td>{new Date(o.createdAt).toLocaleTimeString()}</td>
                  <td>{o.id.slice(0, 8)}</td>
                  <td>{o.table}</td>
                  <td>{o.customerName || '?'}</td>
                  <td>?{(o.subtotalCents/100).toFixed(2)}</td>
                  <td><span className="badge">{o.status}</span></td>
                  <td style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    {(['new','preparing','ready','served','completed','cancelled'] as const).map(s => (
                      <button key={s} className="button ghost" onClick={() => setStatus(o.id, s)}>{s}</button>
                    ))}
                  </td>
                </tr>
              ))}
              {!orders.length && !loading && (
                <tr><td colSpan={7}>No orders yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
