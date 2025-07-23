# DevCanvas - 웹앱 & 웹게임 허브

바이브코딩으로 생성한 다양한 게임과 웹 애플리케이션을 오픈소스로 제공합니다.

**기술 스택:** React, Redux, TypeScript, Business Simulation

## 🚀 기술 스택

- **Frontend:** React 18.3.1, TypeScript 5.7.2
- **Styling:** Tailwind CSS 3.4.17, PostCSS 8.5.1
- **Build Tool:** Vite 6.0.7
- **Deployment:** Vercel
- **Linting:** ESLint 9.17.0
- **Dependencies:**
  - react-dom: 18.3.1
  - 기타 개발 의존성: @types/react, @types/react-dom 등

## 🛠️ 개발 환경 설정

### 필수 요구사항
- Node.js 18+ 
- npm 또는 yarn

### 설치 및 실행

```bash
# 저장소 클론
git clone https://github.com/sigco3111/DevCanvas.git
cd DevCanvas

# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 빌드
npm run build

# 빌드 결과 미리보기
npm run preview
```

## 📁 프로젝트 구조

```
DevCanvas/
├── public/                 # 정적 파일
├── src/
│   ├── components/         # React 컴포넌트
│   │   ├── Header/         # 헤더 컴포넌트
│   │   └── Hero/           # Hero 섹션 컴포넌트
│   ├── data/               # 정적 데이터
│   ├── pages/              # 페이지 컴포넌트
│   ├── types/              # TypeScript 타입 정의
│   ├── utils/              # 유틸리티 함수
│   ├── App.tsx             # 메인 애플리케이션 컴포넌트
│   ├── main.tsx            # 앱 진입점
│   └── index.css           # 전역 스타일
├── .gitignore              # Git 무시 파일 목록
├── eslint.config.js        # ESLint 설정
├── index.html              # 메인 HTML 파일
├── package.json            # 프로젝트 메타데이터 및 의존성
├── postcss.config.js       # PostCSS 설정
├── tailwind.config.js      # Tailwind CSS 설정
├── tsconfig.json           # TypeScript 설정
├── vite.config.ts          # Vite 설정
└── vercel.json             # Vercel 배포 설정
```

## ✨ 주요 기능

- **반응형 디자인**: 모바일, 태블릿, 데스크톱 모든 기기 지원
- **다크모드 지원**: 사용자 환경에 맞는 테마 제공
- **부드러운 애니메이션**: 사용자 경험을 향상시키는 애니메이션 효과
- **타입 안전성**: TypeScript로 구현된 완전한 타입 시스템
- **성능 최적화**: React.memo와 최적화된 번들링
- **컴포넌트 기반 구조**: 재사용 가능한 컴포넌트로 구성된 모듈화된 아키텍처
- **프로젝트 카드**: 각 게임의 특성을 나타내는 시각적 디자인과 직관적인 UI
- **개발자 친화적 디자인**: 코딩 심볼과 개발 도구 아이콘이 포함된 히어로 섹션

## 🎯 향후 계획

- 더 많은 웹앱과 게임 추가
- 카테고리별 필터링 기능
- 검색 기능
- 사용자 리뷰 시스템
- 게임 스크린샷 갤러리
- 플레이 통계 및 랭킹 시스템
- 사용자 계정 시스템 구현
- 모바일 앱 버전 개발

## 📄 라이선스

MIT License

## 🤝 기여하기

프로젝트에 기여하고 싶으시다면 이슈를 생성하거나 풀 리퀘스트를 보내주세요!

1. 저장소를 포크하세요
2. 새 브랜치를 생성하세요 (`git checkout -b feature/amazing-feature`)
3. 변경사항을 커밋하세요 (`git commit -m 'Add some amazing feature'`)
4. 브랜치에 푸시하세요 (`git push origin feature/amazing-feature`)
5. 풀 리퀘스트를 열어주세요

## 💬 문의하기

질문이나 제안이 있으시면 GitHub 이슈를 통해 문의해주세요.

---

**DevCanvas** - 웹의 무한한 가능성을 탐험하세요 🚀 
