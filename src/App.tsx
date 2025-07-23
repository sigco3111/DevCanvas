import { Header, Hero, ProjectCard, Pagination, DashboardModal } from './components';
import Board from './components/Board';
import { PortfolioItem, GeminiApiStatus } from './types/portfolio';
import { getPortfolios, getAllCategories, getCategoryCounts } from './utils/portfolio';
import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { inject as injectAnalytics } from '@vercel/analytics';
import { AuthProvider } from './contexts/AuthContext';
import { getDashboardData } from './services/statisticsService';
import { DashboardData } from './types/dashboard';
// stagewise 툴바 관련 import 추가
import { StagewiseToolbar } from '@stagewise/toolbar-react';
import ReactPlugin from '@stagewise-plugins/react';

/**
 * DevCanvas 메인 애플리케이션 컴포넌트
 * 웹앱과 웹게임을 연결해주는 허브 페이지
 */
function App() {
  // 포트폴리오 데이터 상태
  const [portfolios, setPortfolios] = useState<PortfolioItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // 현재 페이지 상태 ('portfolio' | 'board')
  const [currentPage, setCurrentPage] = useState<'portfolio' | 'board'>('portfolio');
  
  // 검색 및 정렬 상태
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'alphabetical' | 'updated'>('newest');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  // Gemini API 필터 상태
  const [selectedGeminiFilters, setSelectedGeminiFilters] = useState<GeminiApiStatus[]>([]);
  
  // 페이지네이션 상태
  const [currentProjectPage, setCurrentProjectPage] = useState(1);
  const itemsPerPage = 20;

  // 대시보드 상태
  const [isDashboardOpen, setIsDashboardOpen] = useState(false);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [isDashboardLoading, setIsDashboardLoading] = useState(false);
  const [dashboardError, setDashboardError] = useState<string | null>(null);
  
  // 포트폴리오 데이터 로드
  useEffect(() => {
    const loadPortfolios = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await getPortfolios();
        setPortfolios(data);
      } catch (err) {
        console.error('포트폴리오 데이터 로드 실패:', err);
        setError('포트폴리오 데이터를 불러올 수 없습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    loadPortfolios();
  }, []);

  // 카테고리별 프로젝트 수 계산 (동적 카테고리 지원)
  const categoryCounts = getCategoryCounts(portfolios);
  
  // 모든 카테고리 목록 생성 (동적으로 추출)
  const allCategories = ['all', ...getAllCategories(portfolios)];
  
  // 필터링 및 정렬된 프로젝트 목록
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

  // 페이지네이션을 위한 현재 페이지 프로젝트들 계산
  const totalFilteredProjects = filteredProjects.length;
  const startIndex = (currentProjectPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPageProjects = filteredProjects.slice(startIndex, endIndex);
  
  // 페이지 변경 핸들러
  const handlePageChange = (page: number) => {
    setCurrentProjectPage(page);
    // 페이지 변경 시 프로젝트 섹션 상단으로 스크롤
    const projectsSection = document.getElementById('projects');
    if (projectsSection) {
      projectsSection.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  // 필터 초기화 함수
  const resetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setSelectedGeminiFilters([]);
    setCurrentProjectPage(1); // 페이지를 첫 번째로 리셋
  };
  
  // 필터 변경 시 페이지 리셋 (useEffect 훅들)
  useEffect(() => {
    setCurrentProjectPage(1);
  }, [searchTerm, selectedCategory, selectedGeminiFilters, sortBy]);

  // 네비게이션 핸들러
  const handleNavigationClick = (href: string) => {
    if (href === '#board') {
      setCurrentPage('board');
    } else if (href === '#home' || href === '#projects') {
      setCurrentPage('portfolio');
      // 기본 스크롤 처리
      const targetElement = document.querySelector(href);
      if (targetElement) {
        targetElement.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
      }
    } else if (href === '#dashboard') {
      // 대시보드 모달 열기
      openDashboard();
    }
  };

  /**
   * 로고 클릭 핸들러 - 홈화면으로 이동
   */
  const handleLogoClick = () => {
    // 현재 게시판 페이지에 있다면 포트폴리오 페이지로 이동
    if (currentPage === 'board') {
      setCurrentPage('portfolio');
    }
    
    // 페이지 최상단으로 스크롤
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // 필터 초기화 (선택사항)
    resetFilters();
  };

  /**
   * 대시보드 모달 열기 및 데이터 로드
   */
  const openDashboard = async () => {
    setIsDashboardOpen(true);
    
    if (!dashboardData) {
      try {
        setIsDashboardLoading(true);
        setDashboardError(null);
        const data = await getDashboardData();
        setDashboardData(data);
      } catch (err: any) {
        console.error('대시보드 데이터 로드 실패:', err);
        setDashboardError(err.message || '통계 데이터를 불러올 수 없습니다.');
      } finally {
        setIsDashboardLoading(false);
      }
    }
  };

  /**
   * 대시보드 데이터 새로고침
   */
  const refreshDashboardData = async () => {
    try {
      setIsDashboardLoading(true);
      setDashboardError(null);
      const data = await getDashboardData(true); // 강제 새로고침
      setDashboardData(data);
    } catch (err: any) {
      console.error('대시보드 데이터 새로고침 실패:', err);
      setDashboardError(err.message || '통계 데이터를 불러올 수 없습니다.');
    } finally {
      setIsDashboardLoading(false);
    }
  };

  /**
   * 대시보드 모달 닫기
   */
  const closeDashboard = () => {
    setIsDashboardOpen(false);
  };
  
  // 페이지 로드 시 접근성 개선 및 분석 초기화
  useEffect(() => {
    // 스크린 리더용 페이지 정보 업데이트
    document.title = "DevCanvas - 웹앱 & 웹게임 오픈소스 허브";
    
    // Vercel Analytics 초기화
    injectAnalytics();
  }, []);

  return (
    <AuthProvider>
      {/* stagewise 툴바 추가 - 개발 모드에서만 렌더링됨 */}
      <StagewiseToolbar config={{ plugins: [ReactPlugin] }} />
      
      {/* 페이지별 SEO 메타데이터 (react-helmet-async 사용) */}
      <Helmet>
        <title>DevCanvas - 웹앱 & 웹게임 오픈소스 허브</title>
        <meta name="description" content="DevCanvas에서 다양한 게임과 앱을 오픈소스로 공유합니다." />
        <link rel="canonical" href="https://devcanvas.vercel.app/" />
      </Helmet>
      
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header 
          onNavigationClick={handleNavigationClick}
          onLogoClick={handleLogoClick}
        />
        
        {/* 메인 콘텐츠 - 시맨틱 태그 강화 */}
        <main id="main-content">
          {currentPage === 'board' ? (
            <Board />
          ) : (
            <>
              {/* 포트폴리오 콘텐츠 */}
          {/* Hero 섹션 - 홈과 프로젝트 소개를 통합 */}
          <Hero totalProjects={portfolios.length} />

          {/* 프로젝트 섹션 */}
          <section id="projects" aria-labelledby="projects-heading" className="py-16 bg-white dark:bg-gray-800">
            <div className="container mx-auto px-4 py-8">
              <header className="text-center mb-12">
                <h1 id="projects-heading" className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                  프로젝트 둘러보기
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                  다양한 게임과 웹 애플리케이션을 체험해보세요
                </p>
              </header>
              
              {/* 검색 및 필터링 컨트롤 */}
              <div className="max-w-4xl mx-auto mb-8">
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                  {/* 검색 창 */}
                  <div className="w-full md:w-2/3">
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <svg className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                      </div>
                      <input
                        type="search"
                        className="block w-full p-4 pl-10 text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        placeholder="프로젝트 검색..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        aria-label="프로젝트 검색"
                      />
                    </div>
                  </div>
                  
                  {/* 정렬 드롭다운 */}
                  <div className="w-full md:w-1/3 md:pr-4">
                    <select
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-4 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as 'newest' | 'oldest' | 'alphabetical' | 'updated')}
                      aria-label="정렬 기준"
                    >
                      <option value="newest">최신순</option>
                      <option value="updated">업데이트순</option>
                      <option value="oldest">오래된순</option>
                      <option value="alphabetical">이름순</option>
                    </select>
                  </div>
                </div>
              </div>
              
              {/* 카테고리 필터 */}
              <div className="mb-8 max-w-4xl mx-auto">
                <h2 className="sr-only">카테고리별 게임</h2>
                <ul className="flex flex-wrap justify-center gap-4">
                  {allCategories
                    .filter(category => category === 'all' || (categoryCounts[category] && categoryCounts[category] > 0))
                    .map((category) => (
                    <li key={category}>
                      <button
                        onClick={() => setSelectedCategory(category)}
                        className={`px-4 py-2 rounded-full transition-colors ${
                          selectedCategory === category
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                        }`}
                      >
                        <span className="font-medium capitalize">{category === 'all' ? '전체' : category}</span>
                        {category !== 'all' && (
                          <span className="ml-2 inline-flex items-center justify-center bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs font-semibold rounded-full w-6 h-6">
                            {categoryCounts[category]}
                          </span>
                        )}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
              
              {/* Gemini API 필터 - 작은 영역 */}
              <div className="mb-8 max-w-3xl mx-auto">
                <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 text-center">
                    🔑 Gemini API Key 필요 여부
                  </h3>
                  
                  <div className="flex flex-wrap justify-center gap-3">
                    {[
                      { value: 'none' as GeminiApiStatus, label: '불필요', emoji: '🚫' },
                      { value: 'optional' as GeminiApiStatus, label: '부분필요', emoji: '💡' },
                      { value: 'required' as GeminiApiStatus, label: '필요', emoji: '🔑' }
                    ].map(option => (
                      <label 
                        key={option.value}
                        className={`flex items-center space-x-2 cursor-pointer px-3 py-2 rounded-full transition-colors text-sm ${
                          selectedGeminiFilters.includes(option.value) 
                            ? 'bg-blue-100 dark:bg-blue-900/30 border border-blue-300 dark:border-blue-700 text-blue-800 dark:text-blue-200' 
                            : 'bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={selectedGeminiFilters.includes(option.value)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedGeminiFilters([...selectedGeminiFilters, option.value]);
                            } else {
                              setSelectedGeminiFilters(selectedGeminiFilters.filter(filter => filter !== option.value));
                            }
                          }}
                          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-1 dark:bg-gray-700 dark:border-gray-600"
                        />
                        <span className="text-sm">{option.emoji}</span>
                        <span className="font-medium">{option.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* 필터 상태 표시 및 초기화 */}
              {(searchTerm.trim() !== '' || selectedCategory !== 'all' || selectedGeminiFilters.length > 0) && (
                <div className="max-w-4xl mx-auto mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm font-medium text-blue-800 dark:text-blue-200">
                        활성 필터:
                      </span>
                      {searchTerm.trim() !== '' && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-200">
                          검색: "{searchTerm}"
                        </span>
                      )}
                      {selectedCategory !== 'all' && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-200">
                          카테고리: {selectedCategory}
                        </span>
                      )}
                      {selectedGeminiFilters.map(filter => (
                        <span 
                          key={filter}
                          className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-200"
                        >
                          API: {filter === 'none' ? '불필요' : filter === 'optional' ? '부분필요' : '필요'}
                        </span>
                      ))}
                    </div>
                    <button
                      onClick={resetFilters}
                      className="px-3 py-2 text-sm font-medium text-blue-800 dark:text-blue-200 hover:bg-blue-100 dark:hover:bg-blue-800 rounded-lg transition-colors"
                    >
                      필터 초기화
                    </button>
                  </div>
                </div>
              )}
              
              {/* 로딩 상태 표시 */}
              {isLoading && (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-gray-600 dark:text-gray-300">포트폴리오 데이터를 불러오는 중...</p>
                </div>
              )}

              {/* 에러 상태 표시 */}
              {error && (
                <div className="text-center py-12">
                  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 max-w-md mx-auto">
                    <div className="text-red-800 dark:text-red-200 mb-2">
                      ⚠️ 데이터 로드 오류
                    </div>
                    <p className="text-red-600 dark:text-red-300 text-sm mb-4">{error}</p>
                    <button
                      onClick={() => window.location.reload()}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                    >
                      페이지 새로고침
                    </button>
                  </div>
                </div>
              )}

              {/* 검색 결과 표시 */}
              {!isLoading && !error && (
                <div className="text-center mb-6">
                  <p className="text-gray-600 dark:text-gray-300">
                    총 {totalFilteredProjects}개의 프로젝트가 있습니다
                    {(searchTerm.trim() !== '' || selectedCategory !== 'all' || selectedGeminiFilters.length > 0) && 
                      ` (전체 ${portfolios.length}개 중)`
                    }
                  </p>
                </div>
              )}
              
              {/* 프로젝트 카드들 - 구조화된 마크업 */}
              {!isLoading && !error && currentPageProjects.length > 0 && (
                <>
                  <div role="feed" aria-label="프로젝트 목록" className="grid md:grid-cols-2 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
                    {currentPageProjects.map((project) => (
                      <article key={project.id}>
                        <ProjectCard project={project} />
                      </article>
                    ))}
                  </div>
                  
                  {/* 페이지네이션 */}
                  <Pagination
                    currentPage={currentProjectPage}
                    totalItems={totalFilteredProjects}
                    itemsPerPage={itemsPerPage}
                    onPageChange={handlePageChange}
                  />
                </>
              )}
              
              {/* 검색 결과 없음 메시지 */}
              {!isLoading && !error && totalFilteredProjects === 0 && (
                <div className="text-center py-12">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-white">검색 결과가 없습니다</h3>
                  <p className="mt-1 text-gray-500 dark:text-gray-400">다른 검색어를 입력하거나 필터를 조정해보세요.</p>
                  <div className="mt-6">
                    <button
                      onClick={resetFilters}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                    >
                      모든 필터 초기화
                    </button>
                  </div>
                </div>
              )}
            </div>
          </section>
          
          {/* FAQ 섹션 - SEO 개선을 위한 추가 콘텐츠 */}
          <section aria-labelledby="faq-heading" className="py-12 bg-gray-50 dark:bg-gray-900">
            <div className="container mx-auto px-4">
              <h2 id="faq-heading" className="text-2xl md:text-3xl font-bold text-center mb-8 text-gray-900 dark:text-white">
                자주 묻는 질문
              </h2>
              <div className="max-w-3xl mx-auto">
                <dl className="space-y-6">
                  <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                    <dt className="font-semibold text-gray-900 dark:text-white">DevCanvas는 어떤 플랫폼인가요?</dt>
                    <dd className="mt-2 text-gray-600 dark:text-gray-300">DevCanvas는 게임과 웹 애플리케이션을 오픈소스로 제공하는 플랫폼입니다. 사용자는 다양한 게임과 앱을 무료로 사용할 수 있고, 모든 프로젝트의 소스코드는 오픈되어 있습니다.</dd>
                  </div>
                  <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                    <dt className="font-semibold text-gray-900 dark:text-white">게임은 어떻게 플레이하나요?</dt>
                    <dd className="mt-2 text-gray-600 dark:text-gray-300">각 프로젝트 카드의 '앱 실행' 버튼을 클릭하면 새 탭에서 게임이나 웹앱이 열립니다. 별도의 설치 없이 웹 브라우저에서 바로 플레이할 수 있습니다.</dd>
                  </div>
                  <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                    <dt className="font-semibold text-gray-900 dark:text-white">모바일에서도 플레이 가능한가요?</dt>
                    <dd className="mt-2 text-gray-600 dark:text-gray-300">네, 대부분의 게임은 반응형으로 설계되어 있지만 일부 게임 및 앱은 PC에서 원활하게 실행됩니다.</dd>
                  </div>
                </dl>
              </div>
            </div>
          </section>
            </>
          )}
        </main>
        
        {/* 푸터 - 구조화된 마크업 및 링크 개선 */}
        <footer className="bg-gray-800 text-white py-8">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="mb-4 md:mb-0">
                <p className="text-lg font-semibold">DevCanvas</p>
                <p className="text-sm text-gray-400">웹앱 & 웹게임 허브</p>
              </div>
              <nav aria-label="푸터 네비게이션">
                <ul className="flex space-x-6">
                  <li><a href="#projects" className="hover:text-blue-300 transition">프로젝트</a></li>
                  <li><a href="#" className="hover:text-blue-300 transition">소개</a></li>
                  <li><a href="#" className="hover:text-blue-300 transition">연락처</a></li>
                </ul>
              </nav>
            </div>
            <div className="mt-6 pt-6 border-t border-gray-700 text-center text-sm text-gray-400">
              <p>&copy; {new Date().getFullYear()} DevCanvas. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>

      {/* 대시보드 모달 */}
      <DashboardModal
        isOpen={isDashboardOpen}
        onClose={closeDashboard}
        data={dashboardData}
        isLoading={isDashboardLoading}
        error={dashboardError}
        onRefresh={refreshDashboardData}
      />
    </AuthProvider>
  )
}

export default App 