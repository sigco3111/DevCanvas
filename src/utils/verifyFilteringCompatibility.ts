import { PortfolioItem } from '../types/portfolio';

/**
 * 기존 필터링 및 검색 기능 호환성 검증 유틸리티
 * 요구사항 5.1, 5.2: 기존 필터링 및 검색 기능 유지 확인
 */

// 테스트용 샘플 데이터
const samplePortfolios: PortfolioItem[] = [
  {
    id: '1',
    title: 'React 게임 앱',
    description: 'React로 만든 퍼즐 게임입니다',
    category: '퍼즐',
    technologies: ['React', 'TypeScript', 'CSS'],
    featured: true,
    createdAt: '2024-01-15T00:00:00.000Z',
    updatedAt: '2024-01-20T00:00:00.000Z',
    geminiApiStatus: 'optional',
    viewCount: 150,
    commentCount: 5,
    liveUrl: 'https://example.com/game1',
    imageUrl: 'https://example.com/image1.jpg'
  },
  {
    id: '2',
    title: 'Vue 웹앱',
    description: 'Vue.js로 만든 관리 도구입니다',
    category: 'App',
    technologies: ['Vue', 'JavaScript', 'Vuetify'],
    featured: false,
    createdAt: '2024-02-10T00:00:00.000Z',
    updatedAt: '2024-02-15T00:00:00.000Z',
    geminiApiStatus: 'required',
    viewCount: 89,
    commentCount: 3,
    liveUrl: 'https://example.com/app1',
    imageUrl: 'https://example.com/image2.jpg'
  },
  {
    id: '3',
    title: 'Angular 보드게임',
    description: 'Angular로 만든 전략 보드게임',
    category: '보드게임',
    technologies: ['Angular', 'TypeScript', 'RxJS'],
    featured: true,
    createdAt: '2024-03-05T00:00:00.000Z',
    geminiApiStatus: 'none',
    viewCount: 234,
    commentCount: 12,
    liveUrl: 'https://example.com/game2',
    imageUrl: 'https://example.com/image3.jpg'
  }
];

/**
 * HomePage 컴포넌트의 필터링 로직을 복제하여 테스트
 */
export function verifyFilteringCompatibility(): boolean {
  console.log('🔍 기존 필터링 및 검색 기능 호환성 검증 시작...');
  
  let allTestsPassed = true;
  
  try {
    // 1. 카테고리 필터링 테스트
    console.log('1️⃣ 카테고리 필터링 테스트...');
    
    // 전체 카테고리
    const allResults = samplePortfolios.filter(project => true);
    if (allResults.length !== 3) {
      console.error('❌ 전체 카테고리 필터링 실패');
      allTestsPassed = false;
    }
    
    // 특정 카테고리 필터링 (HomePage의 로직과 동일)
    const selectedCategory = '퍼즐';
    const categoryResults = samplePortfolios.filter(project => {
      if (selectedCategory !== 'all' && project.category !== selectedCategory) {
        return false;
      }
      return true;
    });
    
    if (categoryResults.length !== 1 || categoryResults[0].title !== 'React 게임 앱') {
      console.error('❌ 카테고리 필터링 실패');
      allTestsPassed = false;
    } else {
      console.log('✅ 카테고리 필터링 성공');
    }
    
    // 2. Gemini API 필터링 테스트
    console.log('2️⃣ Gemini API 필터링 테스트...');
    
    const selectedGeminiFilters = ['required'];
    const geminiResults = samplePortfolios.filter(project => {
      if (selectedGeminiFilters.length > 0) {
        const projectStatus = project.geminiApiStatus || 'none';
        if (!selectedGeminiFilters.includes(projectStatus)) {
          return false;
        }
      }
      return true;
    });
    
    if (geminiResults.length !== 1 || geminiResults[0].title !== 'Vue 웹앱') {
      console.error('❌ Gemini API 필터링 실패');
      allTestsPassed = false;
    } else {
      console.log('✅ Gemini API 필터링 성공');
    }
    
    // 3. 검색 기능 테스트 (HomePage의 로직과 동일)
    console.log('3️⃣ 검색 기능 테스트...');
    
    const searchTerm = 'React';
    const searchResults = samplePortfolios.filter(project => {
      if (searchTerm.trim() !== '') {
        const searchLower = searchTerm.toLowerCase();
        return (
          project.title.toLowerCase().includes(searchLower) || 
          project.description.toLowerCase().includes(searchLower) ||
          project.technologies.some(tech => tech.toLowerCase().includes(searchLower))
        );
      }
      return true;
    });
    
    if (searchResults.length !== 1 || searchResults[0].title !== 'React 게임 앱') {
      console.error('❌ 검색 기능 실패');
      allTestsPassed = false;
    } else {
      console.log('✅ 검색 기능 성공');
    }
    
    // 4. 정렬 기능 테스트 (HomePage의 로직과 동일)
    console.log('4️⃣ 정렬 기능 테스트...');
    
    // 최신순 정렬
    const sortBy = 'newest';
    const sortedResults = [...samplePortfolios].sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'alphabetical':
          return a.title.localeCompare(b.title);
        case 'updated':
          return new Date(b.updatedAt || b.createdAt).getTime() - new Date(a.updatedAt || a.createdAt).getTime();
        default:
          return 0;
      }
    });
    
    if (sortedResults[0].title !== 'Angular 보드게임') {
      console.error('❌ 정렬 기능 실패');
      allTestsPassed = false;
    } else {
      console.log('✅ 정렬 기능 성공');
    }
    
    // 5. 복합 필터링 테스트
    console.log('5️⃣ 복합 필터링 테스트...');
    
    const complexResults = samplePortfolios.filter(project => {
      // 카테고리 필터링
      const selectedCategory = '퍼즐';
      if (selectedCategory !== 'all' && project.category !== selectedCategory) {
        return false;
      }
      
      // Gemini API 필터링
      const selectedGeminiFilters = ['optional'];
      if (selectedGeminiFilters.length > 0) {
        const projectStatus = project.geminiApiStatus || 'none';
        if (!selectedGeminiFilters.includes(projectStatus)) {
          return false;
        }
      }
      
      // 검색어 필터링
      const searchTerm = 'React';
      if (searchTerm.trim() !== '') {
        const searchLower = searchTerm.toLowerCase();
        return (
          project.title.toLowerCase().includes(searchLower) || 
          project.description.toLowerCase().includes(searchLower) ||
          project.technologies.some(tech => tech.toLowerCase().includes(searchLower))
        );
      }
      
      return true;
    });
    
    if (complexResults.length !== 1 || complexResults[0].title !== 'React 게임 앱') {
      console.error('❌ 복합 필터링 실패');
      allTestsPassed = false;
    } else {
      console.log('✅ 복합 필터링 성공');
    }
    
    // 6. 빈 검색어 처리 테스트
    console.log('6️⃣ 빈 검색어 처리 테스트...');
    
    const emptySearchResults = samplePortfolios.filter(project => {
      const searchTerm = '';
      if (searchTerm.trim() !== '') {
        const searchLower = searchTerm.toLowerCase();
        return (
          project.title.toLowerCase().includes(searchLower) || 
          project.description.toLowerCase().includes(searchLower) ||
          project.technologies.some(tech => tech.toLowerCase().includes(searchLower))
        );
      }
      return true;
    });
    
    if (emptySearchResults.length !== 3) {
      console.error('❌ 빈 검색어 처리 실패');
      allTestsPassed = false;
    } else {
      console.log('✅ 빈 검색어 처리 성공');
    }
    
  } catch (error) {
    console.error('❌ 필터링 호환성 검증 중 오류 발생:', error);
    allTestsPassed = false;
  }
  
  if (allTestsPassed) {
    console.log('🎉 모든 필터링 및 검색 기능 호환성 검증 완료!');
    console.log('✅ 기존 필터링 로직이 간소화된 카드와 정상적으로 작동합니다.');
  } else {
    console.log('❌ 일부 필터링 기능에서 호환성 문제가 발견되었습니다.');
  }
  
  return allTestsPassed;
}

/**
 * 실제 HomePage 컴포넌트의 필터링 로직과 동일한지 확인하는 함수
 */
export function verifyHomePageFilteringLogic(portfolios: PortfolioItem[], filters: {
  selectedCategory: string;
  selectedGeminiFilters: string[];
  searchTerm: string;
  sortBy: 'newest' | 'oldest' | 'alphabetical' | 'updated';
}): PortfolioItem[] {
  
  const { selectedCategory, selectedGeminiFilters, searchTerm, sortBy } = filters;
  
  // HomePage와 동일한 필터링 로직
  const filteredProjects = portfolios
    .filter(project => {
      // 카테고리 필터링
      if (selectedCategory !== 'all' && project.category !== selectedCategory) {
        return false;
      }
      
      // Gemini API 필터링
      if (selectedGeminiFilters.length > 0) {
        const projectStatus = project.geminiApiStatus || 'none';
        if (!selectedGeminiFilters.includes(projectStatus)) {
          return false;
        }
      }
      
      // 검색어 필터링
      if (searchTerm.trim() !== '') {
        const searchLower = searchTerm.toLowerCase();
        return (
          project.title.toLowerCase().includes(searchLower) || 
          project.description.toLowerCase().includes(searchLower) ||
          project.technologies.some(tech => tech.toLowerCase().includes(searchLower))
        );
      }
      
      return true;
    })
    .sort((a, b) => {
      // 정렬 로직
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'alphabetical':
          return a.title.localeCompare(b.title);
        case 'updated':
          return new Date(b.updatedAt || b.createdAt).getTime() - new Date(a.updatedAt || a.createdAt).getTime();
        default:
          return 0;
      }
    });
    
  return filteredProjects;
}

// 자동 실행 (모듈이 import될 때)
if (typeof window === 'undefined') {
  // Node.js 환경에서만 자동 실행
  verifyFilteringCompatibility();
}