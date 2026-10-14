'use client';

import React, { useState } from 'react';
import { ArtElement, EmotionKey, PrincipleKey, StudioMode } from '@/lib/types';
import { EMOTIONS, PRINCIPLES } from '@/lib/constants/emotions';
import { exportArtworkToDataUrl } from '@/lib/engine/imageExporter';
import { X, Share2, CheckCircle2, Loader2, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';
import Link from 'next/link';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  elements: ArtElement[];
  selectedEmotion: EmotionKey;
  activePrinciples: PrincipleKey[];
  mode: StudioMode;
  canvasBgColor?: string;
}

export const GalleryModal: React.FC<Props> = ({
  isOpen,
  onClose,
  elements,
  selectedEmotion,
  activePrinciples,
  mode,
  canvasBgColor = '#FCFCFB',
}) => {
  const [title, setTitle] = useState('');
  const [studentId, setStudentId] = useState('');
  const [studentName, setStudentName] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const currEmotion = EMOTIONS.find((e) => e.key === selectedEmotion);
  const principleNames = activePrinciples
    .map((p) => PRINCIPLES.find((item) => item.key === p)?.koreanName || '')
    .filter(Boolean);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName.trim() || !title.trim()) {
      setErrorMessage('작품 제목과 작가명을 입력해 주세요.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const metadata = {
        title: title.trim(),
        studentId: studentId.trim(),
        studentName: studentName.trim(),
        emotionName: currEmotion?.koreanName || '자유',
        emotionEmoji: currEmotion?.emoji || '🎨',
        principles: principleNames,
        modeName: mode
      };

      const imageData = exportArtworkToDataUrl(elements, metadata, 720, canvasBgColor);

      const res = await fetch('/api/artworks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          student_id: studentId.trim() || '미술반',
          student_name: studentName.trim(),
          title: title.trim(),
          emotion: currEmotion?.koreanName || '자유',
          mode,
          principles: principleNames,
          elements_summary: `${elements.length}개의 조형 요소`,
          description: description.trim(),
          image_data: imageData
        })
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error || '업로드 실패');
      }

      setIsSuccess(true);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (err: any) {
      setErrorMessage(err.message || '전시관 등록 중 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-gray-100 flex flex-col max-h-[90vh]">
        {/* 헤더 */}
        <div className="px-5 py-3.5 border-b border-gray-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <span className="text-xl">🏛️</span>
            <h2 className="text-sm font-bold text-gray-800">우리 반 온라인 미술관에 작품 등록</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-gray-200 text-gray-500 transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* 컨텐츠 */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1">
          {isSuccess ? (
            <div className="text-center py-8 space-y-4">
              <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 size={36} />
              </div>
              <h3 className="text-lg font-extrabold text-gray-900">
                작품이 미술관에 성공적으로 전시되었습니다!
              </h3>
              <p className="text-xs text-gray-600 max-w-xs mx-auto leading-relaxed">
                우리 반 친구들과 선생님이 함께 감상할 수 있도록 온라인 전시관에 등록되었습니다.
              </p>
              <div className="pt-3 flex justify-center gap-2">
                <Link
                  href="/gallery"
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold inline-flex items-center gap-1.5 shadow-sm transition"
                >
                  <span>우리 반 미술관 보러가기</span>
                  <ArrowRight size={14} />
                </Link>
                <button
                  onClick={onClose}
                  className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-semibold transition"
                >
                  스튜디오로 돌아가기
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
              {errorMessage && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-xs">
                  {errorMessage}
                </div>
              )}

              <div>
                <label className="font-bold text-gray-700 block mb-1">
                  작품 제목 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="예: 붉은 격정과 푸른 침묵의 대화"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-hidden focus:ring-2 focus:ring-blue-500 text-gray-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">학번 (예: 20301)</label>
                  <input
                    type="text"
                    placeholder="20301"
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-hidden focus:ring-2 focus:ring-blue-500 text-gray-800"
                  />
                </div>
                <div>
                  <label className="font-bold text-gray-700 block mb-1">
                    작가명 (이름) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="홍길동"
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-hidden focus:ring-2 focus:ring-blue-500 text-gray-800"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">
                  작가의 의도 / 작품 설명 (Artist Note)
                </label>
                <textarea
                  rows={3}
                  placeholder="어떤 감정을 표현하고자 했나요? 사용한 점, 선, 면, 색채와 조형 원리(균형, 율동, 강조 등)의 의도를 적어보세요."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-hidden focus:ring-2 focus:ring-blue-500 text-gray-800 resize-none leading-relaxed"
                />
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-gray-200 text-gray-600 space-y-1">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-semibold text-gray-700">기록될 감정:</span>
                  <span className="font-bold text-blue-600">{currEmotion?.koreanName || '자유'} {currEmotion?.emoji}</span>
                </div>
                {principleNames.length > 0 && (
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-semibold text-gray-700">적용된 원리:</span>
                    <span className="text-purple-700 font-medium">{principleNames.join(', ')}</span>
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl font-semibold text-gray-600 hover:bg-gray-100 transition"
                >
                  취소
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-xl font-bold bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1.5 shadow-sm transition disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={14} className="animate-spin" />
                      <span>전시관 등록 중...</span>
                    </>
                  ) : (
                    <>
                      <Share2 size={14} />
                      <span>전시관에 등록하기</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
