/**
 * Jest 테스트 환경 설정 파일
 */

// Jest에서 사용되는 전역 변수들을 TypeScript에게 알려줌
declare global {
  const describe: (name: string, fn: () => void) => void
  const test: (name: string, fn: () => void) => void
  const expect: any
}

export {};