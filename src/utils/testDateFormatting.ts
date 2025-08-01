/**
 * 날짜 포맷팅 테스트 스크립트
 * 다양한 날짜 형식이 올바르게 처리되는지 확인
 */

// 테스트용 날짜 데이터
const testDates = [
  '2025-01-17T10:30:00.000Z',
  '2024-12-25T15:45:30.000Z',
  '2025-02-01T09:00:00.000Z',
  '2023-06-15T12:00:00.000Z',
  '',
  undefined,
  'invalid-date',
  '2025-01-01',
  '2024-01-01T00:00:00Z'
];

/**
 * 날짜 포맷팅 함수 (ProjectCard와 동일)
 */
const formatDate = (dateString: string | undefined): string => {
  if (!dateString) {
    return '날짜 없음';
  }
  
  try {
    const date = new Date(dateString);
    
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
 * 날짜 포맷팅 테스트 실행
 */
export const testDateFormatting = () => {
  console.log('🗓️ 날짜 포맷팅 테스트 시작...\n');
  
  testDates.forEach((dateString, index) => {
    const formatted = formatDate(dateString);
    console.log(`${index + 1}. 입력: ${dateString || 'undefined'}`);
    console.log(`   출력: ${formatted}`);
    console.log('');
  });
  
  console.log('✅ 날짜 포맷팅 테스트 완료!');
};

// 자동 실행 (Node.js 환경에서만)
if (typeof window === 'undefined') {
  testDateFormatting();
}