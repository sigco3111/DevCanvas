# DevCanvas - 웹앱 & 웹게임 허브

다양한 웹 애플리케이션과 게임을 한 곳에서 즐겨보세요. 창의적이고 재미있는 프로젝트들이 여러분을 기다립니다.

## 🎮 현재 프로젝트

### [World War Simulator](https://world-war-simulator.vercel.app/)
🛡️ AI 국가들이 벌이는 대규모 전쟁 시뮬레이션 게임. 실시간 전략 게임으로 국가 간의 전투와 동맹을 관찰하며 즐길 수 있습니다.

**기술 스택:** Unity, C#, AI Simulation, Real-time Strategy

### [테트리스 AI 마스터 3D](https://tetris-am3d-7k4p.vercel.app/)
🧩 3D 테트리스 게임과 AI 플레이 모드를 즐겨보세요. 입체적인 시각적 경험과 함께 AI의 테트리스 플레이를 관찰할 수 있습니다.

**기술 스택:** React, Three.js, TypeScript, AI Algorithms

### [방치형 모험가 노트](https://idle-rpg-one.vercel.app/)
📖 방치형 RPG 게임으로 캐릭터가 자동 성장하며 던전과 보스를 공략합니다. 장비 강화와 스킬 업그레이드를 통해 더 강해져보세요.

**기술 스택:** React, TypeScript, Game Logic, Progressive Web App

### [지구마블](https://geo-poly.vercel.app/)
🌍 전 세계 도시를 무대로 한 부루마블 게임! 부동산을 구매하고 임대료를 받으며 경제적 승리를 목표로 하는 전략 보드게임입니다.

**기술 스택:** React, TypeScript, Game Logic, Board Game Mechanics

### [디지털 인생 게임](https://life-game-rho.vercel.app/)
🎲 인생의 다양한 선택과 결과를 체험하는 디지털 보드게임. 직업 선택부터 인생의 중요한 순간들을 시뮬레이션하며 즐길 수 있습니다.

**기술 스택:** React, TypeScript, Simulation, Interactive Storytelling

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