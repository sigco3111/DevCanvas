/**
 * 전역 타입 정의 파일
 * 모든 타입을 중앙에서 관리하고 export
 */

// 포트폴리오 관련 타입
export type {
  PortfolioCategory,
  PortfolioItem,
  PortfolioItemSimplified,
  PortfolioFilterOptions,
  AdminCredentials,
  AdminSession,
  ProjectStats,
} from './portfolio';

// Header 컴포넌트 관련 타입
export type {
  HeaderProps,
  NavigationItem,
} from '../components/Header/types';

// Hero 컴포넌트 관련 타입
export type {
  HeroProps,
  CTAButton,
} from '../components/Hero/types';

// 대시보드 관련 타입
export type {
  DashboardCategory,
  StatCardType,
  ChartType,
  StatCardProps,
  NumberStatCardProps,
  ListStatCardProps,
  ChartStatCardProps,
  PortfolioStatistics,
  BoardStatistics,
  UserStatistics,
  DashboardData,
} from './dashboard';

// 공통 UI 컴포넌트 타입
export interface BaseComponentProps {
  /** CSS 클래스명 */
  className?: string;
  
  /** 자식 요소 */
  children?: React.ReactNode;
}

/**
 * 테마 타입 정의
 * 다크모드/라이트모드 지원
 */
export type Theme = 'light' | 'dark' | 'system';

/**
 * 테마 컨텍스트 인터페이스
 */
export interface ThemeContextType {
  /** 현재 테마 */
  theme: Theme;
  
  /** 테마 변경 함수 */
  setTheme: (theme: Theme) => void;
  
  /** 실제 적용된 테마 (system일 경우 해석된 값) */
  resolvedTheme: 'light' | 'dark';
} 