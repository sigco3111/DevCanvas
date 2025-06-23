# Firebase Google 인증 설정 가이드

구글 인증을 통한 게시글 작성 기능을 사용하기 위해 Firebase Console에서 Google 로그인을 활성화해야 합니다.

## 1단계: Firebase Console 접속

1. [Firebase Console](https://console.firebase.google.com/)에 접속
2. 현재 프로젝트(`dev-canvas-f6c15`) 선택

## 2단계: Authentication 설정

1. 왼쪽 메뉴에서 **Authentication** 클릭
2. **Get started** 버튼 클릭 (처음 설정하는 경우)
3. **Sign-in method** 탭 클릭

## 3단계: Google 로그인 제공자 활성화

1. **Google** 제공자 클릭
2. **Enable** 토글 스위치 켜기
3. **Project support email** 선택 (본인 이메일)
4. **Save** 버튼 클릭

## 4단계: 승인된 도메인 추가 (선택사항)

개발 환경에서는 `localhost`가 기본적으로 허용되지만, 배포 시에는 도메인을 추가해야 합니다:

1. **Settings** 탭 클릭
2. **Authorized domains** 섹션에서 도메인 추가
   - 로컬 개발: `localhost` (기본 허용됨)
   - Vercel 배포: `devcanvas.vercel.app`

## 5단계: 설정 완료 확인

설정이 완료되면:
- 헤더에 "Google 로그인" 버튼이 표시됩니다
- 로그인 후 사용자 정보(이름, 프로필 사진)가 표시됩니다
- 게시글 작성 시 자동으로 로그인된 사용자 정보가 사용됩니다

## 주의사항

⚠️ **보안 규칙 업데이트 필요**

Firestore 보안 규칙도 인증된 사용자만 쓰기 가능하도록 업데이트해야 합니다:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // 게시글 컬렉션
    match /posts/{document} {
      allow read: if true;  // 모든 사용자 읽기 가능
      allow write: if request.auth != null;  // 인증된 사용자만 쓰기 가능
    }
    
    // 댓글 컬렉션  
    match /comments/{document} {
      allow read: if true;  // 모든 사용자 읽기 가능
      allow write: if request.auth != null;  // 인증된 사용자만 쓰기 가능
    }
    
    // 테스트 컬렉션 (개발용)
    match /test/{document} {
      allow read, write: if true;
    }
  }
}
```

## 문제 해결

### 팝업 차단 오류
- 브라우저에서 팝업을 허용해주세요
- 시크릿 모드에서는 팝업이 차단될 수 있습니다

### 도메인 오류
- Firebase Console에서 현재 도메인이 승인된 도메인 목록에 있는지 확인하세요

### 프로젝트 설정 오류
- `.env` 파일의 Firebase 설정값이 올바른지 확인하세요
- 특히 `VITE_FIREBASE_AUTH_DOMAIN` 값이 정확한지 확인하세요 