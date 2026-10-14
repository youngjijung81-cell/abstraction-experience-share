import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '감정 추상화 스튜디오 - 고등학교 미술 조형요소 & 조형원리 실습',
  description: '자신의 감정을 점, 선, 면, 색과 8대 조형 원리로 시각화하고 캔버스 위 요소를 변형해보는 인터랙티브 미술 교육 프로그램',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className="antialiased selection:bg-blue-100 selection:text-blue-900">
        {children}
      </body>
    </html>
  );
}
