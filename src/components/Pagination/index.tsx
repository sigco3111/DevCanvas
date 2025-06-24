import React from 'react';

interface PaginationProps {
  /** 현재 페이지 번호 (1부터 시작) */
  currentPage: number;
  /** 총 항목 수 */
  totalItems: number;
  /** 페이지당 항목 수 */
  itemsPerPage: number;
  /** 페이지 변경 콜백 함수 */
  onPageChange: (page: number) => void;
  /** 표시할 페이지 번호 개수 (기본값: 5) */
  maxVisiblePages?: number;
}

/**
 * 페이지네이션 컴포넌트
 * 프로젝트 목록의 페이지 네비게이션을 제공합니다.
 */
const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalItems,
  itemsPerPage,
  onPageChange,
  maxVisiblePages = 5
}) => {
  // 총 페이지 수 계산
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  
  // 현재 페이지의 시작/끝 항목 번호
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);
  
  // 표시할 페이지 번호 범위 계산
  const getVisiblePageNumbers = (): number[] => {
    const half = Math.floor(maxVisiblePages / 2);
    let start = Math.max(1, currentPage - half);
    let end = Math.min(totalPages, start + maxVisiblePages - 1);
    
    // 끝에서 시작점 조정
    if (end - start + 1 < maxVisiblePages) {
      start = Math.max(1, end - maxVisiblePages + 1);
    }
    
    const pages: number[] = [];
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };
  
  const visiblePages = getVisiblePageNumbers();
  
  // 페이지가 1개 이하면 페이지네이션 표시하지 않음
  if (totalPages <= 1) {
    return null;
  }
  
  return (
    <div className="flex flex-col items-center space-y-4 mt-8">
      {/* 항목 수 정보 */}
      <div className="text-sm text-gray-600 dark:text-gray-400">
        총 <span className="font-semibold text-gray-900 dark:text-white">{totalItems}</span>개 중{' '}
        <span className="font-semibold text-gray-900 dark:text-white">{startItem}</span>-
        <span className="font-semibold text-gray-900 dark:text-white">{endItem}</span>개 표시
      </div>
      
      {/* 페이지네이션 버튼들 */}
      <nav aria-label="페이지네이션" className="flex items-center space-x-1">
        {/* 첫 페이지로 이동 */}
        <button
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
            currentPage === 1
              ? 'text-gray-400 dark:text-gray-600 cursor-not-allowed'
              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
          }`}
          aria-label="첫 페이지로 이동"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
          </svg>
        </button>
        
        {/* 이전 페이지 */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
            currentPage === 1
              ? 'text-gray-400 dark:text-gray-600 cursor-not-allowed'
              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
          }`}
          aria-label="이전 페이지"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
        {/* 페이지 번호들 */}
        {visiblePages.map((pageNumber) => (
          <button
            key={pageNumber}
            onClick={() => onPageChange(pageNumber)}
            className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
              pageNumber === currentPage
                ? 'bg-blue-600 text-white'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
            aria-label={`페이지 ${pageNumber}${pageNumber === currentPage ? ' (현재 페이지)' : ''}`}
            aria-current={pageNumber === currentPage ? 'page' : undefined}
          >
            {pageNumber}
          </button>
        ))}
        
        {/* 다음 페이지 */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
            currentPage === totalPages
              ? 'text-gray-400 dark:text-gray-600 cursor-not-allowed'
              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
          }`}
          aria-label="다음 페이지"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
        
        {/* 마지막 페이지로 이동 */}
        <button
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
          className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
            currentPage === totalPages
              ? 'text-gray-400 dark:text-gray-600 cursor-not-allowed'
              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
          }`}
          aria-label="마지막 페이지로 이동"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
          </svg>
        </button>
      </nav>
      
      {/* 페이지 정보 */}
      <div className="text-xs text-gray-500 dark:text-gray-500">
        페이지 {currentPage} / {totalPages}
      </div>
    </div>
  );
};

export default Pagination; 