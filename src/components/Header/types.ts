import type { BaseComponentProps } from '../../types';

/**
 * 네비게이션 메뉴 항목 인터페이스
 */
export interface NavigationItem {
  /** 링크 라벨 */
  label: string;
  
  /** 링크 URL (# 시작은 내부 링크) */
  href: string;
  
  /** 외부 링크 여부 */
  external?: boolean;
  
  /** 아이콘 SVG (선택적) */
  icon?: React.ReactNode;
}

/**
 * Header 컴포넌트 Props 인터페이스
 */
export interface HeaderProps extends BaseComponentProps {
  /** 네비게이션 항목 목록 */
  navigationItems?: NavigationItem[];
  
  /** 로고 클릭 핸들러 */
  onLogoClick?: () => void;
  
  /** 네비게이션 링크 클릭 핸들러 */
  onNavigationClick?: (href: string, external?: boolean) => void;
  
  /** 추가 CSS 클래스 */
  className?: string;
} 