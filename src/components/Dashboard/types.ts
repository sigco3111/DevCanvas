/**
 * 대시보드 컴포넌트 관련 타입 정의
 */
import { DashboardData } from '../../types/dashboard';

/**
 * 대시보드 모달 속성 인터페이스
 */
export interface DashboardModalProps {
  /** 모달 표시 여부 */
  isOpen: boolean;
  
  /** 모달 닫기 핸들러 */
  onClose: () => void;
  
  /** 대시보드 데이터 */
  data: DashboardData | null;
  
  /** 로딩 상태 */
  isLoading?: boolean;
  
  /** 오류 메시지 */
  error?: string | null;
  
  /** 데이터 새로고침 핸들러 */
  onRefresh?: () => void;
}

/**
 * 통계 카드 Props 인터페이스
 */
export interface StatCardComponentProps {
  /** 카드 제목 */
  title: string;
  
  /** 아이콘 (SVG 문자열 또는 컴포넌트) */
  icon?: React.ReactNode;
  
  /** 추가 스타일 클래스 */
  className?: string;
  
  /** 카드 콘텐츠 영역 추가 스타일 클래스 */
  contentClassName?: string;
  
  /** 로딩 상태 */
  isLoading?: boolean;
  
  /** 카드 내용 */
  children: React.ReactNode;
  
  /** 카드 클릭 핸들러 (선택적) */
  onClick?: () => void;
}

/**
 * 차트 컴포넌트 공통 Props
 */
export interface BaseChartProps {
  /** 높이 */
  height?: number;
  
  /** 너비 */
  width?: number;
  
  /** 마진 */
  margin?: {
    top?: number;
    right?: number;
    bottom?: number;
    left?: number;
  };
  
  /** 색상 배열 */
  colors?: string[];
  
  /** 애니메이션 사용 여부 */
  animation?: boolean;
  
  /** 로딩 상태 */
  isLoading?: boolean;
  
  /** 다크 모드 여부 */
  isDarkMode?: boolean;
} 