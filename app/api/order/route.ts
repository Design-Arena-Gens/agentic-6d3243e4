import { NextRequest, NextResponse } from 'next/server';
import { getHotel } from '../../../lib/hotels';
import { createOrder } from '../../../lib/store';
import type { Order } from '../../../lib/types';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { hotel: hotelSlug, table, items, customerName } = body as { hotel: string; table: string; items: Order['items']; customerName?: string };
    const hotel = getHotel(hotelSlug);
    if (!hotel) return NextResponse.json({ error: 'Invalid hotel' }, { status: 400 });
    if (!table || !Array.isArray(items) || !items.length) return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });

    const order = createOrder({ hotel: hotel.slug, table: String(table), items, customerName });
    return NextResponse.json(order, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Server error' }, { status: 500 });
  }
}
