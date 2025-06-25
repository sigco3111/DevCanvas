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
      title: "수박 게임 3D",
      description: "3D 과일 합치기 퍼즐 게임입니다. 인기 있는 수박 게임에서 영향을 받아 3차원 환경으로 재구성했습니다. 과일을 떨어뜨리고, 같은 과일끼리 합쳐 더 큰 과일을 만들며 최고 점수에 도전하세요!",
      category: "퍼즐", // 새로운 카테고리 추가!
      technologies: ["React", "TypeScript", "Three.js", "cannon-es"],
      liveUrl: "https://watermelon-tan-nu.vercel.app/",
      featured: true, // 추천 프로젝트로 설정
      createdAt: "2025-06-26",
      updatedAt: "2025-06-26",
      githubUrl: "https://github.com/sigco3111/watermelon", // 선택사항
      developmentTools: ["Google AI Studio", "Cursor"], // 선택사항
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