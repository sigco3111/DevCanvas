/**
 * 컴포넌트 중앙 export 파일
 * 모든 컴포넌트를 여기서 관리하여 import 경로를 단순화
 */

// Header 컴포넌트
export { default as Header } from './Header';
export type { HeaderProps, NavigationItem } from './Header/types';

// Hero 컴포넌트
export { default as Hero } from './Hero';
export type { HeroProps, CTAButton } from './Hero/types';

// ProjectCard 컴포넌트
export { default as ProjectCard } from './ProjectCard';

// Pagination 컴포넌트
export { default as Pagination } from './Pagination'; 