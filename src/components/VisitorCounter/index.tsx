/**
 * 방문자 카운터 컴포넌트
 * 사이트 방문자 수를 추적하고 표시하는 컴포넌트
 */
import React, { useEffect, useState } from 'react';
import { db } from '../../lib/firebase';
import { doc, getDoc, updateDoc, increment, setDoc } from 'firebase/firestore';

interface VisitorCounterProps {
  /** CSS 클래스명 */
  className?: string;
  
  /** 아이콘 표시 여부 */
  showIcon?: boolean;
  
  /** 레이블 텍스트 */
  label?: string;
}

/**
 * 사이트 방문자 수를 추적하고 표시하는 컴포넌트
 * 세션 스토리지를 사용하여 중복 카운팅 방지
 */
const VisitorCounter: React.FC<VisitorCounterProps> = ({
  className = '',
  showIcon = true,
  label = '방문자 수'
}) => {
  // 방문자 수 상태
  const [count, setCount] = useState<number | null>(null);
  // 로딩 상태
  const [isLoading, setIsLoading] = useState(true);
  // 에러 상태
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const trackVisitor = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // 세션 ID 확인 (중복 카운팅 방지)
        const sessionKey = 'devcanvas_visitor_tracked';
        const hasTracked = sessionStorage.getItem(sessionKey);
        
        // 이미 현재 세션에서 카운팅되었는지 확인
        if (!hasTracked) {
          // statistics 컬렉션 내의 visitors 문서 참조
          const visitorsRef = doc(db, 'statistics', 'visitors');
          
          try {
            // 문서 존재 여부 확인
            const docSnap = await getDoc(visitorsRef);
            
            if (docSnap.exists()) {
              // 문서가 존재하면 카운터 증가
              await updateDoc(visitorsRef, {
                count: increment(1),
                lastUpdated: new Date()
              });
            } else {
              // 문서가 없으면 새로 생성
              await setDoc(visitorsRef, {
                count: 1,
                lastUpdated: new Date()
              });
            }
            
            // 방문 추적 완료 표시
            sessionStorage.setItem(sessionKey, 'true');
          } catch (err) {
            console.error('방문자 수 업데이트 실패:', err);
          }
        }
        
        // 최신 방문자 수 가져오기
        const visitorsRef = doc(db, 'statistics', 'visitors');
        const visitorsDoc = await getDoc(visitorsRef);
        
        if (visitorsDoc.exists()) {
          const visitorData = visitorsDoc.data();
          setCount(visitorData.count || 0);
        } else {
          setCount(0);
        }
        
      } catch (err) {
        console.error('방문자 수 조회 실패:', err);
        setError('방문자 수를 불러올 수 없습니다.');
      } finally {
        setIsLoading(false);
      }
    };
    
    trackVisitor();
  }, []);
  
  return (
    <div className={`inline-flex items-center ${className}`}>
      {showIcon && (
        <svg className="w-4 h-4 mr-1 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
      )}
      
      <span className="text-sm text-gray-600 dark:text-gray-400">
        {label}:{' '}
        {isLoading ? (
          <span className="animate-pulse">로딩 중...</span>
        ) : error ? (
          <span className="text-red-600 dark:text-red-400">오류</span>
        ) : (
          <span className="font-medium text-gray-900 dark:text-gray-100">
            {count?.toLocaleString()}명
          </span>
        )}
      </span>
    </div>
  );
};

export default VisitorCounter; 