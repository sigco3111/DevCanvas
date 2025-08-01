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

// ProjectModal 컴포넌트
export { default as ProjectModal } from './ProjectModal';

// Pagination 컴포넌트
export { default as Pagination } from './Pagination';

// 방문자 카운터 컴포넌트
export { default as VisitorCounter } from './VisitorCounter';

// 대시보드 컴포넌트
export { DashboardModal, StatCard } from './Dashboard';

// 관리자 로그인 컴포넌트
export { default as AdminLogin } from './AdminLogin'; 