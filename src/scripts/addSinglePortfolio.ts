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
      title: "캐피탈리즘 월드",
      description: "고전게임 캐피탈리즘에서 영감을 받아 제작된, 시뮬레이션 게임입니다. 역동적인 세계 경제 속에서 지능적인 AI와 경쟁하며 자신만의 글로벌 기업 제국을 건설해 보세요.",
      category: "경영", // 새로운 카테고리 추가!
      technologies: ["React", "TypeScript"],
      liveUrl: "https://capitalism-web.vercel.app/",
      featured: true, // 추천 프로젝트로 설정
      createdAt: "2025-08-01",
      updatedAt: "2025-08-01",
      githubUrl: "https://github.com/sigco3111/capitalism-web", // 선택사항
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