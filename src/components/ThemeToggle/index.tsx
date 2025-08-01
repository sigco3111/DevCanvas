import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';

/**
 * 테마 토글 버튼 Props
 */
interface ThemeToggleProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

/**
 * 테마 토글 버튼 컴포넌트
 */
const ThemeToggle: React.FC<ThemeToggleProps> = ({ 
  className = '', 
  size = 'md' 
}) => {
  const { theme, toggleTheme } = useTheme();

  // 크기별 스타일 정의
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12'
  };

  const iconSizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  return (
    <button
      onClick={toggleTheme}
      className={`
        ${sizeClasses[size]}
        inline-flex items-center justify-center
        rounded-lg border border-gray-300 dark:border-gray-600
        bg-white dark:bg-gray-800
        text-gray-500 dark:text-gray-400
        hover:bg-gray-50 dark:hover:bg-gray-700
        hover:text-gray-700 dark:hover:text-gray-200
        focus:outline-none focus:ring-2 focus:ring-offset-2 
        focus:ring-blue-500 dark:focus:ring-blue-400
        transition-colors duration-200
        ${className}
      `}
      title={theme === 'light' ? '다크모드로 전환' : '라이트모드로 전환'}
      aria-label={theme === 'light' ? '다크모드로 전환' : '라이트모드로 전환'}
    >
      {theme === 'light' ? (
        // 달 아이콘 (다크모드로 전환)
        <svg 
          className={iconSizeClasses[size]} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" 
          />
        </svg>
      ) : (
        // 태양 아이콘 (라이트모드로 전환)
        <svg 
          className={iconSizeClasses[size]} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" 
          />
        </svg>
      )}
    </button>
  );
};

export default ThemeToggle;