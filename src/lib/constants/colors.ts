export interface ArtColor {
  hex: string;
  name: string;
  category: 'primary' | 'vivid' | 'pastel' | 'earth' | 'neutral';
}

export const ART_COLORS: ArtColor[] = [
  // 1. 선명한 삼원색 및 기본색
  { hex: '#E53E3E', name: '다홍 (Crimson Red)', category: 'vivid' },
  { hex: '#DD6B20', name: '주황 (Vivid Orange)', category: 'vivid' },
  { hex: '#D69E2E', name: '황금귤 (Golden Tangerine)', category: 'vivid' },
  { hex: '#ECC94B', name: '레몬노랑 (Bright Yellow)', category: 'vivid' },
  { hex: '#48BB78', name: '연두 (Yellow Green)', category: 'vivid' },
  { hex: '#38A169', name: '초록 (Forest Green)', category: 'vivid' },
  { hex: '#319795', name: '청록 (Teal Green)', category: 'vivid' },
  { hex: '#3182CE', name: '코발트블루 (Cobalt Blue)', category: 'vivid' },
  { hex: '#2B6CB0', name: '군청 (Ultramarine)', category: 'vivid' },
  { hex: '#1A365D', name: '남색 (Midnight Indigo)', category: 'vivid' },
  { hex: '#805AD5', name: '바이올렛 (Deep Violet)', category: 'vivid' },
  { hex: '#D53F8C', name: '자주 (Magenta)', category: 'vivid' },
  { hex: '#ED64A6', name: '진분홍 (Rose Pink)', category: 'vivid' },

  // 2. 온화/파스텔/흙(대지) 톤
  { hex: '#FBD38D', name: '살구 (Apricot Peach)', category: 'pastel' },
  { hex: '#B2F5EA', name: '민트하늘 (Soft Mint)', category: 'pastel' },
  { hex: '#E9D8FD', name: '연보라 (Soft Lavender)', category: 'pastel' },
  { hex: '#D69E2E', name: '황토 (Raw Ochre)', category: 'earth' },
  { hex: '#8C5523', name: '고동 (Burnt Umber)', category: 'earth' },
  { hex: '#E2E8F0', name: '베이지백 (Warm Cream)', category: 'earth' },

  // 3. 무채색 (대비 및 모노톤 추상)
  { hex: '#FFFFFF', name: '순백 (Pure White)', category: 'neutral' },
  { hex: '#A0AEC0', name: '은회색 (Silver Gray)', category: 'neutral' },
  { hex: '#4A5568', name: '먹회색 (Charcoal Gray)', category: 'neutral' },
  { hex: '#1A202C', name: '칠흑 (Jet Black)', category: 'neutral' }
];

export const EMOTION_PALETTES: Record<string, string[]> = {
  joy: ['#ECC94B', '#DD6B20', '#ED64A6', '#48BB78', '#FFFFFF'],
  ecstasy: ['#E53E3E', '#ECC94B', '#D53F8C', '#3182CE', '#FFFFFF'],
  flutter: ['#ED64A6', '#FBD38D', '#E9D8FD', '#ECC94B', '#FFFFFF'],
  passion: ['#E53E3E', '#DD6B20', '#1A202C', '#D53F8C', '#FFFFFF'],
  hope: ['#ECC94B', '#48BB78', '#319795', '#B2F5EA', '#FFFFFF'],
  serenity: ['#319795', '#3182CE', '#B2F5EA', '#E2E8F0', '#FFFFFF'],
  rest: ['#48BB78', '#319795', '#E2E8F0', '#FBD38D', '#FFFFFF'],
  calm: ['#3182CE', '#2B6CB0', '#E2E8F0', '#A0AEC0', '#FFFFFF'],
  cozy: ['#FBD38D', '#DD6B20', '#8C5523', '#E2E8F0', '#FFFFFF'],
  sorrow: ['#2B6CB0', '#1A365D', '#4A5568', '#A0AEC0', '#1A202C'],
  void: ['#1A202C', '#4A5568', '#A0AEC0', '#E2E8F0', '#FFFFFF'],
  solitude: ['#1A365D', '#4A5568', '#805AD5', '#A0AEC0', '#1A202C'],
  longing: ['#805AD5', '#D53F8C', '#2B6CB0', '#FBD38D', '#E2E8F0'],
  rage: ['#E53E3E', '#1A202C', '#DD6B20', '#D53F8C', '#4A5568'],
  anxiety: ['#1A202C', '#D69E2E', '#805AD5', '#4A5568', '#E53E3E'],
  chaos: ['#E53E3E', '#805AD5', '#ECC94B', '#1A202C', '#3182CE']
};
