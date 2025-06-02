import type { BaseComponentProps } from '../../types';

/**
 * CTA 버튼 인터페이스
 */
export interface CTAButton {
  /** 버튼 텍스트 */
  text: string;
  
  /** 클릭 시 이동할 앵커 또는 URL */
  href: string;
  
  /** 외부 링크 여부 */
  external?: boolean;
  
  /** 버튼 스타일 변형 */
  variant?: 'primary' | 'secondary';
}

/**
 * Hero 섹션 컴포넌트 Props 인터페이스
 */
export interface HeroProps extends BaseComponentProps {
  /** 메인 타이틀 */
  title?: string;
  
  /** 서브 타이틀 */
  subtitle?: string;
  
  /** 설명 텍스트 */
  description?: string;
  
  /** CTA 버튼들 */
  ctaButtons?: CTAButton[];
  
  /** 배경 그라데이션 비활성화 */
  disableGradient?: boolean;
  
  /** 전체 프로젝트 개수 */
  totalProjects?: number;
} 