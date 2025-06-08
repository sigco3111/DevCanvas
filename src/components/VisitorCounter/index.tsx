import React, { useEffect, useState } from 'react';
import { incrementOncePerSession, checkVisitExpiry } from '../../utils/visitorCounter';
import { VisitorCounterProps } from './types';

/**
 * 방문자 카운터 컴포넌트
 * CountAPI를 사용하여 DB 없이 방문자 수를 표시합니다.
 */
const VisitorCounter: React.FC<VisitorCounterProps> = ({
  className = '',
  showIcon = true,
  showLabel = true,
  label = '누적 방문자',
  iconColor = 'text-blue-200',
  valueColor = 'text-white',
  labelColor = 'text-blue-100',
}) => {
  // 방문자 수를 저장할 상태
  const [visitorCount, setVisitorCount] = useState<number | null>(null);
  // 로딩 상태
  const [isLoading, setIsLoading] = useState<boolean>(true);
  // 오류 상태
  const [hasError, setHasError] = useState<boolean>(false);

  useEffect(() => {
    // 방문 기록 만료 확인
    checkVisitExpiry();
    
    // 방문자 카운터 증가 (세션당 한 번)
    const fetchVisitorCount = async () => {
      try {
        setIsLoading(true);
        const count = await incrementOncePerSession();
        setVisitorCount(count);
        setHasError(false);
      } catch (error) {
        console.error('방문자 카운터 조회 실패:', error);
        setHasError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchVisitorCount();
  }, []);

  // 로딩 중인 경우
  if (isLoading) {
    return (
      <div className={`inline-flex items-center space-x-1 ${className}`}>
        <div className="w-4 h-4 rounded-full bg-blue-300/50 animate-pulse"></div>
        <span className="text-sm text-blue-100 opacity-70">로딩 중...</span>
      </div>
    );
  }

  // 오류가 발생한 경우
  if (hasError) {
    return null; // 오류 시 컴포넌트를 표시하지 않음
  }

  return (
    <div className={`inline-flex items-center space-x-2 ${className}`}>
      {showIcon && (
        <svg 
          className={`w-5 h-5 ${iconColor}`} 
          fill="currentColor" 
          viewBox="0 0 20 20" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path 
            fillRule="evenodd" 
            d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" 
            clipRule="evenodd" 
          />
        </svg>
      )}
      
      <div className="flex items-center space-x-1">
        {showLabel && <span className={`text-sm ${labelColor}`}>{label}:</span>}
        <span className={`font-semibold ${valueColor}`}>
          {visitorCount?.toLocaleString() || '0'}
        </span>
      </div>
    </div>
  );
};

export default VisitorCounter; 