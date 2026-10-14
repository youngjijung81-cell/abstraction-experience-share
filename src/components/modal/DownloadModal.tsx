'use client';

import React, { useState, useEffect } from 'react';
import { ArtElement, EmotionKey, PrincipleKey, StudioMode } from '@/lib/types';
import { EMOTIONS, PRINCIPLES } from '@/lib/constants/emotions';
import { exportArtworkToDataUrl, downloadArtworkPNG, ExportMetadata } from '@/lib/engine/imageExporter';
import { X, Download, Check } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  elements: ArtElement[];
  selectedEmotion: EmotionKey;
  activePrinciples: PrincipleKey[];
  mode: StudioMode;
  canvasBgColor?: string;
}

export const DownloadModal: React.FC<Props> = ({
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
  const [previewUrl, setPreviewUrl] = useState('');
  const [downloaded, setDownloaded] = useState(false);

  const currEmotion = EMOTIONS.find((e) => e.key === selectedEmotion);
  const principleNames = activePrinciples
    .map((p) => PRINCIPLES.find((item) => item.key === p)?.koreanName || '')
    .filter(Boolean);

  const modeLabels: Record<StudioMode, string> = {
    auto: '자동 생성',
    guided: '감정 가이드',
    freeform: '자유 창작'
  };

  const getMetadata = (): ExportMetadata => ({
    title: title || `${currEmotion?.koreanName || '자유'}의 추상적 변주`,
    studentId: studentId.trim(),
    studentName: studentName.trim() || '미술반 학생',
    emotionName: currEmotion?.koreanName || '자유 추상',
    emotionEmoji: currEmotion?.emoji || '🎨',
    principles: principleNames,
    modeName: modeLabels[mode]
  });

  // 모달이 열리거나 입력이 바뀔 때 실시간 미리보기 렌더링
  useEffect(() => {
    if (isOpen && elements.length > 0) {
      const meta = getMetadata();
      const url = exportArtworkToDataUrl(elements, meta, 720, canvasBgColor);
      setPreviewUrl(url);
    }
  }, [isOpen, elements, title, studentId, studentName, selectedEmotion, activePrinciples, canvasBgColor]);

  if (!isOpen) return null;

  const handleDownload = () => {
    const meta = getMetadata();
    downloadArtworkPNG(elements, meta, canvasBgColor);
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-gray-100 flex flex-col max-h-[90vh]">
        {/* 헤더 */}
        <div className="px-5 py-3.5 border-b border-gray-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <span className="text-xl">🖼️</span>
            <h2 className="text-sm font-bold text-gray-800">작품 고해상도 PNG 다운로드</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-gray-200 text-gray-500 transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* 바디 */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1">
          {/* 미리보기 이미지 (미술관 캡션 포함) */}
          <div className="relative aspect-square max-w-xs mx-auto rounded-xl overflow-hidden border border-gray-200 shadow-inner bg-slate-100">
            {previewUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={previewUrl}
                alt="Artwork Preview"
                className="w-full h-full object-contain"
              />
            )}
          </div>

          {/* 입력 필드들 */}
          <div className="space-y-3 text-xs">
            <div>
              <label className="font-bold text-gray-700 block mb-1">작품 제목 (Title)</label>
              <input
                type="text"
                placeholder="예: 푸른 침묵 속의 율동"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-hidden focus:ring-2 focus:ring-blue-500 text-gray-800"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-gray-700 block mb-1">학번 (선택)</label>
                <input
                  type="text"
                  placeholder="예: 20415"
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-hidden focus:ring-2 focus:ring-blue-500 text-gray-800"
                />
              </div>
              <div>
                <label className="font-bold text-gray-700 block mb-1">작가명 / 이름</label>
                <input
                  type="text"
                  placeholder="예: 김민수"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-hidden focus:ring-2 focus:ring-blue-500 text-gray-800"
                />
              </div>
            </div>

            <div className="bg-blue-50/70 p-3 rounded-xl text-gray-600 space-y-1">
              <p className="font-semibold text-blue-900">📌 각인 정보 안내</p>
              <p className="text-[11px]">
                다운로드 이미지 하단에 정방형(1080x1080) 규격으로 미술관 전시 플레이트 라벨이 자동 각인되어 인쇄 및 수행평가 제출에 적합합니다.
              </p>
            </div>
          </div>
        </div>

        {/* 푸터 */}
        <div className="px-5 py-3 border-t border-gray-200 flex justify-end gap-2 bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-200 transition"
          >
            닫기
          </button>
          <button
            onClick={handleDownload}
            className="px-5 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1.5 shadow-sm transition"
          >
            {downloaded ? (
              <>
                <Check size={14} />
                <span>저장 완료!</span>
              </>
            ) : (
              <>
                <Download size={14} />
                <span>PNG 고해상도 다운로드</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
