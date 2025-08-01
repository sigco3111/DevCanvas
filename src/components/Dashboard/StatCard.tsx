/**
 * 대시보드에 사용되는 통계 카드 컴포넌트
 * 다양한 통계 데이터를 일관된 카드 형태로 표시
 */
import React from 'react';
import { StatCardComponentProps } from './types';

const StatCard: React.FC<StatCardComponentProps> = ({
  title,
  icon,
  className = '',
  contentClassName = '',
  isLoading = false,
  children,
  onClick,
}) => {
  // 클릭 가능한 카드인지 여부에 따라 커서 스타일 결정
  const cursorStyle = onClick ? 'cursor-pointer' : '';
  
  return (
    <div 
      className={`relative bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden transition-all hover:shadow-md ${cursorStyle} ${className}`}
      onClick={onClick}
    >
      {/* 카드 헤더 */}
      <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {icon && <div className="text-blue-600 dark:text-blue-400">{icon}</div>}
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {title}
          </h3>
        </div>
      </div>
      
      {/* 카드 콘텐츠 */}
      <div className={`p-3 ${contentClassName}`}>
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-6">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-2"></div>
            <p className="text-sm text-gray-500 dark:text-gray-400">데이터 로드 중...</p>
          </div>
        ) : (
          children
        )}
      </div>
    </div>
  );
};

export default React.memo(StatCard); 