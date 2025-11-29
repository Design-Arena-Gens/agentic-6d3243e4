"use client";

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { getHotel } from '../../../lib/hotels';

export default function RatePage({ params }: { params: { hotel: string } }) {
  const hotel = getHotel(params.hotel);
  const search = useSearchParams();
  const table = search.get('table') || '1';
  const orderId = search.get('orderId') || '';

  const [stars, setStars] = useState<number>(5);
  const [comment, setComment] = useState('');
  const [done, setDone] = useState(false);

  if (!hotel) return <div className="card">Unknown hotel.</div>;

  async function submitRating() {
    try {
      const res = await fetch('/api/rate', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ hotel: hotel.slug, table, orderId, stars, comment }),
      });
      if (!res.ok) throw new Error('Failed');
    } catch {}
    setDone(true);
    // Redirect after short delay to Google Reviews
    setTimeout(() => {
      window.location.href = hotel.googleReviewUrl;
    }, 1000);
  }

  if (done) {
    return (
      <div className="card">
        <h2>Thanks for your feedback!</h2>
        <p>Redirecting to Google Reviews?</p>
        <a className="button" href={hotel.googleReviewUrl}>Open now</a>
      </div>
    );
  }

  return (
    <div className="card">
      <h2 style={{ marginTop: 0 }}>Rate your experience ? {hotel.name}</h2>
      <p>Table {table} ? Order {orderId || '?'}</p>
      <div style={{ display: 'flex', gap: 6, fontSize: 28, margin: '8px 0' }}>
        {[1,2,3,4,5].map(n => (
          <button key={n} className="button ghost" onClick={() => setStars(n)} style={{ borderColor: n <= stars ? '#f59e0b' : undefined }}>
            {n <= stars ? '?' : '?'}
          </button>
        ))}
      </div>
      <textarea className="input" placeholder="Any comments?" value={comment} onChange={(e) => setComment(e.target.value)} rows={4} />
      <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
        <button className="button" onClick={submitRating}>Submit</button>
        <Link className="button ghost" href={`/${hotel.slug}/menu?table=${table}`}>Back to menu</Link>
      </div>
    </div>
  );
}
