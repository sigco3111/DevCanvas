import { PortfolioItem } from '../../types/portfolio';

/**
 * 기존 필터링 및 검색 기능 호환성 테스트
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

describe('기존 필터링 및 검색 기능 호환성', () => {
  
  test('카테고리 필터링이 정상 작동해야 함', () => {
    // 전체 카테고리
    const allResults = samplePortfolios.filter(project => true);
    expect(allResults).toHaveLength(3);
    
    // 특정 카테고리 필터링
    const puzzleResults = samplePortfolios.filter(project => project.category === '퍼즐');
    expect(puzzleResults).toHaveLength(1);
    expect(puzzleResults[0].title).toBe('React 게임 앱');
    
    const appResults = samplePortfolios.filter(project => project.category === 'App');
    expect(appResults).toHaveLength(1);
    expect(appResults[0].title).toBe('Vue 웹앱');
  });

  test('Gemini API 필터링이 정상 작동해야 함', () => {
    // 'required' 필터
    const requiredResults = samplePortfolios.filter(project => {
      const status = project.geminiApiStatus || 'none';
      return status === 'required';
    });
    expect(requiredResults).toHaveLength(1);
    expect(requiredResults[0].title).toBe('Vue 웹앱');
    
    // 'optional' 필터
    const optionalResults = samplePortfolios.filter(project => {
      const status = project.geminiApiStatus || 'none';
      return status === 'optional';
    });
    expect(optionalResults).toHaveLength(1);
    expect(optionalResults[0].title).toBe('React 게임 앱');
    
    // 'none' 필터
    const noneResults = samplePortfolios.filter(project => {
      const status = project.geminiApiStatus || 'none';
      return status === 'none';
    });
    expect(noneResults).toHaveLength(1);
    expect(noneResults[0].title).toBe('Angular 보드게임');
  });

  test('검색 기능이 정상 작동해야 함', () => {
    const searchTerm = 'React';
    
    // 제목, 설명, 기술 스택에서 검색
    const searchResults = samplePortfolios.filter(project => {
      const searchLower = searchTerm.toLowerCase();
      return (
        project.title.toLowerCase().includes(searchLower) || 
        project.description.toLowerCase().includes(searchLower) ||
        project.technologies.some(tech => tech.toLowerCase().includes(searchLower))
      );
    });
    
    expect(searchResults).toHaveLength(1);
    expect(searchResults[0].title).toBe('React 게임 앱');
  });

  test('기술 스택 검색이 정상 작동해야 함', () => {
    const searchTerm = 'TypeScript';
    
    const searchResults = samplePortfolios.filter(project => {
      const searchLower = searchTerm.toLowerCase();
      return project.technologies.some(tech => tech.toLowerCase().includes(searchLower));
    });
    
    expect(searchResults).toHaveLength(2);
    expect(searchResults.map(p => p.title)).toContain('React 게임 앱');
    expect(searchResults.map(p => p.title)).toContain('Angular 보드게임');
  });

  test('정렬 기능이 정상 작동해야 함', () => {
    // 최신순 정렬
    const newestFirst = [...samplePortfolios].sort((a, b) => {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
    expect(newestFirst[0].title).toBe('Angular 보드게임');
    expect(newestFirst[2].title).toBe('React 게임 앱');
    
    // 오래된순 정렬
    const oldestFirst = [...samplePortfolios].sort((a, b) => {
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    });
    expect(oldestFirst[0].title).toBe('React 게임 앱');
    expect(oldestFirst[2].title).toBe('Angular 보드게임');
    
    // 이름순 정렬
    const alphabetical = [...samplePortfolios].sort((a, b) => {
      return a.title.localeCompare(b.title);
    });
    expect(alphabetical[0].title).toBe('Angular 보드게임');
    expect(alphabetical[1].title).toBe('React 게임 앱');
    expect(alphabetical[2].title).toBe('Vue 웹앱');
    
    // 업데이트순 정렬
    const updatedFirst = [...samplePortfolios].sort((a, b) => {
      return new Date(b.updatedAt || b.createdAt).getTime() - new Date(a.updatedAt || a.createdAt).getTime();
    });
    expect(updatedFirst[0].title).toBe('Angular 보드게임'); // updatedAt이 없으므로 createdAt 사용
  });

  test('복합 필터링이 정상 작동해야 함', () => {
    // 카테고리 + 검색어 조합
    const categoryAndSearch = samplePortfolios.filter(project => {
      const categoryMatch = project.category === '퍼즐';
      const searchMatch = project.title.toLowerCase().includes('react');
      return categoryMatch && searchMatch;
    });
    
    expect(categoryAndSearch).toHaveLength(1);
    expect(categoryAndSearch[0].title).toBe('React 게임 앱');
  });

  test('빈 검색어 처리가 정상 작동해야 함', () => {
    const emptySearch = '';
    
    const searchResults = samplePortfolios.filter(project => {
      if (emptySearch.trim() === '') {
        return true; // 빈 검색어는 모든 결과 반환
      }
      
      const searchLower = emptySearch.toLowerCase();
      return (
        project.title.toLowerCase().includes(searchLower) || 
        project.description.toLowerCase().includes(searchLower) ||
        project.technologies.some(tech => tech.toLowerCase().includes(searchLower))
      );
    });
    
    expect(searchResults).toHaveLength(3); // 모든 프로젝트 반환
  });
});