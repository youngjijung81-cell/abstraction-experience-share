'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { ArtElement, EmotionKey, PrincipleKey, StudioMode } from '@/lib/types';
import { LeftToolPanel } from './LeftToolPanel';
import { RightCanvasStage } from './RightCanvasStage';
import { DownloadModal } from '../modal/DownloadModal';
import { GalleryModal } from '../modal/GalleryModal';
import { ConceptGuideModal } from '../modal/ConceptGuideModal';
import { generateArtByEmotion } from '@/lib/engine/autoGenerator';
import { applyPrinciple } from '@/lib/engine/principleTransformer';
import { POINT_TEMPLATES, LINE_TEMPLATES, SHAPE_TEMPLATES } from '@/lib/constants/elements';

function uid(): string {
  return 'el_' + Math.random().toString(36).substring(2, 9);
}

export const SplitStudio: React.FC = () => {
  // 모드 및 감정 상태
  const [mode, setMode] = useState<StudioMode>('auto');
  const [selectedEmotion, setSelectedEmotion] = useState<EmotionKey>('joy');
  const [activePrinciples, setActivePrinciples] = useState<PrincipleKey[]>([]);
  const [currentColor, setCurrentColor] = useState<string>('#E53E3E');
  const [canvasBgColor, setCanvasBgColor] = useState<string>('#FCFCFB');

  // 조형 요소 및 히스토리 상태 (Undo / Redo)
  const [elements, setElements] = useState<ArtElement[]>([]);
  const [history, setHistory] = useState<ArtElement[][]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const selectedId = selectedIds.length === 1 ? selectedIds[0] : null;

  // 모달 상태
  const [isDownloadOpen, setIsDownloadOpen] = useState(false);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [isGuideOpen, setIsGuideOpen] = useState(false);

  // 히스토리에 현재 상태 푸시
  const pushHistory = useCallback((newElements: ArtElement[]) => {
    setHistory((prev) => {
      const upToCurrent = prev.slice(0, historyIndex + 1);
      return [...upToCurrent, newElements];
    });
    setHistoryIndex((prev) => prev + 1);
  }, [historyIndex]);

  // 초기 자동 모드 기쁨(Joy) 기본 생성
  useEffect(() => {
    const initial = generateArtByEmotion('joy');
    setElements(initial);
    setHistory([initial]);
    setHistoryIndex(0);
  }, []);

  // 모드 변경 처리: 자동 생성된 그림을 유지한 채 자유 창작으로 자연스럽게 이어갈 수 있도록 보존
  const handleModeChange = (newMode: StudioMode) => {
    setMode(newMode);
    if (newMode === 'auto') {
      // 자동 모드로 전환 시 화면이 비어있다면 현재 감정으로 생성
      if (elements.length === 0) {
        const generated = generateArtByEmotion(selectedEmotion);
        setElements(generated);
        pushHistory(generated);
        setSelectedIds([]);
      }
    }
    // freeform(자유 창작) 전환 시: 화면에 이미 있는 자동 생성 요소를 비우지 않고 그대로 보존하여
    // 학생이 자동 생성된 그림 위에 점·선·면을 더하거나 자유 드로잉으로 창작을 이어갈 수 있게 함!
  };

  // 감정 선택 처리
  const handleEmotionSelect = (emotion: EmotionKey) => {
    setSelectedEmotion(emotion);
    if (mode === 'auto') {
      const generated = generateArtByEmotion(emotion);
      setElements(generated);
      pushHistory(generated);
      setSelectedIds([]);
    }
  };

  // 조형 요소 수동 추가
  const handleAddElement = (type: 'point' | 'line' | 'shape', subType: string) => {
    // 자동 생성된 그림 위에 새 요소를 추가하면 자연스럽게 자유 창작으로 전환되어 이어짐
    if (mode === 'auto') {
      setMode('freeform');
    }
    // 흩뿌림(spray): 하나의 고정 뭉치가 아니라, 개별적으로 배치·크기·색상을 조절할 수 있는 8개의 독립 점 군집으로 생성
    if (type === 'point' && subType === 'spray') {
      const baseZ = elements.length > 0 ? Math.max(...elements.map((e) => e.zIndex || 0)) + 1 : 1;
      const centerOffsetX = (Math.random() - 0.5) * 16;
      const centerOffsetY = (Math.random() - 0.5) * 16;

      // 8개의 자연스러운 유기적 흩뿌림 점 오프셋 및 크기 변주
      const sprayOffsets = [
        { dx: 0, dy: 0, size: 7.5 },
        { dx: -7.5, dy: -6.5, size: 5 },
        { dx: 8.5, dy: -5, size: 6 },
        { dx: 6.5, dy: 8.5, size: 4.5 },
        { dx: -8.5, dy: 7.5, size: 5.5 },
        { dx: -13, dy: 1.5, size: 3.5 },
        { dx: 12, dy: 4, size: 4 },
        { dx: 2, dy: -12, size: 4 }
      ];

      const newSprayDots: ArtElement[] = sprayOffsets.map((dot, idx) => {
        const jitterX = (Math.random() - 0.5) * 2;
        const jitterY = (Math.random() - 0.5) * 2;
        return {
          id: uid(),
          type: 'point',
          subType: 'single',
          x: Math.max(-45, Math.min(45, centerOffsetX + dot.dx + jitterX)),
          y: Math.max(-45, Math.min(45, centerOffsetY + dot.dy + jitterY)),
          width: dot.size,
          height: dot.size,
          rotation: 0,
          color: currentColor,
          opacity: 0.85,
          fill: true,
          zIndex: baseZ + idx
        };
      });

      const nextElements = [...elements, ...newSprayDots];
      setElements(nextElements);
      pushHistory(nextElements);
      // 첫 번째 점을 기본 선택 상태로 지정하여 즉시 조작 가능하게 함
      setSelectedIds([newSprayDots[0].id]);
      return;
    }

    let defaultW = 20;
    let defaultH = 20;

    if (type === 'point') {
      const t = POINT_TEMPLATES.find((item) => item.subType === subType);
      if (t) {
        defaultW = t.defaultWidth;
        defaultH = t.defaultHeight;
      }
    } else if (type === 'line') {
      const t = LINE_TEMPLATES.find((item) => item.subType === subType);
      if (t) {
        defaultW = t.defaultWidth;
        defaultH = t.defaultHeight;
      }
    } else if (type === 'shape') {
      const t = SHAPE_TEMPLATES.find((item) => item.subType === subType);
      if (t) {
        defaultW = t.defaultWidth;
        defaultH = t.defaultHeight;
      }
    }

    const nextZ = elements.length > 0 ? Math.max(...elements.map((e) => e.zIndex || 0)) + 1 : 1;
    const randOffset = () => (Math.random() - 0.5) * 15;

    const newElement: ArtElement = {
      id: uid(),
      type,
      subType,
      x: randOffset(),
      y: randOffset(),
      width: defaultW,
      height: defaultH,
      rotation: Math.floor(Math.random() * 36) * 10,
      color: currentColor,
      opacity: 0.85,
      strokeWidth: type === 'line' ? 4 : 2,
      frequency: subType === 'dashed' ? 8 : (['smooth_curve', 'wave', 'zigzag', 'spiral', 'motion'].includes(subType) ? 4 : undefined),
      amplitude: 1,
      sides: (subType === 'polygon' || subType === 'freeshape') ? 5 : undefined,
      distortion: subType === 'freeshape' ? 0.35 : 0,
      fill: true,
      zIndex: nextZ
    };

    const nextElements = [...elements, newElement];
    setElements(nextElements);
    pushHistory(nextElements);
    setSelectedIds([newElement.id]);
  };

  // 자유 드로잉 획 추가
  const handleAddDrawnStroke = (strokeElement: ArtElement) => {
    if (mode === 'auto') {
      setMode('freeform');
    }
    const nextElements = [...elements, strokeElement];
    setElements(nextElements);
    pushHistory(nextElements);
  };

  // 조형 원리 적용
  const handleApplyPrinciple = (principle: PrincipleKey) => {
    setActivePrinciples((prev) => {
      if (prev.includes(principle)) {
        return prev.filter((p) => p !== principle);
      } else {
        return [...prev, principle];
      }
    });

    const transformed = applyPrinciple(elements, principle);
    setElements(transformed);
    pushHistory(transformed);
  };

  // 선택된 요소 속성 업데이트 (단일)
  const handleUpdateElement = (updated: Partial<ArtElement>) => {
    if (!selectedId) return;
    const nextElements = elements.map((el) => {
      if (el.id === selectedId) {
        return { ...el, ...updated };
      }
      return el;
    });
    setElements(nextElements);
    pushHistory(nextElements);
  };

  // 다중 선택 색상 일괄 변경
  const handleUpdateMultipleColors = (color: string) => {
    if (selectedIds.length === 0) return;
    const nextElements = elements.map((el) => {
      if (selectedIds.includes(el.id)) {
        return { ...el, color };
      }
      return el;
    });
    setElements(nextElements);
    pushHistory(nextElements);
  };

  // 다중 선택 요소 일괄 속성 변경 (크기, 회전, 투명도, 선굵기, 면채우기 등)
  const handleUpdateMultipleProps = (
    patch: Partial<ArtElement> | ((el: ArtElement) => Partial<ArtElement>)
  ) => {
    if (selectedIds.length === 0) return;
    const nextElements = elements.map((el) => {
      if (selectedIds.includes(el.id)) {
        const updates = typeof patch === 'function' ? patch(el) : patch;
        return { ...el, ...updates };
      }
      return el;
    });
    setElements(nextElements);
    pushHistory(nextElements);
  };

  // 캔버스 드래그 중 실시간 업데이트 (단일)
  const handleUpdateElementDirect = (id: string, updated: Partial<ArtElement>, shouldPushHistory?: boolean) => {
    const nextElements = elements.map((el) => {
      if (el.id === id) {
        return { ...el, ...updated };
      }
      return el;
    });
    setElements(nextElements);
    if (shouldPushHistory) {
      pushHistory(nextElements);
    }
  };

  // 캔버스 드래그 중 다중 요소 실시간 동시 이동
  const handleUpdateMultipleElementsDirect = (
    updates: { id: string; patch: Partial<ArtElement> }[],
    shouldPushHistory?: boolean
  ) => {
    if (updates.length === 0) {
      if (shouldPushHistory) {
        pushHistory(elements);
      }
      return;
    }
    const updateMap = new Map(updates.map((u) => [u.id, u.patch]));
    const nextElements = elements.map((el) => {
      const patch = updateMap.get(el.id);
      return patch ? { ...el, ...patch } : el;
    });
    setElements(nextElements);
    if (shouldPushHistory) {
      pushHistory(nextElements);
    }
  };

  // 선택된 요소 삭제 (단일 및 다중 지원)
  const handleDeleteElement = (id: string) => {
    const nextElements = elements.filter((el) => el.id !== id);
    setElements(nextElements);
    pushHistory(nextElements);
    setSelectedIds((prev) => prev.filter((item) => item !== id));
  };

  const handleDeleteSelected = () => {
    if (selectedIds.length === 0) return;
    const nextElements = elements.filter((el) => !selectedIds.includes(el.id));
    setElements(nextElements);
    pushHistory(nextElements);
    setSelectedIds([]);
  };

  // 요소 복제
  const handleDuplicateElement = (id: string) => {
    const target = elements.find((el) => el.id === id);
    if (!target) return;
    const nextZ = Math.max(...elements.map((e) => e.zIndex || 0)) + 1;
    const duplicated: ArtElement = {
      ...target,
      id: uid(),
      x: target.x + 5,
      y: target.y + 5,
      zIndex: nextZ
    };
    const nextElements = [...elements, duplicated];
    setElements(nextElements);
    pushHistory(nextElements);
    setSelectedIds([duplicated.id]);
  };

  // 선택된 요소(단일 또는 다중) 복제
  const handleDuplicateSelected = () => {
    if (selectedIds.length === 0) return;
    const targets = elements.filter((el) => selectedIds.includes(el.id));
    if (targets.length === 0) return;
    const baseZ = Math.max(...elements.map((e) => e.zIndex || 0)) + 1;
    const newClones: ArtElement[] = targets.map((t, idx) => ({
      ...t,
      id: uid(),
      x: Math.min(45, t.x + 4),
      y: Math.min(45, t.y + 4),
      zIndex: baseZ + idx
    }));
    const nextElements = [...elements, ...newClones];
    setElements(nextElements);
    pushHistory(nextElements);
    setSelectedIds(newClones.map((c) => c.id));
  };

  // 레이어 순서 앞/뒤
  const handleBringForward = (id: string) => {
    const nextElements = elements.map((el) => {
      if (el.id === id) {
        return { ...el, zIndex: (el.zIndex || 0) + 1 };
      }
      return el;
    });
    setElements(nextElements);
    pushHistory(nextElements);
  };

  const handleSendBackward = (id: string) => {
    const nextElements = elements.map((el) => {
      if (el.id === id) {
        return { ...el, zIndex: Math.max(0, (el.zIndex || 0) - 1) };
      }
      return el;
    });
    setElements(nextElements);
    pushHistory(nextElements);
  };

  // 다중 선택 요소 일괄 레이어 앞으로/뒤로
  const handleBringForwardMultiple = () => {
    if (selectedIds.length === 0) return;
    const nextElements = elements.map((el) => {
      if (selectedIds.includes(el.id)) {
        return { ...el, zIndex: (el.zIndex || 0) + 1 };
      }
      return el;
    });
    setElements(nextElements);
    pushHistory(nextElements);
  };

  const handleSendBackwardMultiple = () => {
    if (selectedIds.length === 0) return;
    const nextElements = elements.map((el) => {
      if (selectedIds.includes(el.id)) {
        return { ...el, zIndex: Math.max(0, (el.zIndex || 0) - 1) };
      }
      return el;
    });
    setElements(nextElements);
    pushHistory(nextElements);
  };

  // 전체 초기화
  const handleClearAll = () => {
    if (window.confirm('캔버스를 모두 비우시겠습니까?')) {
      const empty: ArtElement[] = [];
      setElements(empty);
      pushHistory(empty);
      setSelectedIds([]);
      setActivePrinciples([]);
    }
  };

  // Undo / Redo
  const handleUndo = () => {
    if (historyIndex > 0) {
      const nextIndex = historyIndex - 1;
      setHistoryIndex(nextIndex);
      setElements(history[nextIndex]);
      setSelectedIds([]);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const nextIndex = historyIndex + 1;
      setHistoryIndex(nextIndex);
      setElements(history[nextIndex]);
      setSelectedIds([]);
    }
  };

  const selectedElement = elements.find((el) => el.id === selectedId) || null;
  const selectedElements = elements.filter((el) => selectedIds.includes(el.id));

  return (
    <div className="w-screen h-screen supports-[height:100dvh]:h-dvh flex flex-col md:flex-row overflow-hidden bg-white">
      {/* 1. 좌측 도구 패널 (50% 분할) */}
      <div className="w-full md:w-1/2 h-1/2 md:h-full">
        <LeftToolPanel
          mode={mode}
          onModeChange={handleModeChange}
          selectedEmotion={selectedEmotion}
          onEmotionSelect={handleEmotionSelect}
          onAddElement={handleAddElement}
          onApplyPrinciple={handleApplyPrinciple}
          activePrinciples={activePrinciples}
          currentColor={currentColor}
          onColorChange={setCurrentColor}
          canvasBgColor={canvasBgColor}
          onBgColorChange={setCanvasBgColor}
          selectedElement={selectedElement}
          selectedElements={selectedElements}
          selectedCount={selectedIds.length}
          onUpdateElement={handleUpdateElement}
          onUpdateMultipleProps={handleUpdateMultipleProps}
          onUpdateMultipleColors={handleUpdateMultipleColors}
          onDeleteElement={handleDeleteElement}
          onDeleteMultiple={handleDeleteSelected}
          onDuplicateElement={handleDuplicateElement}
          onDuplicateMultiple={handleDuplicateSelected}
          onBringForward={handleBringForward}
          onBringForwardMultiple={handleBringForwardMultiple}
          onSendBackward={handleSendBackward}
          onSendBackwardMultiple={handleSendBackwardMultiple}
          onDeselect={() => setSelectedIds([])}
          onOpenGuide={() => setIsGuideOpen(true)}
        />
      </div>

      {/* 2. 우측 캔버스 무대 (50% 분할) */}
      <div className="w-full md:w-1/2 h-1/2 md:h-full">
        <RightCanvasStage
          elements={elements}
          selectedId={selectedId}
          selectedIds={selectedIds}
          canvasBgColor={canvasBgColor}
          onSelectElement={(id) => setSelectedIds(id ? [id] : [])}
          onSelectElements={(ids) => setSelectedIds(ids)}
          onUpdateElementDirect={handleUpdateElementDirect}
          onUpdateMultipleElementsDirect={handleUpdateMultipleElementsDirect}
          onAddDrawnStroke={handleAddDrawnStroke}
          onDeleteSelected={handleDeleteSelected}
          onDuplicateSelected={handleDuplicateSelected}
          onClearAll={handleClearAll}
          onUndo={handleUndo}
          onRedo={handleRedo}
          canUndo={historyIndex > 0}
          canRedo={historyIndex < history.length - 1}
          selectedEmotion={selectedEmotion}
          activePrinciples={activePrinciples}
          mode={mode}
          currentColor={currentColor}
          onOpenDownload={() => setIsDownloadOpen(true)}
          onOpenGallery={() => setIsGalleryOpen(true)}
        />
      </div>

      {/* 다운로드 모달 */}
      <DownloadModal
        isOpen={isDownloadOpen}
        onClose={() => setIsDownloadOpen(false)}
        elements={elements}
        selectedEmotion={selectedEmotion}
        activePrinciples={activePrinciples}
        mode={mode}
        canvasBgColor={canvasBgColor}
      />

      {/* 갤러리 공유 모달 */}
      <GalleryModal
        isOpen={isGalleryOpen}
        onClose={() => setIsGalleryOpen(false)}
        elements={elements}
        selectedEmotion={selectedEmotion}
        activePrinciples={activePrinciples}
        mode={mode}
        canvasBgColor={canvasBgColor}
      />

      {/* 조형 학습 가이드 모달 */}
      <ConceptGuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
      />
    </div>
  );
};
