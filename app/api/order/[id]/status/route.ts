import { NextRequest, NextResponse } from 'next/server';
import { setOrderStatus } from '../../../../lib/store';
import type { Order } from '../../../../lib/types';

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const status = body?.status as Order['status'];
    if (!status) return NextResponse.json({ error: 'Missing status' }, { status: 400 });
    const updated = setOrderStatus(params.id, status);
    if (!updated) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(updated);
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Server error' }, { status: 500 });
  }
}
