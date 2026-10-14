import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

// 목록에는 이미지 원본(image_data)을 넣지 않는다. 이미지는 /api/artworks/[id]/image 에서 따로 받는다.
const LIST_COLUMNS = 'id, student_id, student_name, title, emotion, mode, principles, elements_summary, description, created_at';

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('artworks')
      .select(LIST_COLUMNS)
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // 여러 화면이 동시에 자동 동기화해도 짧게 CDN 캐시로 묶어 DB 부하를 줄인다.
    return NextResponse.json(
      { artworks: data || [] },
      { headers: { 'Cache-Control': 'public, s-maxage=5, stale-while-revalidate=10' } }
    );
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { student_id, student_name, title, emotion, mode, principles, elements_summary, description, image_data } = body;

    if (!student_name || !title || !image_data) {
      return NextResponse.json({ error: '필수 입력 항목이 누락되었습니다.' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('artworks')
      .insert([
        {
          student_id: student_id || '자유작가',
          student_name,
          title,
          emotion: emotion || '자유',
          mode: mode || 'freeform',
          principles: principles || [],
          elements_summary: elements_summary || '',
          description: description || '',
          image_data
        }
      ])
      .select('id')
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, id: data.id });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    // 비밀번호가 주소(로그)에 남지 않도록 본문으로만 받는다.
    let id: string | undefined;
    let password: string | undefined;
    try {
      const body = await request.json();
      id = body.id;
      password = body.password;
    } catch {
      // 본문이 없으면 아래에서 거절
    }

    if (!id) {
      return NextResponse.json({ error: '삭제할 작품 ID가 필요합니다.' }, { status: 400 });
    }

    const { data: deleted, error } = await supabase.rpc('admin_delete_artwork', {
      p_id: id,
      p_password: String(password || '')
    });

    if (error) {
      if (error.code === '28P01') {
        return NextResponse.json({ error: '관리자 비밀번호가 올바르지 않습니다.' }, { status: 401 });
      }
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    if (!deleted) {
      return NextResponse.json({ error: '작품을 찾을 수 없습니다.' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: '작품이 삭제되었습니다.' });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
