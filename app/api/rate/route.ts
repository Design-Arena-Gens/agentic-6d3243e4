import { NextRequest, NextResponse } from 'next/server';
import { getHotel } from '../../../lib/hotels';
import { addRating } from '../../../lib/store';
import type { Rating } from '../../../lib/types';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { hotel: hotelSlug, orderId, table, stars, comment } = body as { hotel: string; orderId: string; table: string; stars: Rating['stars']; comment?: string };
    const hotel = getHotel(hotelSlug);
    if (!hotel) return NextResponse.json({ error: 'Invalid hotel' }, { status: 400 });
    const rating = addRating(hotel.slug, String(orderId||''), String(table||''), Number(stars) as Rating['stars'], comment);
    return NextResponse.json(rating, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Server error' }, { status: 500 });
  }
}
