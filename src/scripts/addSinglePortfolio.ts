import { addPortfolio } from '../services/portfolioService-node';
import { PortfolioItem } from '../types/portfolio';

/**
 * 단일 포트폴리오 추가 스크립트
 * 프로그래밍 방식으로 개별 포트폴리오를 Firebase에 추가
 */
const addNewPortfolio = async () => {
  try {
    // 새 포트폴리오 데이터 정의 (새로운 카테고리 "실험" 추가 테스트)
    const newPortfolio: Omit<PortfolioItem, 'id'> = {
      title: "추가 입력 테스트",
      description: "내용들",
      category: "FPS", // 새로운 카테고리 추가!
      technologies: ["React", "TypeScript", "Firebase", "Tailwind CSS"],
      liveUrl: "https://terrarium-flame.vercel.app/",
      featured: true, // 추천 프로젝트로 설정
      createdAt: "2025-06-23",
      updatedAt: "2025-06-24",
      githubUrl: "https://github.com/sigco3111/terrarium", // 선택사항
      developmentTools: ["Google AI Studio", "Cursor", "Claude"], // 선택사항
      geminiApiStatus: "optional" // none, optional, required 중 선택
    };

    console.log('🚀 새 포트폴리오 추가 시작...');
    console.log('📋 추가할 프로젝트:', newPortfolio.title);
    
    const portfolioId = await addPortfolio(newPortfolio);
    
    console.log(`✅ 포트폴리오 추가 성공!`);
    console.log(`🆔 생성된 ID: ${portfolioId}`);
    console.log(`🌐 Firebase Console: https://console.firebase.google.com/project/dev-canvas-f6c15/firestore/data/portfolios/${portfolioId}`);
    
  } catch (error) {
    console.error('❌ 포트폴리오 추가 실패:', error);
    process.exit(1);
  }
};

// 스크립트 실행
addNewPortfolio(); 

//실행 : npm run add-portfolio