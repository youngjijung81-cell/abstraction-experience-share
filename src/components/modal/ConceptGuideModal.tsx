'use client';

import React from 'react';
import { X, BookOpen, Sparkles, Sliders, CheckCircle } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const ConceptGuideModal: React.FC<Props> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl border border-gray-100 flex flex-col max-h-[88vh]">
        {/* 헤더 */}
        <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <BookOpen className="text-blue-600" size={20} />
            <h2 className="text-sm font-extrabold text-gray-900">
              미술 수업 학습 가이드: 조형 요소와 원리, 그리고 추상화
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-gray-200 text-gray-500 transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* 바디 */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs text-gray-700 leading-relaxed">
          {/* 1. 추상화란 무엇인가? */}
          <div className="bg-blue-50/70 p-4 rounded-xl border border-blue-100 space-y-2">
            <h3 className="text-sm font-bold text-blue-900 flex items-center gap-1.5">
              <Sparkles size={16} />
              <span>추상화(Abstraction)란 무엇인가?</span>
            </h3>
            <p>
              추상화는 눈에 보이는 대상을 그대로 사실적으로 묘사하는 것이 아니라, 대상의 불필요한 세부 묘사를 지우고 <strong>본질적인 특징이나 내면의 감정, 순수한 조형 요소(점, 선, 면, 색)</strong>만으로 화면을 새롭게 재구성하는 미술 표현 방식입니다.
            </p>
            <p className="text-blue-800 font-medium">
              * 몬드리안은 나무를 점차 수직·수평선과 삼원색으로 단순화했고, 피카소는 황소의 형태를 해체하여 몇 개의 강렬한 윤곽선으로 본질을 추출했습니다.
            </p>
          </div>

          {/* 2. 조형 요소 (Visual Elements) */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-gray-900 border-b pb-1.5 flex items-center gap-1.5">
              <span>📍 조형 요소 (Visual Elements)</span>
              <span className="text-[11px] font-normal text-gray-500">- 미술을 이루는 가장 기본 재료</span>
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 space-y-1">
                <span className="font-bold text-gray-900">1. 점 (Point)</span>
                <p className="text-gray-600">위치만을 가지는 가장 작은 단위로, 시선의 집중점(초점)을 만들거나 무리를 지어 질감과 에너지를 형성합니다.</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 space-y-1">
                <span className="font-bold text-gray-900">2. 선 (Line)</span>
                <p className="text-gray-600">점이 연속되어 이동한 자취로, 방향성·속도감·긴장감(직선/지그재그) 또는 유연함과 감성(곡선/파선)을 나타냅니다.</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 space-y-1">
                <span className="font-bold text-gray-900">3. 면 (Shape / Plane)</span>
                <p className="text-gray-600">선이 만나 둘러싼 평면 영역으로, 기하학적 면(원·삼각·사각)과 유기적인 생명체 형태(블롭)로 공간을 채웁니다.</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 space-y-1">
                <span className="font-bold text-gray-900">4. 색채 (Color)</span>
                <p className="text-gray-600">빛과 감정을 가장 직관적으로 전달하는 요소로, 명도·채도·보색 대비를 통해 따뜻함, 차가움, 긴장과 평온을 전달합니다.</p>
              </div>
            </div>
          </div>

          {/* 3. 조형 원리 (Principles of Design) */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-gray-900 border-b pb-1.5 flex items-center gap-1.5">
              <Sliders size={15} />
              <span>⚖️ 조형 원리 (Principles of Design)</span>
              <span className="text-[11px] font-normal text-gray-500">- 조형 요소를 아름답게 엮는 구성 법칙</span>
            </h3>
            <div className="grid grid-cols-2 gap-2.5">
              <div className="p-2.5 border rounded-lg bg-white">
                <span className="font-bold text-gray-800">통일과 변화 (Unity & Variety)</span>
                <p className="text-gray-500 text-[11px] mt-0.5">화면 전체의 질서감(통일)과 지루함을 깨뜨리는 다채로움(변화)의 공존</p>
              </div>
              <div className="p-2.5 border rounded-lg bg-white">
                <span className="font-bold text-gray-800">균형 (Balance)</span>
                <p className="text-gray-500 text-[11px] mt-0.5">대칭 균형(정적인 안정감)과 비대칭 균형(시각적 무게 분산으로 생동감)</p>
              </div>
              <div className="p-2.5 border rounded-lg bg-white">
                <span className="font-bold text-gray-800">율동 / 리듬 (Rhythm)</span>
                <p className="text-gray-500 text-[11px] mt-0.5">일정한 파동이나 점이(Gradation) 규칙을 통해 눈길이 움직이는 박자감</p>
              </div>
              <div className="p-2.5 border rounded-lg bg-white">
                <span className="font-bold text-gray-800">강조와 대비 (Emphasis & Contrast)</span>
                <p className="text-gray-500 text-[11px] mt-0.5">주인공 요소를 부각(초점)하거나 보색·형태 충돌을 통한 강렬한 인상</p>
              </div>
            </div>
          </div>

          {/* 4. 최신 스튜디오 조작 팁 */}
          <div className="bg-indigo-50/70 p-4 rounded-xl border border-indigo-100 space-y-2.5">
            <h4 className="font-bold text-indigo-950 mb-1 flex items-center gap-1.5 text-xs">
              <Sparkles size={15} className="text-indigo-600" />
              <span>🎨 스튜디오 핵심 조작 가이드</span>
            </h4>
            <div className="grid grid-cols-2 gap-2 text-[11px] text-gray-700">
              <div className="bg-white/80 p-2 rounded-lg border border-indigo-100/60">
                <span className="font-bold text-indigo-900 block">🖱️ 다중 선택 도구 & 전체 선택</span>
                <span>상단 [다중 선택 도구]로 드래그하거나 [전체 선택] 버튼을 누르면 여러 요소를 한 번에 묶어 일괄 이동·복제·색상 변경할 수 있습니다.</span>
              </div>
              <div className="bg-white/80 p-2 rounded-lg border border-indigo-100/60">
                <span className="font-bold text-indigo-900 block">📐 자유 변형 & 가로·세로 신축</span>
                <span>요소를 선택한 후 사각형 테두리의 꼭짓점과 변 조절점을 드래그하여 형태를 자유롭게 늘이거나 줄여보세요.</span>
              </div>
              <div className="bg-white/80 p-2 rounded-lg border border-indigo-100/60">
                <span className="font-bold text-indigo-900 block">📋 요소 복제 (원터치 복제)</span>
                <span>상단 툴바의 복제(📋) 버튼을 누르면 선택된 요소들이 겹치지 않게 즉시 복제되어 연속적인 리듬과 패턴을 만듭니다.</span>
              </div>
              <div className="bg-white/80 p-2 rounded-lg border border-indigo-100/60">
                <span className="font-bold text-indigo-900 block">🖼️ 캔버스 배경색 & 22색 팔레트</span>
                <span>[색채] 탭에서 [캔버스 배경색]을 골라 한지·린넨 질감이나 22색 표준 배색을 배경으로 깔아 분위기를 바꿀 수 있습니다.</span>
              </div>
              <div className="bg-white/80 p-2 rounded-lg border border-indigo-100/60">
                <span className="font-bold text-indigo-900 block">✨ 자동 생성 & 흩뿌림 점의 개별 제어</span>
                <span>감정 선택 시 나오는 점군이나 [흩뿌림] 도구의 점들은 모두 독립적인 점입니다. 하나씩 골라 크기와 색상을 따로 바꿀 수 있습니다.</span>
              </div>
              <div className="bg-white/80 p-2 rounded-lg border border-indigo-100/60">
                <span className="font-bold text-indigo-900 block">✏️ 자유 드로잉 & 브러시</span>
                <span>상단 자유 드로잉 펜을 켜면 펜, 형광 마커, 동양화 먹물 브러시로 감정의 흐름을 자유롭게 그릴 수 있습니다.</span>
              </div>
            </div>
          </div>

          {/* 5. 학생 실습 단계 안내 */}
          <div className="bg-slate-50 p-4 rounded-xl border border-gray-200">
            <h4 className="font-bold text-gray-900 mb-1 flex items-center gap-1">
              <CheckCircle size={15} className="text-green-600" />
              <span>학생 실습 꿀팁</span>
            </h4>
            <ul className="list-disc list-inside space-y-1 text-gray-600 text-[11px]">
              <li><strong>1단계 [감정 탐색]</strong>: 16가지 감정 중 자신의 오늘 기분이나 표현하고 싶은 정서를 선택해 기본 영감을 얻습니다.</li>
              <li><strong>2단계 [조형 원리 적용]</strong>: 8대 조형 원리(&apos;율동&apos;, &apos;대비&apos;, &apos;강조&apos; 등)를 클릭해 화면에 질서와 에너지를 부여합니다.</li>
              <li><strong>3단계 [창의적 변형]</strong>: 요소를 클릭하여 22색 표준 팔레트로 색을 바꾸고 꼭짓점을 당겨 나만의 비구상 형태를 완성합니다.</li>
              <li><strong>4단계 [감상 및 공유]</strong>: 고해상도 PNG로 다운로드하고, [우리 반 갤러리]에 작가 의도와 함께 올려 친구들의 작품을 감상합니다.</li>
            </ul>
          </div>
        </div>

        {/* 푸터 */}
        <div className="px-5 py-3 border-t border-gray-200 bg-gray-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs transition"
          >
            확인하고 실습하기
          </button>
        </div>
      </div>
    </div>
  );
};
