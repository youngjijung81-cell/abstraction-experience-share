'use client';

import React from 'react';
import { ArtElement } from '@/lib/types';
import { ART_COLORS } from '@/lib/constants/colors';
import { Trash2, Copy, ArrowUp, ArrowDown, Sliders, Activity, Hexagon, RotateCw, ZoomIn, ZoomOut } from 'lucide-react';

interface Props {
  element: ArtElement | null;
  selectedElements?: ArtElement[];
  selectedCount?: number;
  onUpdate: (updated: Partial<ArtElement>) => void;
  onUpdateMultipleProps?: (
    patch: Partial<ArtElement> | ((el: ArtElement) => Partial<ArtElement>)
  ) => void;
  onUpdateMultipleColors?: (color: string) => void;
  onDelete: (id: string) => void;
  onDeleteMultiple?: () => void;
  onDuplicate: (id: string) => void;
  onDuplicateMultiple?: () => void;
  onBringForward: (id: string) => void;
  onBringForwardMultiple?: () => void;
  onSendBackward: (id: string) => void;
  onSendBackwardMultiple?: () => void;
  onDeselect: () => void;
}

export const SelectedElementEditor: React.FC<Props> = ({
  element,
  selectedElements = [],
  selectedCount = 1,
  onUpdate,
  onUpdateMultipleProps,
  onUpdateMultipleColors,
  onDelete,
  onDeleteMultiple,
  onDuplicate,
  onDuplicateMultiple,
  onBringForward,
  onBringForwardMultiple,
  onSendBackward,
  onSendBackwardMultiple,
  onDeselect,
}) => {
  // 다중 선택 상태일 때 전용 일괄 제어 UI (색상, 형태, 크기, 회전, 투명도, 선굵기, 레이어, 복제)
  if (selectedCount > 1) {
    const hasLine = selectedElements.length > 0
      ? selectedElements.some((e) => e.type === 'line')
      : true;
    const hasShape = selectedElements.length > 0
      ? selectedElements.some((e) => e.type === 'shape')
      : true;

    return (
      <div className="bg-white border-2 border-indigo-400 rounded-xl p-3.5 shadow-sm space-y-3">
        {/* 1. 상단 바: 요소 개수 정보 및 일괄 액션 버튼들 */}
        <div className="flex items-center justify-between border-b pb-2">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 animate-pulse"></span>
            <span className="text-xs font-extrabold text-indigo-900">
              다중 선택됨 ({selectedCount}개 요소)
            </span>
          </div>
          <div className="flex items-center gap-1">
            {/* 일괄 복제 */}
            <button
              onClick={onDuplicateMultiple}
              title="선택된 모든 요소 일괄 복제"
              className="p-1 hover:bg-indigo-50 rounded text-gray-600 hover:text-indigo-600"
            >
              <Copy size={13} />
            </button>
            {/* 레이어 앞으로 */}
            <button
              onClick={onBringForwardMultiple}
              title="선택된 모든 요소 앞으로 가져오기"
              className="p-1 hover:bg-indigo-50 rounded text-gray-600 hover:text-indigo-600"
            >
              <ArrowUp size={13} />
            </button>
            {/* 레이어 뒤로 */}
            <button
              onClick={onSendBackwardMultiple}
              title="선택된 모든 요소 뒤로 보내기"
              className="p-1 hover:bg-indigo-50 rounded text-gray-600 hover:text-indigo-600"
            >
              <ArrowDown size={13} />
            </button>
            {/* 일괄 삭제 */}
            <button
              onClick={onDeleteMultiple}
              title="선택된 모든 요소 일괄 삭제"
              className="p-1 hover:bg-red-50 rounded text-red-600 hover:text-red-700 text-xs font-bold flex items-center gap-0.5"
            >
              <Trash2 size={13} />
              <span className="text-[10px]">삭제</span>
            </button>
            {/* 선택 해제 */}
            <button
              onClick={onDeselect}
              className="text-[11px] text-gray-400 hover:text-gray-700 ml-1 underline"
            >
              해제
            </button>
          </div>
        </div>

        {/* 2. 일괄 색상 변경 팔레트 & 컬러 피커 */}
        <div>
          <label className="text-[11px] font-semibold text-gray-600 block mb-1">
            선택된 모든 요소 색상 일괄 변경
          </label>
          <div className="flex flex-wrap gap-1 max-h-20 overflow-y-auto p-1 bg-gray-50 rounded-lg border border-gray-200">
            {ART_COLORS.map((c) => (
              <button
                key={c.hex}
                onClick={() => {
                  if (onUpdateMultipleColors) {
                    onUpdateMultipleColors(c.hex);
                  } else if (onUpdateMultipleProps) {
                    onUpdateMultipleProps({ color: c.hex });
                  }
                }}
                title={c.name}
                style={{ backgroundColor: c.hex }}
                className="w-5 h-5 rounded-full border border-gray-300 transition-transform hover:scale-110"
              />
            ))}
            <input
              type="color"
              defaultValue="#3B82F6"
              onChange={(e) => {
                const hex = e.target.value;
                if (onUpdateMultipleColors) {
                  onUpdateMultipleColors(hex);
                } else if (onUpdateMultipleProps) {
                  onUpdateMultipleProps({ color: hex });
                }
              }}
              className="w-5 h-5 rounded cursor-pointer border border-gray-300 p-0"
              title="직접 색상 선택"
            />
          </div>
        </div>

        {/* 3. 형태변형: 크기(스케일) 일괄 조절 */}
        <div>
          <div className="flex items-center justify-between text-[11px] font-semibold text-gray-600 mb-1">
            <span className="flex items-center gap-1">
              <ZoomIn size={12} className="text-indigo-600" />
              <span>크기 일괄 변형</span>
            </span>
          </div>
          <div className="grid grid-cols-4 gap-1">
            <button
              onClick={() => {
                if (onUpdateMultipleProps) {
                  onUpdateMultipleProps((el) => ({
                    width: Math.max(2, el.width * 0.8),
                    height: Math.max(2, el.height * 0.8)
                  }));
                }
              }}
              className="py-1 px-1 bg-gray-100 hover:bg-indigo-100 text-gray-700 hover:text-indigo-700 rounded text-[11px] font-bold border transition text-center"
            >
              -20%
            </button>
            <button
              onClick={() => {
                if (onUpdateMultipleProps) {
                  onUpdateMultipleProps((el) => ({
                    width: Math.max(2, el.width * 0.9),
                    height: Math.max(2, el.height * 0.9)
                  }));
                }
              }}
              className="py-1 px-1 bg-gray-100 hover:bg-indigo-100 text-gray-700 hover:text-indigo-700 rounded text-[11px] font-bold border transition text-center"
            >
              -10%
            </button>
            <button
              onClick={() => {
                if (onUpdateMultipleProps) {
                  onUpdateMultipleProps((el) => ({
                    width: Math.min(100, el.width * 1.1),
                    height: Math.min(100, el.height * 1.1)
                  }));
                }
              }}
              className="py-1 px-1 bg-gray-100 hover:bg-indigo-100 text-gray-700 hover:text-indigo-700 rounded text-[11px] font-bold border transition text-center"
            >
              +10%
            </button>
            <button
              onClick={() => {
                if (onUpdateMultipleProps) {
                  onUpdateMultipleProps((el) => ({
                    width: Math.min(100, el.width * 1.2),
                    height: Math.min(100, el.height * 1.2)
                  }));
                }
              }}
              className="py-1 px-1 bg-gray-100 hover:bg-indigo-100 text-gray-700 hover:text-indigo-700 rounded text-[11px] font-bold border transition text-center"
            >
              +20%
            </button>
          </div>
        </div>

        {/* 4. 형태변형: 회전 각도 일괄 조절 */}
        <div>
          <div className="flex items-center justify-between text-[11px] font-semibold text-gray-600 mb-1">
            <span className="flex items-center gap-1">
              <RotateCw size={12} className="text-indigo-600" />
              <span>회전 일괄 변형</span>
            </span>
          </div>
          <div className="grid grid-cols-4 gap-1">
            <button
              onClick={() => {
                if (onUpdateMultipleProps) {
                  onUpdateMultipleProps((el) => ({
                    rotation: (el.rotation - 45 + 360) % 360
                  }));
                }
              }}
              className="py-1 px-1 bg-gray-100 hover:bg-indigo-100 text-gray-700 hover:text-indigo-700 rounded text-[11px] font-bold border transition text-center"
            >
              -45°
            </button>
            <button
              onClick={() => {
                if (onUpdateMultipleProps) {
                  onUpdateMultipleProps((el) => ({
                    rotation: (el.rotation + 45) % 360
                  }));
                }
              }}
              className="py-1 px-1 bg-gray-100 hover:bg-indigo-100 text-gray-700 hover:text-indigo-700 rounded text-[11px] font-bold border transition text-center"
            >
              +45°
            </button>
            <button
              onClick={() => {
                if (onUpdateMultipleProps) {
                  onUpdateMultipleProps((el) => ({
                    rotation: (el.rotation + 90) % 360
                  }));
                }
              }}
              className="py-1 px-1 bg-gray-100 hover:bg-indigo-100 text-gray-700 hover:text-indigo-700 rounded text-[11px] font-bold border transition text-center"
            >
              90°
            </button>
            <button
              onClick={() => {
                if (onUpdateMultipleProps) {
                  onUpdateMultipleProps((el) => ({
                    rotation: (el.rotation + 180) % 360
                  }));
                }
              }}
              className="py-1 px-1 bg-gray-100 hover:bg-indigo-100 text-gray-700 hover:text-indigo-700 rounded text-[11px] font-bold border transition text-center"
            >
              180°
            </button>
          </div>
        </div>

        {/* 5. 투명도 일괄 슬라이더 */}
        <div>
          <div className="flex justify-between text-[11px] text-gray-600 mb-0.5">
            <span>투명도 일괄 조절</span>
            <span className="font-mono text-indigo-600">10% ~ 100%</span>
          </div>
          <input
            type="range"
            min="0.1"
            max="1"
            step="0.05"
            defaultValue="0.85"
            onChange={(e) => {
              const val = Number(e.target.value);
              if (onUpdateMultipleProps) {
                onUpdateMultipleProps({ opacity: val });
              }
            }}
            className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
          />
        </div>

        {/* 6. 선(Line) 요소 포함 시 선 굵기 일괄 조절 */}
        {hasLine && (
          <div className="pt-2 border-t border-gray-100">
            <div className="flex justify-between text-[11px] text-gray-600 mb-0.5">
              <span>선 굵기 일괄 조절 (선 요소)</span>
              <span className="font-mono text-indigo-600">1 ~ 35px</span>
            </div>
            <input
              type="range"
              min="1"
              max="35"
              defaultValue="5"
              onChange={(e) => {
                const val = Number(e.target.value);
                if (onUpdateMultipleProps) {
                  onUpdateMultipleProps((el) =>
                    el.type === 'line' ? { strokeWidth: val } : {}
                  );
                }
              }}
              className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
          </div>
        )}

        {/* 7. 면(Shape) 요소 포함 시 면 채우기 토글 */}
        {hasShape && (
          <div className="flex items-center gap-2 pt-1 border-t border-gray-100">
            <label className="flex items-center gap-1.5 text-gray-700 cursor-pointer">
              <input
                type="checkbox"
                defaultChecked={true}
                onChange={(e) => {
                  const checked = e.target.checked;
                  if (onUpdateMultipleProps) {
                    onUpdateMultipleProps((el) =>
                      el.type === 'shape' ? { fill: checked } : {}
                    );
                  }
                }}
                className="rounded text-indigo-600"
              />
              <span className="text-[11px]">면 채우기 일괄 적용 (해제 시 외곽선만 표현)</span>
            </label>
          </div>
        )}

        <p className="text-[11px] text-indigo-700 bg-indigo-50 p-2.5 rounded-lg leading-relaxed border border-indigo-100">
          💡 <strong>캔버스 제어:</strong> 모서리 4개 조절점(크기 변형), 상단 핸들(회전), 또는 요소를 잡고 직접 드래그(함께 이동)할 수 있습니다.
        </p>
      </div>
    );
  }

  if (!element) return null;

  const typeLabels: Record<string, string> = {
    point: '점 (Point)',
    line: '선 (Line)',
    shape: '면 (Shape)'
  };

  const isCurveOrWave =
    element.type === 'line' &&
    ['smooth_curve', 'wave', 'zigzag', 'spiral', 'motion'].includes(element.subType);

  const isPolygonOrCrystal =
    element.type === 'shape' && ['polygon', 'crystal', 'freeshape'].includes(element.subType);

  return (
    <div className="bg-white border-2 border-blue-400 rounded-xl p-3.5 shadow-sm space-y-3">
      {/* 1. 상단 바: 요소 정보 및 액션 버튼들 */}
      <div className="flex items-center justify-between border-b pb-2">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse"></span>
          <span className="text-xs font-bold text-gray-800">
            선택된 {typeLabels[element.type] || '요소'} ({element.subType})
          </span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => onDuplicate(element.id)}
            title="복제하기"
            className="p-1 hover:bg-gray-100 rounded text-gray-600 hover:text-blue-600"
          >
            <Copy size={14} />
          </button>
          <button
            onClick={() => onBringForward(element.id)}
            title="앞으로 가져오기"
            className="p-1 hover:bg-gray-100 rounded text-gray-600 hover:text-blue-600"
          >
            <ArrowUp size={14} />
          </button>
          <button
            onClick={() => onSendBackward(element.id)}
            title="뒤로 보내기"
            className="p-1 hover:bg-gray-100 rounded text-gray-600 hover:text-blue-600"
          >
            <ArrowDown size={14} />
          </button>
          <button
            onClick={() => onDelete(element.id)}
            title="삭제"
            className="p-1 hover:bg-red-50 rounded text-gray-600 hover:text-red-600"
          >
            <Trash2 size={14} />
          </button>
          <button
            onClick={onDeselect}
            className="text-[11px] text-gray-400 hover:text-gray-700 ml-1 underline"
          >
            선택해제
          </button>
        </div>
      </div>

      {/* 2. 색상 빠른 변경 (팔레트) */}
      <div>
        <label className="text-[11px] font-semibold text-gray-600 block mb-1">
          색상 변경 (원클릭)
        </label>
        <div className="flex flex-wrap gap-1 max-h-16 overflow-y-auto p-1 bg-gray-50 rounded-lg border border-gray-200">
          {ART_COLORS.map((c) => (
            <button
              key={c.hex}
              onClick={() => onUpdate({ color: c.hex })}
              title={c.name}
              style={{ backgroundColor: c.hex }}
              className={`w-5 h-5 rounded-full border transition-transform hover:scale-110 ${
                element.color === c.hex ? 'ring-2 ring-blue-500 scale-110' : 'border-gray-300'
              }`}
            />
          ))}
          <input
            type="color"
            value={element.color}
            onChange={(e) => onUpdate({ color: e.target.value })}
            className="w-5 h-5 rounded cursor-pointer border border-gray-300 p-0"
            title="직접 색상 선택"
          />
        </div>
      </div>

      {/* 3. 기본 변형 슬라이더: 크기, 회전, 투명도 */}
      <div className="grid grid-cols-3 gap-2 text-xs">
        <div>
          <div className="flex justify-between text-[11px] text-gray-500 mb-0.5">
            <span>크기</span>
            <span>{Math.round(element.width)}%</span>
          </div>
          <input
            type="range"
            min="4"
            max="80"
            value={element.width}
            onChange={(e) => {
              const val = Number(e.target.value);
              const ratio = element.height / (element.width || 1);
              onUpdate({ width: val, height: Math.max(2, val * ratio) });
            }}
            className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
        </div>

        <div>
          <div className="flex justify-between text-[11px] text-gray-500 mb-0.5">
            <span>회전</span>
            <span>{Math.round(element.rotation)}°</span>
          </div>
          <input
            type="range"
            min="0"
            max="360"
            value={element.rotation}
            onChange={(e) => onUpdate({ rotation: Number(e.target.value) })}
            className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
        </div>

        <div>
          <div className="flex justify-between text-[11px] text-gray-500 mb-0.5">
            <span>투명도</span>
            <span>{Math.round(element.opacity * 100)}%</span>
          </div>
          <input
            type="range"
            min="0.1"
            max="1"
            step="0.05"
            value={element.opacity}
            onChange={(e) => onUpdate({ opacity: Number(e.target.value) })}
            className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
        </div>
      </div>

      {/* 4. 선(Line) 전용 고도화 제어: 선 굵기 및 곡선 촘촘함/진폭 조절 */}
      {element.type === 'line' && (
        <div className="bg-blue-50/70 p-2.5 rounded-xl border border-blue-100 space-y-2 text-xs">
          <div className="flex items-center gap-1 font-bold text-blue-900 text-[11px]">
            <Activity size={13} />
            <span>선의 굵기 & 촘촘함 조절</span>
          </div>

          {/* 선 굵기 슬라이더 */}
          <div>
            <div className="flex justify-between text-[11px] text-gray-600 mb-0.5">
              <span>선 굵기</span>
              <span className="font-mono font-bold text-blue-600">{element.strokeWidth || 3}px</span>
            </div>
            <input
              type="range"
              min="1"
              max="35"
              value={element.strokeWidth || 3}
              onChange={(e) => onUpdate({ strokeWidth: Number(e.target.value) })}
              className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>

          {/* 곡선/물결 촘촘함(주기) 슬라이더 */}
          {isCurveOrWave && (
            <>
              <div>
                <div className="flex justify-between text-[11px] text-gray-600 mb-0.5">
                  <span>곡선 촘촘함 (파동 주기)</span>
                  <span className="font-mono font-bold text-blue-600">{element.frequency || 4}단계</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="16"
                  value={element.frequency || 4}
                  onChange={(e) => onUpdate({ frequency: Number(e.target.value) })}
                  className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
              </div>

              <div>
                <div className="flex justify-between text-[11px] text-gray-600 mb-0.5">
                  <span>곡선 굴곡 (진폭)</span>
                  <span className="font-mono font-bold text-blue-600">{Math.round((element.amplitude || 1) * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0.2"
                  max="2.5"
                  step="0.1"
                  value={element.amplitude || 1}
                  onChange={(e) => onUpdate({ amplitude: Number(e.target.value) })}
                  className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
              </div>
            </>
          )}

          {/* 점선(dashed) 전용: 마디 개수(밀도) 조절 슬라이더 */}
          {element.subType === 'dashed' && (
            <div className="pt-1 border-t border-blue-200/60">
              <div className="flex justify-between text-[11px] text-gray-600 mb-0.5">
                <span>점선 마디 개수 (밀도)</span>
                <span className="font-mono font-bold text-blue-600">{element.frequency || 8}개</span>
              </div>
              <input
                type="range"
                min="2"
                max="30"
                step="1"
                value={element.frequency || 8}
                onChange={(e) => onUpdate({ frequency: Number(e.target.value) })}
                className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <p className="text-[10px] text-blue-700/80 mt-1">
                점선의 개수를 줄이거나 늘려 여백과 호흡을 조절합니다. 선이 굵어져도 마디 간격이 비례하여 유지됩니다.
              </p>
            </div>
          )}
        </div>
      )}

      {/* 5. 면/다각형(Shape) 전용 변형 제어: 다각형 각 수 및 비대칭 왜곡 */}
      {element.type === 'shape' && (
        <div className="bg-purple-50/70 p-2.5 rounded-xl border border-purple-100 space-y-2 text-xs">
          <div className="flex items-center gap-1 font-bold text-purple-900 text-[11px]">
            <Hexagon size={13} />
            <span>면 & 다각형 형태 변형</span>
          </div>

          {/* 다각형 각 수 슬라이더 (3각형 ~ 10각형) */}
          {isPolygonOrCrystal && (
            <div>
              <div className="flex justify-between text-[11px] text-gray-600 mb-0.5">
                <span>다각형 꼭짓점 수</span>
                <span className="font-mono font-bold text-purple-700">{element.sides || 6}각형</span>
              </div>
              <input
                type="range"
                min="3"
                max="10"
                value={element.sides || 6}
                onChange={(e) => onUpdate({ sides: Number(e.target.value) })}
                className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
              />
            </div>
          )}

          {/* 비대칭 왜곡도 슬라이더 */}
          {['polygon', 'crystal', 'blob'].includes(element.subType) && (
            <div>
              <div className="flex justify-between text-[11px] text-gray-600 mb-0.5">
                <span>추상적 비대칭 왜곡</span>
                <span className="font-mono font-bold text-purple-700">{Math.round((element.distortion || 0) * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={element.distortion || 0}
                onChange={(e) => onUpdate({ distortion: Number(e.target.value) })}
                className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
              />
            </div>
          )}

          {/* 면 채우기 체크박스 */}
          <div className="flex items-center gap-2 pt-1 border-t border-purple-100">
            <label className="flex items-center gap-1.5 text-gray-700 cursor-pointer">
              <input
                type="checkbox"
                checked={element.fill ?? true}
                onChange={(e) => onUpdate({ fill: e.target.checked })}
                className="rounded text-purple-600"
              />
              <span className="text-[11px]">면 채우기 (해제 시 외곽선만 표현)</span>
            </label>
          </div>
        </div>
      )}
    </div>
  );
};
