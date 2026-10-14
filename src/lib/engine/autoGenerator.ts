import { ArtElement, EmotionKey } from '../types';
import { EMOTION_PALETTES } from '../constants/colors';

function uid(): string {
  return 'el_' + Math.random().toString(36).substring(2, 9);
}

// 흩뿌림 점들을 하나의 고정된 덩어리가 아니라, 학생이 하나하나 클릭하여 크기·색상·위치를 변형할 수 있는 개별 독립 점들로 생성
function createSprayDots(
  centerX: number,
  centerY: number,
  color: string,
  baseZ: number,
  spreadRadius: number = 14,
  count: number = 7
): ArtElement[] {
  const offsets = [
    { dx: 0, dy: 0, size: 7.5 },
    { dx: -7.5, dy: -6.5, size: 5 },
    { dx: 8.5, dy: -5, size: 6 },
    { dx: 6.5, dy: 8.5, size: 4.5 },
    { dx: -8.5, dy: 7.5, size: 5.5 },
    { dx: -13, dy: 1.5, size: 3.5 },
    { dx: 12, dy: 4, size: 4 },
    { dx: 2, dy: -12, size: 4 }
  ];

  const scale = spreadRadius / 14;
  return offsets.slice(0, count).map((dot, idx) => ({
    id: uid(),
    type: 'point' as const,
    subType: 'single',
    x: Math.max(-45, Math.min(45, Math.round((centerX + dot.dx * scale) * 10) / 10)),
    y: Math.max(-45, Math.min(45, Math.round((centerY + dot.dy * scale) * 10) / 10)),
    width: Math.max(3.5, Math.round(dot.size * scale * 10) / 10),
    height: Math.max(3.5, Math.round(dot.size * scale * 10) / 10),
    rotation: 0,
    color,
    opacity: 0.85,
    fill: true,
    zIndex: baseZ + idx
  }));
}

export function generateArtByEmotion(emotion: EmotionKey): ArtElement[] {
  const palette = EMOTION_PALETTES[emotion] || ['#3182CE', '#E53E3E', '#ECC94B', '#1A202C'];
  const elements: ArtElement[] = [];

  const pickColor = (idx?: number) => {
    if (idx !== undefined) return palette[idx % palette.length];
    return palette[Math.floor(Math.random() * palette.length)];
  };

  switch (emotion) {
    case 'joy': {
      // 밝고 경쾌한 솟아오르는 곡선과 점 (개별 조작 가능한 흩뿌림 점군 포함)
      elements.push(
        { id: uid(), type: 'shape', subType: 'circle', x: 0, y: 5, width: 34, height: 34, rotation: 0, color: pickColor(0), opacity: 0.85, fill: true, zIndex: 1 },
        { id: uid(), type: 'line', subType: 'smooth_curve', x: -10, y: 15, width: 50, height: 25, rotation: -20, color: pickColor(1), opacity: 0.9, strokeWidth: 5, zIndex: 2 },
        { id: uid(), type: 'line', subType: 'wave', x: 15, y: -15, width: 45, height: 18, rotation: 15, color: pickColor(2), opacity: 0.8, strokeWidth: 4, zIndex: 3 },
        { id: uid(), type: 'shape', subType: 'blob', x: -20, y: -20, width: 26, height: 22, rotation: 45, color: pickColor(3), opacity: 0.75, fill: true, zIndex: 4 },
        { id: uid(), type: 'point', subType: 'single', x: 22, y: 20, width: 9, height: 9, rotation: 0, color: pickColor(1), opacity: 0.9, zIndex: 5 },
        ...createSprayDots(-25, 10, pickColor(0), 6, 14, 6),
        { id: uid(), type: 'shape', subType: 'polygon', sides: 5, distortion: 0.15, x: 5, y: -28, width: 16, height: 16, rotation: 12, color: pickColor(2), opacity: 0.9, fill: true, zIndex: 13 }
      );
      break;
    }

    case 'ecstasy': {
      // 폭발적인 방사형과 별형 (개별 조작 가능한 흩뿌림 점군 포함)
      elements.push(
        { id: uid(), type: 'shape', subType: 'crystal', sides: 6, distortion: 0.2, x: 0, y: 0, width: 44, height: 44, rotation: 0, color: pickColor(0), opacity: 0.9, fill: true, zIndex: 1 },
        { id: uid(), type: 'shape', subType: 'circle', x: 0, y: 0, width: 26, height: 26, rotation: 0, color: pickColor(1), opacity: 0.85, fill: true, zIndex: 2 },
        { id: uid(), type: 'line', subType: 'motion', x: -25, y: -22, width: 35, height: 15, rotation: 45, color: pickColor(2), opacity: 0.9, strokeWidth: 5, zIndex: 3 },
        { id: uid(), type: 'line', subType: 'motion', x: 25, y: 22, width: 35, height: 15, rotation: 45, color: pickColor(2), opacity: 0.9, strokeWidth: 5, zIndex: 4 },
        { id: uid(), type: 'shape', subType: 'fragment', x: 20, y: -25, width: 22, height: 22, rotation: 60, color: pickColor(3), opacity: 0.8, fill: true, zIndex: 5 },
        { id: uid(), type: 'shape', subType: 'fragment', x: -20, y: 25, width: 22, height: 22, rotation: -60, color: pickColor(3), opacity: 0.8, fill: true, zIndex: 6 },
        ...createSprayDots(0, 0, pickColor(1), 7, 24, 8)
      );
      break;
    }

    case 'flutter': {
      // 설렘: 부드러운 유기적 파스텔 면 (개별 조작 가능한 흩뿌림 점군 포함)
      elements.push(
        { id: uid(), type: 'shape', subType: 'blob', x: -12, y: -8, width: 38, height: 32, rotation: 25, color: pickColor(0), opacity: 0.7, fill: true, zIndex: 1 },
        { id: uid(), type: 'shape', subType: 'blob', x: 14, y: 12, width: 32, height: 28, rotation: -15, color: pickColor(1), opacity: 0.75, fill: true, zIndex: 2 },
        { id: uid(), type: 'line', subType: 'smooth_curve', x: 0, y: 0, width: 45, height: 20, rotation: 30, color: pickColor(2), opacity: 0.8, strokeWidth: 4, zIndex: 3 },
        { id: uid(), type: 'shape', subType: 'circle', x: 20, y: -18, width: 18, height: 18, rotation: 0, color: pickColor(3), opacity: 0.85, fill: true, zIndex: 4 },
        ...createSprayDots(-15, 22, pickColor(0), 5, 15, 6)
      );
      break;
    }

    case 'passion': {
      // 열정: 치솟는 삼각형과 날카로운 선
      elements.push(
        { id: uid(), type: 'shape', subType: 'triangle', x: 0, y: -5, width: 40, height: 48, rotation: 0, color: pickColor(0), opacity: 0.88, fill: true, zIndex: 1 },
        { id: uid(), type: 'shape', subType: 'fragment', x: -18, y: 15, width: 28, height: 32, rotation: -25, color: pickColor(1), opacity: 0.85, fill: true, zIndex: 2 },
        { id: uid(), type: 'line', subType: 'zigzag', x: 15, y: -10, width: 38, height: 22, rotation: -50, color: pickColor(2), opacity: 0.95, strokeWidth: 5, zIndex: 3 },
        { id: uid(), type: 'line', subType: 'straight', x: -10, y: -20, width: 35, height: 2, rotation: 65, color: pickColor(0), opacity: 0.9, strokeWidth: 4, zIndex: 4 },
        { id: uid(), type: 'point', subType: 'heavy', x: 22, y: 22, width: 14, height: 14, rotation: 0, color: pickColor(2), opacity: 0.9, zIndex: 5 }
      );
      break;
    }

    case 'hope': {
      // 희망: 상승하는 선과 연두빛
      elements.push(
        { id: uid(), type: 'line', subType: 'smooth_curve', x: -5, y: 5, width: 50, height: 30, rotation: -40, color: pickColor(1), opacity: 0.9, strokeWidth: 5, zIndex: 1 },
        { id: uid(), type: 'shape', subType: 'ellipse', x: 12, y: -18, width: 30, height: 18, rotation: -30, color: pickColor(0), opacity: 0.85, fill: true, zIndex: 2 },
        { id: uid(), type: 'shape', subType: 'circle', x: -18, y: 20, width: 22, height: 22, rotation: 0, color: pickColor(2), opacity: 0.8, fill: true, zIndex: 3 },
        { id: uid(), type: 'line', subType: 'motion', x: 20, y: -5, width: 32, height: 12, rotation: -45, color: pickColor(3), opacity: 0.75, strokeWidth: 4, zIndex: 4 },
        { id: uid(), type: 'point', subType: 'single', x: 18, y: -25, width: 8, height: 8, rotation: 0, color: pickColor(0), opacity: 0.85, zIndex: 5 }
      );
      break;
    }

    case 'serenity': {
      // 평온: 수평선과 청록빛 타원
      elements.push(
        { id: uid(), type: 'line', subType: 'straight', x: 0, y: 0, width: 70, height: 2, rotation: 0, color: pickColor(0), opacity: 0.85, strokeWidth: 4, zIndex: 1 },
        { id: uid(), type: 'shape', subType: 'ellipse', x: -10, y: -12, width: 45, height: 22, rotation: 0, color: pickColor(1), opacity: 0.6, fill: true, zIndex: 2 },
        { id: uid(), type: 'line', subType: 'wave', x: 5, y: 18, width: 55, height: 10, rotation: 0, color: pickColor(2), opacity: 0.75, strokeWidth: 3, zIndex: 3 },
        { id: uid(), type: 'shape', subType: 'circle', x: 22, y: -8, width: 18, height: 18, rotation: 0, color: pickColor(0), opacity: 0.8, fill: true, zIndex: 4 },
        { id: uid(), type: 'point', subType: 'single', x: -28, y: 15, width: 7, height: 7, rotation: 0, color: pickColor(1), opacity: 0.8, zIndex: 5 }
      );
      break;
    }

    case 'rest': {
      // 안식: 포근한 겹침 면 (개별 조작 가능한 흩뿌림 점군 포함)
      elements.push(
        { id: uid(), type: 'shape', subType: 'blob', x: -5, y: 5, width: 48, height: 38, rotation: 10, color: pickColor(0), opacity: 0.65, fill: true, zIndex: 1 },
        { id: uid(), type: 'shape', subType: 'circle', x: 15, y: -10, width: 30, height: 30, rotation: 0, color: pickColor(1), opacity: 0.7, fill: true, zIndex: 2 },
        { id: uid(), type: 'line', subType: 'smooth_curve', x: -10, y: -15, width: 40, height: 15, rotation: 5, color: pickColor(2), opacity: 0.8, strokeWidth: 4, zIndex: 3 },
        ...createSprayDots(10, 20, pickColor(3), 4, 14, 6)
      );
      break;
    }

    case 'calm': {
      // 고요: 짙은 블루와 정돈된 사각/원
      elements.push(
        { id: uid(), type: 'shape', subType: 'rect', x: 0, y: 8, width: 55, height: 30, rotation: 0, color: pickColor(0), opacity: 0.75, fill: true, zIndex: 1 },
        { id: uid(), type: 'shape', subType: 'circle', x: -15, y: -16, width: 26, height: 26, rotation: 0, color: pickColor(1), opacity: 0.85, fill: true, zIndex: 2 },
        { id: uid(), type: 'line', subType: 'straight', x: 10, y: -15, width: 40, height: 2, rotation: 0, color: pickColor(2), opacity: 0.8, strokeWidth: 3, zIndex: 3 },
        { id: uid(), type: 'point', subType: 'heavy', x: 22, y: -15, width: 10, height: 10, rotation: 0, color: pickColor(3), opacity: 0.85, zIndex: 4 }
      );
      break;
    }

    case 'cozy': {
      // 포근함: 따뜻한 원과 부드러운 곡선
      elements.push(
        { id: uid(), type: 'shape', subType: 'circle', x: 0, y: 0, width: 40, height: 40, rotation: 0, color: pickColor(0), opacity: 0.8, fill: true, zIndex: 1 },
        { id: uid(), type: 'shape', subType: 'blob', x: -15, y: 10, width: 34, height: 28, rotation: -20, color: pickColor(1), opacity: 0.75, fill: true, zIndex: 2 },
        { id: uid(), type: 'line', subType: 'smooth_curve', x: 12, y: -12, width: 38, height: 18, rotation: 25, color: pickColor(2), opacity: 0.85, strokeWidth: 5, zIndex: 3 },
        { id: uid(), type: 'point', subType: 'single', x: -20, y: -18, width: 7, height: 7, rotation: 0, color: pickColor(1), opacity: 0.8, zIndex: 4 }
      );
      break;
    }

    case 'sorrow': {
      // 슬픔: 아래로 떨어지는 수직선과 눈물
      elements.push(
        { id: uid(), type: 'line', subType: 'straight', x: -12, y: 0, width: 2, height: 60, rotation: 90, color: pickColor(0), opacity: 0.85, strokeWidth: 4, zIndex: 1 },
        { id: uid(), type: 'line', subType: 'straight', x: 8, y: 10, width: 2, height: 50, rotation: 90, color: pickColor(1), opacity: 0.8, strokeWidth: 3, zIndex: 2 },
        { id: uid(), type: 'shape', subType: 'blob', x: -12, y: 28, width: 18, height: 26, rotation: 180, color: pickColor(0), opacity: 0.9, fill: true, zIndex: 3 },
        { id: uid(), type: 'line', subType: 'dashed', x: 22, y: -5, width: 2, height: 45, rotation: 90, color: pickColor(2), opacity: 0.6, strokeWidth: 2, zIndex: 4 },
        { id: uid(), type: 'shape', subType: 'ellipse', x: 0, y: -20, width: 32, height: 16, rotation: 0, color: pickColor(3), opacity: 0.4, fill: true, zIndex: 5 }
      );
      break;
    }

    case 'void': {
      // 공허: 넓은 여백과 외로운 몇 개의 점
      elements.push(
        { id: uid(), type: 'shape', subType: 'circle', x: 0, y: 0, width: 20, height: 20, rotation: 0, color: pickColor(0), opacity: 0.35, fill: false, strokeWidth: 2, zIndex: 1 },
        { id: uid(), type: 'point', subType: 'single', x: 18, y: -16, width: 6, height: 6, rotation: 0, color: pickColor(1), opacity: 0.7, zIndex: 2 },
        { id: uid(), type: 'line', subType: 'dashed', x: -15, y: 20, width: 30, height: 2, rotation: 15, color: pickColor(2), opacity: 0.4, strokeWidth: 1.5, zIndex: 3 }
      );
      break;
    }

    case 'solitude': {
      // 외로움: 광활한 공간 속 짙은 하나의 원
      elements.push(
        { id: uid(), type: 'shape', subType: 'circle', x: 18, y: 15, width: 16, height: 16, rotation: 0, color: pickColor(0), opacity: 0.95, fill: true, zIndex: 1 },
        { id: uid(), type: 'line', subType: 'straight', x: -10, y: -10, width: 55, height: 2, rotation: -25, color: pickColor(1), opacity: 0.4, strokeWidth: 2, zIndex: 2 },
        { id: uid(), type: 'shape', subType: 'ellipse', x: -25, y: 20, width: 22, height: 12, rotation: 30, color: pickColor(2), opacity: 0.3, fill: true, zIndex: 3 }
      );
      break;
    }

    case 'longing': {
      // 그리움: 뻗어가는 점선과 아련한 보라 (개별 조작 가능한 흩뿌림 점군 포함)
      elements.push(
        { id: uid(), type: 'line', subType: 'dashed', x: -5, y: 0, width: 65, height: 2, rotation: -35, color: pickColor(0), opacity: 0.85, strokeWidth: 3, zIndex: 1 },
        { id: uid(), type: 'shape', subType: 'crystal', sides: 4, distortion: 0.12, x: 22, y: -22, width: 18, height: 18, rotation: 20, color: pickColor(1), opacity: 0.8, fill: true, zIndex: 2 },
        { id: uid(), type: 'shape', subType: 'blob', x: -18, y: 18, width: 32, height: 26, rotation: 15, color: pickColor(2), opacity: 0.5, fill: true, zIndex: 3 },
        ...createSprayDots(0, -10, pickColor(3), 4, 14, 6)
      );
      break;
    }

    case 'rage': {
      // 분노: 날카로운 지그재그와 충돌
      elements.push(
        { id: uid(), type: 'line', subType: 'zigzag', x: 0, y: 0, width: 60, height: 35, rotation: -25, color: pickColor(0), opacity: 0.95, strokeWidth: 7, zIndex: 1 },
        { id: uid(), type: 'shape', subType: 'fragment', x: 18, y: -18, width: 32, height: 36, rotation: 40, color: pickColor(1), opacity: 0.9, fill: true, zIndex: 2 },
        { id: uid(), type: 'shape', subType: 'triangle', x: -20, y: 18, width: 36, height: 34, rotation: -65, color: pickColor(0), opacity: 0.85, fill: true, zIndex: 3 },
        { id: uid(), type: 'line', subType: 'zigzag', x: -10, y: 12, width: 45, height: 25, rotation: 35, color: pickColor(2), opacity: 0.9, strokeWidth: 5, zIndex: 4 },
        { id: uid(), type: 'point', subType: 'heavy', x: 0, y: 0, width: 14, height: 14, rotation: 0, color: pickColor(1), opacity: 1, zIndex: 5 }
      );
      break;
    }

    case 'anxiety': {
      // 불안: 엉킨 선들과 차가운 긴장 (개별 조작 가능한 흩뿌림 점군 포함)
      elements.push(
        { id: uid(), type: 'line', subType: 'spiral', x: -8, y: -5, width: 38, height: 38, rotation: 15, color: pickColor(0), opacity: 0.85, strokeWidth: 3.5, zIndex: 1 },
        { id: uid(), type: 'line', subType: 'dashed', x: 12, y: 10, width: 50, height: 2, rotation: -45, color: pickColor(1), opacity: 0.8, strokeWidth: 3, zIndex: 2 },
        { id: uid(), type: 'line', subType: 'zigzag', x: -15, y: 20, width: 40, height: 20, rotation: 70, color: pickColor(2), opacity: 0.85, strokeWidth: 4, zIndex: 3 },
        { id: uid(), type: 'shape', subType: 'fragment', x: 20, y: -20, width: 24, height: 24, rotation: -30, color: pickColor(3), opacity: 0.75, fill: true, zIndex: 4 },
        ...createSprayDots(-5, -5, pickColor(0), 5, 18, 7)
      );
      break;
    }

    case 'chaos': {
      // 혼란: 통제되지 않은 파편들과 선들
      elements.push(
        { id: uid(), type: 'shape', subType: 'fragment', x: -15, y: -15, width: 34, height: 34, rotation: 45, color: pickColor(0), opacity: 0.85, fill: true, zIndex: 1 },
        { id: uid(), type: 'shape', subType: 'crystal', sides: 6, distortion: 0.35, x: 18, y: 18, width: 32, height: 32, rotation: -30, color: pickColor(1), opacity: 0.85, fill: true, zIndex: 2 },
        { id: uid(), type: 'line', subType: 'zigzag', x: 0, y: 0, width: 55, height: 30, rotation: 60, color: pickColor(2), opacity: 0.9, strokeWidth: 5, zIndex: 3 },
        { id: uid(), type: 'line', subType: 'motion', x: -20, y: 20, width: 38, height: 15, rotation: -40, color: pickColor(3), opacity: 0.8, strokeWidth: 4, zIndex: 4 },
        { id: uid(), type: 'shape', subType: 'polygon', x: 15, y: -22, width: 28, height: 28, rotation: 15, color: pickColor(0), opacity: 0.8, fill: true, zIndex: 5 },
        { id: uid(), type: 'point', subType: 'heavy', x: -5, y: 22, width: 14, height: 14, rotation: 0, color: pickColor(1), opacity: 0.85, zIndex: 6 }
      );
      break;
    }
  }

  return elements;
}
