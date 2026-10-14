import { NextResponse } from 'next/server';
import sharp from 'sharp';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const ALLOWED_WIDTHS = [480];

// 작품 이미지는 제출 후 바뀌지 않으므로 브라우저·CDN에 오래 캐시한다.
const IMMUTABLE_CACHE = 'public, max-age=31536000, s-maxage=31536000, immutable';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  if (!UUID_RE.test(id)) {
    return NextResponse.json({ error: '잘못된 작품 ID입니다.' }, { status: 400 });
  }

  const { searchParams } = new URL(request.url);
  const width = Number(searchParams.get('w')) || 0;
  if (width && !ALLOWED_WIDTHS.includes(width)) {
    return NextResponse.json({ error: '지원하지 않는 크기입니다.' }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('artworks')
    .select('image_data')
    .eq('id', id)
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  if (!data?.image_data) {
    return NextResponse.json({ error: '작품을 찾을 수 없습니다.' }, { status: 404 });
  }

  const match = /^data:(image\/[a-z+]+);base64,([A-Za-z0-9+/=\s]*)$/.exec(data.image_data);
  if (!match) {
    return NextResponse.json({ error: '이미지 형식이 올바르지 않습니다.' }, { status: 500 });
  }

  const original = Buffer.from(match[2], 'base64');

  if (width) {
    // 갤러리 카드용 썸네일: 작은 WebP로 줄여 전송량을 크게 줄인다.
    // 손상된 이미지는 변환할 수 없으므로 아래에서 원본을 그대로 보낸다.
    try {
      const thumb = await sharp(original).resize(width, width, { fit: 'inside' }).webp({ quality: 82 }).toBuffer();
      return new NextResponse(new Uint8Array(thumb), {
        headers: { 'Content-Type': 'image/webp', 'Cache-Control': IMMUTABLE_CACHE }
      });
    } catch {
      // fall through
    }
  }

  return new NextResponse(new Uint8Array(original), {
    headers: { 'Content-Type': match[1], 'Cache-Control': IMMUTABLE_CACHE }
  });
}
