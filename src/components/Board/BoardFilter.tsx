import React from 'react';
import { BoardFilterOptions, PostCategory } from '../../types/board';

interface BoardFilterProps {
  filterOptions: BoardFilterOptions;
  onFilterChange: (filters: Partial<BoardFilterOptions>) => void;
}

/**
 * 게시판 필터 컴포넌트
 * 카테고리, 정렬, 검색 필터를 제공
 */
const BoardFilter: React.FC<BoardFilterProps> = ({ filterOptions, onFilterChange }) => {
  // 카테고리 옵션
  const categoryOptions = [
    { value: 'all', label: '전체', emoji: '📁' },
    { value: 'general', label: '일반', emoji: '💬' },
    { value: 'question', label: '질문', emoji: '❓' },
    { value: 'tip', label: '팁', emoji: '💡' },
    { value: 'announcement', label: '공지', emoji: '📢' },
    { value: 'bug-report', label: '버그제보', emoji: '🐛' }
  ];

  // 정렬 옵션
  const sortOptions = [
    { value: 'latest', label: '최신순' },
    { value: 'oldest', label: '오래된순' },
    { value: 'popular', label: '인기순' },
    { value: 'mostViewed', label: '조회순' }
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 mb-6 border border-gray-200 dark:border-gray-700">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* 검색 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            🔍 검색
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="search"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="제목, 내용, 태그 검색..."
              value={filterOptions.searchTerm || ''}
              onChange={(e) => onFilterChange({ searchTerm: e.target.value })}
            />
          </div>
        </div>

        {/* 카테고리 필터 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            📂 카테고리
          </label>
          <select
            className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            value={filterOptions.category || 'all'}
            onChange={(e) => onFilterChange({ category: e.target.value as PostCategory | 'all' })}
          >
            {categoryOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.emoji} {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* 정렬 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            📊 정렬
          </label>
          <select
            className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            value={filterOptions.sortBy}
            onChange={(e) => onFilterChange({ sortBy: e.target.value as any })}
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 활성 필터 표시 */}
      {(filterOptions.searchTerm || filterOptions.category !== 'all') && (
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">활성 필터:</span>
            
            {filterOptions.searchTerm && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                검색: "{filterOptions.searchTerm}"
                <button
                  type="button"
                  onClick={() => onFilterChange({ searchTerm: '' })}
                  className="ml-1 hover:bg-blue-200 dark:hover:bg-blue-800 rounded-full p-0.5"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </span>
            )}
            
            {filterOptions.category !== 'all' && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                카테고리: {categoryOptions.find(opt => opt.value === filterOptions.category)?.label}
                <button
                  type="button"
                  onClick={() => onFilterChange({ category: 'all' })}
                  className="ml-1 hover:bg-green-200 dark:hover:bg-green-800 rounded-full p-0.5"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </span>
            )}
            
            <button
              onClick={() => onFilterChange({ searchTerm: '', category: 'all' })}
              className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 underline"
            >
              모든 필터 초기화
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BoardFilter; 