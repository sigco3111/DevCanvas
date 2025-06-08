import type { BaseComponentProps } from '../../types';

/**
 * 방문자 카운터 컴포넌트 Props 인터페이스
 */
export interface VisitorCounterProps extends BaseComponentProps {
  /** 아이콘 표시 여부 */
  showIcon?: boolean;
  
  /** 레이블 표시 여부 */
  showLabel?: boolean;
  
  /** 방문자 카운터 레이블 텍스트 */
  label?: string;
  
  /** 아이콘 색상 클래스 */
  iconColor?: string;
  
  /** 카운터 값 색상 클래스 */
  valueColor?: string;
  
  /** 레이블 색상 클래스 */
  labelColor?: string;
} 