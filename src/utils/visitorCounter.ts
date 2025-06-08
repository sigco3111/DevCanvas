/**
 * 방문자 카운터 유틸리티 함수
 * CountAPI를 사용하여 DB 없이 방문자 수를 추적하는 기능을 제공합니다.
 */

/**
 * 방문자 카운터 증가 및 조회를 위한 키
 * 프로젝트명을 기반으로 키를 생성합니다.
 */
const COUNTER_KEY = 'devcanvas-visitors';

/**
 * 방문자 카운터 증가 함수
 * CountAPI를 사용하여 방문자 수를 증가시킵니다.
 * @returns {Promise<number>} 증가 후 방문자 수
 */
export const incrementVisitorCount = async (): Promise<number> => {
  try {
    // CountAPI를 사용하여 방문자 수 증가
    const response = await fetch(`https://api.countapi.xyz/hit/${COUNTER_KEY}`);
    const data = await response.json();
    return data.value;
  } catch (error) {
    console.error('방문자 카운터 증가 중 오류 발생:', error);
    // 오류 발생 시 기본값 반환
    return 0;
  }
};

/**
 * 현재 방문자 수 조회 함수
 * CountAPI를 사용하여 현재 방문자 수를 조회합니다.
 * @returns {Promise<number>} 현재 방문자 수
 */
export const getVisitorCount = async (): Promise<number> => {
  try {
    // CountAPI를 사용하여 방문자 수 조회
    const response = await fetch(`https://api.countapi.xyz/get/${COUNTER_KEY}`);
    const data = await response.json();
    return data.value || 0;
  } catch (error) {
    console.error('방문자 카운터 조회 중 오류 발생:', error);
    // 오류 발생 시 기본값 반환
    return 0;
  }
};

/**
 * 세션 당 한 번만 방문자 카운터를 증가시키는 함수
 * 로컬 스토리지를 활용하여 세션당 한 번만 카운터가 증가하도록 합니다.
 * @returns {Promise<number>} 현재 방문자 수
 */
export const incrementOncePerSession = async (): Promise<number> => {
  // 로컬 스토리지에서 방문 기록 확인
  const hasVisited = localStorage.getItem(`${COUNTER_KEY}-visited`);
  
  // 방문 기록이 없는 경우에만 카운터 증가
  if (!hasVisited) {
    try {
      const count = await incrementVisitorCount();
      // 방문 기록 저장 (24시간 유효)
      localStorage.setItem(`${COUNTER_KEY}-visited`, 'true');
      // 24시간 후 방문 기록 삭제를 위한 만료 시간 저장
      const expiryTime = Date.now() + 24 * 60 * 60 * 1000; // 24시간
      localStorage.setItem(`${COUNTER_KEY}-expiry`, expiryTime.toString());
      return count;
    } catch (error) {
      console.error('방문자 카운터 증가 중 오류 발생:', error);
      return 0;
    }
  } else {
    // 방문 기록이 있는 경우 현재 카운터 값만 조회
    return getVisitorCount();
  }
};

/**
 * 방문 기록 만료 확인 함수
 * 로컬 스토리지에 저장된 방문 기록이 만료되었는지 확인합니다.
 */
export const checkVisitExpiry = (): void => {
  const expiryTime = localStorage.getItem(`${COUNTER_KEY}-expiry`);
  
  if (expiryTime && parseInt(expiryTime) < Date.now()) {
    // 만료 시간이 지난 경우 방문 기록 삭제
    localStorage.removeItem(`${COUNTER_KEY}-visited`);
    localStorage.removeItem(`${COUNTER_KEY}-expiry`);
  }
}; 