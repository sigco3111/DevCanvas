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
      title: "캐슬 브레이커",
      description: "플레이어가 발사체를 사용하여 블록으로 만들어진 건물과 황금 블록을 무너뜨리는 3D 물리 기반 게임입니다. 사용자가 직접 레벨 디자인을 할 수 있는 툴을 제공하며, Gemini API를 활용한 AI 레벨 생성 기능도 포함하고 있습니다.",
      category: "기타", // 새로운 카테고리 추가!
      technologies: ["React", "TypeScript", "Three.js", "cannon-es"],
      liveUrl: "https://castle-breaker.vercel.app/",
      featured: true, // 추천 프로젝트로 설정
      createdAt: "2025-07-02",
      updatedAt: "2025-07-02",
      githubUrl: "https://github.com/sigco3111/castle-breaker", // 선택사항
      developmentTools: ["Google AI Studio", "Cursor"], // 선택사항
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