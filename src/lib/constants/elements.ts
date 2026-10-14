import { ElementType } from '../types';

export interface ElementTemplate {
  type: ElementType;
  subType: string;
  name: string;
  icon: string;
  description: string;
  defaultWidth: number;
  defaultHeight: number;
}

export const POINT_TEMPLATES: ElementTemplate[] = [
  {
    type: 'point',
    subType: 'single',
    name: '단일 점',
    icon: '•',
    description: '화면의 중심이나 특정 위치에 긴장감과 초점을 형성하는 하나의 점',
    defaultWidth: 6,
    defaultHeight: 6
  },
  {
    type: 'point',
    subType: 'spray',
    name: '흩뿌림 점군 (Spray)',
    icon: '∴',
    description: '은하수나 물방울처럼 자연스럽게 흩뿌려지는 점들 (각 점을 개별 클릭하여 위치·크기·색상 자유 변형)',
    defaultWidth: 6,
    defaultHeight: 6
  },
  {
    type: 'point',
    subType: 'heavy',
    name: '묵직한 점 (Heavy)',
    icon: '●',
    description: '화면의 무게 중심을 잡아주는 크고 짙은 점',
    defaultWidth: 14,
    defaultHeight: 14
  },
  {
    type: 'point',
    subType: 'diamond',
    name: '다이아몬드 점',
    icon: '◆',
    description: '빛의 반짝임이나 결정체를 연상시키는 각진 점',
    defaultWidth: 8,
    defaultHeight: 8
  }
];

export const LINE_TEMPLATES: ElementTemplate[] = [
  {
    type: 'line',
    subType: 'straight',
    name: '직선 (Straight)',
    icon: '─',
    description: '명확하고 이성적이며 결단력 있는 방향성을 나타내는 직선',
    defaultWidth: 30,
    defaultHeight: 2
  },
  {
    type: 'line',
    subType: 'smooth_curve',
    name: '유려한 곡선 (Curve)',
    icon: '～',
    description: '자연스럽고 우아하며 감성적인 흐름을 만드는 유연한 곡선 (촘촘함 조절 가능)',
    defaultWidth: 35,
    defaultHeight: 16
  },
  {
    type: 'line',
    subType: 'wave',
    name: '율동 물결선 (Wave)',
    icon: '〰',
    description: '음악적인 박자와 파동을 담는 선 (파동 수와 촘촘함 실시간 조절 가능)',
    defaultWidth: 40,
    defaultHeight: 12
  },
  {
    type: 'line',
    subType: 'zigzag',
    name: '번개 지그재그',
    icon: '⚡',
    description: '충격, 긴장, 분노와 번뜩이는 에너지를 표출하는 날카로운 꺾임선 (각 주기 조절)',
    defaultWidth: 35,
    defaultHeight: 18
  },
  {
    type: 'line',
    subType: 'spiral',
    name: '소용돌이 (Spiral)',
    icon: '🌀',
    description: '내면으로 수렴하거나 외부로 확장되는 회오리형 선 (회전 밀도 조절)',
    defaultWidth: 26,
    defaultHeight: 26
  },
  {
    type: 'line',
    subType: 'dashed',
    name: '점선 (Dashed)',
    icon: '┄',
    description: '은은한 여운, 거리감, 아련한 그리움을 전하는 끊어진 선 (마디 개수와 굵기 실시간 조절 가능)',
    defaultWidth: 32,
    defaultHeight: 2
  },
  {
    type: 'line',
    subType: 'motion',
    name: '속도선 (Motion)',
    icon: '≡',
    description: '바람이나 빠른 속도감을 연출하는 평행한 선 무리',
    defaultWidth: 36,
    defaultHeight: 10
  }
];

export const SHAPE_TEMPLATES: ElementTemplate[] = [
  {
    type: 'shape',
    subType: 'circle',
    name: '원 (Circle)',
    icon: '◯',
    description: '완전함, 포용, 우주와 영속성을 상징하는 순수 원형 면',
    defaultWidth: 22,
    defaultHeight: 22
  },
  {
    type: 'shape',
    subType: 'ellipse',
    name: '타원 (Ellipse)',
    icon: '⬯',
    description: '기울기와 방향성을 가지며 운동감을 품은 타원',
    defaultWidth: 28,
    defaultHeight: 16
  },
  {
    type: 'shape',
    subType: 'triangle',
    name: '삼각형 (Triangle)',
    icon: '△',
    description: '상승, 진취성, 또는 불안정한 긴장감을 표현하는 각형',
    defaultWidth: 22,
    defaultHeight: 22
  },
  {
    type: 'shape',
    subType: 'rect',
    name: '사각형 (Rect)',
    icon: '▢',
    description: '안정감, 질서, 건축적 균형미를 나타내는 기하학적 사각 면',
    defaultWidth: 24,
    defaultHeight: 24
  },
  {
    type: 'shape',
    subType: 'polygon',
    name: '변형 다각형 (Polygon)',
    icon: '⬡',
    description: '3~10각 수 및 비대칭 왜곡을 자유롭게 변형할 수 있는 추상 다면체',
    defaultWidth: 24,
    defaultHeight: 24
  },
  {
    type: 'shape',
    subType: 'crystal',
    name: '추상 결정체 (Crystal)',
    icon: '⬩',
    description: '기하학적 면분할과 각진 모서리를 가진 현대 미술식 입체 조형 면',
    defaultWidth: 22,
    defaultHeight: 22
  },
  {
    type: 'shape',
    subType: 'blob',
    name: '유기적 블롭 (Blob)',
    icon: '🫧',
    description: '살아있는 생명체나 세포처럼 자유롭게 호흡하는 비정형 면',
    defaultWidth: 28,
    defaultHeight: 24
  },
  {
    type: 'shape',
    subType: 'fragment',
    name: '추상 파편 (Fragment)',
    icon: '▲',
    description: '형태가 해체되거나 튀어나온 듯한 입체파풍 파편형 조각',
    defaultWidth: 20,
    defaultHeight: 24
  },
  {
    type: 'shape',
    subType: 'freeshape',
    name: '자유면 (Free Shape)',
    icon: '⬟',
    description: '꼭짓점 핸들을 당겨 가로·세로로 자유롭게 찌그러뜨리고 변형할 수 있는 유기적 조형 면',
    defaultWidth: 26,
    defaultHeight: 26
  }
];
