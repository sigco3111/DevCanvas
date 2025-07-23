/**
 * 대시보드 관련 타입 정의 파일
 * 사이트의 각종 통계를 표시하는 데 필요한 인터페이스 정의
 */

import { PostCategory } from './board';
import { Timestamp } from 'firebase/firestore';

/**
 * 대시보드 통계 카테고리 타입
 */
export type DashboardCategory = 'portfolio' | 'board' | 'user' | 'tech';

/**
 * 통계 카드 타입
 * 숫자형, 리스트형, 차트형 통계 카드를 정의
 */
export type StatCardType = 'number' | 'list' | 'chart';

/**
 * 차트 타입 정의
 */
export type ChartType = 'donut' | 'bar' | 'line' | 'area';

/**
 * 통계 카드 인터페이스
 * 대시보드에 표시되는 각 통계 카드의 공통 속성
 */
export interface StatCardProps {
  /** 카드 제목 */
  title: string;
  
  /** 통계 카드 타입 */
  type: StatCardType;
  
  /** 카드 아이콘 (선택적) */
  icon?: string;
  
  /** 통계 카테고리 */
  category: DashboardCategory;
  
  /** 추가 설명 (선택적) */
  description?: string;
  
  /** 마지막 업데이트 시간 (선택적) */
  lastUpdated?: Date | Timestamp | null;
  
  /** 카드 크기 (1: 작음, 2: 중간, 3: 큼) */
  size?: 1 | 2 | 3;
}

/**
 * 숫자형 통계 카드 인터페이스
 * 단일 수치를 표시하는 통계 카드
 */
export interface NumberStatCardProps extends StatCardProps {
  type: 'number';
  
  /** 표시할 숫자 값 */
  value: number;
  
  /** 이전 값 (증감률 계산용, 선택적) */
  previousValue?: number;
  
  /** 값의 단위 (선택적) */
  unit?: string;
  
  /** 색상 (선택적, 기본값: 'blue') */
  color?: 'blue' | 'green' | 'red' | 'yellow' | 'purple';
}

/**
 * 리스트형 통계 카드 인터페이스
 * 목록 형태로 데이터를 표시하는 통계 카드
 */
export interface ListStatCardProps extends StatCardProps {
  type: 'list';
  
  /** 표시할 목록 데이터 */
  items: Array<{
    /** 항목 ID */
    id: string;
    
    /** 항목 제목 */
    title: string;
    
    /** 항목 값 */
    value?: number | string;
    
    /** 추가 정보 */
    meta?: string;
    
    /** 항목 링크 URL (선택적) */
    link?: string;
    
    /** 항목 아이콘 (선택적) */
    icon?: string;
  }>;
  
  /** 최대 표시 항목 수 */
  maxItems?: number;
}

/**
 * 차트형 통계 카드 인터페이스
 * 차트로 데이터를 시각화하는 통계 카드
 */
export interface ChartStatCardProps extends StatCardProps {
  type: 'chart';
  
  /** 차트 타입 */
  chartType: ChartType;
  
  /** 차트 데이터 */
  data: Array<{
    /** 항목 이름 */
    name: string;
    
    /** 항목 값 */
    value: number;
    
    /** 카테고리 (선택적) */
    category?: string;
    
    /** 색상 (선택적) */
    color?: string;
    
    /** 추가 속성 */
    [key: string]: any;
  }>;
  
  /** 차트 색상 팔레트 (선택적) */
  colors?: string[];
  
  /** X축 데이터 키 (선택적) */
  xAxisKey?: string;
  
  /** Y축 데이터 키 (선택적) */
  yAxisKey?: string;
  
  /** 라인 차트용 여러 시리즈 데이터 (선택적) */
  series?: Array<{
    /** 시리즈 이름 */
    name: string;
    
    /** 시리즈 데이터 키 */
    dataKey: string;
    
    /** 시리즈 색상 */
    color?: string;
  }>;
}

/**
 * 포트폴리오 통계 인터페이스
 */
export interface PortfolioStatistics {
  /** 총 프로젝트 수 */
  totalProjects: number;
  
  /** 카테고리별 프로젝트 수 */
  categoryDistribution: Array<{
    /** 카테고리 이름 */
    name: string;
    
    /** 프로젝트 수 */
    count: number;
  }>;
  
  /** 최근 프로젝트 */
  recentProjects: Array<{
    /** 프로젝트 ID */
    id: string;
    
    /** 프로젝트 제목 */
    title: string;
    
    /** 생성일 */
    createdAt: string;
    
    /** 카테고리 */
    category: string;
  }>;
  
  /** Gemini API 상태별 프로젝트 수 */
  geminiApiDistribution: Array<{
    /** API 상태 */
    status: string;
    
    /** 프로젝트 수 */
    count: number;
  }>;
  
  /** 시간에 따른 프로젝트 추가 추이 */
  projectsOverTime: Array<{
    /** 날짜 */
    date: string;
    
    /** 프로젝트 수 */
    count: number;
  }>;
}

/**
 * 게시판 통계 인터페이스
 */
export interface BoardStatistics {
  /** 총 게시글 수 */
  totalPosts: number;
  
  /** 총 댓글 수 */
  totalComments: number;
  
  /** 카테고리별 게시글 수 */
  categoryDistribution: Array<{
    /** 카테고리 이름 */
    name: PostCategory | 'all';
    
    /** 게시글 수 */
    count: number;
  }>;
  
  /** 인기 게시글 */
  popularPosts: Array<{
    /** 게시글 ID */
    id: string;
    
    /** 게시글 제목 */
    title: string;
    
    /** 작성자 이름 */
    authorName: string;
    
    /** 조회수 */
    viewCount: number;
    
    /** 좋아요 수 */
    likeCount: number;
  }>;
  
  /** 시간에 따른 게시글 작성 추이 */
  postsOverTime: Array<{
    /** 날짜 */
    date: string;
    
    /** 게시글 수 */
    count: number;
  }>;
}

/**
 * 사용자 활동 통계 인터페이스
 */
export interface UserStatistics {
  /** 총 방문자 수 */
  totalVisitors: number;
  
  /** 로그인 사용자 수 */
  totalUsers: number;
  
  /** 사용자별 게시글 작성 순위 */
  topContributors: Array<{
    /** 사용자 ID */
    userId: string;
    
    /** 사용자 이름 */
    userName: string;
    
    /** 게시글 수 */
    postCount: number;
  }>;
  
  /** 시간대별 방문자 분포 */
  visitsByHour: Array<{
    /** 시간대 (0-23) */
    hour: number;
    
    /** 방문자 수 */
    count: number;
  }>;
  
  /** 일별 활동 추이 */
  activityByDay: Array<{
    /** 날짜 */
    date: string;
    
    /** 방문자 수 */
    visitors: number;
    
    /** 게시글 수 */
    posts: number;
    
    /** 댓글 수 */
    comments: number;
  }>;
}

/**
 * 기술 스택 통계 인터페이스
 */
export interface TechStackStatistics {
  /** 총 기술 스택 수 */
  totalTechnologies: number;
  
  /** 총 개발 도구 수 */
  totalDevelopmentTools: number;
  
  /** 기술 스택 사용 빈도 */
  technologyDistribution: Array<{
    /** 기술 이름 */
    name: string;
    
    /** 사용 프로젝트 수 */
    count: number;
  }>;
  
  /** 개발 도구 사용 빈도 */
  developmentToolDistribution: Array<{
    /** 도구 이름 */
    name: string;
    
    /** 사용 프로젝트 수 */
    count: number;
  }>;
  
  /** 가장 많이 사용된 기술 스택 */
  topTechnologies: Array<{
    /** 기술 이름 */
    name: string;
    
    /** 사용 프로젝트 수 */
    count: number;
    
    /** 사용 비율 (%) */
    percentage: number;
  }>;
  
  /** 가장 많이 사용된 개발 도구 */
  topDevelopmentTools: Array<{
    /** 도구 이름 */
    name: string;
    
    /** 사용 프로젝트 수 */
    count: number;
    
    /** 사용 비율 (%) */
    percentage: number;
  }>;
  
  /** 프로젝트별 기술 스택 수 */
  technologiesPerProject: Array<{
    /** 프로젝트 ID */
    projectId: string;
    
    /** 프로젝트 제목 */
    projectTitle: string;
    
    /** 기술 스택 수 */
    techCount: number;
  }>;
}

/**
 * 대시보드 데이터 인터페이스
 * 대시보드에 표시되는 모든 통계 데이터를 포함
 */
export interface DashboardData {
  /** 포트폴리오 통계 */
  portfolio: PortfolioStatistics;
  
  /** 게시판 통계 */
  board: BoardStatistics;
  
  /** 사용자 활동 통계 */
  user: UserStatistics;
  
  /** 기술 스택 통계 */
  tech: TechStackStatistics;
  
  /** 마지막 업데이트 시간 */
  lastUpdated: Date;
} 