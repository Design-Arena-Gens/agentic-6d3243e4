"use client";

import Link from 'next/link';
import { useMemo } from 'react';
import { getHotel } from '../../../../lib/hotels';

export default function QrCodesPage({ params, searchParams }: { params: { hotel: string }, searchParams: { code?: string } }) {
  const hotel = getHotel(params.hotel);
  const code = searchParams.code || '';
  if (!hotel) return <div className="card">Unknown hotel.</div>;
  const valid = code === hotel.adminCode;
  if (!valid) return <div className="card">Invalid admin code.</div>;

  const origin = useMemo(() => (typeof window !== 'undefined' ? window.location.origin : ''), []);

  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ marginTop: 0 }}>{hotel.name} ? QR Codes</h2>
        <Link className="button ghost" href={`/dashboard/${hotel.slug}?code=${encodeURIComponent(code)}`}>Back</Link>
      </div>
      <p>Print and place these at each table. Scanning opens the menu directly.</p>
      <div className="grid">
        {Array.from({ length: hotel.tables }).map((_, i) => {
          const table = String(i + 1);
          const link = `${origin}/${hotel.slug}/menu?table=${encodeURIComponent(table)}`;
          const qrUrl = `/api/qr?data=${encodeURIComponent(link)}`;
          return (
            <div className="card" key={table}>
              <h3 style={{ marginTop: 0 }}>Table {table}</h3>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={qrUrl} alt={`QR for Table ${table}`} width={220} height={220} />
              <div style={{ marginTop: 8, wordBreak: 'break-all', fontSize: 12 }}>{link}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
