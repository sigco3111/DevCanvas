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
      title: "테라리움",
      description: "이 몰입형 시뮬레이션에서 당신은 자신만의 작은 3D 테라리움을 조성하고, 다양한 생물과 식물을 추가하며 시간이 지남에 따라 생태계가 자체적으로 성장하고 변화하며 복잡한 상호작용을 펼치는 모습을 관찰할 수 있습니다.",
      category: "육성", // 새로운 카테고리 추가!
      technologies: ["React", "TypeScript", "Recharts", "Three.js"],
      liveUrl: "https://terrarium-flame.vercel.app/",
      featured: true, // 추천 프로젝트로 설정
      createdAt: "2025-06-25",
      updatedAt: "2025-06-25",
      githubUrl: "https://github.com/sigco3111/terrarium", // 선택사항
      developmentTools: ["Google AI Studio", "Cursor", "Claude"], // 선택사항
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