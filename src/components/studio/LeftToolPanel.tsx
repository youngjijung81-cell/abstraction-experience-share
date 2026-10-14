'use client';

import React, { useState } from 'react';
import { StudioMode, EmotionKey, PrincipleKey, ArtElement } from '@/lib/types';
import { EMOTIONS, PRINCIPLES } from '@/lib/constants/emotions';
import { ART_COLORS } from '@/lib/constants/colors';
import { POINT_TEMPLATES, LINE_TEMPLATES, SHAPE_TEMPLATES } from '@/lib/constants/elements';
import { SelectedElementEditor } from './SelectedElementEditor';
import { Sparkles, Palette, Shapes, Sliders, Wand2, Info, Compass, Plus, ArrowRight, Lightbulb, BookOpen } from 'lucide-react';

interface Props {
  mode: StudioMode;
  onModeChange: (m: StudioMode) => void;
  selectedEmotion: EmotionKey;
  onEmotionSelect: (e: EmotionKey) => void;
  onAddElement: (type: 'point' | 'line' | 'shape', subType: string) => void;
  onApplyPrinciple: (p: PrincipleKey) => void;
  activePrinciples: PrincipleKey[];
  currentColor: string;
  onColorChange: (c: string) => void;
  canvasBgColor?: string;
  onBgColorChange?: (c: string) => void;
  selectedElement: ArtElement | null;
  selectedElements?: ArtElement[];
  selectedCount?: number;
  onUpdateElement: (updated: Partial<ArtElement>) => void;
  onUpdateMultipleProps?: (
    patch: Partial<ArtElement> | ((el: ArtElement) => Partial<ArtElement>)
  ) => void;
  onUpdateMultipleColors?: (color: string) => void;
  onDeleteElement: (id: string) => void;
  onDeleteMultiple?: () => void;
  onDuplicateElement: (id: string) => void;
  onDuplicateMultiple?: () => void;
  onBringForward: (id: string) => void;
  onBringForwardMultiple?: () => void;
  onSendBackward: (id: string) => void;
  onSendBackwardMultiple?: () => void;
  onDeselect: () => void;
  onOpenGuide: () => void;
}

export const LeftToolPanel: React.FC<Props> = ({
  mode,
  onModeChange,
  selectedEmotion,
  onEmotionSelect,
  onAddElement,
  onApplyPrinciple,
  activePrinciples,
  currentColor,
  onColorChange,
  canvasBgColor = '#FCFCFB',
  onBgColorChange,
  selectedElement,
  selectedElements = [],
  selectedCount = 0,
  onUpdateElement,
  onUpdateMultipleProps,
  onUpdateMultipleColors,
  onDeleteElement,
  onDeleteMultiple,
  onDuplicateElement,
  onDuplicateMultiple,
  onBringForward,
  onBringForwardMultiple,
  onSendBackward,
  onSendBackwardMultiple,
  onDeselect,
  onOpenGuide,
}) => {
  const [activeTab, setActiveTab] = useState<'emotions' | 'elements' | 'colors' | 'principles' | 'guidedView'>('emotions');
  const [elementCategory, setElementCategory] = useState<'shape' | 'line' | 'point'>('shape');
  const [colorTarget, setColorTarget] = useState<'element' | 'background'>('element');

  const currEmotionInfo = EMOTIONS.find((e) => e.key === selectedEmotion) || EMOTIONS[0];

  return (
    <div className="h-full flex flex-col bg-slate-50 border-r border-gray-200 select-none overflow-hidden">
      {/* 1. 상단 모드 전환 탭 */}
      <div className="p-3 bg-white border-b border-gray-200">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-sm font-bold text-sm">
              Art
            </div>
            <div>
              <h1 className="text-sm font-extrabold text-gray-900 tracking-tight">
                감정 추상화 스튜디오
              </h1>
              <p className="text-[11px] text-gray-500">고등학교 미술 조형요소 & 원리 실습</p>
            </div>
          </div>
          <button
            onClick={onOpenGuide}
            className="flex items-center gap-1 text-[11px] font-medium text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-2.5 py-1 rounded-md transition"
          >
            <Info size={13} />
            <span>학습가이드</span>
          </button>
        </div>

        {/* 3가지 모드 토글 */}
        <div className="grid grid-cols-3 gap-1 p-1 bg-gray-100 rounded-lg">
          <button
            onClick={() => {
              onModeChange('auto');
              setActiveTab('emotions');
            }}
            className={`py-1.5 px-2 rounded-md text-xs font-semibold flex items-center justify-center gap-1 transition ${
              mode === 'auto'
                ? 'bg-white text-blue-700 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Wand2 size={13} />
            <span>자동 생성</span>
          </button>
          <button
            onClick={() => {
              onModeChange('guided');
              setActiveTab('guidedView');
            }}
            className={`py-1.5 px-2 rounded-md text-xs font-semibold flex items-center justify-center gap-1 transition ${
              mode === 'guided'
                ? 'bg-white text-blue-700 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Compass size={13} />
            <span>감정 가이드</span>
          </button>
          <button
            onClick={() => {
              onModeChange('freeform');
              setActiveTab('elements');
            }}
            className={`py-1.5 px-2 rounded-md text-xs font-semibold flex items-center justify-center gap-1 transition ${
              mode === 'freeform'
                ? 'bg-white text-blue-700 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Sparkles size={13} />
            <span>자유 창작</span>
          </button>
        </div>

        {/* 모드별 안내 메시지 */}
        <div className="mt-2 text-[11px] text-gray-600 bg-blue-50/60 rounded px-2 py-1">
          {mode === 'auto' && '✨ 감정별 구도를 기초로 삼아, 자유 창작 모드로 전환하거나 캔버스 위에 점·선·면과 드로잉을 자유롭게 더해보세요.'}
          {mode === 'guided' && '🎯 선택한 감정의 조형적 해석과 추천 요소·색채·원리 해설을 보며 단계별로 창작합니다.'}
          {mode === 'freeform' && '🎨 자동 생성된 그림 위나 캔버스에 점·선·면 조형요소, 자유 드로잉 펜, 22색 팔레트를 자유롭게 배치하고 창작합니다.'}
        </div>
      </div>

      {/* 2. 도구 탭 메뉴 */}
      <div className="flex border-b border-gray-200 bg-white">
        {mode === 'guided' && (
          <button
            onClick={() => setActiveTab('guidedView')}
            className={`flex-1 py-2.5 text-xs font-bold border-b-2 flex items-center justify-center gap-1 transition ${
              activeTab === 'guidedView'
                ? 'border-blue-600 text-blue-600 bg-blue-50/20'
                : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            <Compass size={14} />
            <span>조형 가이드</span>
          </button>
        )}
        <button
          onClick={() => setActiveTab('emotions')}
          className={`flex-1 py-2.5 text-xs font-bold border-b-2 flex items-center justify-center gap-1 transition ${
            activeTab === 'emotions'
              ? 'border-blue-600 text-blue-600 bg-blue-50/20'
              : 'border-transparent text-gray-500 hover:text-gray-800'
          }`}
        >
          <span>💖</span>
          <span>감정 ({EMOTIONS.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('elements')}
          className={`flex-1 py-2.5 text-xs font-bold border-b-2 flex items-center justify-center gap-1 transition ${
            activeTab === 'elements'
              ? 'border-blue-600 text-blue-600 bg-blue-50/20'
              : 'border-transparent text-gray-500 hover:text-gray-800'
          }`}
        >
          <Shapes size={14} />
          <span>조형요소</span>
        </button>
        <button
          onClick={() => setActiveTab('colors')}
          className={`flex-1 py-2.5 text-xs font-bold border-b-2 flex items-center justify-center gap-1 transition ${
            activeTab === 'colors'
              ? 'border-blue-600 text-blue-600 bg-blue-50/20'
              : 'border-transparent text-gray-500 hover:text-gray-800'
          }`}
        >
          <Palette size={14} />
          <span>색채 (22색)</span>
        </button>
        <button
          onClick={() => setActiveTab('principles')}
          className={`flex-1 py-2.5 text-xs font-bold border-b-2 flex items-center justify-center gap-1 transition ${
            activeTab === 'principles'
              ? 'border-blue-600 text-blue-600 bg-blue-50/20'
              : 'border-transparent text-gray-500 hover:text-gray-800'
          }`}
        >
          <Sliders size={14} />
          <span>조형원리</span>
        </button>
      </div>

      {/* 3. 탭별 메인 컨텐츠 영역 (스크롤 가능) */}
      <div className="flex-1 overflow-y-auto p-3.5 space-y-4">
        {/* 자동 생성 모드에서 바로 자유 창작으로 이어가기 배너 */}
        {mode === 'auto' && (
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-3 flex items-center justify-between shadow-2xs">
            <div>
              <div className="text-xs font-extrabold text-blue-900 flex items-center gap-1.5">
                <Sparkles size={14} className="text-blue-600" />
                <span>현재 그림 바탕으로 자유 창작하기</span>
              </div>
              <p className="text-[11px] text-gray-500 mt-0.5">
                자동 생성된 요소를 유지한 채 자유롭게 요소를 더하고 드로잉합니다.
              </p>
            </div>
            <button
              onClick={() => {
                onModeChange('freeform');
                setActiveTab('elements');
              }}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition shadow-xs flex items-center gap-1 whitespace-nowrap ml-2"
            >
              <span>자유 창작 시작</span>
              <ArrowRight size={12} />
            </button>
          </div>
        )}
        {/* 감정 가이드 전용 뷰: 감정에 따른 적절한 조형요소와 원리 상세 해설 */}
        {activeTab === 'guidedView' && currEmotionInfo && (
          <div className="space-y-4">
            {/* 상단 감정 헤더 카드 */}
            <div className="bg-white border-2 border-blue-400 rounded-2xl p-4 shadow-xs space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-2xl p-1.5 bg-blue-50 rounded-xl">{currEmotionInfo.emoji}</span>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h2 className="text-sm font-extrabold text-gray-900">{currEmotionInfo.koreanName}</h2>
                      <span className="text-[10px] text-blue-600 font-semibold bg-blue-50 px-1.5 py-0.5 rounded">
                        {currEmotionInfo.category}
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-500 font-medium">{currEmotionInfo.englishName}</p>
                  </div>
                </div>
                <button
                  onClick={() => setActiveTab('emotions')}
                  className="text-[11px] text-blue-600 hover:text-blue-800 font-bold bg-blue-50 px-2 py-1 rounded-md"
                >
                  다른 감정 선택
                </button>
              </div>
              <p className="text-xs text-gray-700 font-medium bg-slate-50 p-2.5 rounded-xl border border-gray-100 leading-relaxed">
                {currEmotionInfo.description}
              </p>
            </div>

            {/* 1. 추천 조형 요소 */}
            <div className="bg-white border rounded-2xl p-3.5 space-y-3 shadow-2xs">
              <div className="flex items-center gap-1.5 text-xs font-bold text-gray-900">
                <Lightbulb className="text-amber-500" size={16} />
                <span>1. 추천 조형 요소 (Visual Elements)</span>
              </div>
              <div className="space-y-2 text-xs">
                {/* 점 추천 */}
                <div className="p-2.5 bg-gray-50 rounded-xl border border-gray-200 flex items-center justify-between gap-2">
                  <div className="flex-1">
                    <span className="font-bold text-blue-800 text-[11px] block">• 점 (Point)</span>
                    <p className="text-[11px] text-gray-600 mt-0.5">{currEmotionInfo.guide.recommendedElements.point}</p>
                  </div>
                  <button
                    onClick={() => onAddElement('point', 'spray')}
                    className="shrink-0 text-[11px] font-bold text-white bg-blue-600 hover:bg-blue-700 px-2.5 py-1.5 rounded-lg flex items-center gap-1 transition"
                  >
                    <Plus size={12} />
                    <span>추가</span>
                  </button>
                </div>

                {/* 선 추천 */}
                <div className="p-2.5 bg-gray-50 rounded-xl border border-gray-200 flex items-center justify-between gap-2">
                  <div className="flex-1">
                    <span className="font-bold text-blue-800 text-[11px] block">─ 선 (Line)</span>
                    <p className="text-[11px] text-gray-600 mt-0.5">{currEmotionInfo.guide.recommendedElements.line}</p>
                  </div>
                  <button
                    onClick={() => onAddElement('line', 'smooth_curve')}
                    className="shrink-0 text-[11px] font-bold text-white bg-blue-600 hover:bg-blue-700 px-2.5 py-1.5 rounded-lg flex items-center gap-1 transition"
                  >
                    <Plus size={12} />
                    <span>추가</span>
                  </button>
                </div>

                {/* 면 추천 */}
                <div className="p-2.5 bg-gray-50 rounded-xl border border-gray-200 flex items-center justify-between gap-2">
                  <div className="flex-1">
                    <span className="font-bold text-blue-800 text-[11px] block">▢ 면 (Shape)</span>
                    <p className="text-[11px] text-gray-600 mt-0.5">{currEmotionInfo.guide.recommendedElements.shape}</p>
                  </div>
                  <button
                    onClick={() => onAddElement('shape', 'circle')}
                    className="shrink-0 text-[11px] font-bold text-white bg-blue-600 hover:bg-blue-700 px-2.5 py-1.5 rounded-lg flex items-center gap-1 transition"
                  >
                    <Plus size={12} />
                    <span>추가</span>
                  </button>
                </div>
              </div>
            </div>

            {/* 2. 추천 색채 & 팔레트 */}
            <div className="bg-white border rounded-2xl p-3.5 space-y-2.5 shadow-2xs">
              <div className="flex items-center gap-1.5 text-xs font-bold text-gray-900">
                <Palette className="text-purple-600" size={16} />
                <span>2. 추천 색채 & 대비 (Colors)</span>
              </div>
              <p className="text-[11px] text-gray-600 leading-relaxed">
                {currEmotionInfo.guide.recommendedColorsDesc}
              </p>
              <div className="flex items-center gap-2 pt-1">
                <span className="text-[11px] font-semibold text-gray-500">추천 팔레트:</span>
                <div className="flex gap-1.5">
                  {currEmotionInfo.colorPalette.map((c, i) => (
                    <button
                      key={i}
                      onClick={() => onColorChange(c)}
                      title={`이 색상 선택: ${c}`}
                      style={{ backgroundColor: c }}
                      className="w-6 h-6 rounded-full border border-black/15 shadow-2xs hover:scale-115 transition-transform"
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* 3. 추천 조형 원리 */}
            <div className="bg-white border rounded-2xl p-3.5 space-y-2.5 shadow-2xs">
              <div className="flex items-center gap-1.5 text-xs font-bold text-gray-900">
                <Sliders className="text-emerald-600" size={16} />
                <span>3. 추천 조형 원리 (Principles)</span>
              </div>
              <p className="text-[11px] text-gray-600 leading-relaxed bg-emerald-50/50 p-2.5 rounded-xl border border-emerald-100">
                {currEmotionInfo.guide.recommendedPrinciples.reason}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => onApplyPrinciple(currEmotionInfo.guide.recommendedPrinciples.primary)}
                  className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1 transition shadow-xs"
                >
                  <span>1순위: {PRINCIPLES.find((p) => p.key === currEmotionInfo.guide.recommendedPrinciples.primary)?.koreanName} 적용</span>
                </button>
                <button
                  onClick={() => onApplyPrinciple(currEmotionInfo.guide.recommendedPrinciples.secondary)}
                  className="flex-1 py-2 bg-gray-800 hover:bg-black text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1 transition shadow-xs"
                >
                  <span>2순위: {PRINCIPLES.find((p) => p.key === currEmotionInfo.guide.recommendedPrinciples.secondary)?.koreanName} 적용</span>
                </button>
              </div>
            </div>

            {/* 4. 미술사적 모티브 */}
            <div className="bg-slate-100/90 border border-slate-200 rounded-2xl p-3.5 space-y-1.5 text-xs">
              <div className="flex items-center gap-1.5 font-bold text-slate-800">
                <BookOpen size={15} className="text-slate-600" />
                <span>미술 교과 연계 노트</span>
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                {currEmotionInfo.guide.artConceptNote}
              </p>
            </div>
          </div>
        )}

        {/* 탭 1: 감정 선택 (16종) */}
        {activeTab === 'emotions' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-700">표현하고 싶은 감정을 선택하세요</span>
              <span className="text-[11px] text-gray-400">총 16가지 감정</span>
            </div>

            {/* 감정 칩 그리드 */}
            <div className="grid grid-cols-2 gap-2">
              {EMOTIONS.map((e) => {
                const isSelected = selectedEmotion === e.key;
                return (
                  <button
                    key={e.key}
                    onClick={() => {
                      onEmotionSelect(e.key);
                      if (mode === 'guided') {
                        setActiveTab('guidedView');
                      }
                    }}
                    className={`p-2.5 rounded-xl border text-left transition-all relative overflow-hidden ${
                      isSelected
                        ? 'border-blue-500 bg-blue-50/60 shadow-sm ring-1 ring-blue-400'
                        : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-1.5">
                        <span className="text-base">{e.emoji}</span>
                        <span className="text-xs font-bold text-gray-900">{e.koreanName}</span>
                      </div>
                      <span className="text-[10px] text-gray-400 font-medium">{e.englishName}</span>
                    </div>
                    <p className="text-[10px] text-gray-500 line-clamp-1">{e.description}</p>
                    <div className="flex gap-1 mt-1.5">
                      {e.colorPalette.slice(0, 4).map((c, i) => (
                        <span
                          key={i}
                          style={{ backgroundColor: c }}
                          className="w-2.5 h-2.5 rounded-full border border-gray-200"
                        />
                      ))}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* 탭 2: 조형 요소 (점, 선, 면) */}
        {activeTab === 'elements' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-700">추가할 조형 요소를 선택하세요</span>
              <span className="text-[11px] text-gray-400">클릭 시 캔버스에 추가</span>
            </div>

            {/* 하위 카테고리 탭: 면 / 선 / 점 */}
            <div className="flex p-1 bg-gray-100 rounded-lg gap-1">
              <button
                onClick={() => setElementCategory('shape')}
                className={`flex-1 py-1 text-xs font-bold rounded ${
                  elementCategory === 'shape' ? 'bg-white text-blue-600 shadow-2xs' : 'text-gray-500'
                }`}
              >
                면 (Shape) 9종
              </button>
              <button
                onClick={() => setElementCategory('line')}
                className={`flex-1 py-1 text-xs font-bold rounded ${
                  elementCategory === 'line' ? 'bg-white text-blue-600 shadow-2xs' : 'text-gray-500'
                }`}
              >
                선 (Line) 7종
              </button>
              <button
                onClick={() => setElementCategory('point')}
                className={`flex-1 py-1 text-xs font-bold rounded ${
                  elementCategory === 'point' ? 'bg-white text-blue-600 shadow-2xs' : 'text-gray-500'
                }`}
              >
                점 (Point) 4종
              </button>
            </div>

            {/* 면(Shape) 목록 */}
            {elementCategory === 'shape' && (
              <div className="grid grid-cols-2 gap-2">
                {SHAPE_TEMPLATES.map((item) => (
                  <button
                    key={item.subType}
                    onClick={() => onAddElement('shape', item.subType)}
                    className="p-2.5 bg-white border border-gray-200 rounded-xl hover:border-blue-400 hover:shadow-sm text-left transition group"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-lg w-6 text-center text-blue-600 font-bold group-hover:scale-110 transition-transform">
                        {item.icon}
                      </span>
                      <span className="text-xs font-bold text-gray-800">{item.name}</span>
                    </div>
                    <p className="text-[10px] text-gray-500 line-clamp-1">{item.description}</p>
                  </button>
                ))}
              </div>
            )}

            {/* 선(Line) 목록 */}
            {elementCategory === 'line' && (
              <div className="grid grid-cols-2 gap-2">
                {LINE_TEMPLATES.map((item) => (
                  <button
                    key={item.subType}
                    onClick={() => onAddElement('line', item.subType)}
                    className="p-2.5 bg-white border border-gray-200 rounded-xl hover:border-blue-400 hover:shadow-sm text-left transition group"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-lg w-6 text-center text-blue-600 font-bold group-hover:scale-110 transition-transform">
                        {item.icon}
                      </span>
                      <span className="text-xs font-bold text-gray-800">{item.name}</span>
                    </div>
                    <p className="text-[10px] text-gray-500 line-clamp-1">{item.description}</p>
                  </button>
                ))}
              </div>
            )}

            {/* 점(Point) 목록 */}
            {elementCategory === 'point' && (
              <div className="grid grid-cols-2 gap-2">
                {POINT_TEMPLATES.map((item) => (
                  <button
                    key={item.subType}
                    onClick={() => onAddElement('point', item.subType)}
                    className="p-2.5 bg-white border border-gray-200 rounded-xl hover:border-blue-400 hover:shadow-sm text-left transition group"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-lg w-6 text-center text-blue-600 font-bold group-hover:scale-110 transition-transform">
                        {item.icon}
                      </span>
                      <span className="text-xs font-bold text-gray-800">{item.name}</span>
                    </div>
                    <p className="text-[10px] text-gray-500 line-clamp-1">{item.description}</p>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 탭 3: 색채 팔레트 (요소 색상 & 캔버스 배경색) */}
        {activeTab === 'colors' && (
          <div className="space-y-3.5">
            {/* 색상 적용 대상 전환 (요소 색상 vs 캔버스 배경색) */}
            <div className="flex bg-gray-100 p-1 rounded-xl gap-1">
              <button
                onClick={() => setColorTarget('element')}
                className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                  colorTarget === 'element'
                    ? 'bg-white text-blue-600 shadow-2xs'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: currentColor }} />
                <span>요소 색상 {selectedCount > 0 ? `(${selectedCount}개 선택됨)` : ''}</span>
              </button>
              <button
                onClick={() => setColorTarget('background')}
                className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                  colorTarget === 'background'
                    ? 'bg-white text-indigo-600 shadow-2xs'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <span
                  className="w-2.5 h-2.5 rounded-full border border-gray-300"
                  style={{ backgroundColor: canvasBgColor }}
                />
                <span>캔버스 배경색</span>
              </button>
            </div>

            {/* 안내 배너 */}
            <div className={`p-2.5 rounded-xl border text-[11px] leading-relaxed ${
              colorTarget === 'element'
                ? selectedCount > 0
                  ? 'bg-blue-50/80 border-blue-200 text-blue-800 font-semibold'
                  : 'bg-gray-50 border-gray-200 text-gray-600'
                : 'bg-indigo-50/80 border-indigo-200 text-indigo-800 font-semibold'
            }`}>
              {colorTarget === 'element'
                ? selectedCount > 0
                  ? `💡 22색 팔레트를 누르면 현재 선택된 ${selectedCount}개 요소의 색상이 실시간으로 변경됩니다.`
                  : '💡 22색 팔레트를 누르면 새로 추가할 요소의 기본 색상이 설정됩니다.'
                : '💡 22색 팔레트나 추천 프리셋을 누르면 캔버스 배경색이 실시간으로 변경됩니다.'}
            </div>

            {/* 22색 표준 미술 팔레트 */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-gray-700">
                  {colorTarget === 'element' ? '미술 교육용 표준 22색 팔레트' : '22색 표준 팔레트 적용'}
                </span>
                <span className="text-[11px] text-gray-400 font-mono">
                  {colorTarget === 'element' ? currentColor : canvasBgColor}
                </span>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {ART_COLORS.map((c) => {
                  const targetHex = colorTarget === 'element' ? currentColor : canvasBgColor;
                  const isSelected = targetHex.toLowerCase() === c.hex.toLowerCase();
                  return (
                    <button
                      key={c.hex}
                      onClick={() => {
                        if (colorTarget === 'background') {
                          if (onBgColorChange) onBgColorChange(c.hex);
                        } else {
                          onColorChange(c.hex);
                          if (selectedElement) onUpdateElement({ color: c.hex });
                          if (selectedCount > 1 && onUpdateMultipleColors) onUpdateMultipleColors(c.hex);
                        }
                      }}
                      className={`p-2 rounded-xl border flex flex-col items-center gap-1.5 transition ${
                        isSelected
                          ? colorTarget === 'element'
                            ? 'border-blue-500 bg-blue-50 shadow-sm ring-2 ring-blue-400'
                            : 'border-indigo-500 bg-indigo-50 shadow-sm ring-2 ring-indigo-400'
                          : 'border-gray-200 bg-white hover:border-gray-300'
                      }`}
                    >
                      <span
                        style={{ backgroundColor: c.hex }}
                        className="w-7 h-7 rounded-full border border-black/10 shadow-inner"
                      />
                      <span className="text-[10px] font-semibold text-gray-700 text-center truncate w-full">
                        {c.name.split(' ')[0]}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 캔버스 배경색 전용 추천 프리셋 (배경색 모드일 때 추가 표시) */}
            {colorTarget === 'background' && (
              <div className="space-y-1.5 pt-1">
                <span className="text-xs font-bold text-gray-700 block">캔버스 질감 추천 배경색</span>
                <div className="grid grid-cols-4 gap-1.5">
                  {[
                    { name: '한지 미색', hex: '#FCFCFB' },
                    { name: '웜 아이보리', hex: '#FFFDF5' },
                    { name: '쿨 화이트', hex: '#F8FAFC' },
                    { name: '모던 그레이', hex: '#EDF2F7' },
                    { name: '차콜 그레이', hex: '#2D3748' },
                    { name: '미드나잇 블랙', hex: '#1A202C' },
                    { name: '딥 네이비', hex: '#1E3A8A' },
                    { name: '버건디 와인', hex: '#4C1D1D' }
                  ].map((bg) => (
                    <button
                      key={bg.hex}
                      onClick={() => onBgColorChange && onBgColorChange(bg.hex)}
                      className={`p-1.5 rounded-lg border text-center transition flex flex-col items-center gap-1 ${
                        canvasBgColor.toLowerCase() === bg.hex.toLowerCase()
                          ? 'border-indigo-500 bg-indigo-50 ring-2 ring-indigo-400'
                          : 'border-gray-200 bg-white hover:border-gray-300'
                      }`}
                    >
                      <span
                        style={{ backgroundColor: bg.hex }}
                        className="w-5 h-5 rounded-full border border-black/15 shadow-2xs"
                      />
                      <span className="text-[9px] font-semibold text-gray-700 truncate w-full">
                        {bg.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* 자유 조색 피커 */}
            <div className="bg-white border rounded-xl p-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={colorTarget === 'element' ? currentColor : canvasBgColor}
                  onChange={(e) => {
                    const hex = e.target.value;
                    if (colorTarget === 'background') {
                      if (onBgColorChange) onBgColorChange(hex);
                    } else {
                      onColorChange(hex);
                      if (selectedElement) onUpdateElement({ color: hex });
                      if (selectedCount > 1 && onUpdateMultipleColors) onUpdateMultipleColors(hex);
                    }
                  }}
                  className="w-9 h-9 rounded-lg border border-gray-300 cursor-pointer p-0"
                />
                <div>
                  <span className="text-xs font-bold text-gray-800 block">
                    {colorTarget === 'element' ? '요소 자유 조색' : '배경색 자유 조색'}
                  </span>
                  <span className="text-[11px] text-gray-500">원하는 색상을 직접 배색해보세요</span>
                </div>
              </div>
              <span className="text-xs font-mono font-bold text-gray-600 bg-gray-100 px-2 py-1 rounded">
                {colorTarget === 'element' ? currentColor : canvasBgColor}
              </span>
            </div>
          </div>
        )}

        {/* 탭 4: 조형 원리 (8대 원리 인터랙티브 변형) */}
        {activeTab === 'principles' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-700">
                조형 원리를 선택하면 캔버스가 즉시 변형됩니다
              </span>
              <span className="text-[11px] text-gray-400">8대 핵심 원리</span>
            </div>

            <div className="space-y-2">
              {PRINCIPLES.map((p) => {
                const isActive = activePrinciples.includes(p.key);
                return (
                  <button
                    key={p.key}
                    onClick={() => onApplyPrinciple(p.key)}
                    className={`w-full p-3 rounded-xl border text-left transition flex items-start gap-3 ${
                      isActive
                        ? 'border-blue-500 bg-blue-50/80 shadow-sm ring-1 ring-blue-400'
                        : 'border-gray-200 bg-white hover:border-blue-300 hover:bg-gray-50'
                    }`}
                  >
                    <span className="text-2xl p-1 bg-white rounded-lg border border-gray-100 shadow-2xs">
                      {p.icon}
                    </span>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-gray-900">{p.koreanName}</span>
                        <span className="text-[10px] text-gray-400 font-medium">{p.englishName}</span>
                      </div>
                      <p className="text-[11px] text-gray-600 mt-0.5 leading-relaxed">{p.description}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* 선택된 요소가 있을 때 (단일 또는 다중) 실시간 속성 편집기 표시 */}
        {(selectedElement || selectedCount > 1) && (
          <div className="pt-2">
            <SelectedElementEditor
              element={selectedElement}
              selectedElements={selectedElements}
              selectedCount={selectedCount}
              onUpdate={onUpdateElement}
              onUpdateMultipleProps={onUpdateMultipleProps}
              onUpdateMultipleColors={onUpdateMultipleColors}
              onDelete={onDeleteElement}
              onDeleteMultiple={onDeleteMultiple}
              onDuplicate={onDuplicateElement}
              onDuplicateMultiple={onDuplicateMultiple}
              onBringForward={onBringForward}
              onBringForwardMultiple={onBringForwardMultiple}
              onSendBackward={onSendBackward}
              onSendBackwardMultiple={onSendBackwardMultiple}
              onDeselect={onDeselect}
            />
          </div>
        )}
      </div>
    </div>
  );
};
