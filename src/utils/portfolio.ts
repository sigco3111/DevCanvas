import type { PortfolioItem, PortfolioCategory } from '../types';
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
 * 타입 안전성을 보장하며 데이터를 반환
 */
export function getPortfolios(): PortfolioItem[] {
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