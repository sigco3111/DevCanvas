import { initializeApp } from 'firebase/app';
import { 
  getFirestore, 
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  getDoc,
  setDoc,
  query,
  orderBy,
  limit,
  startAfter,
  where,
  serverTimestamp,
  DocumentData,
  QueryDocumentSnapshot
} from 'firebase/firestore';
import { config } from 'dotenv';

// .env 파일 로드
config();

/**
 * 환경변수 검증 (Node.js 환경용)
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

  const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    console.error('❌ Firebase 환경변수가 누락되었습니다:', missingVars);
    throw new Error(`Firebase 환경변수가 설정되지 않았습니다: ${missingVars.join(', ')}`);
  }

  console.log('✅ Firebase 환경변수 검증 완료 (Node.js)');
};

// 환경변수 검증 실행
validateFirebaseConfig();

/**
 * Firebase 설정 (Node.js 환경용)
 * process.env에서 Firebase 설정값을 가져와 초기화
 */
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY!,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN!,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID!,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET!,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID!,
  appId: process.env.VITE_FIREBASE_APP_ID!
};

console.log('🔧 Firebase 설정 (Node.js):', {
  projectId: firebaseConfig.projectId,
  authDomain: firebaseConfig.authDomain,
  apiKeyExists: !!firebaseConfig.apiKey
});

// Firebase 앱 초기화
let app;
try {
  app = initializeApp(firebaseConfig);
  console.log('✅ Firebase 앱 초기화 성공 (Node.js)');
} catch (error) {
  console.error('❌ Firebase 앱 초기화 실패 (Node.js):', error);
  throw error;
}

// Firestore 데이터베이스 초기화
export const db = getFirestore(app);

// Firestore 함수들을 다시 export (편의를 위해)
export {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  getDoc,
  setDoc,
  query,
  orderBy,
  limit,
  startAfter,
  where,
  serverTimestamp,
  type DocumentData,
  type QueryDocumentSnapshot
};

export default app; 