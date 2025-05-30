import { Header, Hero, ProjectCard } from './components';
import { PortfolioItem } from './types/portfolio';
import portfolioData from './data/portfolios.json';

/**
 * DevCanvas 메인 애플리케이션 컴포넌트
 * 웹앱과 웹게임을 연결해주는 허브 페이지
 */
function App() {
  // 포트폴리오 데이터 로드
  const portfolios: PortfolioItem[] = portfolioData as PortfolioItem[];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      
      {/* 메인 콘텐츠 */}
      <main>
        {/* Hero 섹션 - 홈과 프로젝트 소개를 통합 */}
        <Hero />

        {/* 프로젝트 섹션 */}
        <section id="projects" className="py-16 bg-white dark:bg-gray-800">
          <div className="container mx-auto px-4 py-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                프로젝트 둘러보기
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                다양한 자동진행 게임과 웹 애플리케이션을 체험해보세요
              </p>
            </div>
            
            {/* 프로젝트 카드들 */}
            <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
              {portfolios.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>

            <div className="text-center mt-12">
              <p className="text-gray-500 dark:text-gray-400">
                더 많은 프로젝트가 곧 추가될 예정입니다!
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

export default App 