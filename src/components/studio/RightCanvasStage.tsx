'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { ArtElement, EmotionKey, PrincipleKey, StudioMode, BrushStyle } from '@/lib/types';
import { EMOTIONS } from '@/lib/constants/emotions';
import {
  drawBackground,
  drawElement,
  drawSelectionBox,
  drawMarqueeBox,
  drawMultiSelectionOverlay,
  getMultiSelectionBounds,
  MultiBounds
} from '@/lib/engine/canvasRenderer';
import { findTopHitElement, findElementsByBox, hitTestMultiSelectionBounds, HandleType } from '@/lib/engine/hitTest';
import {
  Download,
  Share2,
  Undo2,
  Redo2,
  Trash2,
  Eraser,
  Eye,
  MousePointer,
  PenTool,
  Sparkles,
  Layers,
  Copy,
  BoxSelect,
  CheckSquare,
  X
} from 'lucide-react';
import Link from 'next/link';

function uid(): string {
  return 'el_' + Math.random().toString(36).substring(2, 9);
}

interface MultiElementInitialState {
  id: string;
  initialX: number;
  initialY: number;
  initialWidth: number;
  initialHeight: number;
  initialRotation: number;
}

interface DragState {
  isDragging: boolean;
  elementId?: string;
  handle: HandleType;
  startX: number;
  startY: number;
  initialX: number;
  initialY: number;
  initialWidth: number;
  initialHeight: number;
  initialRotation: number;
  multiElements?: MultiElementInitialState[];
  groupCenterPct?: { x: number; y: number };
  groupBounds?: MultiBounds;
  isClickOnly?: boolean;
  clickedElementId?: string;
}

interface Props {
  elements: ArtElement[];
  selectedId: string | null;
  selectedIds?: string[];
  canvasBgColor?: string;
  onSelectElement: (id: string | null) => void;
  onSelectElements?: (ids: string[]) => void;
  onUpdateElementDirect: (id: string, updated: Partial<ArtElement>, pushHistory?: boolean) => void;
  onUpdateMultipleElementsDirect?: (
    updates: { id: string; patch: Partial<ArtElement> }[],
    pushHistory?: boolean
  ) => void;
  onAddDrawnStroke: (element: ArtElement) => void;
  onDeleteSelected: () => void;
  onDuplicateSelected?: () => void;
  onClearAll: () => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  selectedEmotion: EmotionKey;
  activePrinciples: PrincipleKey[];
  mode: StudioMode;
  currentColor: string;
  onOpenDownload: () => void;
  onOpenGallery: () => void;
}

export const RightCanvasStage: React.FC<Props> = ({
  elements,
  selectedId,
  selectedIds = [],
  canvasBgColor = '#FCFCFB',
  onSelectElement,
  onSelectElements,
  onUpdateElementDirect,
  onUpdateMultipleElementsDirect,
  onAddDrawnStroke,
  onDeleteSelected,
  onDuplicateSelected,
  onClearAll,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  selectedEmotion,
  activePrinciples,
  currentColor,
  onOpenDownload,
  onOpenGallery,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // 현재 유효한 선택 ID 목록
  const currentSelectedIds = selectedIds.length > 0 ? selectedIds : (selectedId ? [selectedId] : []);

  // 캔버스 도구 모드: 'select' (선택/자유변형) vs 'multi' (영역/탭 다중 선택 도구) vs 'draw' (자유 드로잉 펜)
  const [activeTool, setActiveTool] = useState<'select' | 'multi' | 'draw'>('select');
  const [brushStyle, setBrushStyle] = useState<BrushStyle>('pen');
  const [brushWidth, setBrushWidth] = useState<number>(5);

  // 자유 드로잉 실시간 좌표 배열
  const [activeStroke, setActiveStroke] = useState<{ x: number; y: number }[] | null>(null);

  // 마키 영역 선택(Box Selection) 상태
  const [marqueeState, setMarqueeState] = useState<{
    isSelecting: boolean;
    startX: number;
    startY: number;
    currX: number;
    currY: number;
  } | null>(null);

  // Drag & Transform State (꼭짓점 자유 변형 및 다중 이동/스케일/회전)
  const [dragState, setDragState] = useState<DragState | null>(null);

  const currEmotion = EMOTIONS.find((e) => e.key === selectedEmotion);

  // 캔버스 실시간 렌더링
  const renderCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 화면 배율(dpr)은 여기서 한 번만 적용하고, 그리기는 CSS 픽셀(논리 크기) 기준으로 한다
    const dpr = window.devicePixelRatio || 1;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const width = canvas.width / dpr;
    const height = canvas.height / dpr;

    // 1. 캔버스 배경 (고급 종이 질감 및 사용자 선택 배경색)
    drawBackground(ctx, width, height, canvasBgColor || '#FCFCFB');

    // 2. 조형 요소 정렬 렌더링 (zIndex 기준)
    const sorted = [...elements].sort((a, b) => (a.zIndex || 0) - (b.zIndex || 0));
    for (const el of sorted) {
      drawElement(ctx, el, width, height);
    }

    // 3. 현재 실시간 드로잉 중인 획 표시
    if (activeStroke && activeStroke.length > 0) {
      ctx.save();
      ctx.strokeStyle = currentColor;
      ctx.fillStyle = currentColor;
      ctx.lineWidth = brushWidth;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      if (brushStyle === 'glow') {
        ctx.shadowColor = currentColor;
        ctx.shadowBlur = 12;
      } else if (brushStyle === 'marker') {
        ctx.globalAlpha = 0.55;
        ctx.lineWidth = brushWidth * 1.6;
        ctx.lineCap = 'square';
      }

      const toPx = (pt: { x: number; y: number }) => ({
        x: width / 2 + (pt.x / 100) * width,
        y: height / 2 + (pt.y / 100) * height
      });

      if (activeStroke.length === 1) {
        const p = toPx(activeStroke[0]);
        ctx.beginPath();
        ctx.arc(p.x, p.y, brushWidth / 2, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.beginPath();
        const start = toPx(activeStroke[0]);
        ctx.moveTo(start.x, start.y);
        for (let i = 1; i < activeStroke.length; i++) {
          const p = toPx(activeStroke[i]);
          ctx.lineTo(p.x, p.y);
        }
        ctx.stroke();
      }
      ctx.restore();
    }

    // 4. 다중 선택 및 단일 선택 바운딩 박스 & 변형 핸들 오버레이
    if (activeTool === 'select' || activeTool === 'multi') {
      if (currentSelectedIds.length > 1) {
        // 다중 선택 하이라이트
        drawMultiSelectionOverlay(ctx, elements, currentSelectedIds, width, height);
      } else if (currentSelectedIds.length === 1) {
        // 단일 선택: 꼭짓점 변형 핸들이 달린 바운딩 박스
        const target = elements.find((el) => el.id === currentSelectedIds[0]);
        if (target) {
          drawSelectionBox(ctx, target, width, height);
        }
      }
    }

    // 5. 마키 영역 드래그 선택 박스 렌더링
    if (marqueeState && marqueeState.isSelecting) {
      drawMarqueeBox(
        ctx,
        marqueeState.startX,
        marqueeState.startY,
        marqueeState.currX,
        marqueeState.currY
      );
    }
  }, [
    elements,
    currentSelectedIds,
    activeTool,
    activeStroke,
    currentColor,
    brushWidth,
    brushStyle,
    marqueeState,
    canvasBgColor
  ]);

  // 반응형 캔버스 크기 리사이즈 핸들러
  useEffect(() => {
    const updateSize = () => {
      const container = containerRef.current;
      const canvas = canvasRef.current;
      if (!container || !canvas) return;

      const containerW = container.clientWidth - 32;
      const containerH = container.clientHeight - 32;
      const size = Math.max(0, Math.floor(Math.min(containerW, containerH, 800)));

      const dpr = window.devicePixelRatio || 1;
      canvas.width = size * dpr;
      canvas.height = size * dpr;
      canvas.style.width = `${size}px`;
      canvas.style.height = `${size}px`;

      renderCanvas();
    };

    updateSize();
    // 창 크기뿐 아니라 툴바 줄바꿈 등으로 무대 영역 크기가 바뀔 때도 다시 맞춘다
    const observer = new ResizeObserver(updateSize);
    if (containerRef.current) observer.observe(containerRef.current);
    window.addEventListener('resize', updateSize);
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', updateSize);
    };
  }, [renderCanvas]);

  useEffect(() => {
    renderCanvas();
  }, [renderCanvas]);

  // 단일 및 다중 선택 일원화 함수 (onSelectElements 호출 시 onSelectElement 중복 호출에 의한 단일 덮어쓰기 방지)
  const updateSelection = (ids: string[]) => {
    if (onSelectElements) {
      onSelectElements(ids);
    } else {
      onSelectElement(ids.length > 0 ? ids[0] : null);
    }
  };

  // 모든 요소 전체 선택
  const handleSelectAll = () => {
    const allIds = elements.map((e) => e.id);
    updateSelection(allIds);
  };

  // 선택 해제
  const handleClearSelection = () => {
    updateSelection([]);
  };

  // 마우스/터치 다운
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    const dpr = window.devicePixelRatio || 1;
    const currentLogicalW = canvas.width / dpr;
    const currentLogicalH = canvas.height / dpr;

    // 1. 자유 드로잉 모드
    if (activeTool === 'draw') {
      const pctX = ((clickX - currentLogicalW / 2) / currentLogicalW) * 100;
      const pctY = ((clickY - currentLogicalH / 2) / currentLogicalH) * 100;
      setActiveStroke([{ x: pctX, y: pctY }]);
      return;
    }

    // 2. 다중 선택 상태일 때: 모서리 조절 핸들(nw, ne, se, sw) 및 회전 핸들(rotate) 최우선 히트 테스트
    if (currentSelectedIds.length > 1) {
      const bounds = getMultiSelectionBounds(
        elements,
        currentSelectedIds,
        currentLogicalW,
        currentLogicalH
      );
      if (bounds) {
        const groupHit = hitTestMultiSelectionBounds(clickX, clickY, bounds);
        if (groupHit.hit && groupHit.handle && groupHit.handle !== 'move') {
          const multiElements = currentSelectedIds
            .map((id) => {
              const el = elements.find((e) => e.id === id);
              return el
                ? {
                    id: el.id,
                    initialX: el.x,
                    initialY: el.y,
                    initialWidth: el.width,
                    initialHeight: el.height,
                    initialRotation: el.rotation
                  }
                : null;
            })
            .filter(Boolean) as MultiElementInitialState[];

          const groupCenterPct = {
            x: ((bounds.cx - currentLogicalW / 2) / currentLogicalW) * 100,
            y: ((bounds.cy - currentLogicalH / 2) / currentLogicalH) * 100
          };

          setDragState({
            isDragging: true,
            handle: groupHit.handle,
            startX: clickX,
            startY: clickY,
            initialX: bounds.cx,
            initialY: bounds.cy,
            initialWidth: bounds.w,
            initialHeight: bounds.h,
            initialRotation: 0,
            multiElements,
            groupCenterPct,
            groupBounds: bounds,
            isClickOnly: false
          });
          return;
        }
      }
    }

    // 3. 다중 선택 도구 ('multi') 모드
    if (activeTool === 'multi') {
      const hit = findTopHitElement(
        clickX,
        clickY,
        elements,
        null,
        currentLogicalW,
        currentLogicalH
      );

      if (hit.elementId) {
        const targetId = hit.elementId;
        const isAlreadySelected = currentSelectedIds.includes(targetId);

        if (isAlreadySelected) {
          // 이미 선택된 요소 클릭: 드래그 시 그룹 전체 이동, 단순 탭 시 선택 해제 토글 준비
          const multiElements = currentSelectedIds
            .map((id) => {
              const el = elements.find((e) => e.id === id);
              return el
                ? {
                    id: el.id,
                    initialX: el.x,
                    initialY: el.y,
                    initialWidth: el.width,
                    initialHeight: el.height,
                    initialRotation: el.rotation
                  }
                : null;
            })
            .filter(Boolean) as MultiElementInitialState[];

          setDragState({
            isDragging: true,
            handle: 'move',
            startX: clickX,
            startY: clickY,
            initialX: clickX,
            initialY: clickY,
            initialWidth: 0,
            initialHeight: 0,
            initialRotation: 0,
            multiElements,
            clickedElementId: targetId,
            isClickOnly: true
          });
          return;
        } else {
          // 미선택 요소 클릭: 즉시 다중 선택 목록에 추가! ("다중선택도구를 클릭한 후 요소요소를 누르면 선택되게")
          const nextIds = [...currentSelectedIds, targetId];
          updateSelection(nextIds);

          const multiElements = nextIds
            .map((id) => {
              const el = elements.find((e) => e.id === id);
              return el
                ? {
                    id: el.id,
                    initialX: el.x,
                    initialY: el.y,
                    initialWidth: el.width,
                    initialHeight: el.height,
                    initialRotation: el.rotation
                  }
                : null;
            })
            .filter(Boolean) as MultiElementInitialState[];

          setDragState({
            isDragging: true,
            handle: 'move',
            startX: clickX,
            startY: clickY,
            initialX: clickX,
            initialY: clickY,
            initialWidth: 0,
            initialHeight: 0,
            initialRotation: 0,
            multiElements,
            isClickOnly: false
          });
          return;
        }
      } else {
        // 빈 공간 클릭: 마키 영역(Box Selection) 드래그 시작
        setMarqueeState({
          isSelecting: true,
          startX: clickX,
          startY: clickY,
          currX: clickX,
          currY: clickY
        });
        return;
      }
    }

    // 4. 일반 선택 모드 ('select')
    const activeSingleId = currentSelectedIds.length === 1 ? currentSelectedIds[0] : null;
    const hit = findTopHitElement(
      clickX,
      clickY,
      elements,
      activeSingleId,
      currentLogicalW,
      currentLogicalH
    );

    if (hit.elementId) {
      const target = elements.find((el) => el.id === hit.elementId);
      if (!target) return;

      // Shift 키 누른 상태로 클릭 -> 다중 선택 토글
      if (e.shiftKey) {
        const nextIds = currentSelectedIds.includes(hit.elementId)
          ? currentSelectedIds.filter((id) => id !== hit.elementId)
          : [...currentSelectedIds, hit.elementId];
        updateSelection(nextIds);
        return;
      }

      // 이미 다중 선택된 그룹 중 하나를 클릭하여 이동하려는 경우
      if (currentSelectedIds.includes(hit.elementId) && currentSelectedIds.length > 1) {
        const multiElements = currentSelectedIds
          .map((id) => {
            const el = elements.find((e) => e.id === id);
            return el
              ? {
                  id: el.id,
                  initialX: el.x,
                  initialY: el.y,
                  initialWidth: el.width,
                  initialHeight: el.height,
                  initialRotation: el.rotation
                }
              : null;
          })
          .filter(Boolean) as MultiElementInitialState[];

        setDragState({
          isDragging: true,
          elementId: target.id,
          handle: 'move',
          startX: clickX,
          startY: clickY,
          initialX: target.x,
          initialY: target.y,
          initialWidth: target.width,
          initialHeight: target.height,
          initialRotation: target.rotation,
          multiElements,
          isClickOnly: false
        });
        return;
      }

      // 단일 선택으로 전환 및 변형 준비
      updateSelection([hit.elementId]);

      setDragState({
        isDragging: true,
        elementId: target.id,
        handle: hit.handle,
        startX: clickX,
        startY: clickY,
        initialX: target.x,
        initialY: target.y,
        initialWidth: target.width,
        initialHeight: target.height,
        initialRotation: target.rotation,
        isClickOnly: false
      });
    } else {
      // 빈 공간 클릭: 선택 해제 및 마키 영역 선택 시작
      updateSelection([]);
      setMarqueeState({
        isSelecting: true,
        startX: clickX,
        startY: clickY,
        currX: clickX,
        currY: clickY
      });
    }
  };

  // 마우스/터치 이동
  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const currX = e.clientX - rect.left;
    const currY = e.clientY - rect.top;

    const dpr = window.devicePixelRatio || 1;
    const w = canvas.width / dpr;
    const h = canvas.height / dpr;

    // 1) 자유 드로잉 중
    if (activeTool === 'draw' && activeStroke) {
      const pctX = ((currX - w / 2) / w) * 100;
      const pctY = ((currY - h / 2) / h) * 100;
      setActiveStroke((prev) => (prev ? [...prev, { x: pctX, y: pctY }] : [{ x: pctX, y: pctY }]));
      return;
    }

    // 2) 마키 영역 드래그 선택 중
    if (marqueeState && marqueeState.isSelecting) {
      setMarqueeState((prev) => (prev ? { ...prev, currX, currY } : null));
      return;
    }

    // 3) 요소 이동 및 꼭짓점 자유 변형 중
    if (!dragState || !dragState.isDragging) return;

    if (Math.hypot(currX - dragState.startX, currY - dragState.startY) > 3) {
      dragState.isClickOnly = false;
    }

    const deltaX = currX - dragState.startX;
    const deltaY = currY - dragState.startY;

    if (dragState.handle === 'move') {
      if (dragState.multiElements && dragState.multiElements.length > 0) {
        // 다중 요소 함께 이동
        const deltaPctX = (deltaX / w) * 100;
        const deltaPctY = (deltaY / h) * 100;

        if (onUpdateMultipleElementsDirect) {
          const updates = dragState.multiElements.map((pos) => ({
            id: pos.id,
            patch: { x: pos.initialX + deltaPctX, y: pos.initialY + deltaPctY }
          }));
          onUpdateMultipleElementsDirect(updates, false);
        } else {
          dragState.multiElements.forEach((pos) => {
            onUpdateElementDirect(
              pos.id,
              { x: pos.initialX + deltaPctX, y: pos.initialY + deltaPctY },
              false
            );
          });
        }
      } else if (dragState.elementId) {
        // 단일 요소 이동
        const newX = dragState.initialX + (deltaX / w) * 100;
        const newY = dragState.initialY + (deltaY / h) * 100;
        onUpdateElementDirect(dragState.elementId, { x: newX, y: newY }, false);
      }
    } else if (dragState.handle === 'rotate') {
      if (
        dragState.multiElements &&
        dragState.multiElements.length > 1 &&
        dragState.groupBounds &&
        dragState.groupCenterPct
      ) {
        // 다중 요소 그룹 회전
        const cx = dragState.groupBounds.cx;
        const cy = dragState.groupBounds.cy;
        const initRad = Math.atan2(dragState.startY - cy, dragState.startX - cx);
        const currRad = Math.atan2(currY - cy, currX - cx);
        const deltaRad = currRad - initRad;
        const deltaDeg = (deltaRad * 180) / Math.PI;

        const gCx = dragState.groupCenterPct.x;
        const gCy = dragState.groupCenterPct.y;

        const updates = dragState.multiElements.map((el) => {
          const relX = el.initialX - gCx;
          const relY = el.initialY - gCy;
          const newRelX = relX * Math.cos(deltaRad) - relY * Math.sin(deltaRad);
          const newRelY = relX * Math.sin(deltaRad) + relY * Math.cos(deltaRad);
          return {
            id: el.id,
            patch: {
              x: gCx + newRelX,
              y: gCy + newRelY,
              rotation: (el.initialRotation + deltaDeg + 360) % 360
            }
          };
        });

        if (onUpdateMultipleElementsDirect) {
          onUpdateMultipleElementsDirect(updates, false);
        }
      } else if (dragState.elementId) {
        // 단일 요소 회전
        const target = elements.find((el) => el.id === dragState.elementId);
        if (!target) return;
        const cx = w / 2 + (target.x / 100) * w;
        const cy = h / 2 + (target.y / 100) * h;
        const angleRad = Math.atan2(currY - cy, currX - cx);
        const angleDeg = (angleRad * 180) / Math.PI + 90;
        onUpdateElementDirect(dragState.elementId, { rotation: (angleDeg + 360) % 360 }, false);
      }
    } else if (dragState.handle && ['nw', 'ne', 'se', 'sw'].includes(dragState.handle)) {
      if (
        dragState.multiElements &&
        dragState.multiElements.length > 1 &&
        dragState.groupBounds &&
        dragState.groupCenterPct
      ) {
        // 다중 요소 그룹 크기 변형 (비례/독립 스케일)
        const gb = dragState.groupBounds;
        let scaleX = 1;
        let scaleY = 1;

        if (dragState.handle === 'se') {
          scaleX = Math.max(0.1, (gb.w + deltaX) / gb.w);
          scaleY = Math.max(0.1, (gb.h + deltaY) / gb.h);
        } else if (dragState.handle === 'sw') {
          scaleX = Math.max(0.1, (gb.w - deltaX) / gb.w);
          scaleY = Math.max(0.1, (gb.h + deltaY) / gb.h);
        } else if (dragState.handle === 'ne') {
          scaleX = Math.max(0.1, (gb.w + deltaX) / gb.w);
          scaleY = Math.max(0.1, (gb.h - deltaY) / gb.h);
        } else if (dragState.handle === 'nw') {
          scaleX = Math.max(0.1, (gb.w - deltaX) / gb.w);
          scaleY = Math.max(0.1, (gb.h - deltaY) / gb.h);
        }

        const gCx = dragState.groupCenterPct.x;
        const gCy = dragState.groupCenterPct.y;

        const updates = dragState.multiElements.map((el) => ({
          id: el.id,
          patch: {
            x: gCx + (el.initialX - gCx) * scaleX,
            y: gCy + (el.initialY - gCy) * scaleY,
            width: Math.max(2, el.initialWidth * scaleX),
            height: Math.max(2, el.initialHeight * scaleY)
          }
        }));

        if (onUpdateMultipleElementsDirect) {
          onUpdateMultipleElementsDirect(updates, false);
        }
      } else if (dragState.elementId) {
        // 단일 요소 꼭짓점 자유 변형 (가로·세로 독립 신축 왜곡)
        const rad = (dragState.initialRotation * Math.PI) / 180;
        const cos = Math.cos(rad);
        const sin = Math.sin(rad);

        const pctDx = (deltaX / w) * 100;
        const pctDy = (deltaY / h) * 100;
        const localDx = pctDx * cos + pctDy * sin;
        const localDy = -pctDx * sin + pctDy * cos;

        let newWidth = dragState.initialWidth;
        let newHeight = dragState.initialHeight;

        switch (dragState.handle) {
          case 'se': // 우하단
            newWidth = Math.max(2, dragState.initialWidth + localDx);
            newHeight = Math.max(2, dragState.initialHeight + localDy);
            break;
          case 'ne': // 우상단
            newWidth = Math.max(2, dragState.initialWidth + localDx);
            newHeight = Math.max(2, dragState.initialHeight - localDy);
            break;
          case 'sw': // 좌하단
            newWidth = Math.max(2, dragState.initialWidth - localDx);
            newHeight = Math.max(2, dragState.initialHeight + localDy);
            break;
          case 'nw': // 좌상단
            newWidth = Math.max(2, dragState.initialWidth - localDx);
            newHeight = Math.max(2, dragState.initialHeight - localDy);
            break;
        }

        onUpdateElementDirect(dragState.elementId, { width: newWidth, height: newHeight }, false);
      }
    }
  };

  // 마우스/터치 업
  const handlePointerUp = () => {
    // 1) 자유 드로잉 완료
    if (activeTool === 'draw' && activeStroke && activeStroke.length > 0) {
      const nextZ = elements.length > 0 ? Math.max(...elements.map((e) => e.zIndex || 0)) + 1 : 1;
      const newStrokeElement: ArtElement = {
        id: uid(),
        type: 'line',
        subType: 'freehand',
        x: 0,
        y: 0,
        width: 100,
        height: 100,
        rotation: 0,
        color: currentColor,
        opacity: 0.9,
        strokeWidth: brushWidth,
        brushStyle,
        zIndex: nextZ,
        points: activeStroke
      };
      onAddDrawnStroke(newStrokeElement);
      setActiveStroke(null);
      return;
    }

    // 2) 마키 영역 드래그 선택 완료
    if (marqueeState && marqueeState.isSelecting) {
      const canvas = canvasRef.current;
      if (canvas) {
        const dpr = window.devicePixelRatio || 1;
        const w = canvas.width / dpr;
        const h = canvas.height / dpr;

        const dragDist = Math.hypot(
          marqueeState.currX - marqueeState.startX,
          marqueeState.currY - marqueeState.startY
        );

        if (dragDist > 6) {
          // 사각형 영역에 걸치거나 포함된 모든 요소 검색
          const matchedIds = findElementsByBox(
            marqueeState.startX,
            marqueeState.startY,
            marqueeState.currX,
            marqueeState.currY,
            elements,
            w,
            h
          );

          if (matchedIds.length > 0) {
            updateSelection(matchedIds);
          } else {
            updateSelection([]);
          }
        } else {
          // 빈 영역 단순 클릭 시 선택 해제
          updateSelection([]);
        }
      }
      setMarqueeState(null);
      return;
    }

    // 3) 드래그 및 변형 완료 -> 히스토리에 최종 상태 기록
    if (dragState && dragState.isDragging) {
      // 다중 선택 도구 상태에서 이미 선택된 요소를 단순 탭(드래그 없이)한 경우 -> 토글 선택 해제
      if (dragState.isClickOnly && dragState.clickedElementId && activeTool === 'multi') {
        const nextIds = currentSelectedIds.filter((id) => id !== dragState.clickedElementId);
        updateSelection(nextIds);
        setDragState(null);
        return;
      }

      if (dragState.multiElements && dragState.multiElements.length > 0) {
        // 다중 요소 이동 또는 변형 종료 히스토리 기록
        if (onUpdateMultipleElementsDirect) {
          onUpdateMultipleElementsDirect([], true);
        }
      } else if (dragState.elementId) {
        const target = elements.find((el) => el.id === dragState.elementId);
        if (target) {
          onUpdateElementDirect(
            dragState.elementId,
            {
              x: target.x,
              y: target.y,
              width: target.width,
              height: target.height,
              rotation: target.rotation
            },
            true
          );
        }
      }
      setDragState(null);
    }
  };

  return (
    <div className="w-full h-full flex flex-col bg-slate-100 select-none">
      {/* 1. 상단 툴바: 선택 모드 / 자유 드로잉 모드 토글 및 실행 취소/다시실행 */}
      <div className="bg-white border-b border-gray-200 px-3.5 py-2 flex flex-wrap items-center justify-between gap-2 shadow-2xs [&_button]:whitespace-nowrap [&_span]:whitespace-nowrap">
        <div className="flex flex-wrap items-center gap-1.5">
          {/* 모드 전환 토글: 단일 선택 vs 다중 선택 도구 vs 자유 드로잉 */}
          <div className="flex bg-gray-100 p-0.5 rounded-lg border border-gray-200">
            <button
              onClick={() => setActiveTool('select')}
              title="단일 요소 선택 및 8방향 꼭짓점 자유 변형 핸들"
              className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold transition ${
                activeTool === 'select'
                  ? 'bg-white text-blue-600 shadow-2xs'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <MousePointer size={14} />
              <span>선택 & 변형</span>
            </button>
            <button
              onClick={() => setActiveTool('multi')}
              title="영역 드래그 또는 탭으로 여러 요소를 동시에 다중 선택하는 도구"
              className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold transition ${
                activeTool === 'multi'
                  ? 'bg-indigo-600 text-white shadow-2xs'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <BoxSelect size={14} />
              <span>다중 선택 도구</span>
            </button>
            <button
              onClick={() => setActiveTool('draw')}
              title="감정의 흐름을 표현하는 자유 브러시 펜"
              className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold transition ${
                activeTool === 'draw'
                  ? 'bg-blue-600 text-white shadow-2xs'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <PenTool size={14} />
              <span>자유 드로잉</span>
            </button>
          </div>

          {/* 전체 선택 도구 */}
          {elements.length > 0 && (
            <button
              onClick={handleSelectAll}
              title="캔버스의 모든 요소 전체 선택"
              className="flex items-center gap-1 px-2 py-1 rounded-md border border-gray-200 hover:bg-gray-100 text-xs font-semibold text-gray-700 transition"
            >
              <CheckSquare size={13} className="text-indigo-600" />
              <span>전체 선택</span>
            </button>
          )}

          {/* 선택 해제 버튼 */}
          {currentSelectedIds.length > 0 && (
            <button
              onClick={handleClearSelection}
              title="선택 해제"
              className="flex items-center gap-1 px-2 py-1 rounded-md border border-gray-200 hover:bg-gray-100 text-xs font-medium text-gray-500 transition"
            >
              <X size={12} />
              <span>해제</span>
            </button>
          )}

          {/* 브러시 세부 설정 (자유 드로잉 활성화 시) */}
          {activeTool === 'draw' && (
            <div className="flex items-center gap-1.5 ml-1 bg-blue-50/80 px-2 py-1 rounded-lg border border-blue-200 text-xs">
              <span className="font-bold text-blue-900 text-[11px]">브러시:</span>
              <select
                value={brushStyle}
                onChange={(e) => setBrushStyle(e.target.value as BrushStyle)}
                className="bg-white border border-blue-200 rounded px-1.5 py-0.5 text-xs text-blue-950 font-medium"
              >
                <option value="pen">펜 (기본)</option>
                <option value="brush">붓 (유화감)</option>
                <option value="marker">마커 (반투명)</option>
                <option value="glow">네온 (발광)</option>
              </select>

              <span className="font-bold text-blue-900 text-[11px] ml-1">굵기:</span>
              <input
                type="range"
                min="2"
                max="25"
                value={brushWidth}
                onChange={(e) => setBrushWidth(Number(e.target.value))}
                className="w-16 h-1 bg-blue-200 rounded appearance-none cursor-pointer accent-blue-600"
              />
              <span className="font-mono text-[11px] text-blue-800 font-bold">{brushWidth}px</span>
            </div>
          )}

          <div className="h-4 w-px bg-gray-200 mx-1 hidden sm:block" />

          {/* 실행 취소 / 다시 실행 */}
          <button
            onClick={onUndo}
            disabled={!canUndo}
            title="실행 취소 (Undo)"
            className="p-1 rounded-md border border-gray-200 hover:bg-gray-100 disabled:opacity-40 text-gray-700 transition"
          >
            <Undo2 size={15} />
          </button>
          <button
            onClick={onRedo}
            disabled={!canRedo}
            title="다시 실행 (Redo)"
            className="p-1 rounded-md border border-gray-200 hover:bg-gray-100 disabled:opacity-40 text-gray-700 transition"
          >
            <Redo2 size={15} />
          </button>

          {/* 선택 요소 복제 */}
          {activeTool !== 'draw' && currentSelectedIds.length > 0 && onDuplicateSelected && (
            <button
              onClick={onDuplicateSelected}
              title="선택된 요소 복제"
              className="flex items-center gap-1 px-2 py-1 rounded-md border border-blue-200 bg-blue-50 hover:bg-blue-100 text-xs font-bold text-blue-600 transition"
            >
              <Copy size={13} />
              <span>{currentSelectedIds.length > 1 ? `${currentSelectedIds.length}개 복제` : '복제'}</span>
            </button>
          )}

          {/* 선택 삭제 */}
          {activeTool !== 'draw' && currentSelectedIds.length > 0 && (
            <button
              onClick={onDeleteSelected}
              title="선택된 요소 삭제"
              className="flex items-center gap-1 px-2 py-1 rounded-md border border-red-200 bg-red-50 hover:bg-red-100 text-xs font-bold text-red-600 transition"
            >
              <Trash2 size={13} />
              <span>{currentSelectedIds.length > 1 ? `${currentSelectedIds.length}개 삭제` : '삭제'}</span>
            </button>
          )}

          {/* 전체 비우기 */}
          <button
            onClick={onClearAll}
            title="캔버스 비우기"
            className="flex items-center gap-1 px-2 py-1 rounded-md border border-gray-200 hover:bg-gray-100 text-xs font-medium text-gray-600 transition"
          >
            <Eraser size={13} />
            <span>초기화</span>
          </button>
        </div>

        {/* 현재 상태 정보 뱃지 및 다중 선택 안내 */}
        <div className="flex items-center gap-2 text-xs">
          {currentSelectedIds.length > 1 ? (
            <div className="flex items-center gap-1 bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full border border-indigo-200 font-bold text-[11px]">
              <Layers size={12} />
              <span>{currentSelectedIds.length}개 다중 선택됨</span>
            </div>
          ) : currentSelectedIds.length === 1 ? (
            <div className="flex items-center gap-1 bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full border border-blue-200 font-medium text-[11px]">
              <span>1개 선택됨 (자유변형 가능)</span>
            </div>
          ) : currEmotion ? (
            <div className="flex items-center gap-1 bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full border border-blue-200 font-semibold text-[11px]">
              <span>{currEmotion.emoji}</span>
              <span>{currEmotion.koreanName}</span>
            </div>
          ) : null}

          <span className="text-gray-400 font-mono text-[11px]">
            총 요소: {elements.length}개
          </span>
        </div>
      </div>

      {/* 2. 중앙 캔버스 무대 */}
      <div
        ref={containerRef}
        className="flex-1 flex items-center justify-center p-4 relative overflow-hidden"
      >
        <div className="relative shadow-xl rounded-xl overflow-hidden bg-white ring-1 ring-black/5">
          <canvas
            ref={canvasRef}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            className={`touch-none block ${
              activeTool === 'draw'
                ? 'cursor-crosshair'
                : marqueeState?.isSelecting
                ? 'cursor-crosshair'
                : 'cursor-default'
            }`}
          />

          {elements.length === 0 && !activeStroke && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 bg-white/80 pointer-events-none">
              <span className="text-3xl mb-2">🎨</span>
              <p className="text-sm font-bold text-gray-700">빈 캔버스입니다</p>
              <p className="text-xs text-gray-500 mt-1 max-w-xs leading-relaxed">
                왼쪽 도구창에서 조형 요소를 추가하거나, 마우스로 크게 드래그하여 여러 요소를 한 번에 선택할 수 있습니다.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* 3. 하단 액션바 */}
      <div className="bg-white border-t border-gray-200 px-4 py-3 flex items-center justify-between shadow-xs">
        <Link
          href="/gallery"
          className="flex items-center gap-1.5 text-xs font-bold text-gray-700 hover:text-blue-600 bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-xl transition"
        >
          <Eye size={15} />
          <span>우리 반 미술관</span>
        </Link>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenDownload}
            disabled={elements.length === 0}
            className="flex items-center gap-1.5 text-xs font-bold bg-gray-900 hover:bg-black text-white px-3.5 py-2 rounded-xl shadow-sm hover:shadow transition disabled:opacity-40"
          >
            <Download size={15} />
            <span>작품 다운로드 (PNG)</span>
          </button>

          <button
            onClick={onOpenGallery}
            disabled={elements.length === 0}
            className="flex items-center gap-1.5 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white px-3.5 py-2 rounded-xl shadow-sm hover:shadow transition disabled:opacity-40"
          >
            <Share2 size={15} />
            <span>우리 반 전시관 등록</span>
          </button>
        </div>
      </div>
    </div>
  );
};
