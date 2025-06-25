/**
 * 포트폴리오 데이터를 Firebase에 업로드하는 스크립트
 * Node.js 환경에서 실행됩니다.
 */

import { db, collection, getDocs, doc, setDoc } from '../lib/firebase-node';
import { getPortfolios } from '../services/portfolioService-node';
// import portfolioData from '../data/portfolios.json'; // 파일이 존재하지 않음
import { PortfolioItem } from '../types/portfolio';

// 현재 portfolios.json 파일이 없으므로 빈 배열 사용
// 실제 데이터 업로드가 필요한 경우, Firebase에서 데이터를 가져와서 사용하세요
const portfolioData: PortfolioItem[] = [];

/**
 * 포트폴리오 데이터를 Firebase에 업로드하는 함수
 * 기존 데이터는 덮어쓰기로 처리됩니다.
 * 
 * ⚠️ 현재 portfolios.json 파일이 없으므로 빈 배열을 사용합니다.
 * 실제 데이터 업로드가 필요한 경우, Firebase에서 데이터를 가져와서 사용하세요.
 */
export const uploadPortfoliosToFirebase = async (): Promise<void> => {
  try {
    console.log('🚀 포트폴리오 데이터 Firebase 업로드 시작...');
    
    if (portfolioData.length === 0) {
      console.log('⚠️ 업로드할 포트폴리오 데이터가 없습니다.');
      console.log('📝 portfolios.json 파일을 생성하거나 Firebase에서 데이터를 가져와서 사용하세요.');
      return;
    }
    
    console.log(`📊 업로드할 포트폴리오 수: ${portfolioData.length}개`);
    
    const portfoliosRef = collection(db, 'portfolios');
    
    // 기존 데이터 확인
    const existingDocs = await getDocs(portfoliosRef);
    console.log(`📋 기존 Firebase 데이터: ${existingDocs.size}개`);
    
    let successCount = 0;
    let errorCount = 0;
    
    // 각 포트폴리오 데이터를 Firebase에 업로드
    for (const portfolio of portfolioData as PortfolioItem[]) {
      try {
        // 문서 ID를 포트폴리오 ID로 설정하여 중복 방지
        const docRef = doc(db, 'portfolios', portfolio.id);
        await setDoc(docRef, {
          ...portfolio,
          // Firebase 타임스탬프 추가
          uploadedAt: new Date().toISOString(),
          // 업데이트 날짜 없으면 생성 날짜로 설정
          updatedAt: portfolio.updatedAt || portfolio.createdAt
        });
        
        successCount++;
        console.log(`✅ ${successCount}/${portfolioData.length} - ${portfolio.title} 업로드 완료`);
      } catch (error) {
        errorCount++;
        console.error(`❌ ${portfolio.title} 업로드 실패:`, error);
      }
    }
    
    console.log('\n📋 업로드 결과 요약:');
    console.log(`✅ 성공: ${successCount}개`);
    console.log(`❌ 실패: ${errorCount}개`);
    console.log(`📊 총 처리: ${successCount + errorCount}개`);
    
    if (successCount > 0) {
      console.log('\n🎉 포트폴리오 데이터 Firebase 업로드 완료!');
      console.log('🌐 Firebase Console에서 확인하세요:');
      const projectId = process.env.VITE_FIREBASE_PROJECT_ID;
      console.log(`https://console.firebase.google.com/project/${projectId}/firestore/data`);
    }
    
  } catch (error) {
    console.error('💥 포트폴리오 업로드 중 오류 발생:', error);
    throw error;
  }
};

/**
 * Firebase의 기존 포트폴리오 데이터를 확인하는 함수
 */
export const checkExistingPortfolios = async (): Promise<void> => {
  try {
    console.log('🔍 Firebase 기존 포트폴리오 데이터 확인 중...');
    
    const portfolios = await getPortfolios();
    
    console.log(`📊 Firebase에 저장된 포트폴리오 수: ${portfolios.length}개`);
    
    if (portfolios.length > 0) {
      console.log('\n📋 기존 포트폴리오 목록:');
      portfolios.forEach((portfolio, index) => {
        console.log(`${index + 1}. ${portfolio.title} (ID: ${portfolio.id}) - ${portfolio.category}`);
      });
    } else {
      console.log('📭 Firebase에 포트폴리오 데이터가 없습니다.');
    }
    
  } catch (error) {
    console.error('❌ 기존 데이터 확인 실패:', error);
    throw error;
  }
};

/**
 * 스크립트 실행 함수
 * 실제 업로드를 수행하고 결과를 출력
 */
const runUploadScript = async (): Promise<void> => {
  try {
    console.log('🎯 포트폴리오 Firebase 업로드 스크립트 시작\n');
    
    // 1. 기존 데이터 확인
    await checkExistingPortfolios();
    
    console.log('\n' + '='.repeat(50));
    
    // 2. 데이터 업로드
    await uploadPortfoliosToFirebase();
    
    console.log('\n' + '='.repeat(50));
    
    // 3. 업로드 후 확인
    console.log('\n🔍 업로드 후 데이터 확인:');
    await checkExistingPortfolios();
    
  } catch (error) {
    console.error('💥 스크립트 실행 실패:', error);
    process.exit(1);
  }
};

// 스크립트가 직접 실행될 때만 실행
if (import.meta.url === `file://${process.argv[1]}`) {
  runUploadScript();
}

export default { uploadPortfoliosToFirebase, checkExistingPortfolios }; 