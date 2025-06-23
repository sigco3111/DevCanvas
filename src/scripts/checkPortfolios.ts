import { checkExistingPortfolios } from './uploadPortfolios';

/**
 * Firebase에 저장된 포트폴리오 데이터 확인 스크립트
 * 터미널에서 npm run check-portfolios 로 실행
 */
const main = async () => {
  try {
    console.log('🔍 Firebase 포트폴리오 데이터 확인 시작\n');
    await checkExistingPortfolios();
    console.log('\n✅ 데이터 확인 완료');
  } catch (error) {
    console.error('❌ 데이터 확인 실패:', error);
    process.exit(1);
  }
};

main(); 