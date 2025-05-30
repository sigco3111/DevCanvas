import { Header, Hero, ProjectCard } from './components';
import { PortfolioItem } from './types/portfolio';
import portfolioData from './data/portfolios.json';
import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';

/**
 * DevCanvas 메인 애플리케이션 컴포넌트
 * 웹앱과 웹게임을 연결해주는 허브 페이지
 */
function App() {
  // 포트폴리오 데이터 로드
  const portfolios: PortfolioItem[] = portfolioData as PortfolioItem[];
  
  // 카테고리별 프로젝트 수 계산
  const categoryCounts = portfolios.reduce((acc, project) => {
    acc[project.category] = (acc[project.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  // 페이지 로드 시 접근성 개선
  useEffect(() => {
    // 스크린 리더용 페이지 정보 업데이트
    document.title = "DevCanvas - 웹앱 & 웹게임 허브 | 자동진행 게임 플랫폼";
  }, []);

  return (
    <>
      {/* 페이지별 SEO 메타데이터 (react-helmet-async 사용) */}
      <Helmet>
        <title>DevCanvas - 웹앱 & 웹게임 허브 | 자동진행 게임 플랫폼</title>
        <meta name="description" content="DevCanvas에서 World War Simulator, 테트리스 AI 마스터 3D, 방치형 모험가 노트 등 다양한 자동진행 게임을 즐겨보세요." />
        <link rel="canonical" href="https://devcanvas.vercel.app/" />
      </Helmet>
      
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header />
        
        {/* 메인 콘텐츠 - 시맨틱 태그 강화 */}
        <main id="main-content">
          {/* Hero 섹션 - 홈과 프로젝트 소개를 통합 */}
          <Hero />

          {/* 프로젝트 섹션 */}
          <section id="projects" aria-labelledby="projects-heading" className="py-16 bg-white dark:bg-gray-800">
            <div className="container mx-auto px-4 py-8">
              <header className="text-center mb-12">
                <h1 id="projects-heading" className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                  프로젝트 둘러보기
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                  다양한 자동진행 게임과 웹 애플리케이션을 체험해보세요
                </p>
              </header>
              
              {/* 카테고리 요약 - 검색엔진에 추가 콘텐츠 제공 */}
              <div className="mb-8 max-w-4xl mx-auto">
                <h2 className="sr-only">카테고리별 게임</h2>
                <ul className="flex flex-wrap justify-center gap-4">
                  {Object.entries(categoryCounts).map(([category, count]) => (
                    <li key={category} className="bg-gray-100 dark:bg-gray-700 px-4 py-2 rounded-full">
                      <span className="font-medium">{category}</span>
                      <span className="ml-2 inline-flex items-center justify-center bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs font-semibold rounded-full w-6 h-6">{count}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              {/* 프로젝트 카드들 - 구조화된 마크업 */}
              <div role="feed" aria-label="프로젝트 목록" className="grid md:grid-cols-2 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
                {portfolios.map((project) => (
                  <article key={project.id}>
                    <ProjectCard project={project} />
                  </article>
                ))}
              </div>

              <footer className="text-center mt-12">
                <p className="text-gray-500 dark:text-gray-400">
                  더 많은 프로젝트가 곧 추가될 예정입니다!
                </p>
              </footer>
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
                    <dd className="mt-2 text-gray-600 dark:text-gray-300">DevCanvas는 자동진행 게임과 웹 애플리케이션을 제공하는 플랫폼입니다. 사용자는 다양한 게임을 무료로 즐길 수 있습니다.</dd>
                  </div>
                  <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                    <dt className="font-semibold text-gray-900 dark:text-white">게임은 어떻게 플레이하나요?</dt>
                    <dd className="mt-2 text-gray-600 dark:text-gray-300">각 게임 카드의 '앱 실행' 버튼을 클릭하면 새 탭에서 게임이 열립니다. 별도의 설치 없이 웹 브라우저에서 바로 플레이할 수 있습니다.</dd>
                  </div>
                  <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                    <dt className="font-semibold text-gray-900 dark:text-white">모바일에서도 플레이 가능한가요?</dt>
                    <dd className="mt-2 text-gray-600 dark:text-gray-300">네, 모든 게임은 반응형으로 설계되어 모바일 기기에서도 원활하게 플레이할 수 있습니다.</dd>
                  </div>
                </dl>
              </div>
            </div>
          </section>
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
    </>
  )
}

export default App 