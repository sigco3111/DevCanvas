import type { BaseComponentProps } from '../../types';

/**
 * 네비게이션 메뉴 항목 인터페이스
 */
export interface NavigationItem {
  /** 메뉴 항목 라벨 */
  label: string;
  
  /** 스크롤 앵커 또는 URL */
  href: string;
  
  /** 외부 링크 여부 */
  external?: boolean;
}

/**
 * Header 컴포넌트 Props 인터페이스
 */
export interface HeaderProps extends BaseComponentProps {
  /** 네비게이션 메뉴 항목들 */
  navigationItems?: NavigationItem[];
  
  /** 로고 클릭 시 실행될 함수 */
  onLogoClick?: () => void;
  
  /** 네비게이션 클릭 시 실행될 함수 */
  onNavigationClick?: (href: string) => void;
} 