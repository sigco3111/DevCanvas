import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

/**
 * 테마 타입 정의
 */
export type Theme = 'light' | 'dark';

/**
 * 테마 컨텍스트 타입 정의
 */
interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

/**
 * 테마 컨텍스트 생성
 */
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

/**
 * 테마 컨텍스트 프로바이더 Props
 */
interface ThemeProviderProps {
  children: ReactNode;
}

/**
 * 테마 컨텍스트 프로바이더
 */
export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  // 다크모드를 기본값으로 설정
  const [theme, setThemeState] = useState<Theme>('dark');

  // 컴포넌트 마운트 시 저장된 테마 설정 불러오기
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as Theme;
    if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark')) {
      setThemeState(savedTheme);
    } else {
      // 저장된 테마가 없으면 다크모드를 기본값으로 설정
      setThemeState('dark');
      localStorage.setItem('theme', 'dark');
    }
  }, []);

  // 테마 변경 시 DOM과 localStorage 업데이트
  useEffect(() => {
    const root = window.document.documentElement;
    
    // 이전 테마 클래스 제거
    root.classList.remove('light', 'dark');
    
    // 새 테마 클래스 추가
    root.classList.add(theme);
    
    // localStorage에 저장
    localStorage.setItem('theme', theme);
    
    console.log(`테마 변경: ${theme}`);
  }, [theme]);

  /**
   * 테마 토글 함수
   */
  const toggleTheme = () => {
    setThemeState(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  /**
   * 테마 직접 설정 함수
   */
  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  const value: ThemeContextType = {
    theme,
    toggleTheme,
    setTheme
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

/**
 * 테마 컨텍스트 사용 훅
 */
export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme은 ThemeProvider 내부에서 사용되어야 합니다');
  }
  return context;
};