import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User } from 'firebase/auth';
import { 
  signInWithGoogle, 
  signOutUser, 
  onAuthStateChange,
  getCurrentUser,
  getUserForPost
} from '../services/authService';

/**
 * 인증 컨텍스트 타입 정의
 */
interface AuthContextType {
  // 현재 로그인된 사용자
  currentUser: User | null;
  // 로딩 상태
  isLoading: boolean;
  // 로그인 함수
  login: () => Promise<void>;
  // 로그아웃 함수
  logout: () => Promise<void>;
  // 게시글 작성용 사용자 정보
  getUserInfo: () => ReturnType<typeof getUserForPost> | null;
}

/**
 * 인증 컨텍스트 생성
 */
const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * 인증 컨텍스트 프로바이더 Props
 */
interface AuthProviderProps {
  children: ReactNode;
}

/**
 * 인증 컨텍스트 프로바이더
 */
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Google 로그인
  const login = async (): Promise<void> => {
    try {
      setIsLoading(true);
      await signInWithGoogle();
      // onAuthStateChanged에서 사용자 상태가 업데이트됨
    } catch (error: any) {
      console.error('로그인 오류:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // 로그아웃
  const logout = async (): Promise<void> => {
    try {
      setIsLoading(true);
      await signOutUser();
      // onAuthStateChanged에서 사용자 상태가 업데이트됨
    } catch (error: any) {
      console.error('로그아웃 오류:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // 게시글 작성용 사용자 정보 가져오기
  const getUserInfo = () => {
    if (!currentUser) return null;
    return getUserForPost(currentUser);
  };

  // 인증 상태 변경 리스너 설정
  useEffect(() => {
    console.log('인증 상태 리스너 설정...');
    
    const unsubscribe = onAuthStateChange((user) => {
      console.log('인증 상태 변경:', user ? `로그인됨 (${user.displayName})` : '로그아웃됨');
      setCurrentUser(user);
      setIsLoading(false);
    });

    // 초기 사용자 상태 확인
    const initialUser = getCurrentUser();
    if (initialUser) {
      console.log('초기 사용자 상태:', initialUser.displayName);
      setCurrentUser(initialUser);
    }
    setIsLoading(false);

    // 컴포넌트 언마운트 시 리스너 해제
    return () => {
      console.log('인증 상태 리스너 해제');
      unsubscribe();
    };
  }, []);

  const value: AuthContextType = {
    currentUser,
    isLoading,
    login,
    logout,
    getUserInfo
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * 인증 컨텍스트 사용 훅
 */
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth는 AuthProvider 내부에서 사용되어야 합니다');
  }
  return context;
}; 