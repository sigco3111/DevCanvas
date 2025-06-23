import { getPortfolioById } from '../services/portfolioService-node';

/**
 * 날짜 데이터 디버깅 스크립트
 * Firebase에서 가져온 데이터의 날짜 형식을 확인
 */
const debugDates = async () => {
  try {
    console.log('🔍 날짜 데이터 디버깅 시작...');
    
    // 최근 추가된 "동적 카테고리 테스트" 프로젝트 확인
    const testProject = await getPortfolioById('ssUVHFwEVPuxeMC1DioQ');
    
    // 기존 프로젝트도 확인 (3D 블록 월드 편집기)
    const existingProject = await getPortfolioById('3d-block-world-edit');
    
    if (testProject) {
      console.log('\n📋 프로젝트 정보:');
      console.log('제목:', testProject.title);
      console.log('ID:', testProject.id);
      
      console.log('\n📅 날짜 정보 상세:');
      console.log('createdAt 원본:', testProject.createdAt);
      console.log('createdAt 타입:', typeof testProject.createdAt);
      console.log('updatedAt 원본:', testProject.updatedAt);
      console.log('updatedAt 타입:', typeof testProject.updatedAt);
      
      // Date 객체로 변환 테스트
      try {
        const createdDate = new Date(testProject.createdAt);
        const updatedDate = new Date(testProject.updatedAt || testProject.createdAt);
        
        console.log('\n🔄 Date 객체 변환 결과:');
        console.log('createdDate:', createdDate);
        console.log('createdDate.getTime():', createdDate.getTime());
        console.log('createdDate.toISOString():', createdDate.toISOString());
        console.log('createdDate.toLocaleDateString():', createdDate.toLocaleDateString('ko-KR'));
        
        console.log('updatedDate:', updatedDate);
        console.log('updatedDate.getTime():', updatedDate.getTime());
        console.log('updatedDate.toISOString():', updatedDate.toISOString());
        console.log('updatedDate.toLocaleDateString():', updatedDate.toLocaleDateString('ko-KR'));
        
        // Invalid Date 체크
        console.log('\n✅ 유효성 검사:');
        console.log('createdDate isValid:', !isNaN(createdDate.getTime()));
        console.log('updatedDate isValid:', !isNaN(updatedDate.getTime()));
        
      } catch (error) {
        console.error('❌ Date 변환 에러:', error);
      }
    } else {
      console.log('❌ 테스트 프로젝트를 찾을 수 없습니다.');
    }
    
    // 기존 프로젝트 날짜 확인
    if (existingProject) {
      console.log('\n\n🔍 기존 프로젝트 날짜 확인:');
      console.log('제목:', existingProject.title);
      console.log('createdAt:', existingProject.createdAt);
      console.log('updatedAt:', existingProject.updatedAt);
      
      const existingCreatedDate = new Date(existingProject.createdAt);
      console.log('기존 프로젝트 생성일:', existingCreatedDate.toLocaleDateString('ko-KR'));
      console.log('기존 프로젝트 유효성:', !isNaN(existingCreatedDate.getTime()));
    }
    
    // 현재 시스템 시간 확인
    console.log('\n⏰ 시스템 시간 확인:');
    const now = new Date();
    console.log('현재 시간:', now.toISOString());
    console.log('현재 로컬 시간:', now.toLocaleDateString('ko-KR'));
    console.log('현재 년도:', now.getFullYear());
    
  } catch (error) {
    console.error('❌ 디버깅 실패:', error);
    process.exit(1);
  }
};

// 스크립트 실행
debugDates(); 