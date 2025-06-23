import React, { useState } from 'react';
import type { HeaderProps, NavigationItem } from './types';
import { useAuth } from '../../contexts/AuthContext';

/**
 * 기본 네비게이션 메뉴 항목들
 */
const DEFAULT_NAVIGATION: NavigationItem[] = [
  { label: '홈', href: '#home' },
  { label: '프로젝트', href: '#projects' },
  { label: '게시판', href: '#board' },
];

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
  
  // 인증 상태 및 함수들
  const { currentUser, isLoading, login, logout } = useAuth();

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

    // 외부 콜백이 있으면 먼저 실행
    if (onNavigationClick) {
      onNavigationClick(href);
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
    } catch (error: any) {
      alert(error.message || '로그인 중 오류가 발생했습니다.');
    }
  };

  /**
   * 로그아웃 버튼 클릭 핸들러
   */
  const handleLogoutClick = async () => {
    try {
      await logout();
    } catch (error: any) {
      alert(error.message || '로그아웃 중 오류가 발생했습니다.');
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
              {navigationItems.map((item) => (
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
                  className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors duration-200"
                >
                  {item.label}
                </a>
              ))}
            </nav>
            
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
              {navigationItems.map((item) => (
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
                  className="block px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md transition-colors duration-200"
                >
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