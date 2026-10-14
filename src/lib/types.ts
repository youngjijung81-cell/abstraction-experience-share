export type StudioMode = 'auto' | 'guided' | 'freeform';

export type ElementType = 'point' | 'line' | 'shape';

export type PointSubType = 'single' | 'cluster' | 'spray' | 'heavy' | 'diamond';
export type LineSubType = 'straight' | 'smooth_curve' | 'wave' | 'zigzag' | 'spiral' | 'dashed' | 'motion' | 'freehand';
export type ShapeSubType = 'circle' | 'ellipse' | 'triangle' | 'rect' | 'polygon' | 'blob' | 'fragment' | 'crystal' | 'freeshape';

export type BrushStyle = 'pen' | 'brush' | 'marker' | 'glow';

export interface ArtElement {
  id: string;
  type: ElementType;
  subType: string;
  x: number; // percentage (-50 to 50 relative to canvas center)
  y: number; // percentage (-50 to 50)
  width: number; // percentage relative to canvas dimension
  height: number;
  rotation: number; // 0 to 360 degrees
  color: string;
  opacity: number; // 0.1 to 1.0
  strokeWidth?: number; // 선 굵기 (1 ~ 35)
  fill?: boolean;
  zIndex: number;
  brushStyle?: BrushStyle;

  // 선(Line) 세부 조형 파라미터
  frequency?: number; // 곡선/물결 촘촘함 및 주기 (1 ~ 16)
  amplitude?: number; // 곡선 굴곡 진폭 (0.2 ~ 2.5)

  // 면/다각형(Shape) 세부 조형 파라미터
  sides?: number; // 다각형 꼭짓점 수 (3 ~ 10)
  distortion?: number; // 비대칭 왜곡/찌그러짐 비율 (0 ~ 1)

  // 자유 드로잉 획 점들
  points?: { x: number; y: number }[];
}

export type EmotionKey =
  | 'joy'
  | 'ecstasy'
  | 'flutter'
  | 'passion'
  | 'hope'
  | 'serenity'
  | 'rest'
  | 'calm'
  | 'cozy'
  | 'sorrow'
  | 'void'
  | 'solitude'
  | 'longing'
  | 'rage'
  | 'anxiety'
  | 'chaos';

export type PrincipleKey =
  | 'balance_sym'
  | 'balance_asym'
  | 'rhythm'
  | 'emphasis'
  | 'contrast'
  | 'unity'
  | 'variety'
  | 'movement';

export interface EmotionVisualGuide {
  recommendedElements: {
    point: string;
    line: string;
    shape: string;
  };
  recommendedColorsDesc: string;
  recommendedPrinciples: {
    primary: PrincipleKey;
    secondary: PrincipleKey;
    reason: string;
  };
  artConceptNote: string;
}

export interface EmotionInfo {
  key: EmotionKey;
  koreanName: string;
  englishName: string;
  emoji: string;
  category: '활기/긍정' | '평온/안정' | '슬픔/내면' | '긴장/격정';
  colorPalette: string[];
  description: string;
  guide: EmotionVisualGuide;
}

export interface PrincipleInfo {
  key: PrincipleKey;
  koreanName: string;
  englishName: string;
  icon: string;
  description: string;
}

export interface ArtworkRecord {
  id: string;
  student_id: string;
  student_name: string;
  title: string;
  emotion: string;
  mode: string;
  principles: string[];
  elements_summary?: string;
  description?: string;
  image_data?: string;
  created_at: string;
}
