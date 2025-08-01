/**
 * 기본 제공 카테고리 목록
 * 새로운 카테고리는 언제든지 추가 가능합니다
 */
export const DEFAULT_CATEGORIES = [
  'App',
  '경영', 
  '전략',
  'RPG',
  '퍼즐',
  '보드게임',
  '육성',
] as const;

/**
 * 포트폴리오 카테고리 타입
 * 동적으로 카테고리 추가 가능
 */
export type PortfolioCategory = string | 'all';

/**
 * Gemini API Key 필요 상태 타입
 * required: 필수, optional: 선택, none: 필요없음
 */
export type GeminiApiStatus = 'required' | 'optional' | 'none';

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
  
  /** 라이브 사이트 URL (선택적) */
  liveUrl?: string;
  
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
  
  /** Gemini API Key 필요 상태 (기본값: 'none') */
  geminiApiStatus?: GeminiApiStatus;
  
  /** 댓글 수 */
  commentCount: number;
  
  /** 조회수 */
  viewCount: number;
}

/**
 * 간소화된 포트폴리오 항목 인터페이스
 * 프로젝트 카드에서 사용되는 필수 정보만 포함
 */
export interface PortfolioItemSimplified {
  /** 고유 식별자 */
  id: string;
  
  /** 프로젝트 제목 */
  title: string;
  
  /** 프로젝트 이미지 URL (선택적) */
  imageUrl?: string;
  
  /** 프로젝트 생성 날짜 */
  createdAt: string;
  
  /** 댓글 수 */
  commentCount: number;
  
  /** 조회수 */
  viewCount: number;
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

/**
 * 관리자 자격증명 인터페이스
 */
export interface AdminCredentials {
  /** 관리자 ID */
  id: string;
  
  /** 관리자 비밀번호 */
  password: string;
}

/**
 * 관리자 세션 인터페이스
 */
export interface AdminSession {
  /** 인증 상태 */
  isAuthenticated: boolean;
  
  /** 로그인 시간 */
  loginTime: Date;
  
  /** 세션 만료 시간 */
  expiresAt: Date;
}

/**
 * 프로젝트 통계 인터페이스
 */
export interface ProjectStats {
  /** 프로젝트 ID */
  projectId: string;
  
  /** 조회수 */
  viewCount: number;
  
  /** 마지막 조회 시간 */
  lastViewed: Date;
}

/**
 * 카테고리 관련 유틸리티 함수들
 */
export const CategoryUtils = {
  /**
   * 모든 카테고리 목록을 가져옵니다 (포트폴리오 데이터에서 동적으로 추출)
   */
  getAllCategories: (portfolios: PortfolioItem[]): string[] => {
    const categories = new Set<string>();
    
    // 기본 카테고리 추가
    DEFAULT_CATEGORIES.forEach(cat => categories.add(cat));
    
    // 포트폴리오에서 사용된 카테고리 추가
    portfolios.forEach(portfolio => {
      if (portfolio.category !== 'all') {
        categories.add(portfolio.category);
      }
    });
    
    return Array.from(categories).sort();
  },

  /**
   * 카테고리가 유효한지 확인합니다
   */
  isValidCategory: (category: string): boolean => {
    return category === 'all' || (typeof category === 'string' && category.length > 0);
  },

  /**
   * 새로운 카테고리를 추가할 수 있는지 확인합니다
   */
  canAddCategory: (category: string): boolean => {
    return typeof category === 'string' && 
           category.length > 0 && 
           category !== 'all' &&
           !category.includes('/') && // Firebase 컬렉션 이름 제한
           category.trim() === category; // 앞뒤 공백 없음
  }
}; 