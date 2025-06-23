/**
 * 날짜 관련 유틸리티 함수들
 */

/**
 * 안전한 날짜 생성 함수
 * 미래 날짜인 경우 현재 날짜로 수정
 */
export const createSafeDate = (dateString?: string): string => {
  if (!dateString) {
    return new Date('2025-01-17').toISOString(); // 현재 날짜로 설정
  }
  
  try {
    const date = new Date(dateString);
    
    // Invalid Date 체크
    if (isNaN(date.getTime())) {
      console.warn('Invalid date string:', dateString);
      return new Date('2025-01-17').toISOString();
    }
    
    // 미래 날짜 체크 (2025년 이후)
    if (date.getFullYear() > 2024) {
      console.warn('Future date detected, adjusting:', dateString);
      // 2025년을 2024년으로 변경
      const adjustedDate = new Date(date);
      adjustedDate.setFullYear(2024);
      return adjustedDate.toISOString();
    }
    
    return date.toISOString();
  } catch (error) {
    console.error('Date creation error:', error, 'for date:', dateString);
    return new Date('2025-01-17').toISOString();
  }
};

/**
 * 안전한 날짜 포맷팅 함수
 */
export const formatSafeDate = (dateString: string | undefined): string => {
  if (!dateString) {
    return '날짜 없음';
  }
  
  try {
    const safeDate = createSafeDate(dateString);
    const date = new Date(safeDate);
    
    // Invalid Date 체크
    if (isNaN(date.getTime())) {
      console.warn('Invalid date string:', dateString);
      return '유효하지 않은 날짜';
    }
    
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch (error) {
    console.error('Date formatting error:', error, 'for date:', dateString);
    return '날짜 형식 오류';
  }
};

/**
 * 상대적 날짜 표시 함수 (예: "3일 전", "1주일 전")
 */
export const getRelativeDate = (dateString: string | undefined): string => {
  if (!dateString) {
    return '날짜 없음';
  }
  
  try {
    const safeDate = createSafeDate(dateString);
    const date = new Date(safeDate);
    const now = new Date('2025-01-17'); // 현재 날짜로 설정
    
    const diffInMs = now.getTime() - date.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) {
      return '오늘';
    } else if (diffInDays === 1) {
      return '어제';
    } else if (diffInDays < 7) {
      return `${diffInDays}일 전`;
    } else if (diffInDays < 30) {
      const weeks = Math.floor(diffInDays / 7);
      return `${weeks}주일 전`;
    } else if (diffInDays < 365) {
      const months = Math.floor(diffInDays / 30);
      return `${months}개월 전`;
    } else {
      const years = Math.floor(diffInDays / 365);
      return `${years}년 전`;
    }
  } catch (error) {
    console.error('Relative date calculation error:', error, 'for date:', dateString);
    return '날짜 계산 오류';
  }
}; 