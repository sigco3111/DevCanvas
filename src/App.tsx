import { Header, Hero } from './components';

/**
 * DevCanvas 메인 애플리케이션 컴포넌트
 * 웹앱과 웹게임을 연결해주는 허브 페이지
 */
function App() {

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
                다양한 웹 애플리케이션과 게임을 체험해보세요
              </p>
            </div>
            
            {/* 임시 프로젝트 카드들 */}
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {/* World War Simulator */}
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 hover:shadow-lg transition-shadow duration-300">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  World War Simulator
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  AI 국가들이 벌이는 대규모 전쟁 시뮬레이션 게임
                </p>
                <a 
                  href="https://world-war-simulator.vercel.app/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                >
                  게임 플레이
                  <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>

              {/* 방치형 모험가 노트 */}
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 hover:shadow-lg transition-shadow duration-300">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  방치형 모험가 노트
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  방치형 RPG 게임으로 자동 성장과 던전 공략을 즐기세요
                </p>
                <a 
                  href="https://idle-rpg-one.vercel.app/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200"
                >
                  게임 플레이
                  <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>
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