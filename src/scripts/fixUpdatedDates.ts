/**
 * Firebase에서 updatedAt이 누락된 포트폴리오들을 수정하는 스크립트
 * updatedAt이 없는 경우 createdAt으로 설정합니다.
 */

import { getPortfolios, updatePortfolio } from '../services/portfolioService-node';

/**
 * updatedAt이 누락된 포트폴리오들을 수정하는 함수
 */
const fixMissingUpdatedDates = async (): Promise<void> => {
  try {
    console.log('🔍 Firebase에서 포트폴리오 데이터 확인 중...');
    
    const portfolios = await getPortfolios();
    console.log(`📊 총 ${portfolios.length}개의 포트폴리오를 확인합니다.`);
    
    // updatedAt이 없거나 비어있는 포트폴리오들 찾기
    const portfoliosNeedingUpdate = portfolios.filter(portfolio => 
      !portfolio.updatedAt || 
      portfolio.updatedAt === '' || 
      portfolio.updatedAt === null || 
      portfolio.updatedAt === undefined
    );
    
    console.log(`🔧 수정이 필요한 포트폴리오: ${portfoliosNeedingUpdate.length}개`);
    
    if (portfoliosNeedingUpdate.length === 0) {
      console.log('✅ 모든 포트폴리오에 updatedAt이 설정되어 있습니다.');
      return;
    }
    
    console.log('\n📋 수정할 포트폴리오 목록:');
    portfoliosNeedingUpdate.forEach((portfolio, index) => {
      console.log(`${index + 1}. ${portfolio.title} (ID: ${portfolio.id})`);
      console.log(`   - createdAt: ${portfolio.createdAt}`);
      console.log(`   - updatedAt: ${portfolio.updatedAt || '없음'}`);
    });
    
    let successCount = 0;
    let errorCount = 0;
    
    console.log('\n🚀 updatedAt 필드 수정 시작...');
    
    // 각 포트폴리오의 updatedAt을 createdAt으로 설정
    for (const portfolio of portfoliosNeedingUpdate) {
      try {
        await updatePortfolio(portfolio.id, {
          updatedAt: portfolio.createdAt // createdAt을 updatedAt으로 설정
        });
        
        successCount++;
        console.log(`✅ ${successCount}/${portfoliosNeedingUpdate.length} - ${portfolio.title} 수정 완료`);
        
      } catch (error) {
        errorCount++;
        console.error(`❌ ${portfolio.title} 수정 실패:`, error);
      }
    }
    
    console.log('\n📋 수정 결과 요약:');
    console.log(`✅ 성공: ${successCount}개`);
    console.log(`❌ 실패: ${errorCount}개`);
    console.log(`📊 총 처리: ${successCount + errorCount}개`);
    
    if (successCount > 0) {
      console.log('\n🎉 updatedAt 필드 수정 완료!');
      console.log('🌐 웹 애플리케이션에서 모든 프로젝트의 업데이트 날짜가 표시될 것입니다.');
    }
    
  } catch (error) {
    console.error('💥 updatedAt 수정 중 오류 발생:', error);
    throw error;
  }
};

/**
 * 현재 상태를 확인하는 함수
 */
const checkCurrentStatus = async (): Promise<void> => {
  try {
    console.log('🔍 현재 상태 확인 중...');
    
    const portfolios = await getPortfolios();
    
    const withUpdatedAt = portfolios.filter(p => p.updatedAt && p.updatedAt.trim() !== '');
    const withoutUpdatedAt = portfolios.filter(p => !p.updatedAt || p.updatedAt.trim() === '');
    const sameAsCreated = portfolios.filter(p => p.updatedAt === p.createdAt);
    const differentFromCreated = portfolios.filter(p => p.updatedAt && p.updatedAt !== p.createdAt);
    
    console.log('\n📊 현재 상태:');
    console.log(`📁 총 포트폴리오: ${portfolios.length}개`);
    console.log(`✅ updatedAt 있음: ${withUpdatedAt.length}개`);
    console.log(`❌ updatedAt 없음: ${withoutUpdatedAt.length}개`);
    console.log(`🔄 createdAt과 동일: ${sameAsCreated.length}개`);
    console.log(`📝 createdAt과 다름: ${differentFromCreated.length}개`);
    
    if (withoutUpdatedAt.length > 0) {
      console.log('\n❌ updatedAt이 없는 포트폴리오들:');
      withoutUpdatedAt.forEach((portfolio, index) => {
        console.log(`${index + 1}. ${portfolio.title} (ID: ${portfolio.id})`);
      });
    }
    
  } catch (error) {
    console.error('❌ 상태 확인 실패:', error);
    throw error;
  }
};

/**
 * 스크립트 실행 함수
 */
const runFixScript = async (): Promise<void> => {
  try {
    console.log('🎯 updatedAt 필드 수정 스크립트 시작\n');
    
    // 1. 현재 상태 확인
    await checkCurrentStatus();
    
    console.log('\n' + '='.repeat(50));
    
    // 2. 누락된 updatedAt 수정
    await fixMissingUpdatedDates();
    
    console.log('\n' + '='.repeat(50));
    
    // 3. 수정 후 상태 확인
    console.log('\n🔍 수정 후 상태 확인:');
    await checkCurrentStatus();
    
  } catch (error) {
    console.error('💥 스크립트 실행 실패:', error);
    process.exit(1);
  }
};

// 스크립트가 직접 실행될 때만 실행
if (import.meta.url === `file://${process.argv[1]}`) {
  runFixScript();
}

export { fixMissingUpdatedDates, checkCurrentStatus }; 