/**
 * 포트폴리오 카테고리 타입
 * 게임, 웹앱, 전체 카테고리를 정의
 */
export type PortfolioCategory = 'game' | 'webapp' | 'all';

/**
 * 포트폴리오 항목 인터페이스
 * 개별 프로젝트의 정보를 담는 데이터 구조
 */
export interface PortfolioItem {
  /** 고유 식별자 */
  id: string;
  
  /** 프로젝트 제목 */
  title: string;
  
  /** 프로젝트 설명 */
  description: string;
  
  /** 프로젝트 카테고리 (게임 또는 웹앱) */
  category: Exclude<PortfolioCategory, 'all'>;
  
  /** 사용된 기술 스택 배열 */
  technologies: string[];
  
  /** 라이브 사이트 URL */
  liveUrl: string;
  
  /** 프로젝트 이미지 URL (선택적) */
  imageUrl?: string;
  
  /** 추천 프로젝트 여부 */
  featured: boolean;
  
  /** 프로젝트 생성 날짜 */
  createdAt: string;
  
  /** 프로젝트 업데이트 날짜 */
  updatedAt?: string;
  
  /** GitHub 저장소 URL (선택적) */
  githubUrl?: string;
  
  /** 개발 도구 */
  developmentTools?: string[];
}

/**
 * 포트폴리오 필터 옵션 인터페이스
 * 포트폴리오 그리드에서 사용되는 필터링 옵션
 */
export interface PortfolioFilterOptions {
  /** 선택된 카테고리 */
  category: PortfolioCategory;
  
  /** 추천 프로젝트만 표시 여부 */
  featuredOnly: boolean;
} 