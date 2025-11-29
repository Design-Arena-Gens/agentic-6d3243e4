"use client";

import { useState } from 'react';
import { hotels } from '../../lib/hotels';
import { useRouter } from 'next/navigation';

export default function DashboardEntry() {
  const [hotel, setHotel] = useState(hotels[0]?.slug || '');
  const [code, setCode] = useState('');
  const router = useRouter();

  return (
    <div className="card">
      <h2 style={{ marginTop: 0 }}>Hotel Dashboard</h2>
      <div style={{ display: 'grid', gap: 8, maxWidth: 420 }}>
        <label>
          <div>Choose hotel</div>
          <select className="input" value={hotel} onChange={(e) => setHotel(e.target.value)}>
            {hotels.map(h => (<option key={h.slug} value={h.slug}>{h.name}</option>))}
          </select>
        </label>
        <label>
          <div>Admin code</div>
          <input className="input" type="password" placeholder="Enter admin code" value={code} onChange={(e) => setCode(e.target.value)} />
        </label>
        <button className="button" onClick={() => router.push(`/dashboard/${hotel}?code=${encodeURIComponent(code)}`)}>Open dashboard</button>
      </div>
    </div>
  );
}
