import { NextRequest, NextResponse } from 'next/server';
import { listOrders } from '../../../lib/store';
import { getHotel } from '../../../lib/hotels';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const hotelSlug = searchParams.get('hotel') || '';
  const hotel = getHotel(hotelSlug);
  if (!hotel) return NextResponse.json({ error: 'Invalid hotel' }, { status: 400 });
  const orders = listOrders(hotel.slug);
  return NextResponse.json({ orders });
}
