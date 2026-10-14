import { createClient } from '@supabase/supabase-js';
import { ArtworkRecord } from './types';

// 서버(API 라우트)에서만 쓰는 클라이언트. 키는 Vercel 서버 환경변수에서만 읽고 코드에 넣지 않는다.
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('SUPABASE_URL / SUPABASE_ANON_KEY 환경변수가 설정되지 않았습니다.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function fetchArtworks(): Promise<ArtworkRecord[]> {
  try {
    const { data, error } = await supabase
      .from('artworks')
      .select('id, student_id, student_name, title, emotion, mode, principles, elements_summary, description, created_at')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching artworks:', error);
      return [];
    }

    return (data as ArtworkRecord[]) || [];
  } catch (err) {
    console.error('Unexpected error fetching artworks:', err);
    return [];
  }
}

export async function createArtwork(record: Omit<ArtworkRecord, 'id' | 'created_at'>): Promise<{ success: boolean; id?: string; error?: string }> {
  try {
    const { data, error } = await supabase
      .from('artworks')
      .insert([record])
      .select('id')
      .single();

    if (error) {
      console.error('Error inserting artwork:', error);
      return { success: false, error: error.message };
    }

    return { success: true, id: data?.id };
  } catch (err: any) {
    console.error('Unexpected error creating artwork:', err);
    return { success: false, error: err?.message || '알 수 없는 오류' };
  }
}
