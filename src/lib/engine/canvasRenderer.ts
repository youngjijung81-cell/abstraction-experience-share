import { ArtElement } from '../types';

export function toCanvasCoords(el: ArtElement, canvasWidth: number, canvasHeight: number) {
  const cx = canvasWidth / 2;
  const cy = canvasHeight / 2;
  const px = cx + (el.x / 100) * canvasWidth;
  const py = cy + (el.y / 100) * canvasHeight;
  const w = (el.width / 100) * canvasWidth;
  const h = (el.height / 100) * canvasHeight;
  return { px, py, w, h };
}

export function drawBackground(ctx: CanvasRenderingContext2D, width: number, height: number, bgColor: string = '#FBFBFA') {
  ctx.save();
  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, width, height);

  // 미세한 미술용 캔버스 한지/캔버스 질감 도트 효과
  ctx.fillStyle = 'rgba(0, 0, 0, 0.015)';
  const step = 8;
  for (let x = 0; x < width; x += step) {
    for (let y = 0; y < height; y += step) {
      if ((x + y) % (step * 2) === 0) {
        ctx.fillRect(x, y, 1, 1);
      }
    }
  }
  ctx.restore();
}

export function drawElement(
  ctx: CanvasRenderingContext2D,
  element: ArtElement,
  canvasWidth: number,
  canvasHeight: number
) {
  const { px, py, w, h } = toCanvasCoords(element, canvasWidth, canvasHeight);

  ctx.save();
  ctx.translate(px, py);
  ctx.rotate((element.rotation * Math.PI) / 180);
  ctx.globalAlpha = Math.max(0.05, Math.min(1, element.opacity));
  ctx.fillStyle = element.color;
  ctx.strokeStyle = element.color;
  ctx.lineWidth = element.strokeWidth || 3;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  const halfW = w / 2;
  const halfH = h / 2;

  switch (element.type) {
    case 'point':
      drawPoint(ctx, element.subType, halfW, halfH);
      break;
    case 'line':
      if (element.subType === 'freehand') {
        drawFreehandStroke(ctx, element, canvasWidth, canvasHeight);
      } else {
        drawLine(ctx, element, halfW, halfH);
      }
      break;
    case 'shape':
      drawShape(ctx, element, halfW, halfH, element.fill ?? true);
      break;
  }

  ctx.restore();
}

function drawFreehandStroke(
  ctx: CanvasRenderingContext2D,
  element: ArtElement,
  canvasWidth: number,
  canvasHeight: number
) {
  const points = element.points;
  if (!points || points.length === 0) return;

  const brush = element.brushStyle || 'pen';

  ctx.save();
  if (brush === 'glow') {
    ctx.shadowColor = element.color;
    ctx.shadowBlur = 12;
    ctx.lineWidth = (element.strokeWidth || 4) * 1.2;
  } else if (brush === 'marker') {
    ctx.globalAlpha = Math.min(0.55, element.opacity);
    ctx.lineWidth = (element.strokeWidth || 8) * 1.8;
    ctx.lineCap = 'square';
  } else if (brush === 'brush') {
    ctx.lineWidth = element.strokeWidth || 6;
  }

  const toPx = (pt: { x: number; y: number }) => ({
    x: (pt.x / 100) * canvasWidth,
    y: (pt.y / 100) * canvasHeight
  });

  if (points.length === 1) {
    const p = toPx(points[0]);
    ctx.beginPath();
    ctx.arc(p.x, p.y, (element.strokeWidth || 4) / 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
    return;
  }

  ctx.beginPath();
  const first = toPx(points[0]);
  ctx.moveTo(first.x, first.y);

  for (let i = 1; i < points.length - 1; i++) {
    const curr = toPx(points[i]);
    const next = toPx(points[i + 1]);
    const midX = (curr.x + next.x) / 2;
    const midY = (curr.y + next.y) / 2;
    ctx.quadraticCurveTo(curr.x, curr.y, midX, midY);
  }

  const last = toPx(points[points.length - 1]);
  ctx.lineTo(last.x, last.y);
  ctx.stroke();

  ctx.restore();
}

function drawPoint(ctx: CanvasRenderingContext2D, subType: string, halfW: number, halfH: number) {
  const rx = Math.max(2, halfW);
  const ry = Math.max(2, halfH);
  const r = Math.min(rx, ry);
  switch (subType) {
    case 'single':
      ctx.beginPath();
      ctx.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2);
      ctx.fill();
      break;
    case 'heavy':
      ctx.beginPath();
      ctx.ellipse(0, 0, rx * 1.4, ry * 1.4, 0, 0, Math.PI * 2);
      ctx.fill();
      break;
    case 'diamond':
      ctx.beginPath();
      ctx.moveTo(0, -ry * 1.4);
      ctx.lineTo(rx * 1.4, 0);
      ctx.lineTo(0, ry * 1.4);
      ctx.lineTo(-rx * 1.4, 0);
      ctx.closePath();
      ctx.fill();
      break;
    case 'cluster':
      const offsets = [
        [0, 0],
        [-r * 0.7, -r * 0.6],
        [r * 0.8, -r * 0.4],
        [r * 0.6, r * 0.7],
        [-r * 0.5, r * 0.8],
        [-r * 0.9, 0.2],
        [0.3, -r * 0.9]
      ];
      offsets.forEach(([ox, oy], idx) => {
        ctx.beginPath();
        ctx.arc(ox, oy, r * (idx === 0 ? 0.6 : 0.4), 0, Math.PI * 2);
        ctx.fill();
      });
      break;
    case 'spray':
      for (let i = 0; i < 14; i++) {
        const angle = (i * 2.39996) + 0.5;
        const dist = (i / 14) * r * 1.6;
        const sx = Math.cos(angle) * dist;
        const sy = Math.sin(angle) * dist;
        ctx.beginPath();
        ctx.arc(sx, sy, Math.max(1, r * 0.22 * ((i % 3) + 1)), 0, Math.PI * 2);
        ctx.fill();
      }
      break;
    default:
      ctx.beginPath();
      ctx.arc(0, 0, r, 0, Math.PI * 2);
      ctx.fill();
  }
}

function drawLine(ctx: CanvasRenderingContext2D, element: ArtElement, halfW: number, halfH: number) {
  const subType = element.subType;
  // 촘촘함 (Frequency / Segments)
  const freq = Math.max(1, Math.min(16, element.frequency || 4));
  const amp = element.amplitude || 1;

  switch (subType) {
    case 'straight':
      ctx.beginPath();
      ctx.moveTo(-halfW, 0);
      ctx.lineTo(halfW, 0);
      ctx.stroke();
      break;

    case 'dashed': {
      ctx.save();
      // 굵기가 두꺼워져도 마디가 뭉개져 실선이 되지 않도록 butt 캡 적용 및 주기에 비례한 대시/갭 분할
      ctx.lineCap = 'butt';
      const numDashes = Math.max(2, Math.min(30, element.frequency || 8));
      const totalLen = Math.max(10, halfW * 2);
      const unit = totalLen / numDashes;
      const dashLen = Math.max(2, unit * 0.5);
      const gapLen = Math.max(2, unit * 0.5);
      ctx.setLineDash([dashLen, gapLen]);
      ctx.beginPath();
      ctx.moveTo(-halfW, 0);
      ctx.lineTo(halfW, 0);
      ctx.stroke();
      ctx.restore();
      break;
    }

    case 'smooth_curve':
      // 촘촘함에 따른 다중 S-커브 또는 유연한 단일/복합 곡선
      ctx.beginPath();
      if (freq <= 2) {
        ctx.moveTo(-halfW, halfH * amp);
        ctx.bezierCurveTo(-halfW * 0.5, -halfH * 1.5 * amp, halfW * 0.5, halfH * 1.5 * amp, halfW, -halfH * amp);
      } else {
        ctx.moveTo(-halfW, 0);
        const segW = (halfW * 2) / freq;
        for (let i = 0; i < freq; i++) {
          const x1 = -halfW + i * segW;
          const x2 = x1 + segW;
          const sign = i % 2 === 0 ? 1 : -1;
          const ctrlX = x1 + segW / 2;
          const ctrlY = sign * halfH * amp;
          ctx.quadraticCurveTo(ctrlX, ctrlY, x2, 0);
        }
      }
      ctx.stroke();
      break;

    case 'wave':
      // 촘촘함에 따른 물결선
      ctx.beginPath();
      ctx.moveTo(-halfW, 0);
      const waveSegW = (halfW * 2) / freq;
      for (let i = 0; i < freq; i++) {
        const x1 = -halfW + i * waveSegW;
        const x2 = x1 + waveSegW;
        const sign = i % 2 === 0 ? 1 : -1;
        ctx.quadraticCurveTo(x1 + waveSegW / 2, sign * halfH * amp, x2, 0);
      }
      ctx.stroke();
      break;

    case 'zigzag':
      // 촘촘함에 따른 날카로운 지그재그
      ctx.beginPath();
      ctx.moveTo(-halfW, 0);
      const zStepW = (halfW * 2) / freq;
      for (let i = 0; i < freq; i++) {
        const x = -halfW + (i + 0.5) * zStepW;
        const sign = i % 2 === 0 ? -1 : 1;
        ctx.lineTo(x, sign * halfH * amp);
      }
      ctx.lineTo(halfW, 0);
      ctx.stroke();
      break;

    case 'spiral':
      // 촘촘함에 따른 소용돌이 밀도
      ctx.beginPath();
      const maxR = Math.min(halfW, halfH);
      const totalRotations = Math.max(1, freq);
      const totalSteps = totalRotations * 28;
      for (let s = 0; s <= totalSteps; s++) {
        const t = (s / totalSteps) * (Math.PI * 2 * totalRotations);
        const currR = (s / totalSteps) * maxR;
        const sx = Math.cos(t) * currR;
        const sy = Math.sin(t) * currR;
        if (s === 0) ctx.moveTo(sx, sy);
        else ctx.lineTo(sx, sy);
      }
      ctx.stroke();
      break;

    case 'motion':
      ctx.beginPath();
      const numLines = Math.max(2, Math.min(6, freq));
      const lineGap = (halfH * 2) / (numLines + 1);
      for (let i = 0; i < numLines; i++) {
        const yOffset = -halfH + (i + 1) * lineGap;
        const len = halfW * (0.8 + ((i % 2) * 0.2));
        ctx.moveTo(-len, yOffset);
        ctx.lineTo(len, yOffset);
      }
      ctx.stroke();
      break;

    default:
      ctx.beginPath();
      ctx.moveTo(-halfW, 0);
      ctx.lineTo(halfW, 0);
      ctx.stroke();
  }
}

function drawShape(ctx: CanvasRenderingContext2D, element: ArtElement, halfW: number, halfH: number, fill: boolean) {
  const subType = element.subType;
  ctx.beginPath();

  switch (subType) {
    case 'circle': {
      ctx.ellipse(0, 0, halfW, halfH, 0, 0, Math.PI * 2);
      break;
    }

    case 'ellipse': {
      ctx.ellipse(0, 0, halfW, halfH, 0, 0, Math.PI * 2);
      break;
    }

    case 'triangle': {
      ctx.moveTo(0, -halfH);
      ctx.lineTo(halfW, halfH);
      ctx.lineTo(-halfW, halfH);
      ctx.closePath();
      break;
    }

    case 'rect': {
      ctx.rect(-halfW, -halfH, halfW * 2, halfH * 2);
      break;
    }

    case 'polygon': {
      // 3~10각 수 및 비대칭 왜곡(Distortion) 지원 추상 다면체 (가로/세로 독립 신축 지원)
      const sides = Math.max(3, Math.min(10, element.sides || 6));
      const dist = Math.max(0, Math.min(1, element.distortion || 0));

      for (let i = 0; i < sides; i++) {
        const angle = (i * 2 * Math.PI) / sides - Math.PI / 2;
        // 시드형 왜곡 적용: 홀짝 및 인덱스에 따라 각 꼭짓점 반지름 변형
        const mod = 1 + dist * (Math.sin(i * 2.5) * 0.45);
        const x = Math.cos(angle) * halfW * mod;
        const y = Math.sin(angle) * halfH * mod;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      break;
    }

    case 'crystal': {
      // 추상 결정체: 각진 다면 분할 형태 (가로/세로 독립 신축 지원)
      const sides = Math.max(4, Math.min(8, element.sides || 6));
      const dist = element.distortion || 0.2;

      for (let i = 0; i < sides; i++) {
        const angle = (i * 2 * Math.PI) / sides;
        const radFactor = i % 2 === 0 ? 1 : 0.65 + dist * 0.3;
        const x = Math.cos(angle) * halfW * radFactor;
        const y = Math.sin(angle) * halfH * radFactor;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      break;
    }

    case 'freeshape': {
      // 자유면: 꼭짓점 핸들을 당길 때 가로·세로로 드라마틱하게 찌그러지고 변형되는 유기적 조형 면
      const sides = Math.max(3, Math.min(10, element.sides || 5));
      const dist = Math.max(0.15, element.distortion ?? 0.35);

      for (let i = 0; i < sides; i++) {
        const angle = (i * 2 * Math.PI) / sides - Math.PI / 2;
        const mod = 1 + dist * Math.sin(i * 3 + 1.2);
        const x = Math.cos(angle) * halfW * mod;
        const y = Math.sin(angle) * halfH * mod;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      break;
    }

    case 'blob': {
      const dist = element.distortion || 0;
      ctx.moveTo(0, -halfH * (1 + dist * 0.2));
      ctx.bezierCurveTo(halfW * (1.2 + dist * 0.3), -halfH * 0.8, halfW * 0.9, halfH * 0.9, 0, halfH);
      ctx.bezierCurveTo(-halfW * 0.8, halfH * 1.1, -halfW * (1.1 + dist * 0.3), -halfH * 0.5, 0, -halfH * (1 + dist * 0.2));
      ctx.closePath();
      break;
    }

    case 'fragment': {
      ctx.moveTo(-halfW * 0.8, -halfH);
      ctx.lineTo(halfW, -halfH * 0.2);
      ctx.lineTo(halfW * 0.6, halfH);
      ctx.lineTo(-halfW, halfH * 0.7);
      ctx.closePath();
      break;
    }

    default:
      ctx.rect(-halfW, -halfH, halfW * 2, halfH * 2);
  }

  if (fill) {
    ctx.fill();
  } else {
    ctx.stroke();
  }
}

export function drawSelectionBox(
  ctx: CanvasRenderingContext2D,
  element: ArtElement,
  canvasWidth: number,
  canvasHeight: number
) {
  const { px, py, w, h } = toCanvasCoords(element, canvasWidth, canvasHeight);
  const pad = 12;
  const strokeExtra = element.strokeWidth || 0;
  const boxW = Math.max(20, w + pad * 2);
  const boxH = Math.max(20, Math.max(h, strokeExtra) + pad * 2);

  ctx.save();
  ctx.translate(px, py);
  ctx.rotate((element.rotation * Math.PI) / 180);

  ctx.strokeStyle = '#3182CE';
  ctx.lineWidth = 1.8;
  ctx.setLineDash([5, 4]);
  ctx.strokeRect(-boxW / 2, -boxH / 2, boxW, boxH);

  ctx.setLineDash([]);
  ctx.fillStyle = '#FFFFFF';
  ctx.strokeStyle = '#2B6CB0';
  ctx.lineWidth = 2;
  const handleSize = 9;
  const corners = [
    [-boxW / 2, -boxH / 2],
    [boxW / 2, -boxH / 2],
    [boxW / 2, boxH / 2],
    [-boxW / 2, boxH / 2]
  ];
  corners.forEach(([cx, cy]) => {
    ctx.fillRect(cx - handleSize / 2, cy - handleSize / 2, handleSize, handleSize);
    ctx.strokeRect(cx - handleSize / 2, cy - handleSize / 2, handleSize, handleSize);
  });

  const stemLen = 22;
  ctx.beginPath();
  ctx.moveTo(0, -boxH / 2);
  ctx.lineTo(0, -boxH / 2 - stemLen);
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(0, -boxH / 2 - stemLen, 5.5, 0, Math.PI * 2);
  ctx.fillStyle = '#3182CE';
  ctx.fill();
  ctx.stroke();

  ctx.restore();
}

export function drawMarqueeBox(
  ctx: CanvasRenderingContext2D,
  startX: number,
  startY: number,
  currentX: number,
  currentY: number
) {
  const minX = Math.min(startX, currentX);
  const minY = Math.min(startY, currentY);
  const width = Math.abs(currentX - startX);
  const height = Math.abs(currentY - startY);

  if (width < 2 && height < 2) return;

  ctx.save();
  ctx.fillStyle = 'rgba(59, 130, 246, 0.12)';
  ctx.fillRect(minX, minY, width, height);

  ctx.strokeStyle = '#2563EB';
  ctx.lineWidth = 1.5;
  ctx.setLineDash([4, 3]);
  ctx.strokeRect(minX, minY, width, height);
  ctx.restore();
}

export interface MultiBounds {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
  cx: number;
  cy: number;
  w: number;
  h: number;
}

export function getMultiSelectionBounds(
  elements: ArtElement[],
  selectedIds: string[],
  canvasWidth: number,
  canvasHeight: number
): MultiBounds | null {
  const selected = elements.filter((el) => selectedIds.includes(el.id));
  if (selected.length <= 1) return null;

  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  for (const el of selected) {
    const { px, py, w, h } = toCanvasCoords(el, canvasWidth, canvasHeight);
    const halfW = Math.max(8, w / 2);
    const halfH = Math.max(8, h / 2);
    const maxR = Math.hypot(halfW, halfH);

    minX = Math.min(minX, px - maxR);
    maxX = Math.max(maxX, px + maxR);
    minY = Math.min(minY, py - maxR);
    maxY = Math.max(maxY, py + maxR);
  }

  const pad = 12;
  const boundedMinX = minX - pad;
  const boundedMinY = minY - pad;
  const boundedMaxX = maxX + pad;
  const boundedMaxY = maxY + pad;

  return {
    minX: boundedMinX,
    minY: boundedMinY,
    maxX: boundedMaxX,
    maxY: boundedMaxY,
    cx: (boundedMinX + boundedMaxX) / 2,
    cy: (boundedMinY + boundedMaxY) / 2,
    w: Math.max(24, boundedMaxX - boundedMinX),
    h: Math.max(24, boundedMaxY - boundedMinY)
  };
}

export function drawMultiSelectionOverlay(
  ctx: CanvasRenderingContext2D,
  elements: ArtElement[],
  selectedIds: string[],
  canvasWidth: number,
  canvasHeight: number
) {
  if (selectedIds.length <= 1) return;

  const selected = elements.filter((e) => selectedIds.includes(e.id));
  if (selected.length === 0) return;

  ctx.save();

  // 1. 각 개별 선택 요소 주위에 얇은 점선 하이라이트 박스
  ctx.strokeStyle = '#4F46E5';
  ctx.lineWidth = 1.2;
  ctx.setLineDash([4, 4]);

  for (const el of selected) {
    const { px, py, w, h } = toCanvasCoords(el, canvasWidth, canvasHeight);
    const pad = 6;
    const strokeExtra = el.strokeWidth || 0;
    const boxW = Math.max(16, w + pad * 2);
    const boxH = Math.max(16, Math.max(h, strokeExtra) + pad * 2);

    ctx.save();
    ctx.translate(px, py);
    ctx.rotate((el.rotation * Math.PI) / 180);
    ctx.fillStyle = 'rgba(79, 70, 229, 0.08)';
    ctx.fillRect(-boxW / 2, -boxH / 2, boxW, boxH);
    ctx.strokeRect(-boxW / 2, -boxH / 2, boxW, boxH);
    ctx.restore();
  }

  // 2. 다중 선택 전체를 감싸는 그룹 변형 바운딩 박스 & 4방향 조절점 & 회전 핸들
  const bounds = getMultiSelectionBounds(elements, selectedIds, canvasWidth, canvasHeight);
  if (bounds) {
    // 테두리 외곽 사각형
    ctx.setLineDash([6, 5]);
    ctx.strokeStyle = '#4338CA';
    ctx.lineWidth = 1.8;
    ctx.strokeRect(bounds.minX, bounds.minY, bounds.w, bounds.h);

    // 4개 모서리 조절 핸들
    ctx.setLineDash([]);
    ctx.fillStyle = '#FFFFFF';
    ctx.strokeStyle = '#4338CA';
    ctx.lineWidth = 2;
    const handleSize = 10;
    const corners = [
      [bounds.minX, bounds.minY],
      [bounds.maxX, bounds.minY],
      [bounds.maxX, bounds.maxY],
      [bounds.minX, bounds.maxY]
    ];
    corners.forEach(([hx, hy]) => {
      ctx.fillRect(hx - handleSize / 2, hy - handleSize / 2, handleSize, handleSize);
      ctx.strokeRect(hx - handleSize / 2, hy - handleSize / 2, handleSize, handleSize);
    });

    // 회전 핸들 (상단 스템)
    const stemLen = 22;
    ctx.beginPath();
    ctx.moveTo(bounds.cx, bounds.minY);
    ctx.lineTo(bounds.cx, bounds.minY - stemLen);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(bounds.cx, bounds.minY - stemLen, 6, 0, Math.PI * 2);
    ctx.fillStyle = '#4F46E5';
    ctx.fill();
    ctx.stroke();
  }

  ctx.restore();
}

