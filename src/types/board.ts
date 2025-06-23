import { Timestamp } from 'firebase/firestore';

/**
 * 게시글 상태 타입
 */
export type PostStatus = 'published' | 'draft' | 'archived';

/**
 * 게시글 카테고리 타입
 */
export type PostCategory = 'general' | 'question' | 'tip' | 'announcement' | 'bug-report';

/**
 * 게시글 인터페이스
 */
export interface BoardPost {
  /** 게시글 고유 ID (Firestore 자동 생성) */
  id?: string;
  
  /** 게시글 제목 */
  title: string;
  
  /** 게시글 내용 */
  content: string;
  
  /** 작성자 정보 */
  author: {
    uid: string;
    name: string;
    email?: string;
    avatar?: string;
    role?: string;
  };
  
  /** 게시글 카테고리 */
  category: PostCategory;
  
  /** 게시글 상태 */
  status: PostStatus;
  
  /** 조회수 */
  viewCount: number;
  
  /** 좋아요 수 */
  likeCount: number;
  
  /** 댓글 수 */
  commentCount: number;
  
  /** 태그 목록 */
  tags: string[];
  
  /** 생성 날짜 */
  createdAt: Timestamp;
  
  /** 수정 날짜 */
  updatedAt: Timestamp;
  
  /** 고정 게시글 여부 */
  isPinned: boolean;
}

/**
 * 댓글 인터페이스
 */
export interface BoardComment {
  /** 댓글 고유 ID */
  id?: string;
  
  /** 속한 게시글 ID */
  postId: string;
  
  /** 댓글 내용 */
  content: string;
  
  /** 작성자 정보 */
  author: {
    uid: string;
    name: string;
    email?: string;
    avatar?: string;
    role?: string;
  };
  
  /** 부모 댓글 ID (대댓글인 경우) */
  parentId?: string;
  
  /** 좋아요 수 */
  likeCount: number;
  
  /** 생성 날짜 */
  createdAt: Timestamp;
  
  /** 수정 날짜 */
  updatedAt: Timestamp;
  
  /** 삭제 여부 */
  isDeleted: boolean;
}

/**
 * 게시판 필터 옵션
 */
export interface BoardFilterOptions {
  /** 카테고리 필터 */
  category?: PostCategory | 'all';
  
  /** 상태 필터 */
  status?: PostStatus | 'all';
  
  /** 검색어 */
  searchTerm?: string;
  
  /** 정렬 기준 */
  sortBy: 'latest' | 'oldest' | 'popular' | 'mostViewed';
  
  /** 페이지당 항목 수 */
  limit: number;
}

/**
 * 페이지네이션 정보
 */
export interface PaginationInfo {
  /** 현재 페이지 */
  currentPage: number;
  
  /** 총 페이지 수 */
  totalPages: number;
  
  /** 총 게시글 수 */
  totalPosts: number;
  
  /** 페이지당 표시 항목 수 */
  postsPerPage: number;
  
  /** 다음 페이지 존재 여부 */
  hasNext: boolean;
  
  /** 이전 페이지 존재 여부 */
  hasPrev: boolean;
} 