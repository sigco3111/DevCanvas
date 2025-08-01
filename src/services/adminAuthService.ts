/**
 * 관리자 인증 서비스
 * 환경변수 기반 자격증명 검증 및 세션 관리
 */

// 관리자 자격증명 인터페이스
export interface AdminCredentials {
  id: string;
  password: string;
}

// 관리자 세션 인터페이스
export interface AdminSession {
  isAuthenticated: boolean;
  loginTime: Date;
  expiresAt: Date;
  adminId: string;
}

// 세션 만료 시간 (24시간)
const SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
const STORAGE_KEY = 'admin_session';

/**
 * 환경변수에서 관리자 자격증명 가져오기
 */
const getAdminCredentials = (): AdminCredentials => {
  const adminId = import.meta.env.VITE_ADMIN_ID;
  const adminPassword = import.meta.env.VITE_ADMIN_PW;

  if (!adminId || !adminPassword) {
    throw new Error('관리자 자격증명이 환경변수에 설정되지 않았습니다.');
  }

  return {
    id: adminId,
    password: adminPassword
  };
};

/**
 * 관리자 자격증명 검증
 */
export const validateAdminCredentials = (inputId: string, inputPassword: string): boolean => {
  try {
    const credentials = getAdminCredentials();
    return credentials.id === inputId && credentials.password === inputPassword;
  } catch (error) {
    console.error('관리자 자격증명 검증 실패:', error);
    return false;
  }
};

/**
 * 관리자 로그인
 */
export const adminLogin = (id: string, password: string): boolean => {
  if (!validateAdminCredentials(id, password)) {
    return false;
  }

  const now = new Date();
  const session: AdminSession = {
    isAuthenticated: true,
    loginTime: now,
    expiresAt: new Date(now.getTime() + SESSION_DURATION),
    adminId: id
  };

  // localStorage에 세션 정보 저장
  localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  
  console.log('관리자 로그인 성공:', { adminId: id, loginTime: now });
  return true;
};

/**
 * 관리자 로그아웃
 */
export const adminLogout = (): void => {
  localStorage.removeItem(STORAGE_KEY);
  console.log('관리자 로그아웃 완료');
};

/**
 * 현재 관리자 세션 가져오기
 */
export const getAdminSession = (): AdminSession | null => {
  try {
    const sessionData = localStorage.getItem(STORAGE_KEY);
    if (!sessionData) {
      return null;
    }

    const session: AdminSession = JSON.parse(sessionData);
    
    // 날짜 객체로 변환
    session.loginTime = new Date(session.loginTime);
    session.expiresAt = new Date(session.expiresAt);

    return session;
  } catch (error) {
    console.error('세션 데이터 파싱 실패:', error);
    // 잘못된 세션 데이터 제거
    localStorage.removeItem(STORAGE_KEY);
    return null;
  }
};

/**
 * 세션 만료 확인
 */
export const isSessionExpired = (session: AdminSession): boolean => {
  const now = new Date();
  return now > session.expiresAt;
};

/**
 * 관리자 인증 상태 확인
 */
export const isAdminAuthenticated = (): boolean => {
  const session = getAdminSession();
  
  if (!session || !session.isAuthenticated) {
    return false;
  }

  // 세션 만료 확인
  if (isSessionExpired(session)) {
    console.log('관리자 세션이 만료되었습니다.');
    adminLogout();
    return false;
  }

  return true;
};

/**
 * 세션 갱신 (활동 시 세션 연장)
 */
export const refreshAdminSession = (): boolean => {
  const session = getAdminSession();
  
  if (!session || !session.isAuthenticated || isSessionExpired(session)) {
    return false;
  }

  // 세션 만료 시간 연장
  const now = new Date();
  session.expiresAt = new Date(now.getTime() + SESSION_DURATION);
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  console.log('관리자 세션이 갱신되었습니다.');
  
  return true;
};

/**
 * 현재 로그인된 관리자 ID 가져오기
 */
export const getCurrentAdminId = (): string | null => {
  const session = getAdminSession();
  return session?.adminId || null;
};

/**
 * 세션 만료까지 남은 시간 (밀리초)
 */
export const getTimeUntilExpiry = (): number => {
  const session = getAdminSession();
  if (!session) return 0;
  
  const now = new Date();
  return Math.max(0, session.expiresAt.getTime() - now.getTime());
};

/**
 * 관리자 인증 상태 변경 이벤트 리스너
 */
export type AdminAuthStateChangeCallback = (isAuthenticated: boolean) => void;

// 인증 상태 변경 콜백들을 저장할 배열
const authStateChangeCallbacks: AdminAuthStateChangeCallback[] = [];

/**
 * 인증 상태 변경 리스너 등록
 */
export const onAdminAuthStateChange = (callback: AdminAuthStateChangeCallback): (() => void) => {
  authStateChangeCallbacks.push(callback);
  
  // 현재 상태로 즉시 콜백 호출
  callback(isAdminAuthenticated());
  
  // 리스너 제거 함수 반환
  return () => {
    const index = authStateChangeCallbacks.indexOf(callback);
    if (index > -1) {
      authStateChangeCallbacks.splice(index, 1);
    }
  };
};

/**
 * 인증 상태 변경 알림
 */
const notifyAuthStateChange = (isAuthenticated: boolean): void => {
  authStateChangeCallbacks.forEach(callback => {
    try {
      callback(isAuthenticated);
    } catch (error) {
      console.error('인증 상태 변경 콜백 실행 중 오류:', error);
    }
  });
};

// 로그인 함수에 상태 변경 알림 추가
export const adminLoginWithNotification = (id: string, password: string): boolean => {
  const result = adminLogin(id, password);
  if (result) {
    notifyAuthStateChange(true);
  }
  return result;
};

// 로그아웃 함수에 상태 변경 알림 추가
export const adminLogoutWithNotification = (): void => {
  adminLogout();
  notifyAuthStateChange(false);
};