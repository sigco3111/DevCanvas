# Firebase 포트폴리오 데이터 설정 가이드

DevCanvas에 Firebase 포트폴리오 데이터베이스를 설정하고 사용하는 방법을 설명합니다.

## 🔧 사전 준비사항

1. **Firebase 프로젝트 설정**
   - [Firebase Console](https://console.firebase.google.com/)에서 프로젝트 생성
   - Firestore Database 활성화
   - 웹 앱 등록 및 설정 정보 확인

2. **환경변수 설정**
   `.env` 파일에 Firebase 설정값을 추가:
   ```env
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```

## 📁 프로젝트 구조

```
src/
├── services/
│   └── portfolioService.ts     # Firebase 포트폴리오 CRUD 함수
├── scripts/
│   ├── uploadPortfolios.ts     # 포트폴리오 업로드 스크립트
│   └── checkPortfolios.ts      # 포트폴리오 확인 스크립트
├── utils/
│   └── portfolio.ts            # 포트폴리오 유틸리티 (Firebase 연동)
└── data/
    └── portfolios.json         # 기존 로컬 데이터 (백업용)
```

## 🚀 데이터 업로드 방법

### 1단계: 의존성 설치
```bash
npm install
```

### 2단계: 포트폴리오 데이터 업로드
```bash
# 포트폴리오 데이터를 Firebase에 업로드
npm run upload-portfolios
```

### 3단계: 업로드 확인
```bash
# Firebase에 저장된 포트폴리오 데이터 확인
npm run check-portfolios
```

## 📊 Firebase 데이터 구조

### 컬렉션: `portfolios`
각 문서는 포트폴리오 항목을 나타내며 다음 필드를 포함:

```typescript
{
  id: string;                    // 포트폴리오 고유 ID
  title: string;                 // 프로젝트 제목
  description: string;           // 프로젝트 설명
  category: string;              // 카테고리 (전략, 경영, RPG 등)
  technologies: string[];        // 사용 기술 스택
  liveUrl: string;              // 라이브 사이트 URL
  featured: boolean;            // 추천 프로젝트 여부
  createdAt: string;            // 생성 날짜 (ISO 문자열)
  updatedAt?: string;           // 업데이트 날짜 (선택적)
  githubUrl?: string;           // GitHub 저장소 URL (선택적)
  developmentTools?: string[];   // 개발 도구 (선택적)
  geminiApiStatus?: string;     // Gemini API 필요 상태 (선택적)
  uploadedAt: string;           // Firebase 업로드 날짜
}
```

## 🔄 애플리케이션 동작 방식

1. **데이터 로딩 순서**:
   1. Firebase에서 포트폴리오 데이터 가져오기 시도
   2. 실패 시 로컬 `portfolios.json` 파일 사용
   3. 로딩 상태 및 에러 상태 처리

2. **주요 기능**:
   - Firebase 실시간 데이터 동기화
   - 로딩 상태 표시
   - 에러 처리 및 폴백 시스템
   - 검색 및 필터링 기능 유지

## 📝 서비스 함수 사용법

### 포트폴리오 데이터 가져오기
```typescript
import { getPortfolios } from '../services/portfolioService';

const portfolios = await getPortfolios();
```

### 새 포트폴리오 추가
```typescript
import { addPortfolio } from '../services/portfolioService';

const newPortfolio = {
  title: "새 프로젝트",
  description: "프로젝트 설명",
  category: "전략",
  technologies: ["React", "TypeScript"],
  liveUrl: "https://example.com",
  featured: false,
  createdAt: new Date().toISOString()
};

const portfolioId = await addPortfolio(newPortfolio);
```

### 포트폴리오 업데이트
```typescript
import { updatePortfolio } from '../services/portfolioService';

await updatePortfolio('portfolio_id', {
  title: "업데이트된 제목",
  featured: true
});
```

## 🛠️ 개발 도구

### Firestore 규칙 설정
Firebase Console에서 다음 규칙을 설정하세요:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // 포트폴리오 읽기 허용 (모든 사용자)
    match /portfolios/{document} {
      allow read: if true;
      // 쓰기는 인증된 사용자만 (관리자 설정 필요)
      allow write: if request.auth != null;
    }
  }
}
```

### 인덱스 설정
Firebase Console에서 다음 인덱스를 생성하세요:
- `category` (오름차순) + `createdAt` (내림차순)
- `featured` (오름차순) + `createdAt` (내림차순)

## 🔍 문제 해결

### 일반적인 오류

1. **환경변수 오류**
   ```
   ❌ Firebase 환경변수가 누락되었습니다
   ```
   → `.env` 파일의 Firebase 설정값 확인

2. **권한 오류**
   ```
   ❌ Permission denied
   ```
   → Firestore 보안 규칙 확인

3. **네트워크 오류**
   ```
   ❌ 포트폴리오 데이터 가져오기 실패
   ```
   → 인터넷 연결 및 Firebase 프로젝트 상태 확인

### 디버깅 팁

1. **브라우저 개발자 도구에서 네트워크 탭 확인**
2. **Firebase Console에서 Firestore 데이터 직접 확인**
3. **콘솔 로그를 통한 상세 오류 정보 확인**

## 📋 체크리스트

데이터 마이그레이션 완료 후 다음 사항들을 확인하세요:

- [ ] Firebase 프로젝트 생성 및 Firestore 활성화
- [ ] 환경변수 설정 완료
- [ ] `npm run upload-portfolios` 실행 성공
- [ ] `npm run check-portfolios`로 데이터 확인
- [ ] 웹 애플리케이션에서 포트폴리오 로딩 확인
- [ ] 검색 및 필터링 기능 정상 동작 확인
- [ ] 모바일 환경에서 로딩 확인

## 🔒 보안 고려사항

1. **API 키 보안**: 환경변수를 통해 API 키 관리
2. **Firestore 규칙**: 읽기는 공개, 쓰기는 인증 필요
3. **데이터 백업**: 로컬 JSON 파일을 백업으로 유지

---

더 많은 정보는 [Firebase 공식 문서](https://firebase.google.com/docs/firestore)를 참조하세요. 