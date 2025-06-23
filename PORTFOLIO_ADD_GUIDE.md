# 📋 DevCanvas 포트폴리오 추가 가이드

DevCanvas에 새로운 포트폴리오 프로젝트를 추가하는 방법을 안내합니다.

## 🎯 추가 방법 3가지

### 📝 방법 1: JSON 파일 수정 + 업로드 (추천)

가장 간단하고 안정적인 방법입니다.

#### 1단계: JSON 파일 수정
`src/data/portfolios.json` 파일을 열고 마지막 항목 뒤에 새 객체를 추가합니다.

```json
{
  "id": "unique-project-id",
  "title": "프로젝트 제목",
  "description": "프로젝트에 대한 상세한 설명을 작성하세요.",
  "category": "App",
  "technologies": ["React", "TypeScript", "Tailwind CSS"],
  "liveUrl": "https://your-project.vercel.app/",
  "featured": false,
  "createdAt": "2025-01-17",
  "updatedAt": "2025-01-17",
  "githubUrl": "https://github.com/your-username/your-repo",
  "developmentTools": ["Google AI Studio", "Cursor"],
  "geminiApiStatus": "none"
}
```

#### 2단계: Firebase에 업로드
```bash
npm run upload-portfolios
```

### 🔧 방법 2: 개별 추가 스크립트 사용

프로그래밍 방식으로 단일 포트폴리오를 추가할 때 사용합니다.

#### 1단계: 스크립트 파일 수정
`src/scripts/addSinglePortfolio.ts` 파일에서 프로젝트 정보를 수정합니다.

```typescript
const newPortfolio: Omit<PortfolioItem, 'id'> = {
  title: "새 프로젝트 제목을 여기에 입력",
  description: "프로젝트에 대한 상세한 설명을 작성하세요.",
  category: "App", // 카테고리 선택
  technologies: ["React", "TypeScript"],
  liveUrl: "https://your-project.vercel.app/",
  featured: false,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  githubUrl: "https://github.com/your-username/your-repo",
  developmentTools: ["Google AI Studio", "Cursor"],
  geminiApiStatus: "none"
};
```

#### 2단계: 스크립트 실행
```bash
npm run add-portfolio
```

### 🌐 방법 3: Firebase Console 직접 추가

웹 인터페이스를 통해 직접 추가하는 방법입니다.

1. [Firebase Console](https://console.firebase.google.com/project/dev-canvas-f6c15/firestore/data) 접속
2. `portfolios` 컬렉션 선택
3. "문서 추가" 클릭
4. 필드별로 데이터 입력
5. 저장

## 📊 필드 상세 설명

### 🔴 필수 필드

| 필드명 | 타입 | 설명 | 예시 |
|--------|------|------|------|
| `id` | string | 고유 식별자 (URL 친화적) | `"my-awesome-game"` |
| `title` | string | 프로젝트 제목 | `"멋진 퍼즐 게임"` |
| `description` | string | 프로젝트 상세 설명 | `"재미있는 3D 퍼즐 게임입니다"` |
| `category` | string | 프로젝트 카테고리 | `"퍼즐"` |
| `technologies` | array | 사용된 기술 스택 | `["React", "Three.js"]` |
| `liveUrl` | string | 실행 가능한 웹사이트 URL | `"https://my-game.vercel.app"` |
| `featured` | boolean | 메인 페이지 추천 여부 | `true` 또는 `false` |
| `createdAt` | string | 프로젝트 생성 날짜 | `"2025-01-17"` |

### 🟡 선택 필드

| 필드명 | 타입 | 설명 | 예시 |
|--------|------|------|------|
| `updatedAt` | string | 마지막 업데이트 날짜 | `"2025-01-17"` |
| `githubUrl` | string | GitHub 저장소 URL | `"https://github.com/user/repo"` |
| `developmentTools` | array | 사용된 개발 도구 | `["Cursor", "Claude"]` |
| `geminiApiStatus` | string | Gemini API 필요 여부 | `"none"`, `"optional"`, `"required"` |
| `imageUrl` | string | 프로젝트 이미지 URL | `"https://example.com/image.png"` |

## 🏷️ 카테고리 목록

### 🎮 기본 제공 카테고리
- `"App"` - 웹 애플리케이션, 도구
- `"경영"` - 경영 시뮬레이션 게임
- `"전략"` - 전략 게임
- `"RPG"` - 롤플레잉 게임
- `"퍼즐"` - 퍼즐 게임
- `"보드게임"` - 보드게임 스타일
- `"육성"` - 캐릭터/아이템 육성 게임
- `"액션"` - 액션 게임
- `"FPS"` - 1인칭 슈팅 게임
- `"TPS"` - 3인칭 슈팅 게임
- `"MMORPG"` - 대규모 멀티플레이어 온라인 RPG
- `"MOBA"` - 멀티플레이어 온라인 배틀 아레나
- `"SLG"` - 시뮬레이션 게임
- `"RTS"` - 실시간 전략 게임
- `"MCP"` - 기타 분류

### ✨ 동적 카테고리 추가
**새로운 카테고리는 언제든지 추가할 수 있습니다!**

- 포트폴리오 추가 시 새로운 카테고리명을 입력하면 자동으로 추가됩니다
- 웹 애플리케이션에서 자동으로 인식하여 필터 목록에 표시됩니다
- 예시: `"실험"`, `"교육"`, `"유틸리티"`, `"엔터테인먼트"` 등

### 📋 카테고리 명명 규칙
- 한글, 영문, 숫자 사용 가능
- 특수문자 `/`는 사용 불가 (Firebase 제한)
- 앞뒤 공백 없이 작성
- `"all"`은 시스템 예약어로 사용 불가
- 의미 있고 직관적인 이름 권장

## 🔑 Gemini API 상태

| 값 | 설명 | 아이콘 |
|----|------|-------|
| `"none"` | API 키 불필요 | 🚫 |
| `"optional"` | 부분적으로 필요 (일부 기능만) | 💡 |
| `"required"` | 필수적으로 필요 | 🔑 |

## 📝 빠른 추가 템플릿

### 🎯 기본 템플릿
새 프로젝트를 추가할 때 이 템플릿을 복사해서 사용하세요:

```json
{
  "id": "my-project-id",
  "title": "여기에 프로젝트 제목 입력",
  "description": "여기에 프로젝트 설명 입력. 어떤 게임인지, 어떤 기능이 있는지 상세히 작성하세요.",
  "category": "App",
  "technologies": [
    "React",
    "TypeScript",
    "기타 기술"
  ],
  "liveUrl": "https://your-project.vercel.app/",
  "featured": false,
  "createdAt": "2025-01-17",
  "updatedAt": "2025-01-17",
  "githubUrl": "https://github.com/your-username/your-repo",
  "developmentTools": [
    "Google AI Studio",
    "Cursor"
  ],
  "geminiApiStatus": "none"
}
```

### 🆕 새 카테고리 추가 템플릿
새로운 카테고리로 프로젝트를 추가하는 예시:

```json
{
  "id": "experimental-project",
  "title": "실험적 프로젝트",
  "description": "새로운 기술을 실험하는 프로젝트입니다. 이 프로젝트는 '실험' 카테고리를 사용합니다.",
  "category": "실험",
  "technologies": ["React", "TypeScript", "WebGL"],
  "liveUrl": "https://experimental-project.vercel.app/",
  "featured": true,
  "createdAt": "2025-01-17",
  "updatedAt": "2025-01-17",
  "githubUrl": "https://github.com/example/experimental-project",
  "developmentTools": ["Google AI Studio", "Cursor", "Claude"],
  "geminiApiStatus": "optional"
}
```

## 🚀 사용 가능한 명령어

### 포트폴리오 관리 명령어
```bash
# 모든 포트폴리오를 Firebase에 업로드
npm run upload-portfolios

# Firebase의 포트폴리오 데이터 확인
npm run check-portfolios

# 단일 포트폴리오 추가 (스크립트 수정 후)
npm run add-portfolio

# 개발 서버 실행
npm run dev

# 프로덕션 빌드
npm run build
```

## 🎉 성공 사례

### ✅ 동적 카테고리 테스트 성공!
최근에 새로운 카테고리 "실험"을 추가한 테스트가 성공적으로 완료되었습니다:

- **프로젝트**: "동적 카테고리 테스트"
- **카테고리**: "실험" (새로 추가된 카테고리)
- **Firebase ID**: `ssUVHFwEVPuxeMC1DioQ`
- **결과**: 웹 애플리케이션에서 자동으로 인식하여 필터 목록에 표시됨

이제 언제든지 새로운 카테고리를 추가할 수 있습니다! 🚀

## ✅ 추가 후 확인 사항

포트폴리오를 추가한 후 다음 사항들을 확인하세요:

1. **Firebase Console에서 데이터 확인**
   - [Firebase Console](https://console.firebase.google.com/project/dev-canvas-f6c15/firestore/data) 접속
   - `portfolios` 컬렉션에서 새 항목 확인

2. **웹 애플리케이션에서 확인**
   ```bash
   npm run dev
   ```
   - http://localhost:5173/ 접속
   - 새 프로젝트가 목록에 표시되는지 확인
   - 카테고리 필터링이 정상 작동하는지 확인

3. **링크 테스트**
   - `liveUrl` 클릭 시 정상 작동 확인
   - `githubUrl` 클릭 시 저장소 접속 확인

## 🔧 문제 해결

### 일반적인 오류와 해결방법

#### 1. 환경변수 오류
```
❌ Firebase 환경변수가 누락되었습니다
```
**해결방법**: `.env` 파일에 Firebase 설정값 확인

#### 2. 중복 ID 오류
```
❌ Document already exists
```
**해결방법**: `id` 필드를 고유한 값으로 변경

#### 3. 카테고리 타입 오류
```
❌ Invalid category type
```
**해결방법**: 지원되는 카테고리 목록에서 선택

#### 4. URL 형식 오류
```
❌ Invalid URL format
```
**해결방법**: `https://`로 시작하는 완전한 URL 사용

### 디버깅 팁

1. **콘솔 로그 확인**
   - 브라우저 개발자 도구에서 네트워크 탭 확인
   - 터미널에서 에러 메시지 확인

2. **JSON 문법 확인**
   - JSON Validator 도구 사용
   - 쉼표, 중괄호 누락 확인

3. **Firebase 권한 확인**
   - Firestore 보안 규칙 확인
   - 읽기/쓰기 권한 설정 확인

## 📚 추가 참고자료

- [Firebase Console](https://console.firebase.google.com/project/dev-canvas-f6c15/firestore/data)
- [Firebase 포트폴리오 설정 가이드](./FIREBASE_PORTFOLIO_SETUP.md)
- [프로젝트 README](./README.md)

## 💡 팁과 모범 사례

### ID 명명 규칙
- 소문자 사용
- 단어 구분은 하이픈(-) 사용
- 영문과 숫자만 사용
- 예: `"rpg-adventure-game"`, `"3d-puzzle-master"`

### 설명 작성 팁
- 게임의 핵심 기능 설명
- 플레이어가 무엇을 할 수 있는지 명시
- 특별한 기능이나 기술적 특징 강조
- 150-300자 내외 권장

### 기술 스택 작성
- 주요 기술부터 나열
- 버전 정보는 생략
- 일반적인 기술명 사용
- 예: `["React", "TypeScript", "Three.js", "Tailwind CSS"]`

### Featured 프로젝트 선택 기준
- 완성도가 높은 프로젝트
- 독창적이거나 재미있는 프로젝트
- 기술적으로 우수한 프로젝트
- 전체 포트폴리오의 30% 이하 권장

---

더 자세한 정보가 필요하시면 [FIREBASE_PORTFOLIO_SETUP.md](./FIREBASE_PORTFOLIO_SETUP.md) 파일을 참조하세요. 