import { ArtElement, PrincipleKey } from '../types';

export function applyPrinciple(elements: ArtElement[], principle: PrincipleKey): ArtElement[] {
  if (elements.length === 0) return elements;

  const clone: ArtElement[] = elements.map((el) => ({ ...el }));

  switch (principle) {
    case 'balance_sym': {
      // 대칭 균형: 중앙 Y축(수직선)을 기준으로 좌우 대칭 배치 및 정렬
      return clone.map((el, idx) => {
        const sign = idx % 2 === 0 ? -1 : 1;
        const absX = Math.abs(el.x || 15);
        return {
          ...el,
          x: sign * Math.min(38, Math.max(10, absX)),
          rotation: sign * Math.abs(el.rotation % 90)
        };
      });
    }

    case 'balance_asym': {
      // 비대칭 균형: 큰 요소 하나를 한쪽에 두고, 작은 요소들을 반대편에 분산 배치
      const sorted = [...clone].sort((a, b) => b.width * b.height - a.width * a.height);
      const largest = sorted[0];

      return clone.map((el, idx) => {
        if (el.id === largest.id) {
          return {
            ...el,
            x: -22,
            y: 5,
            width: el.width * 1.15,
            height: el.height * 1.15
          };
        } else {
          // 작은 요소들은 우측에 조화롭게 분산
          const stepY = ((idx - 1) / Math.max(1, clone.length - 1) - 0.5) * 50;
          return {
            ...el,
            x: 18 + (idx % 3) * 6,
            y: stepY
          };
        }
      });
    }

    case 'rhythm': {
      // 리듬/율동: 요소들을 부드러운 사인곡선 파동 궤적을 따라 순차 배치
      return clone.map((el, idx) => {
        const t = (idx / Math.max(1, clone.length - 1)) * 2 - 1; // -1 to 1
        const waveX = t * 38;
        const waveY = Math.sin(t * Math.PI * 1.5) * 22;
        const scaleMod = 0.85 + Math.sin(idx * 0.8) * 0.25;

        return {
          ...el,
          x: waveX,
          y: waveY,
          width: el.width * scaleMod,
          height: el.height * scaleMod,
          rotation: Math.cos(t * Math.PI) * 35
        };
      });
    }

    case 'emphasis': {
      // 강조/초점: 가장 핵심적인 1개 요소를 황금비 지점에 크게 배치하고 대비 극대화
      const focalIndex = Math.floor(clone.length / 2);
      return clone.map((el, idx) => {
        if (idx === focalIndex) {
          return {
            ...el,
            x: 5,
            y: -5,
            width: el.width * 1.45,
            height: el.height * 1.45,
            opacity: 1,
            zIndex: 100
          };
        } else {
          // 주변 요소들은 은은하게 물러서도록 투명도 조절
          return {
            ...el,
            opacity: Math.max(0.35, el.opacity * 0.75)
          };
        }
      });
    }

    case 'contrast': {
      // 대비: 명도/크기/각도의 극적 대비 형성 (극대화 vs 극소화)
      return clone.map((el, idx) => {
        const isBig = idx % 2 === 0;
        return {
          ...el,
          width: isBig ? el.width * 1.3 : el.width * 0.7,
          height: isBig ? el.height * 1.3 : el.height * 0.7,
          rotation: isBig ? el.rotation + 45 : el.rotation - 45,
          opacity: isBig ? 1 : 0.6
        };
      });
    }

    case 'unity': {
      // 통일: 화면 중앙 부근으로 조화롭게 수렴하며 각도와 간격 정돈
      return clone.map((el) => {
        return {
          ...el,
          x: el.x * 0.75,
          y: el.y * 0.75,
          rotation: Math.round(el.rotation / 30) * 30, // 30도 단위 정돈
          opacity: 0.82
        };
      });
    }

    case 'variety': {
      // 변화: 크기와 회전에 풍부한 변주를 주어 다채로움 부여
      return clone.map((el, idx) => {
        const angleDelta = ((idx * 47) % 60) - 30;
        const scaleFactor = 0.8 + ((idx * 23) % 40) / 100;
        return {
          ...el,
          width: el.width * scaleFactor,
          height: el.height * scaleFactor,
          rotation: (el.rotation + angleDelta) % 360
        };
      });
    }

    case 'movement': {
      // 동세: 우상향(또는 대각선) 방향으로 역동적인 속도감 부여
      return clone.map((el, idx) => {
        const progress = (idx / Math.max(1, clone.length - 1)) - 0.5;
        return {
          ...el,
          x: progress * 60,
          y: -progress * 45,
          rotation: -35 + ((idx % 3) * 10)
        };
      });
    }

    default:
      return clone;
  }
}
