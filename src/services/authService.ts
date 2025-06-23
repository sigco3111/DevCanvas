import { 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut, 
  onAuthStateChanged,
  User
} from 'firebase/auth';
import { auth } from '../lib/firebase';

/**
 * Google 로그인 제공자 설정
 */
const googleProvider = new GoogleAuthProvider();
googleProvider.addScope('profile');
googleProvider.addScope('email');

/**
 * Google 계정으로 로그인
 */
export const signInWithGoogle = async (): Promise<User> => {
  try {
    console.log('Google 로그인 시도...');
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    
    console.log('Google 로그인 성공:', {
      uid: user.uid,
      displayName: user.displayName,
      email: user.email,
      photoURL: user.photoURL
    });
    
    return user;
  } catch (error: any) {
    console.error('Google 로그인 실패:', error);
    
    // 사용자 친화적인 에러 메시지
    if (error.code === 'auth/popup-closed-by-user') {
      throw new Error('로그인 창이 닫혔습니다. 다시 시도해주세요.');
    } else if (error.code === 'auth/popup-blocked') {
      throw new Error('팝업이 차단되었습니다. 브라우저 설정을 확인해주세요.');
    } else if (error.code === 'auth/cancelled-popup-request') {
      throw new Error('로그인이 취소되었습니다.');
    } else {
      throw new Error(`로그인 중 오류가 발생했습니다: ${error.message}`);
    }
  }
};

/**
 * 로그아웃
 */
export const signOutUser = async (): Promise<void> => {
  try {
    console.log('로그아웃 시도...');
    await signOut(auth);
    console.log('로그아웃 성공');
  } catch (error: any) {
    console.error('로그아웃 실패:', error);
    throw new Error(`로그아웃 중 오류가 발생했습니다: ${error.message}`);
  }
};

/**
 * 현재 로그인된 사용자 정보 가져오기
 */
export const getCurrentUser = (): User | null => {
  return auth.currentUser;
};

/**
 * 인증 상태 변경 리스너 등록
 */
export const onAuthStateChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};

/**
 * 사용자 정보를 게시글 작성자 형태로 변환
 */
export const getUserForPost = (user: User) => {
  return {
    uid: user.uid,
    name: user.displayName || '익명 사용자',
    email: user.email || '',
    avatar: user.photoURL || '',
    role: 'user' as const
  };
};

/**
 * 로그인 상태 확인
 */
export const isAuthenticated = (): boolean => {
  return !!auth.currentUser;
}; 