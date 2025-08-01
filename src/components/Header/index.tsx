import React, { useState, useEffect } from 'react';
import type { HeaderProps, NavigationItem } from './types';
import { useAuth } from '../../contexts/AuthContext';
import { VisitorCounter } from '..';
import { isAdminAuthenticated, onAdminAuthStateChange } from '../../services/adminAuthService';
import ThemeToggle from '../ThemeToggle';

/**
 * 기본 네비게이션 메뉴 항목들
 */
const DEFAULT_NAVIGATION: NavigationItem[] = [
  { label: '홈', href: '#home' },
  { label: '프로젝트', href: '#projects' },
  { label: '게시판', href: '#board' },
  { 
    label: '대시보드',
    href: '#dashboard',
    icon: (
      <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    )
  }
];

/**
 * 관리자 네비게이션 항목
 */
const ADMIN_NAVIGATION_ITEM: NavigationItem = {
  label: '관리자',
  href: '/admin',
  external: true, // 외부 링크로 처리하여 페이지 이동
  icon: (
    <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  )
};

/**
 * DevCanvas 웹사이트의 헤더 컴포넌트
 * 브랜딩, 네비게이션, 다크모드 토글 기능을 제공
 */
const Header: React.FC<HeaderProps> = React.memo(({
  navigationItems = DEFAULT_NAVIGATION,
  onLogoClick,
  onNavigationClick,
  className = '',
}) => {
  // 모바일 메뉴 토글 상태 관리
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // 관리자 인증 상태 관리 (요구사항 3.1, 3.3)
  const [isAdminAuth, setIsAdminAuth] = useState(false);
  
  // 인증 상태 및 함수들
  const { currentUser, isLoading, login, logout } = useAuth();

  // 관리자 인증 상태 확인 및 리스너 등록
  useEffect(() => {
    // 초기 인증 상태 확인
    setIsAdminAuth(isAdminAuthenticated());

    // 인증 상태 변경 리스너 등록
    const unsubscribe = onAdminAuthStateChange((authStatus) => {
      setIsAdminAuth(authStatus);
    });

    return unsubscribe;
  }, []);

  // 동적 네비게이션 항목 생성 (관리자 인증 상태에 따라)
  const dynamicNavigationItems = React.useMemo(() => {
    const items = [...navigationItems];
    
    // 관리자가 인증된 경우 관리자 메뉴 추가 (요구사항 3.3)
    if (isAdminAuth) {
      items.push(ADMIN_NAVIGATION_ITEM);
    }
    
    return items;
  }, [navigationItems, isAdminAuth]);

  /**
   * 모바일 메뉴 토글 핸들러
   */
  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen(prev => !prev);
  };

  /**
   * 네비게이션 링크 클릭 핸들러
   * 모바일 메뉴를 닫고 스크롤 이동 처리
   */
  const handleNavigationClick = (href: string, external?: boolean) => {
    // 모바일 메뉴 닫기
    setIsMobileMenuOpen(false);

    // 관리자 페이지 링크 처리 (요구사항 3.1, 3.3)
    if (href === '/admin') {
      window.location.href = href;
      return;
    }

    // 외부 콜백이 있으면 먼저 실행
    if (onNavigationClick) {
      onNavigationClick(href, external);
      return;
    }

    // 외부 링크가 아닌 경우 스크롤 이동 처리
    if (!external && href.startsWith('#')) {
      const targetElement = document.querySelector(href);
      if (targetElement) {
        targetElement.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
      }
    }
  };

  /**
   * 로고 클릭 핸들러
   */
  const handleLogoClick = () => {
    if (onLogoClick) {
      onLogoClick();
    } else {
      // 기본 동작: 페이지 최상단으로 스크롤
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  /**
   * 로그인 버튼 클릭 핸들러
   */
  const handleLoginClick = async () => {
    try {
      await login();
    } catch (error: unknown) {
      // 에러 타입 확인 후 메시지 추출
      const errorMessage = error instanceof Error ? error.message : '로그인 중 오류가 발생했습니다.';
      alert(errorMessage);
    }
  };

  /**
   * 로그아웃 버튼 클릭 핸들러
   */
  const handleLogoutClick = async () => {
    try {
      await logout();
    } catch (error: unknown) {
      // 에러 타입 확인 후 메시지 추출
      const errorMessage = error instanceof Error ? error.message : '로그아웃 중 오류가 발생했습니다.';
      alert(errorMessage);
    }
  };

  return (
    <header className={`sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 ${className}`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* 로고 및 브랜드명 */}
          <div className="flex items-center">
            <button
              onClick={handleLogoClick}
              className="flex items-center space-x-2 text-xl font-bold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
              aria-label="DevCanvas 홈으로 이동"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">DC</span>
              </div>
              <span>DevCanvas</span>
            </button>
          </div>

          {/* 데스크톱 네비게이션 */}
          <div className="hidden md:flex items-center space-x-8">
            <nav className="flex items-center space-x-8">
              {dynamicNavigationItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={(e) => {
                    if (!item.external) {
                      e.preventDefault();
                      handleNavigationClick(item.href, item.external);
                    }
                  }}
                  target={item.external ? '_blank' : undefined}
                  rel={item.external ? 'noopener noreferrer' : undefined}
                  className="flex items-center text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors duration-200"
                >
                  {item.icon && <span className="mr-1">{item.icon}</span>}
                  {item.label}
                </a>
              ))}
            </nav>
            
            {/* 방문자 카운터 */}
            <VisitorCounter className="mr-4" />
            
            {/* 테마 토글 버튼 */}
            <ThemeToggle size="md" />
            
            {/* 인증 UI */}
            <div className="flex items-center space-x-4">
              {isLoading ? (
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              ) : currentUser ? (
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2">
                    {currentUser.photoURL && (
                      <img
                        src={currentUser.photoURL}
                        alt={currentUser.displayName || '사용자'}
                        className="w-8 h-8 rounded-full"
                      />
                    )}
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {currentUser.displayName || '사용자'}
                    </span>
                  </div>
                  <button
                    onClick={handleLogoutClick}
                    className="px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 transition-colors duration-200"
                  >
                    로그아웃
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleLoginClick}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  <span>Google 로그인</span>
                </button>
              )}
            </div>
          </div>

          {/* 모바일 햄버거 메뉴 버튼 */}
          <div className="md:hidden">
            <button
              onClick={handleMobileMenuToggle}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
              aria-label="메뉴 열기"
              aria-expanded={isMobileMenuOpen}
            >
              <svg
                className="h-6 w-6"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 24 24"
              >
                {isMobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* 모바일 네비게이션 메뉴 */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
              {/* 방문자 카운터 */}
              <div className="flex justify-center px-3 py-2 mb-2">
                <VisitorCounter />
              </div>
              
              {/* 모바일 테마 토글 */}
              <div className="flex justify-center px-3 py-2 mb-2">
                <ThemeToggle size="md" />
              </div>
              
              {dynamicNavigationItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={(e) => {
                    if (!item.external) {
                      e.preventDefault();
                      handleNavigationClick(item.href, item.external);
                    }
                  }}
                  target={item.external ? '_blank' : undefined}
                  rel={item.external ? 'noopener noreferrer' : undefined}
                  className="flex items-center px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md transition-colors duration-200"
                >
                  {item.icon && <span className="mr-2">{item.icon}</span>}
                  {item.label}
                </a>
              ))}
              
              {/* 모바일 인증 UI */}
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                {isLoading ? (
                  <div className="flex justify-center py-2">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                  </div>
                ) : currentUser ? (
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3 px-3 py-2">
                      {currentUser.photoURL && (
                        <img
                          src={currentUser.photoURL}
                          alt={currentUser.displayName || '사용자'}
                          className="w-10 h-10 rounded-full"
                        />
                      )}
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {currentUser.displayName || '사용자'}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {currentUser.email}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={handleLogoutClick}
                      className="block w-full text-left px-3 py-2 text-base font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors duration-200"
                    >
                      로그아웃
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={handleLoginClick}
                    className="flex items-center justify-center space-x-2 w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    <span>Google 로그인</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
});

Header.displayName = 'Header';

export default Header; 