'use client';

import React, { useEffect, useState, useMemo, useCallback, useRef } from 'react';
import { ArtworkRecord } from '@/lib/types';
import { EMOTIONS } from '@/lib/constants/emotions';
import Link from 'next/link';
import {
  ArrowLeft,
  Sparkles,
  Filter,
  User,
  Download,
  Search,
  Trash2,
  Lock,
  Unlock,
  X,
  Layers,
  School,
  AlertCircle,
  RefreshCw
} from 'lucide-react';

// 학번에서 반(Class) 정보 추출 유틸 함수
function getStudentClass(studentId?: string): string {
  if (!studentId) return '기타';
  const clean = studentId.trim();

  // 1) 5자리 숫자 학번 (예: 10315 -> 3반, 21105 -> 11반)
  if (/^\d{5}$/.test(clean)) {
    const classNum = parseInt(clean.substring(1, 3), 10);
    return `${classNum}반`;
  }
  // 2) 4자리 숫자 학번 (예: 1315 -> 3반)
  if (/^\d{4}$/.test(clean)) {
    const classNum = parseInt(clean.substring(1, 2), 10);
    return `${classNum}반`;
  }
  // 3) "1-3", "1-03", "1-3-15", "1학년 3반" 등
  const match = clean.match(/(\d+)\s*[-학년]\s*0?(\d+)/);
  if (match) {
    return `${parseInt(match[2], 10)}반`;
  }
  // 4) "3반" 형태
  const matchClassOnly = clean.match(/0?(\d+)\s*반/);
  if (matchClassOnly) {
    return `${parseInt(matchClassOnly[1], 10)}반`;
  }

  return '기타';
}

// 작품 이미지 주소 (썸네일은 width 지정)
function artworkImageUrl(id: string, width?: number): string {
  return `/api/artworks/${id}/image${width ? `?w=${width}` : ''}`;
}

export default function GalleryPage() {
  const [artworks, setArtworks] = useState<ArtworkRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<Date>(new Date());

  // 필터 및 검색 상태
  const [selectedEmotion, setSelectedEmotion] = useState<string>('all');
  const [selectedClass, setSelectedClass] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedArtwork, setSelectedArtwork] = useState<ArtworkRecord | null>(null);

  // 교사 관리 모드 상태
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [adminPassword, setAdminPassword] = useState<string>('');
  const [showAdminModal, setShowAdminModal] = useState<boolean>(false);
  const [passwordInput, setPasswordInput] = useState<string>('');
  const [passwordError, setPasswordError] = useState<string>('');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // 교사 모드 단축 접근을 위한 비밀 클릭 횟수
  const [secretClickCount, setSecretClickCount] = useState<number>(0);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);

  // 방금 삭제한 작품 ID (짧은 CDN 캐시 때문에 목록에 다시 나타나지 않도록 제외)
  const deletedIdsRef = useRef<Set<string>>(new Set());

  // 실시간 작품 목록 불러오기 함수
  const loadArtworks = useCallback(async (silent = false) => {
    if (!silent) setIsRefreshing(true);
    try {
      const res = await fetch('/api/artworks');
      const data = await res.json();
      if (data.artworks) {
        const next: ArtworkRecord[] = data.artworks.filter(
          (a: ArtworkRecord) => !deletedIdsRef.current.has(a.id)
        );
        // 목록이 그대로면 다시 그리지 않는다.
        setArtworks((prev) =>
          prev.length === next.length && prev.every((a, i) => a.id === next[i].id) ? prev : next
        );
        setLastSyncTime(new Date());
      }
    } catch (e) {
      console.error(e);
    } finally {
      if (!silent) setIsRefreshing(false);
      setLoading(false);
    }
  }, []);

  // 초기 로드 & 10초 주기 실시간 자동 동기화 (수업 중 학생들 제출 실시간 반영)
  useEffect(() => {
    loadArtworks(false);

    // 10초마다 자동으로 새로운 제출 작품 실시간 반영
    // (탭이 가려져 있으면 건너뛰고, 다시 보이면 즉시 갱신)
    const syncInterval = setInterval(() => {
      if (document.visibilityState === 'visible') loadArtworks(true);
    }, 10000);
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') loadArtworks(true);
    };
    document.addEventListener('visibilitychange', handleVisibility);

    // 저장된 관리자 세션 확인
    const savedPin = sessionStorage.getItem('art_admin_pin');
    if (savedPin) {
      setIsAdmin(true);
      setAdminPassword(savedPin);
    }

    // URL 파라미터 감지 (?admin=true 또는 ?teacher=true)
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('admin') === 'true' || params.get('teacher') === 'true') {
        setShowAdminModal(true);
      }
    }

    // 단축키 감지: Ctrl + Shift + A (Teacher Admin Shortcut)
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        setShowAdminModal(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      clearInterval(syncInterval);
      document.removeEventListener('visibilitychange', handleVisibility);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [loadArtworks]);

  // 반 목록 및 각 반별 등록 작품 수 집계
  const classCounts = useMemo(() => {
    const counts: Record<string, number> = { all: artworks.length };
    artworks.forEach((art) => {
      const cls = getStudentClass(art.student_id);
      counts[cls] = (counts[cls] || 0) + 1;
    });
    return counts;
  }, [artworks]);

  // 기본 반 탭 목록 (1반 ~ 8반 + 등록된 기타 반)
  const classTabs = useMemo(() => {
    const standard = ['1반', '2반', '3반', '4반', '5반', '6반', '7반', '8반'];
    const otherClasses = Object.keys(classCounts).filter(
      (c) => c !== 'all' && !standard.includes(c)
    );
    return ['all', ...standard, ...otherClasses];
  }, [classCounts]);

  // 필터링 적용된 작품 목록
  const filteredArtworks = useMemo(() => {
    return artworks.filter((art) => {
      // 1) 감정 필터
      if (selectedEmotion !== 'all' && art.emotion !== selectedEmotion) {
        return false;
      }
      // 2) 반별 필터
      if (selectedClass !== 'all') {
        const cls = getStudentClass(art.student_id);
        if (cls !== selectedClass) return false;
      }
      // 3) 실시간 검색 (학번, 이름, 작품명)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchName = (art.student_name || '').toLowerCase().includes(q);
        const matchId = (art.student_id || '').toLowerCase().includes(q);
        const matchTitle = (art.title || '').toLowerCase().includes(q);
        if (!matchName && !matchId && !matchTitle) return false;
      }
      return true;
    });
  }, [artworks, selectedEmotion, selectedClass, searchQuery]);

  // 헤더 🏛️ 아이콘 3회 연속 클릭 시 교사 모드 진입
  const handleSecretIconClick = () => {
    setSecretClickCount((prev) => {
      const next = prev + 1;
      if (next >= 3) {
        setShowAdminModal(true);
        return 0;
      }
      return next;
    });
  };

  // 교사 모드 서버 검증 로그인 처리
  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordInput.trim()) {
      setPasswordError('비밀번호를 입력해 주세요.');
      return;
    }

    setIsVerifying(true);
    setPasswordError('');

    try {
      const res = await fetch('/api/admin/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: passwordInput.trim() })
      });
      const data = await res.json();

      if (!res.ok) {
        setPasswordError(data.error || '비밀번호가 올바르지 않습니다.');
        setIsVerifying(false);
        return;
      }

      setIsAdmin(true);
      setAdminPassword(passwordInput.trim());
      sessionStorage.setItem('art_admin_pin', passwordInput.trim());
      setShowAdminModal(false);
      setPasswordInput('');
      setPasswordError('');
    } catch {
      setPasswordError('비밀번호 검증 중 오류가 발생했습니다.');
    } finally {
      setIsVerifying(false);
    }
  };

  // 교사 모드 로그아웃
  const handleAdminLogout = () => {
    setIsAdmin(false);
    setAdminPassword('');
    sessionStorage.removeItem('art_admin_pin');
  };

  // 작품 삭제 실행
  const handleDeleteArtwork = async (id: string, title: string) => {
    const confirmDelete = window.confirm(
      `'${title}' 작품을 정말 미술관에서 삭제하시겠습니까?\n(삭제 후에는 복구할 수 없습니다)`
    );
    if (!confirmDelete) return;

    setDeletingId(id);
    try {
      const res = await fetch('/api/artworks', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, password: adminPassword })
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || '삭제 중 오류가 발생했습니다.');
      }

      // 화면 목록에서 즉시 제거
      deletedIdsRef.current.add(id);
      setArtworks((prev) => prev.filter((a) => a.id !== id));
      if (selectedArtwork?.id === id) {
        setSelectedArtwork(null);
      }
      alert('작품이 정상적으로 삭제되었습니다.');
    } catch (err: any) {
      alert(`삭제 실패: ${err.message}`);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-gray-900 flex flex-col">
      {/* 1. 상단 네비게이션 헤더 */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-20 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 transition flex items-center gap-1.5 text-xs font-bold shrink-0"
            >
              <ArrowLeft size={16} />
              <span>창작 스튜디오</span>
            </Link>
            <div>
              <h1 className="text-base sm:text-lg font-black text-gray-900 flex items-center gap-2 select-none">
                <span
                  onClick={handleSecretIconClick}
                  className="cursor-pointer hover:scale-110 active:scale-95 transition-transform"
                  title="온라인 미술관"
                >
                  🏛️
                </span>
                <span>우리 반 온라인 미술관</span>
              </h1>
              <div className="flex items-center gap-2">
                <p className="text-[11px] text-gray-500 hidden sm:block">
                  감정을 조형 요소와 원리로 시각화한 학생들의 추상화 전시관
                </p>
                <div className="flex items-center gap-1 text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>실시간 동기화 중 ({artworks.length}점)</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* 실시간 수동 새로고침 버튼 */}
            <button
              onClick={() => loadArtworks(false)}
              disabled={isRefreshing}
              title="새로 제출된 학생 작품 실시간 불러오기"
              className="px-2.5 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-semibold transition flex items-center gap-1.5"
            >
              <RefreshCw
                size={13}
                className={isRefreshing ? 'animate-spin text-blue-600' : 'text-gray-500'}
              />
              <span className="hidden sm:inline">{isRefreshing ? '불러오는 중...' : '새로고침'}</span>
            </button>

            {/* 교사 관리 모드: 활성화 시 관리 상태 배지 표시, 비활성 시에는 아주 작고 은은한 잠금 아이콘으로만 최소화 */}
            {isAdmin ? (
              <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-300 px-2.5 py-1 rounded-xl shadow-2xs">
                <span className="text-xs font-bold text-emerald-800 flex items-center gap-1">
                  <Unlock size={14} className="text-emerald-600" />
                  <span className="hidden sm:inline">교사 관리 모드</span>
                  <span className="sm:hidden">관리중</span>
                </span>
                <button
                  onClick={handleAdminLogout}
                  className="text-[11px] font-bold text-red-600 hover:text-red-700 underline ml-1"
                >
                  종료
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  setShowAdminModal(true);
                  setPasswordError('');
                }}
                className="p-1.5 text-gray-300 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition"
                title="관리자"
                aria-label="관리자"
              >
                <Lock size={13} />
              </button>
            )}

            <Link
              href="/"
              className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs transition flex items-center gap-1.5 shrink-0"
            >
              <Sparkles size={14} />
              <span>작품 만들기</span>
            </Link>
          </div>
        </div>
      </header>

      {/* 2. 검색창 & 반별 / 감정별 스마트 필터 섹션 */}
      <div className="bg-white border-b border-gray-200 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 space-y-3">
          {/* 상단 줄: 검색창 + 현재 상태 요약 */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
            {/* 학번 / 이름 / 제목 실시간 검색창 */}
            <div className="relative flex-1 max-w-md">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="학번(예: 10301, 3반), 학생 이름, 작품명 검색..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-8 py-2 text-xs bg-slate-50 border border-gray-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-0.5"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* 필터 결과 요약 및 초기화 */}
            <div className="flex items-center justify-between sm:justify-end gap-2 text-xs text-gray-600">
              <span className="font-medium">
                전체 <span className="font-bold text-blue-600">{artworks.length}</span>점 중{' '}
                <span className="font-bold text-gray-900">{filteredArtworks.length}</span>점 표시
              </span>
              {(selectedClass !== 'all' || selectedEmotion !== 'all' || searchQuery) && (
                <button
                  onClick={() => {
                    setSelectedClass('all');
                    setSelectedEmotion('all');
                    setSearchQuery('');
                  }}
                  className="text-[11px] text-blue-600 hover:text-blue-800 font-bold bg-blue-50 px-2 py-1 rounded-lg"
                >
                  필터 초기화
                </button>
              )}
            </div>
          </div>

          {/* 반별 필터 탭 (학번 기반 자동 분류) */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs scrollbar-thin">
            <span className="text-gray-500 font-bold flex items-center gap-1 mr-1 shrink-0 text-[11px]">
              <School size={13} className="text-indigo-600" />
              <span>반별:</span>
            </span>
            {classTabs.map((cls) => {
              const count = classCounts[cls] || 0;
              const isSelected = selectedClass === cls;
              return (
                <button
                  key={cls}
                  onClick={() => setSelectedClass(cls)}
                  className={`px-3 py-1.5 rounded-xl font-bold transition shrink-0 flex items-center gap-1.5 text-xs ${
                    isSelected
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <span>{cls === 'all' ? '전체 학급' : cls}</span>
                  {count > 0 && (
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full font-semibold ${
                        isSelected
                          ? 'bg-white/25 text-white'
                          : 'bg-gray-200 text-gray-700'
                      }`}
                    >
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* 감정별 필터 탭 */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs scrollbar-thin">
            <span className="text-gray-500 font-bold flex items-center gap-1 mr-1 shrink-0 text-[11px]">
              <Filter size={13} className="text-amber-500" />
              <span>감정:</span>
            </span>
            <button
              onClick={() => setSelectedEmotion('all')}
              className={`px-3 py-1 rounded-full font-bold transition shrink-0 text-xs ${
                selectedEmotion === 'all'
                  ? 'bg-gray-900 text-white shadow-xs'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              전체 감정
            </button>
            {EMOTIONS.map((em) => (
              <button
                key={em.key}
                onClick={() => setSelectedEmotion(em.koreanName)}
                className={`px-2.5 py-1 rounded-full font-semibold transition shrink-0 flex items-center gap-1 text-xs ${
                  selectedEmotion === em.koreanName
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <span>{em.emoji}</span>
                <span>{em.koreanName}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 3. 갤러리 메인 그리드 */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 flex-1 w-full">
        {loading ? (
          <div className="py-24 text-center">
            <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-xs text-gray-500 font-medium">전시관의 작품들을 불러오는 중입니다...</p>
          </div>
        ) : filteredArtworks.length === 0 ? (
          <div className="py-20 text-center bg-white rounded-2xl border border-dashed border-gray-300 p-8 max-w-md mx-auto">
            <span className="text-4xl block mb-2">🎨</span>
            <h3 className="text-sm font-bold text-gray-800">조건에 맞는 작품이 없습니다</h3>
            <p className="text-xs text-gray-500 mt-1 mb-4 leading-relaxed">
              선택한 반이나 감정에 등록된 작품이 없거나 검색 결과가 없습니다.
            </p>
            <button
              onClick={() => {
                setSelectedClass('all');
                setSelectedEmotion('all');
                setSearchQuery('');
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-bold transition mr-2"
            >
              <span>필터 초기화</span>
            </button>
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition shadow-xs"
            >
              <Sparkles size={14} />
              <span>작품 창작하기</span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredArtworks.map((art) => {
              const studentClass = getStudentClass(art.student_id);
              const isDeleting = deletingId === art.id;

              return (
                <div
                  key={art.id}
                  onClick={() => setSelectedArtwork(art)}
                  className="bg-white rounded-2xl border border-gray-200 shadow-2xs hover:shadow-md transition-all overflow-hidden cursor-pointer group flex flex-col relative"
                >
                  {/* 캔버스 이미지 미리보기 */}
                  <div className="relative aspect-square bg-slate-100 overflow-hidden border-b border-gray-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={artworkImageUrl(art.id, 480)}
                      alt={art.title}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                    />

                    {/* 감정 뱃지 */}
                    <div className="absolute top-2.5 left-2.5 bg-black/60 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                      <span>{art.emotion}</span>
                    </div>

                    {/* 반(Class) 뱃지 */}
                    {studentClass !== '기타' && (
                      <div className="absolute bottom-2.5 left-2.5 bg-indigo-600/85 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
                        {studentClass}
                      </div>
                    )}

                    {/* 교사 관리 모드: 즉시 삭제 버튼 */}
                    {isAdmin && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteArtwork(art.id, art.title);
                        }}
                        disabled={isDeleting}
                        title="선생님 권한으로 이 작품 삭제"
                        className="absolute top-2.5 right-2.5 bg-red-600 hover:bg-red-700 text-white p-1.5 rounded-xl shadow-md transition transform hover:scale-110 flex items-center gap-1 text-[11px] font-bold z-10"
                      >
                        <Trash2 size={13} />
                        <span className="text-[10px]">삭제</span>
                      </button>
                    )}
                  </div>

                  {/* 정보 영역 */}
                  <div className="p-4 flex-1 flex flex-col justify-between space-y-2">
                    <div>
                      <h3 className="text-sm font-bold text-gray-900 group-hover:text-blue-600 transition truncate">
                        {art.title}
                      </h3>
                      <div className="flex items-center gap-1.5 text-xs text-gray-600 mt-1">
                        <User size={13} className="text-gray-400" />
                        <span className="font-semibold text-gray-800">
                          {art.student_name}
                        </span>
                        {art.student_id && (
                          <span className="text-[11px] text-gray-500 font-mono bg-gray-100 px-1.5 py-0.2 rounded">
                            {art.student_id}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* 작가 의도 프리뷰 */}
                    {art.description && (
                      <p className="text-[11px] text-gray-500 line-clamp-2 leading-relaxed bg-slate-50 p-2 rounded-lg">
                        {art.description}
                      </p>
                    )}

                    {/* 조형 원리 태그 */}
                    {art.principles && art.principles.length > 0 && (
                      <div className="flex flex-wrap gap-1 pt-1">
                        {art.principles.map((pr, idx) => (
                          <span
                            key={idx}
                            className="text-[10px] bg-purple-50 text-purple-700 px-1.5 py-0.5 rounded border border-purple-200"
                          >
                            {pr}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* 4. 작품 상세보기 모달 */}
      {selectedArtwork && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-xl w-full overflow-hidden shadow-2xl border border-gray-200 flex flex-col max-h-[90vh]">
            <div className="p-4 border-b flex items-center justify-between bg-slate-50">
              <div>
                <h2 className="text-sm font-bold text-gray-900">{selectedArtwork.title}</h2>
                <p className="text-xs text-gray-500">
                  {selectedArtwork.student_id ? `[${selectedArtwork.student_id}] ` : ''}
                  {selectedArtwork.student_name} 작가 • {selectedArtwork.emotion}
                </p>
              </div>
              <button
                onClick={() => setSelectedArtwork(null)}
                className="p-1 rounded-lg hover:bg-gray-200 text-gray-500 text-xs font-bold px-2 py-1"
              >
                닫기
              </button>
            </div>

            <div className="p-5 overflow-y-auto space-y-4">
              <div className="aspect-square max-w-md mx-auto rounded-xl overflow-hidden border shadow-xs bg-slate-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={artworkImageUrl(selectedArtwork.id)}
                  alt={selectedArtwork.title}
                  className="w-full h-full object-contain bg-white"
                />
              </div>

              {selectedArtwork.description && (
                <div className="bg-slate-50 p-3.5 rounded-xl border border-gray-200 space-y-1">
                  <h4 className="text-xs font-bold text-gray-800">작가 노트 (Artist Note)</h4>
                  <p className="text-xs text-gray-600 leading-relaxed whitespace-pre-wrap">
                    {selectedArtwork.description}
                  </p>
                </div>
              )}

              <div className="flex flex-wrap items-center justify-between text-xs text-gray-500 pt-1 gap-2">
                <span>학번/소속: {selectedArtwork.student_id || '자유작가'} ({getStudentClass(selectedArtwork.student_id)})</span>
                <span>표현 감정: {selectedArtwork.emotion}</span>
              </div>
            </div>

            <div className="p-3 border-t bg-gray-50 flex items-center justify-between gap-2">
              {/* 관리자 모드인 경우 모달 내 삭제 버튼 */}
              {isAdmin ? (
                <button
                  onClick={() => handleDeleteArtwork(selectedArtwork.id, selectedArtwork.title)}
                  className="px-3.5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition"
                >
                  <Trash2 size={14} />
                  <span>이 작품 삭제</span>
                </button>
              ) : (
                <div />
              )}

              <div className="flex gap-2">
                <a
                  href={artworkImageUrl(selectedArtwork.id)}
                  download={`${selectedArtwork.title}.png`}
                  className="px-4 py-2 bg-gray-900 hover:bg-black text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition shadow-xs"
                >
                  <Download size={14} />
                  <span>다운로드</span>
                </a>
                <button
                  onClick={() => setSelectedArtwork(null)}
                  className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-xl text-xs font-semibold transition"
                >
                  닫기
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. 교사 관리자 모드 로그인 모달 */}
      {showAdminModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl border border-gray-200 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-indigo-50 rounded-xl text-indigo-600">
                  <Lock size={18} />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-gray-900">교사 관리 모드 인증</h3>
                  <p className="text-[11px] text-gray-500">작품 삭제 및 관리 권한 활성화</p>
                </div>
              </div>
              <button
                onClick={() => setShowAdminModal(false)}
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleAdminLogin} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  선생님 관리 비밀번호
                </label>
                <input
                  type="password"
                  placeholder="관리자 비밀번호를 입력해 주세요"
                  value={passwordInput}
                  onChange={(e) => {
                    setPasswordInput(e.target.value);
                    setPasswordError('');
                  }}
                  autoFocus
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                />
                <p className="text-[10px] text-gray-400 mt-1">
                  * 승인된 지도교사만 작품 삭제 및 관리 권한을 가집니다.
                </p>
                {passwordError && (
                  <p className="text-xs text-red-600 font-bold mt-1 flex items-center gap-1">
                    <AlertCircle size={12} />
                    <span>{passwordError}</span>
                  </p>
                )}
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAdminModal(false)}
                  className="px-3.5 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-xl"
                >
                  취소
                </button>
                <button
                  type="submit"
                  disabled={isVerifying}
                  className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 rounded-xl shadow-xs transition"
                >
                  {isVerifying ? '확인 중...' : '관리 모드 시작'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
