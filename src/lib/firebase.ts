import { initializeApp } from 'firebase/app';
import { 
  getFirestore, 
  connectFirestoreEmulator,
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  getDoc,
  query,
  orderBy,
  limit,
  startAfter,
  where,
  onSnapshot,
  serverTimestamp,
  DocumentData,
  QueryDocumentSnapshot
} from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

/**
 * 환경변수 접근 함수
 * 브라우저 환경(Vite)과 Node.js 환경 모두 지원
 */
const getEnvVar = (key: string): string | undefined => {
  // Node.js 환경 (process.env 사용)
  if (typeof process !== 'undefined' && process.env) {
    return process.env[key];
  }
  
  // 브라우저 환경 (import.meta.env 사용)
  try {
    // @ts-ignore - import.meta.env는 브라우저에서만 사용 가능
    return import.meta.env[key];
  } catch {
    return undefined;
  }
};

/**
 * 환경변수 검증
 */
const validateFirebaseConfig = () => {
  const requiredEnvVars = [
    'VITE_FIREBASE_API_KEY',
    'VITE_FIREBASE_AUTH_DOMAIN', 
    'VITE_FIREBASE_PROJECT_ID',
    'VITE_FIREBASE_STORAGE_BUCKET',
    'VITE_FIREBASE_MESSAGING_SENDER_ID',
    'VITE_FIREBASE_APP_ID'
  ];

  const missingVars = requiredEnvVars.filter(varName => !getEnvVar(varName));
  
  if (missingVars.length > 0) {
    console.error('❌ Firebase 환경변수가 누락되었습니다:', missingVars);
    throw new Error(`Firebase 환경변수가 설정되지 않았습니다: ${missingVars.join(', ')}`);
  }

  console.log('✅ Firebase 환경변수 검증 완료');
};

// 환경변수 검증 실행
validateFirebaseConfig();

/**
 * Firebase 설정
 * 환경변수에서 Firebase 설정값을 가져와 초기화
 */
const firebaseConfig = {
  apiKey: getEnvVar('VITE_FIREBASE_API_KEY')!,
  authDomain: getEnvVar('VITE_FIREBASE_AUTH_DOMAIN')!,
  projectId: getEnvVar('VITE_FIREBASE_PROJECT_ID')!,
  storageBucket: getEnvVar('VITE_FIREBASE_STORAGE_BUCKET')!,
  messagingSenderId: getEnvVar('VITE_FIREBASE_MESSAGING_SENDER_ID')!,
  appId: getEnvVar('VITE_FIREBASE_APP_ID')!
};

console.log('🔧 Firebase 설정:', {
  projectId: firebaseConfig.projectId,
  authDomain: firebaseConfig.authDomain,
  apiKeyExists: !!firebaseConfig.apiKey
});

// Firebase 앱 초기화
let app;
try {
  app = initializeApp(firebaseConfig);
  console.log('✅ Firebase 앱 초기화 성공');
} catch (error) {
  console.error('❌ Firebase 앱 초기화 실패:', error);
  throw error;
}

// Firestore 데이터베이스 초기화
export const db = getFirestore(app);

// Firebase Auth 초기화
export const auth = getAuth(app);

// 개발 환경에서 Firestore 에뮬레이터 연결 (선택사항)
// 에뮬레이터를 사용하려면 VITE_FIREBASE_USE_EMULATOR=true 설정
if (getEnvVar('VITE_FIREBASE_USE_EMULATOR') === 'true') {
  try {
    connectFirestoreEmulator(db, 'localhost', 8080);
    console.log('🔧 Firestore 에뮬레이터에 연결됨');
  } catch (error) {
    console.warn('⚠️ Firestore 에뮬레이터 연결 실패:', error);
  }
} else {
  console.log('🌐 프로덕션 Firestore에 연결됨');
}

// Firestore 함수들을 다시 export (편의를 위해)
export {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  getDoc,
  query,
  orderBy,
  limit,
  startAfter,
  where,
  onSnapshot,
  serverTimestamp,
  type DocumentData,
  type QueryDocumentSnapshot
};

export default app; 