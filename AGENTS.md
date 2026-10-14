# AGENTS.md - 감정 표현 및 자유 추상화 스튜디오

## 1. 프로젝트 목표 & 검증 기준
- **목표**: 고등학교 미술 수업에서 감정을 조형 요소(점, 선, 면, 색)와 조형 원리(균형, 리듬, 강조, 대비 등)로 표현하고, 캔버스 위의 개별 요소를 인터랙티브하게 선택·변형(이동, 스케일, 회전, 색상 변경)하며 고해상도 캡션 이미지로 다운로드 및 학급 갤러리에 공유할 수 있는 웹 애플리케이션 구축.
- **검증 기준**:
  1. 좌우 2분할 레이아웃 (왼쪽: 도구 컨트롤 패널, 오른쪽: 대형 캔버스)
  2. 3가지 모드 완벽 지원: [자동 모드], [감정 가이드 모드], [자유 창작 모드]
  3. 16종 이상의 다채로운 감정 선택 및 감정별 시각적 조형 생성
  4. 22종 이상의 미술 표준 색채 팔레트 및 조형 요소(점, 선, 면) 세부 파라미터 제어
  5. 8대 조형 원리(균형, 율동, 강조, 대비, 통일, 변화, 동세, 조화) 변형 엔진 작동
  6. 캔버스 위 개별 요소를 클릭하여 선택하고 마우스/터치 드래그로 이동, 크기 조절, 회전, 색상 교체 지원
  7. 캡션(작품명, 학번, 작가명, 감정, 사용 원리) 포함 1080x1080 고해상도 PNG 다운로드
  8. Supabase 연동 학급 갤러리 전시 및 실시간 조회
  9. GitHub 원격 저장소 및 Vercel Production 배포, DoRms 보안 검사 통과

## 2. 프로젝트 플랫폼 식별자 (공유용 사본 — 원본 art_class와 섞지 말 것)
- 이 저장소는 학급 원본(`abstraction-experience`, Supabase `ptrowbvbkivizcgbfxhy`)에서 복사한 **다른 학교 교사 공유용** 사본이다. 원본 프로젝트·DB를 이 폴더에서 바꾸지 않는다.
- **Supabase**:
  - Project: `abstraction-art-studio-share` (ref `teedzpcforkomxdvcuya`, ap-northeast-2)
  - Project URL: `https://teedzpcforkomxdvcuya.supabase.co`
  - Organization ID: `biraagftjqlpjzzrtuxd`
  - Table: `public.artworks` (RLS: 공개 조회·등록만, 삭제는 `admin_delete_artwork` 함수로만)
  - 관리자 비밀번호: `private.admin_secret`에 솔트+SHA-256 해시만 저장. 원문은 로컬 `~/.config/art-share/admin-password.txt`(Git 밖)
- **GitHub**:
  - Repository: `youngjijung81-cell/abstraction-experience-share` (public)
  - Branch: `main`
- **Vercel**:
  - Project: `abstraction-experience-share`
  - Project ID: `prj_e6JpH8vuMYcKUvwQAHqg1Ab8aGle`
  - Org ID: `team_iogzRgUzWCusnCB7XCvZNx9O` (youngjijung81-9685)
  - Production URL: `https://abstraction-experience-share.vercel.app`
  - 서버 환경변수: `SUPABASE_URL`, `SUPABASE_ANON_KEY` (클라이언트 번들에 넣지 않음)
