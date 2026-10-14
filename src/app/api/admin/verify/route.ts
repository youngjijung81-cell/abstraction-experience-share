import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { password } = body;

    // 비밀번호는 DB에 해시로만 저장되어 있고, DB 함수가 대조한다.
    const { data: ok, error } = await supabase.rpc('admin_check', { p_password: String(password || '').trim() });
    if (error) {
      return NextResponse.json({ error: '비밀번호 확인 중 오류가 발생했습니다.' }, { status: 500 });
    }
    if (!ok) {
      return NextResponse.json(
        { error: '선생님 관리 비밀번호가 올바르지 않습니다.' },
        { status: 401 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
