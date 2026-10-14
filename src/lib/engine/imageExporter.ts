import { ArtElement } from '../types';
import { drawBackground, drawElement } from './canvasRenderer';

export interface ExportMetadata {
  title: string;
  studentId: string;
  studentName: string;
  emotionName: string;
  emotionEmoji: string;
  principles: string[];
  modeName: string;
}

export function exportArtworkToDataUrl(
  elements: ArtElement[],
  metadata: ExportMetadata,
  outputSize: number = 1080,
  bgColor: string = '#FCFCFB'
): string {
  const canvas = document.createElement('canvas');
  canvas.width = outputSize;
  canvas.height = outputSize;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  // 1. 사용자 지정 캔버스 배경색 적용
  drawBackground(ctx, outputSize, outputSize, bgColor);

  // 2. 작품 영역 렌더링 (상단 86% 영역에 배치)
  const artAreaH = outputSize * 0.86;
  ctx.save();
  // 정렬된 zIndex 순으로 그리기
  const sorted = [...elements].sort((a, b) => (a.zIndex || 0) - (b.zIndex || 0));
  for (const el of sorted) {
    drawElement(ctx, el, outputSize, artAreaH);
  }
  ctx.restore();

  // 3. 하단 세련된 미술관 라벨 플레이트 (Exhibition Plaque)
  const plaqueH = outputSize * 0.14;
  const plaqueY = outputSize - plaqueH;

  // 구분선
  ctx.save();
  ctx.strokeStyle = '#E2E8F0';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(outputSize * 0.06, plaqueY);
  ctx.lineTo(outputSize * 0.94, plaqueY);
  ctx.stroke();

  // 텍스트 스타일
  const padX = outputSize * 0.06;
  const contentY = plaqueY + plaqueH * 0.42;

  // 작품 제목
  ctx.fillStyle = '#1A202C';
  ctx.font = 'bold 32px "Pretendard", -apple-system, sans-serif';
  ctx.fillText(metadata.title || '무제 (Untitled)', padX, contentY);

  // 학번 / 작가명
  ctx.fillStyle = '#4A5568';
  ctx.font = '500 22px "Pretendard", -apple-system, sans-serif';
  const authorText = metadata.studentName
    ? `${metadata.studentId ? `[${metadata.studentId}] ` : ''}${metadata.studentName} 작가`
    : '고등학교 미술 아틀리에';
  ctx.fillText(authorText, padX, contentY + 34);

  // 우측: 감정 및 조형 원리 태그
  ctx.textAlign = 'right';
  ctx.fillStyle = '#2B6CB0';
  ctx.font = 'bold 22px "Pretendard", -apple-system, sans-serif';
  const emotionText = `${metadata.emotionEmoji} 감정: ${metadata.emotionName || '자유 추상'}`;
  ctx.fillText(emotionText, outputSize - padX, contentY);

  ctx.fillStyle = '#718096';
  ctx.font = '500 18px "Pretendard", -apple-system, sans-serif';
  const principlesText = metadata.principles.length > 0
    ? `조형원리: ${metadata.principles.join(' · ')}`
    : `모드: ${metadata.modeName}`;
  ctx.fillText(principlesText, outputSize - padX, contentY + 32);

  ctx.restore();

  return canvas.toDataURL('image/png');
}

export function downloadArtworkPNG(elements: ArtElement[], metadata: ExportMetadata, bgColor?: string) {
  const dataUrl = exportArtworkToDataUrl(elements, metadata, 1080, bgColor);
  if (!dataUrl) return;

  const a = document.createElement('a');
  a.href = dataUrl;
  const cleanTitle = (metadata.title || '추상화').replace(/[^a-zA-Z0-9가-힣_-]/g, '_');
  a.download = `${cleanTitle}_${metadata.studentName || '작품'}.png`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}
