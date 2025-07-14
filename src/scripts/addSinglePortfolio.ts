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
      title: "Windows 11 스타일 게시판",
      description: "Windows 11 인터페이스에서 영향을 받은 온라인 게시판 시스템입니다. 사용자들은 다양한 주제에 대한 게시물을 작성하고, 공유하며 커뮤니티를 형성할 수 있습니다. 데스크톱 환경을 시뮬레이션하는 UI를 통해 친숙하고 직관적인 사용자 경험을 제공합니다.",
      category: "App", // 새로운 카테고리 추가!
      technologies: ["React", "TypeScript"],
      liveUrl: "https://win11-board.vercel.app/",
      featured: true, // 추천 프로젝트로 설정
      createdAt: "2025-07-15",
      updatedAt: "2025-07-15",
      githubUrl: "https://github.com/sigco3111/win11-board", // 선택사항
      developmentTools: ["Cursor"], // 선택사항
      geminiApiStatus: "none" // none, optional, required 중 선택
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