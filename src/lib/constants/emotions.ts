import { EmotionInfo, PrincipleInfo } from '../types';
import { EMOTION_PALETTES } from './colors';

export const EMOTIONS: EmotionInfo[] = [
  // 1. 활기 / 긍정
  {
    key: 'joy',
    koreanName: '기쁨',
    englishName: 'Joy',
    emoji: '✨',
    category: '활기/긍정',
    colorPalette: EMOTION_PALETTES.joy,
    description: '밝고 경쾌한 리듬, 위로 솟아오르는 곡선과 생기 넘치는 점들의 군집',
    guide: {
      recommendedElements: {
        point: '점 군집 (Cluster) - 생기 있게 튀어오르는 작은 점들의 무리',
        line: '부드러운 곡선 & 물결선 (Wave) - 경쾌하게 상승하는 생동감',
        shape: '원 (Circle) & 변형 다각형 (Polygon) - 밝고 완전하게 확장하는 순수 조형 면'
      },
      recommendedColorsDesc: '고채도의 따뜻한 레몬노랑(#ECC94B), 생동하는 주황(#DD6B20), 화사한 진분홍(#ED64A6)',
      recommendedPrinciples: {
        primary: 'rhythm',
        secondary: 'variety',
        reason: '리듬(율동)으로 음악적인 경쾌함을 부여하고, 다양한 크기와 위치의 변화(Variety)로 활기를 극대화합니다.'
      },
      artConceptNote: '칸딘스키는 밝은 노랑과 유연한 곡선이 트럼펫의 높은 음색처럼 마음속 순수한 기쁨을 울린다고 보았습니다.'
    }
  },
  {
    key: 'ecstasy',
    koreanName: '환희',
    englishName: 'Ecstasy',
    emoji: '🌟',
    category: '활기/긍정',
    colorPalette: EMOTION_PALETTES.ecstasy,
    description: '중심에서 사방으로 뻗어 나가는 강렬한 방사형 빛과 폭발적인 색채',
    guide: {
      recommendedElements: {
        point: '흩뿌림 (Spray) - 빛의 입자가 사방으로 확산되는 입체적 점들',
        line: '속도선 (Motion) - 중심에서 외곽으로 발산하는 강한 방향선',
        shape: '추상 결정체 (Crystal) & 불꽃 파편 (Fragment) - 에너지가 각진 면으로 분할되는 형태'
      },
      recommendedColorsDesc: '극적인 대비를 이루는 다홍(#E53E3E), 레몬노랑(#ECC94B), 코발트블루(#3182CE)',
      recommendedPrinciples: {
        primary: 'emphasis',
        secondary: 'contrast',
        reason: '화면 중심을 강하게 강조(Emphasis)하고, 보색 대비(Contrast)를 통해 폭발하는 환희의 절정을 표현합니다.'
      },
      artConceptNote: '미래주의 화가들은 빛과 에너지의 방사선 구조를 통해 감정의 환희와 감각의 해방을 시각화했습니다.'
    }
  },
  {
    key: 'flutter',
    koreanName: '설렘',
    englishName: 'Flutter',
    emoji: '🌸',
    category: '활기/긍정',
    colorPalette: EMOTION_PALETTES.flutter,
    description: '꽃잎처럼 흩날리는 부드러운 유기적 면과 따뜻하고 화사한 파스텔 톤',
    guide: {
      recommendedElements: {
        point: '흩뿌림 (Spray) - 바람에 흩날리는 꽃가루 같은 은은한 점',
        line: '부드러운 곡선 (Curve) - 살랑이는 바람의 궤적',
        shape: '유기적 블롭 (Blob) - 꽃잎과 구름처럼 정형화되지 않은 부드러운 면'
      },
      recommendedColorsDesc: '로맨틱하고 부드러운 진분홍(#ED64A6), 살구(#FBD38D), 연보라(#E9D8FD)',
      recommendedPrinciples: {
        primary: 'rhythm',
        secondary: 'harmony' as any,
        reason: '파동형 리듬(Rhythm)으로 두근거리는 심장박동을 표현하고, 파스텔 색조의 조화(Harmony)를 형성합니다.'
      },
      artConceptNote: '샤갈의 회화처럼 경계가 흐릿한 유기적 색면은 첫사랑의 아지랑이 같은 설렘을 전달합니다.'
    }
  },
  {
    key: 'passion',
    koreanName: '열정',
    englishName: 'Passion',
    emoji: '🔥',
    category: '활기/긍정',
    colorPalette: EMOTION_PALETTES.passion,
    description: '불꽃처럼 치솟는 날카로운 삼각형과 강렬한 원색의 역동적인 조화',
    guide: {
      recommendedElements: {
        point: '묵직한 점 (Heavy) - 에너지가 응축된 짙은 핵',
        line: '직선 (Straight) & 지그재그 (Zigzag) - 단호하고 저돌적인 상향 궤적',
        shape: '삼각형 (Triangle) & 파편 (Fragment) - 위를 향해 솟구치는 예리한 형태'
      },
      recommendedColorsDesc: '타오르는 다홍(#E53E3E), 주황(#DD6B20), 그리고 배경을 제압하는 칠흑(#1A202C)',
      recommendedPrinciples: {
        primary: 'movement',
        secondary: 'contrast',
        reason: '강한 대각선 상향 동세(Movement)와 적흑의 강렬한 명도 대비(Contrast)로 타협 없는 열정을 뿜어냅니다.'
      },
      artConceptNote: '야수파(포비즘)는 사물의 고유색을 깨고 원색의 충돌만으로 순수한 내면의 격정을 분출했습니다.'
    }
  },
  {
    key: 'hope',
    koreanName: '희망',
    englishName: 'Hope',
    emoji: '🌱',
    category: '활기/긍정',
    colorPalette: EMOTION_PALETTES.hope,
    description: '어둠을 뚫고 솟아나는 새싹처럼 상향하는 직선과 맑은 연두·청록',
    guide: {
      recommendedElements: {
        point: '점 군집 (Cluster) - 생명이 싹트는 생명력의 응집',
        line: '속도선 (Motion) - 위를 향해 전진하는 상승선',
        shape: '타원 (Ellipse) & 원 (Circle) - 움트는 씨앗과 빛의 상징'
      },
      recommendedColorsDesc: '생명력이 움트는 연두(#48BB78), 맑은 레몬노랑(#ECC94B), 투명한 민트(#B2F5EA)',
      recommendedPrinciples: {
        primary: 'movement',
        secondary: 'emphasis',
        reason: '하단에서 상단으로 향하는 상승 동세(Movement)로 미래를 향해 뻗어가는 희망의 시선을 이끕니다.'
      },
      artConceptNote: '클레는 선 하나가 산책을 떠나듯 자라나는 조형적 성장을 통해 자연의 재생과 희망을 그렸습니다.'
    }
  },

  // 2. 평온 / 안정
  {
    key: 'serenity',
    koreanName: '평온',
    englishName: 'Serenity',
    emoji: '🍃',
    category: '평온/안정',
    colorPalette: EMOTION_PALETTES.serenity,
    description: '잔잔한 수면처럼 완만하게 흐르는 수평선과 마음을 가라앉히는 청록',
    guide: {
      recommendedElements: {
        point: '단일 점 (Single) - 고요한 호수에 떨어진 작은 물방울',
        line: '직선 (Straight, 수평) & 완만한 물결 - 긴장감을 완화하는 가로선',
        shape: '타원 (Ellipse) - 눕혀진 완만한 수평 곡면'
      },
      recommendedColorsDesc: '마음을 차분히 가라앉히는 청록(#319795), 코발트블루(#3182CE), 부드러운 민트(#B2F5EA)',
      recommendedPrinciples: {
        primary: 'balance_sym',
        secondary: 'unity',
        reason: '좌우 대칭 균형(Balance)과 색조의 통일(Unity)로 시각적 마찰을 없애고 깊은 안정감을 조성합니다.'
      },
      artConceptNote: '몬드리안의 수평선은 대지이자 쉼이며, 수직선의 긴장을 보듬는 영원한 평온의 상징입니다.'
    }
  },
  {
    key: 'rest',
    koreanName: '안식',
    englishName: 'Rest',
    emoji: '☁️',
    category: '평온/안정',
    colorPalette: EMOTION_PALETTES.rest,
    description: '구름처럼 둥글고 포근하게 겹쳐지는 유기적 면과 편안한 크림·녹색',
    guide: {
      recommendedElements: {
        point: '흩뿌림 (Spray) - 부드럽게 감싸는 미세한 온기',
        line: '부드러운 곡선 (Curve) - 안기는 듯한 둥근 호',
        shape: '유기적 블롭 (Blob) - 푹신한 구름처럼 겹쳐지는 편안한 면'
      },
      recommendedColorsDesc: '편안한 초록(#48BB78), 베이지백(#E2E8F0), 따뜻한 살구(#FBD38D)',
      recommendedPrinciples: {
        primary: 'unity',
        secondary: 'balance_asym',
        reason: '부드러운 색면들의 통일감(Unity)을 주되, 자연스러운 비대칭(Balance)으로 편안한 여백을 둡니다.'
      },
      artConceptNote: '모란디의 정물화처럼 채도를 낮춘 온화한 색채의 조화는 번잡한 일상을 멈추는 안식을 줍니다.'
    }
  },
  {
    key: 'calm',
    koreanName: '고요',
    englishName: 'Calm',
    emoji: '🌊',
    category: '평온/안정',
    colorPalette: EMOTION_PALETTES.calm,
    description: '깊은 바다 속 침묵처럼 무게감 있게 정돈된 수평 구도와 딥 블루',
    guide: {
      recommendedElements: {
        point: '묵직한 점 (Heavy) - 중심을 가라앉히는 차분한 무게추',
        line: '직선 (Straight) - 흔들림 없는 완벽한 수평선',
        shape: '사각형 (Rect) - 정적이고 묵직하게 놓인 직사각형 면'
      },
      recommendedColorsDesc: '심해의 깊이를 품은 군청(#2B6CB0), 코발트블루(#3182CE), 은회색(#A0AEC0)',
      recommendedPrinciples: {
        primary: 'balance_sym',
        secondary: 'unity',
        reason: '대칭 균형(Balance)과 단순화된 형태의 통일(Unity)로 잡음을 지우고 침묵의 공간을 연출합니다.'
      },
      artConceptNote: '마크 로스코의 색면 회화(Color Field)는 거대한 블루 면 속에 관람객을 침잠케 하여 명상을 이끕니다.'
    }
  },
  {
    key: 'cozy',
    koreanName: '포근함',
    englishName: 'Cozy',
    emoji: '☕',
    category: '평온/안정',
    colorPalette: EMOTION_PALETTES.cozy,
    description: '따뜻한 모닥불과 흙의 온기처럼 감싸 안는 둥근 원과 부드러운 갈색·주황',
    guide: {
      recommendedElements: {
        point: '점 군집 (Cluster) - 도란도란 모여 앉은 따스함',
        line: '부드러운 곡선 (Curve) - 품에 안아주는 둥근 선',
        shape: '원 (Circle) & 유기적 블롭 (Blob) - 각진 구석 없는 둥글둥글한 면'
      },
      recommendedColorsDesc: '따스한 대지의 살구(#FBD38D), 고동(#8C5523), 온화한 크림베이지(#E2E8F0)',
      recommendedPrinciples: {
        primary: 'unity',
        secondary: 'rhythm',
        reason: '유사한 둥근 형태들의 통일감(Unity)과 잔잔한 리듬으로 따뜻한 품속 같은 편안함을 만듭니다.'
      },
      artConceptNote: '아르누보와 공예 운동은 자연의 둥근 곡선과 흙의 색채를 통해 현대인의 차가운 감성을 감싸 안았습니다.'
    }
  },

  // 3. 슬픔 / 내면
  {
    key: 'sorrow',
    koreanName: '슬픔',
    englishName: 'Sorrow',
    emoji: '💧',
    category: '슬픔/내면',
    colorPalette: EMOTION_PALETTES.sorrow,
    description: '눈물처럼 아래로 길게 떨어지는 수직선과 묵직하게 가라앉는 푸른빛',
    guide: {
      recommendedElements: {
        point: '단일 점 (Single) - 뚝뚝 떨어지는 무거운 물방울',
        line: '수직 직선 & 점선 (Dashed) - 아래로 길게 드리워진 눈물과 빗줄기',
        shape: '물방울형 블롭 (Blob) - 중력에 이끌려 처진 유기적 형태'
      },
      recommendedColorsDesc: '가라앉는 남색(#1A365D), 먹회색(#4A5568), 차가운 군청(#2B6CB0)',
      recommendedPrinciples: {
        primary: 'movement',
        secondary: 'contrast',
        reason: '하향하는 수직 동세(Movement)와 어두운 저명도 명암 대비(Contrast)로 침잠하는 슬픔을 담아냅니다.'
      },
      artConceptNote: '피카소의 청색 시대(Blue Period)는 차가운 푸른빛과 힘없이 늘어진 선으로 인간의 깊은 비애를 표현했습니다.'
    }
  },
  {
    key: 'void',
    koreanName: '공허',
    englishName: 'Void',
    emoji: '🌫️',
    category: '슬픔/내면',
    colorPalette: EMOTION_PALETTES.void,
    description: '넓은 여백 속 외롭게 흩어진 몇 개의 희미한 점과 모노톤의 대비',
    guide: {
      recommendedElements: {
        point: '단일 점 (Single) - 광활한 빈 공간 속 미세한 존재감',
        line: '점선 (Dashed) - 힘을 잃고 끊어질 듯 이어지는 얇은 선',
        shape: '외곽선만 있는 원 (Unfilled Circle) - 속이 텅 비어 있는 공허한 테두리'
      },
      recommendedColorsDesc: '무채색의 먹회색(#4A5568), 은회색(#A0AEC0), 차가운 순백(#FFFFFF)',
      recommendedPrinciples: {
        primary: 'contrast',
        secondary: 'balance_asym',
        reason: '극단적인 여백과 극소 요소의 대비(Contrast), 한쪽으로 기운 비대칭(Balance)으로 허탈함을 전합니다.'
      },
      artConceptNote: '동양화의 여백의 미(餘白의 美)와 미니멀리즘은 불필요한 것을 모두 비워냄으로써 침묵의 무게를 드러냅니다.'
    }
  },
  {
    key: 'solitude',
    koreanName: '외로움',
    englishName: 'Solitude',
    emoji: '🌌',
    category: '슬픔/내면',
    colorPalette: EMOTION_PALETTES.solitude,
    description: '광활한 어둠 속 홀로 놓인 작고 짙은 하나의 원과 쓸쓸한 보랏빛',
    guide: {
      recommendedElements: {
        point: '묵직한 점 (Heavy) - 무리에서 홀로 떨어진 고독한 섬',
        line: '얇은 직선 (Straight) - 소통이 단절된 냉정한 경계선',
        shape: '원 (Circle) - 자기 자신만의 세계에 갇힌 닫힌 면'
      },
      recommendedColorsDesc: '쓸쓸한 딥 바이올렛(#805AD5), 칠흑(#1A202C), 먹회색(#4A5568)',
      recommendedPrinciples: {
        primary: 'emphasis',
        secondary: 'contrast',
        reason: '텅 빈 화면의 한구석에 작은 단일 요소를 강조(Emphasis)하여 군중 속의 고립을 조형화합니다.'
      },
      artConceptNote: '자코메티의 길쭉한 조각상처럼, 거대한 공간 속에 홀로 서 있는 형상은 인간 실존의 고독을 상징합니다.'
    }
  },
  {
    key: 'longing',
    koreanName: '그리움',
    englishName: 'Longing',
    emoji: '🌙',
    category: '슬픔/내면',
    colorPalette: EMOTION_PALETTES.longing,
    description: '먼 곳을 향해 아련하게 이어지다 끊어지는 점선과 몽환적인 자주·보라',
    guide: {
      recommendedElements: {
        point: '흩뿌림 (Spray) - 아스라이 멀어져가는 기억의 잔상',
        line: '점선 (Dashed) - 닿지 못하고 끊어지며 이어지는 시선의 실타래',
        shape: '추상 결정체 (Crystal) & 유기적 블롭 - 밤하늘의 결정처럼 아련히 떠 있는 면'
      },
      recommendedColorsDesc: '몽환적인 바이올렛(#805AD5), 자주(#D53F8C), 아련한 살구빛(#FBD38D)',
      recommendedPrinciples: {
        primary: 'rhythm',
        secondary: 'movement',
        reason: '서서히 흐려지는 점선과 점진적 크기 변화(Rhythm)로 시공간을 건너는 아련한 동세(Movement)를 만듭니다.'
      },
      artConceptNote: '독일 낭만주의 회화에서 저녁 노을과 지평선 너머를 바라보는 시선은 가닿을 수 없는 대상에 대한 그리움입니다.'
    }
  },

  // 4. 긴장 / 격정
  {
    key: 'rage',
    koreanName: '분노',
    englishName: 'Rage',
    emoji: '⚡',
    category: '긴장/격정',
    colorPalette: EMOTION_PALETTES.rage,
    description: '날카롭게 부딪치는 지그재그 선과 격렬하게 충돌하는 붉은색과 검정',
    guide: {
      recommendedElements: {
        point: '묵직한 점 (Heavy) - 충돌로 찍힌 강한 타격점',
        line: '지그재그선 (Zigzag) - 번개처럼 폭발하는 예리하고 공격적인 꺾임선',
        shape: '불꽃 파편 (Fragment) & 삼각형 - 날카로운 파편과 가시 같은 다각형'
      },
      recommendedColorsDesc: '타오르는 핏빛 다홍(#E53E3E), 충돌하는 주황(#DD6B20), 억누르는 칠흑(#1A202C)',
      recommendedPrinciples: {
        primary: 'contrast',
        secondary: 'variety',
        reason: '강렬한 색과 선의 극단적인 충돌(Contrast), 거칠고 불규칙한 각도의 변화(Variety)로 분노를 폭발시킵니다.'
      },
      artConceptNote: '피카소의 게르니카는 예리한 파편과 찢어지는 지그재그 선의 충돌로 전쟁의 비극과 인간의 격노를 절규했습니다.'
    }
  },
  {
    key: 'anxiety',
    koreanName: '불안',
    englishName: 'Anxiety',
    emoji: '🌀',
    category: '긴장/격정',
    colorPalette: EMOTION_PALETTES.anxiety,
    description: '불규칙하게 떨리는 파선, 예측할 수 없이 뒤엉킨 선들과 차가운 긴장감',
    guide: {
      recommendedElements: {
        point: '점 군집 (Cluster) - 불안하게 흔들리는 미세한 진동',
        line: '소용돌이 (Spiral) & 지그재그 - 빠져나올 수 없이 휘감기는 복잡한 선',
        shape: '비정형 다각형 (Polygon) - 균형이 깨진 불완전한 기하 형태'
      },
      recommendedColorsDesc: '불안정한 형광 레몬노랑(#D69E2E), 음산한 바이올렛(#805AD5), 차가운 칠흑(#1A202C)',
      recommendedPrinciples: {
        primary: 'balance_asym',
        secondary: 'movement',
        reason: '무게중심이 위태롭게 쏠린 비대칭(Balance)과 뒤엉킨 회오리 동세(Movement)로 심리적 불안을 자아냅니다.'
      },
      artConceptNote: '뭉크의 <절규>에서 물결치는 하늘과 소용돌이치는 곡선은 내면의 불안과 공포가 자연으로 번져나간 표현입니다.'
    }
  },
  {
    key: 'chaos',
    koreanName: '혼란',
    englishName: 'Chaos',
    emoji: '💥',
    category: '긴장/격정',
    colorPalette: EMOTION_PALETTES.chaos,
    description: '서로 다른 방향으로 엇갈리는 수많은 파편들과 통제되지 않은 강렬한 원색들',
    guide: {
      recommendedElements: {
        point: '흩뿌림 (Spray) - 사방으로 튀어 오르는 불규칙한 파편 점',
        line: '지그재그 & 속도선 - 서로 다른 방향으로 어긋나며 교차하는 선들',
        shape: '불꽃 파편 (Fragment) & 다각형 - 규칙 없이 흩뿌려진 복합 형태'
      },
      recommendedColorsDesc: '시각적 충돌을 일으키는 다홍(#E53E3E), 보라(#805AD5), 레몬노랑(#ECC94B), 칠흑(#1A202C)',
      recommendedPrinciples: {
        primary: 'variety',
        secondary: 'contrast',
        reason: '극단적인 다양성(Variety)과 무질서한 대비(Contrast)를 통해 질서가 붕괴된 혼돈의 에너지를 시각화합니다.'
      },
      artConceptNote: '잭슨 폴록의 액션 페인팅은 통제되지 않은 선과 색의 뒤엉킴을 통해 순수한 혼돈과 무의식의 역동을 담아냈습니다.'
    }
  }
];

export const PRINCIPLES: PrincipleInfo[] = [
  {
    key: 'balance_sym',
    koreanName: '대칭 균형',
    englishName: 'Symmetrical Balance',
    icon: '⚖️',
    description: '중앙 축을 기준으로 좌우/상하 대칭을 이루어 정적인 안정감을 부여합니다.'
  },
  {
    key: 'balance_asym',
    koreanName: '비대칭 균형',
    englishName: 'Asymmetrical Balance',
    icon: '🎯',
    description: '형태와 색채의 시각적 무게를 조율하여 역동적이면서도 균형 잡힌 구도를 만듭니다.'
  },
  {
    key: 'rhythm',
    koreanName: '리듬 / 율동',
    englishName: 'Rhythm & Movement',
    icon: '🌊',
    description: '유사한 형태를 일정한 파동이나 점이(Gradation) 규칙으로 배열하여 리듬감을 형성합니다.'
  },
  {
    key: 'emphasis',
    koreanName: '강조 / 초점',
    englishName: 'Emphasis & Focal Point',
    icon: '🔍',
    description: '황금비 위치의 핵심 요소를 크게 확대하고 대비를 주어 시선을 집중시킵니다.'
  },
  {
    key: 'contrast',
    koreanName: '대비',
    englishName: 'Contrast',
    icon: '🌓',
    description: '보색, 직선과 곡선, 크기의 극적인 차이를 주어 강렬한 시각적 효과를 만듭니다.'
  },
  {
    key: 'unity',
    koreanName: '통일',
    englishName: 'Unity',
    icon: '🔗',
    description: '색조(Tone)와 형태적 특성을 조화롭게 정돈하여 화면 전체에 일체감을 줍니다.'
  },
  {
    key: 'variety',
    koreanName: '변화',
    englishName: 'Variety',
    icon: '🎨',
    description: '크기, 회전, 투명도에 다채로운 변주를 주어 단조로움을 탈피합니다.'
  },
  {
    key: 'movement',
    koreanName: '동세',
    englishName: 'Dynamic Movement',
    icon: '💨',
    description: '대각선 방향의 흐름과 속도감을 부여하여 생동감 넘치는 운동감을 표현합니다.'
  }
];
