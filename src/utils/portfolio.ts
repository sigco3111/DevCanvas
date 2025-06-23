import type { PortfolioItem, PortfolioCategory } from '../types';
import { CategoryUtils } from '../types/portfolio';
import { getPortfolios as getPortfoliosFromFirebase } from '../services/portfolioService';
import portfoliosData from '../data/portfolios.json' assert { type: 'json' };

/**
 * 포트폴리오 데이터 타입 가드 함수
 * JSON 데이터가 PortfolioItem 인터페이스를 만족하는지 검증
 */
export function isValidPortfolioItem(item: unknown): item is PortfolioItem {
  if (typeof item !== 'object' || item === null) {
    return false;
  }

  const portfolio = item as Record<string, unknown>;

  return (
    typeof portfolio.id === 'string' &&
    typeof portfolio.title === 'string' &&
    typeof portfolio.description === 'string' &&
    (portfolio.category === 'game' || portfolio.category === 'webapp') &&
    Array.isArray(portfolio.technologies) &&
    portfolio.technologies.every((tech) => typeof tech === 'string') &&
    typeof portfolio.liveUrl === 'string' &&
    typeof portfolio.featured === 'boolean' &&
    typeof portfolio.createdAt === 'string' &&
    (portfolio.imageUrl === undefined || typeof portfolio.imageUrl === 'string') &&
    (portfolio.githubUrl === undefined || typeof portfolio.githubUrl === 'string')
  );
}

/**
 * 포트폴리오 데이터를 가져오는 함수
 * Firebase에서 데이터를 가져오고, 실패시 로컬 JSON 파일을 사용
 */
export async function getPortfolios(): Promise<PortfolioItem[]> {
  try {
    // Firebase에서 데이터 가져오기 시도
    const portfolios = await getPortfoliosFromFirebase();
    console.log('✅ Firebase에서 포트폴리오 데이터 가져오기 성공');
    return portfolios;
  } catch (error) {
    console.warn('⚠️ Firebase에서 데이터 가져오기 실패, 로컬 JSON 파일 사용:', error);
    
    // 로컬 JSON 파일 사용
    const validPortfolios = (portfoliosData as unknown[]).filter(isValidPortfolioItem);
    
    if (validPortfolios.length !== portfoliosData.length) {
      console.warn('일부 포트폴리오 데이터가 유효하지 않습니다.');
    }
    
    return validPortfolios;
  }
}

/**
 * 동기적으로 로컬 포트폴리오 데이터를 가져오는 함수 (레거시 호환용)
 * 새로운 코드에서는 getPortfolios() 비동기 함수를 사용하세요
 */
export function getPortfoliosSync(): PortfolioItem[] {
  const validPortfolios = (portfoliosData as unknown[]).filter(isValidPortfolioItem);
  
  if (validPortfolios.length !== portfoliosData.length) {
    console.warn('일부 포트폴리오 데이터가 유효하지 않습니다.');
  }
  
  return validPortfolios;
}

/**
 * 카테고리별로 포트폴리오를 필터링하는 함수
 */
export function filterPortfoliosByCategory(
  portfolios: PortfolioItem[],
  category: PortfolioCategory
): PortfolioItem[] {
  if (category === 'all') {
    return portfolios;
  }
  
  return portfolios.filter((portfolio) => portfolio.category === category);
}

/**
 * 추천 포트폴리오만 필터링하는 함수
 */
export function getFeaturedPortfolios(portfolios: PortfolioItem[]): PortfolioItem[] {
  return portfolios.filter((portfolio) => portfolio.featured);
}

/**
 * 포트폴리오를 생성 날짜 기준으로 정렬하는 함수
 */
export function sortPortfoliosByDate(
  portfolios: PortfolioItem[],
  order: 'asc' | 'desc' = 'desc'
): PortfolioItem[] {
  return [...portfolios].sort((a, b) => {
    const dateA = new Date(a.createdAt).getTime();
    const dateB = new Date(b.createdAt).getTime();
    
    return order === 'desc' ? dateB - dateA : dateA - dateB;
  });
}

/**
 * 포트폴리오 데이터에서 모든 카테고리를 추출하는 함수
 * 동적으로 사용된 카테고리 목록을 가져옵니다
 */
export function getAllCategories(portfolios: PortfolioItem[]): string[] {
  return CategoryUtils.getAllCategories(portfolios);
}

/**
 * 새로운 카테고리가 유효한지 검증하는 함수
 */
export function validateNewCategory(category: string): boolean {
  return CategoryUtils.canAddCategory(category);
}

/**
 * 카테고리별 포트폴리오 개수를 반환하는 함수
 */
export function getCategoryCounts(portfolios: PortfolioItem[]): Record<string, number> {
  const counts: Record<string, number> = { all: portfolios.length };
  
  portfolios.forEach(portfolio => {
    const category = portfolio.category;
    counts[category] = (counts[category] || 0) + 1;
  });
  
  return counts;
} 