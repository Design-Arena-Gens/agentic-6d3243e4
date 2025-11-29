import { NextRequest, NextResponse } from 'next/server';
import QRCode from 'qrcode';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const data = searchParams.get('data') || '';
  if (!data) return new NextResponse('Missing data', { status: 400 });
  try {
    const png = await QRCode.toBuffer(data, { errorCorrectionLevel: 'M', margin: 1, width: 512 });
    return new NextResponse(png, { headers: { 'Content-Type': 'image/png', 'Cache-Control': 'public, max-age=31536000, immutable' } });
  } catch (e) {
    return new NextResponse('QR generation failed', { status: 500 });
  }
}
