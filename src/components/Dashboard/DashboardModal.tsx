/**
 * 대시보드 모달 컴포넌트
 * 사이트의 통계 정보를 표시하는 모달 창
 */
import React, { useState, useRef, useEffect } from 'react';
import { DashboardModalProps } from './types';
import { StatCard } from './';
import { DonutChart, BarChart, LineChart } from './charts';

const DashboardModal: React.FC<DashboardModalProps> = ({
  isOpen,
  onClose,
  data,
  isLoading = false,
  error = null,
  onRefresh
}) => {
  // 모달 표시 여부에 따른 클래스 설정
  const modalClass = isOpen ? 'flex' : 'hidden';
  
  // 현재 선택된 탭 상태
  const [activeTab, setActiveTab] = useState<'portfolio' | 'board' | 'user' | 'tech'>('portfolio');
  
  // 모달 외부 클릭 감지를 위한 ref
  const modalRef = useRef<HTMLDivElement>(null);
  
  // 탭 변경 핸들러
  const handleTabChange = (tab: 'portfolio' | 'board' | 'user' | 'tech') => {
    setActiveTab(tab);
  };
  
  // ESC 키 및 외부 클릭 감지 이벤트 핸들러
  useEffect(() => {
    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    
    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node) && isOpen) {
        onClose();
      }
    };
    
    // 이벤트 리스너 등록
    document.addEventListener('keydown', handleEscapeKey);
    document.addEventListener('mousedown', handleClickOutside);
    
    // 모달이 열릴 때 스크롤 방지
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }
    
    // 컴포넌트 언마운트 시 이벤트 리스너 해제
    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, onClose]);

  // 로딩 화면
  if (isLoading) {
    return (
      <div className={`${modalClass} fixed inset-0 z-50 justify-center items-center bg-black bg-opacity-50 p-4`}>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-hidden">
          <div className="flex flex-col items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-gray-600 dark:text-gray-300">통계 데이터를 불러오는 중입니다...</p>
          </div>
        </div>
      </div>
    );
  }
  
  // 에러 화면
  if (error) {
    return (
      <div className={`${modalClass} fixed inset-0 z-50 justify-center items-center bg-black bg-opacity-50 p-4`}>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-hidden">
          <div className="flex justify-between items-center mb-6 pb-3 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">대시보드 오류</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
              aria-label="닫기"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
          
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 mb-6">
            <div className="flex items-center text-red-800 dark:text-red-200 mb-3">
              <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <h3 className="text-lg font-medium">통계 데이터 로드 실패</h3>
            </div>
            <p className="text-red-700 dark:text-red-300 mb-4">{error}</p>
            
            <div className="flex space-x-3">
              <button
                onClick={onRefresh}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
              >
                다시 시도
              </button>
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg transition-colors"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  // 데이터가 없는 경우
  if (!data) {
    return (
      <div className={`${modalClass} fixed inset-0 z-50 justify-center items-center bg-black bg-opacity-50 p-4`}>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-hidden">
          <div className="flex justify-between items-center mb-6 pb-3 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">사이트 통계 대시보드</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
              aria-label="닫기"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
          
          <div className="flex flex-col items-center justify-center py-12">
            <svg className="w-16 h-16 text-gray-400 dark:text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
            </svg>
            <p className="text-gray-600 dark:text-gray-300 mb-4">통계 데이터를 불러올 수 없습니다.</p>
            
            <button
              onClick={onRefresh}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              새로고침
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  // 정상적인 대시보드 렌더링
  return (
    <div className={`${modalClass} fixed inset-0 z-50 justify-center items-center bg-black bg-opacity-50 p-4 overflow-auto`}>
      <div 
        ref={modalRef} 
        className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col"
      >
        {/* 모달 헤더 */}
        <div className="flex justify-between items-center p-6 pb-3 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">사이트 통계 대시보드</h2>
          
          <div className="flex items-center space-x-2">
            {/* 새로고침 버튼 */}
            {onRefresh && (
              <button
                onClick={onRefresh}
                className="p-2 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                aria-label="새로고침"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                </svg>
              </button>
            )}
            
            {/* 닫기 버튼 */}
            <button
              onClick={onClose}
              className="p-2 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
              aria-label="닫기"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
        </div>
        
        {/* 대시보드 탭 네비게이션 */}
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex px-6 overflow-x-auto" aria-label="통계 카테고리">
            <button
              onClick={() => handleTabChange('portfolio')}
              className={`py-4 px-6 font-medium border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'portfolio'
                  ? 'border-blue-600 text-blue-600 dark:border-blue-500 dark:text-blue-500'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              포트폴리오 통계
            </button>
            
            <button
              onClick={() => handleTabChange('tech')}
              className={`py-4 px-6 font-medium border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'tech'
                  ? 'border-blue-600 text-blue-600 dark:border-blue-500 dark:text-blue-500'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              기술 스택 통계
            </button>
            
            <button
              onClick={() => handleTabChange('board')}
              className={`py-4 px-6 font-medium border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'board'
                  ? 'border-blue-600 text-blue-600 dark:border-blue-500 dark:text-blue-500'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              게시판 통계
            </button>
            
            <button
              onClick={() => handleTabChange('user')}
              className={`py-4 px-6 font-medium border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'user'
                  ? 'border-blue-600 text-blue-600 dark:border-blue-500 dark:text-blue-500'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              사용자 활동
            </button>
          </nav>
        </div>
        
        {/* 대시보드 콘텐츠 영역 */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* 포트폴리오 통계 탭 */}
          {activeTab === 'portfolio' && (
            <div className="space-y-6">
              {/* 요약 통계 */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <StatCard title="총 프로젝트 수">
                  <div className="text-3xl font-bold text-blue-600 dark:text-blue-500 text-center py-4">
                    {data.portfolio.totalProjects}
                  </div>
                </StatCard>
                
                <StatCard title="최근 추가된 프로젝트">
                  <div className="text-3xl font-bold text-green-600 dark:text-green-500 text-center py-4">
                    {data.portfolio.recentProjects.length > 0 ? data.portfolio.recentProjects.length : 0}
                  </div>
                </StatCard>
                
                <StatCard title="마지막 업데이트">
                  <div className="text-center py-4">
                    <div className="text-lg font-medium text-gray-800 dark:text-gray-200">
                      {new Date(data.lastUpdated).toLocaleDateString()}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {new Date(data.lastUpdated).toLocaleTimeString()}
                    </div>
                  </div>
                </StatCard>
              </div>
              
              {/* 도넛 차트: 카테고리별 프로젝트 분포 */}
              <StatCard title="카테고리별 프로젝트 분포">
                <DonutChart 
                  data={data.portfolio.categoryDistribution.map(item => ({
                    name: item.name,
                    value: item.count
                  }))}
                  height={300}
                />
              </StatCard>
              
              {/* 바 차트: Gemini API 상태별 프로젝트 수 */}
              <StatCard title="Gemini API 상태별 프로젝트 수">
                <BarChart 
                  data={data.portfolio.geminiApiDistribution.map(item => ({
                    name: item.status,
                    value: item.count
                  }))}
                  dataKey="value"
                  height={250}
                />
              </StatCard>
              
              {/* 라인 차트: 시간에 따른 프로젝트 추가 추이 */}
              <StatCard title="시간에 따른 프로젝트 추가 추이">
                <LineChart 
                  data={data.portfolio.projectsOverTime.map(item => ({
                    name: item.date,
                    value: item.count
                  }))}
                  dataKey="value"
                  height={250}
                  areaFill
                />
              </StatCard>
              
              {/* 최근 프로젝트 목록 */}
              <StatCard title="최근 추가된 프로젝트">
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead>
                      <tr className="border-b border-gray-200 dark:border-gray-700">
                        <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">프로젝트</th>
                        <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">카테고리</th>
                        <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">생성일</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.portfolio.recentProjects.map((project, index) => (
                        <tr 
                          key={project.id} 
                          className={index % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-750'}
                        >
                          <td className="py-3 px-4 text-sm text-gray-900 dark:text-white">{project.title}</td>
                          <td className="py-3 px-4 text-sm text-gray-500 dark:text-gray-400">{project.category}</td>
                          <td className="py-3 px-4 text-sm text-gray-500 dark:text-gray-400">{new Date(project.createdAt).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </StatCard>
            </div>
          )}
          
          {/* 기술 스택 통계 탭 */}
          {activeTab === 'tech' && (
            <div className="space-y-6">
              {/* 요약 통계 */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <StatCard title="총 기술 스택 수">
                  <div className="text-3xl font-bold text-blue-600 dark:text-blue-500 text-center py-4">
                    {data.tech.totalTechnologies}
                  </div>
                </StatCard>
                
                <StatCard title="총 개발 도구 수">
                  <div className="text-3xl font-bold text-purple-600 dark:text-purple-500 text-center py-4">
                    {data.tech.totalDevelopmentTools}
                  </div>
                </StatCard>
                
                <StatCard title="마지막 업데이트">
                  <div className="text-center py-4">
                    <div className="text-lg font-medium text-gray-800 dark:text-gray-200">
                      {new Date(data.lastUpdated).toLocaleDateString()}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {new Date(data.lastUpdated).toLocaleTimeString()}
                    </div>
                  </div>
                </StatCard>
              </div>
              
              {/* 도넛 차트: 상위 기술 스택 분포 */}
              <StatCard title="상위 기술 스택 분포">
                <DonutChart 
                  data={data.tech.topTechnologies.map(item => ({
                    name: item.name,
                    value: item.count
                  }))}
                  height={300}
                />
              </StatCard>
              
              {/* 바 차트: 상위 개발 도구 분포 */}
              <StatCard 
                title="상위 개발 도구 분포"
                contentClassName="p-1 pb-3"
              >
                <BarChart 
                  data={data.tech.topDevelopmentTools.map(item => ({
                    name: item.name,
                    value: item.count
                  }))}
                  dataKey="value"
                  height={300}
                />
              </StatCard>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* 상위 기술 스택 목록 */}
                <StatCard title="가장 많이 사용된 기술 스택">
                  <div className="overflow-x-auto">
                    <table className="min-w-full">
                      <thead>
                        <tr className="border-b border-gray-200 dark:border-gray-700">
                          <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">기술 스택</th>
                          <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">사용 프로젝트 수</th>
                          <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">비율</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.tech.topTechnologies.map((tech, index) => (
                          <tr 
                            key={tech.name} 
                            className={index % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-750'}
                          >
                            <td className="py-3 px-4 text-sm text-gray-900 dark:text-white">{tech.name}</td>
                            <td className="py-3 px-4 text-sm text-gray-500 dark:text-gray-400">{tech.count}</td>
                            <td className="py-3 px-4 text-sm text-gray-500 dark:text-gray-400">{tech.percentage}%</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </StatCard>
                
                {/* 상위 개발 도구 목록 */}
                <StatCard title="가장 많이 사용된 개발 도구">
                  <div className="overflow-x-auto">
                    <table className="min-w-full">
                      <thead>
                        <tr className="border-b border-gray-200 dark:border-gray-700">
                          <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">개발 도구</th>
                          <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">사용 프로젝트 수</th>
                          <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">비율</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.tech.topDevelopmentTools.map((tool, index) => (
                          <tr 
                            key={tool.name} 
                            className={index % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-750'}
                          >
                            <td className="py-3 px-4 text-sm text-gray-900 dark:text-white">{tool.name}</td>
                            <td className="py-3 px-4 text-sm text-gray-500 dark:text-gray-400">{tool.count}</td>
                            <td className="py-3 px-4 text-sm text-gray-500 dark:text-gray-400">{tool.percentage}%</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </StatCard>
              </div>
              
              {/* 프로젝트별 기술 스택 수 */}
              <StatCard title="프로젝트별 기술 스택 사용 현황">
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead>
                      <tr className="border-b border-gray-200 dark:border-gray-700">
                        <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">프로젝트</th>
                        <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">기술 스택 및 도구 수</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.tech.technologiesPerProject.map((project, index) => (
                        <tr 
                          key={project.projectId} 
                          className={index % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-750'}
                        >
                          <td className="py-3 px-4 text-sm text-gray-900 dark:text-white">{project.projectTitle}</td>
                          <td className="py-3 px-4 text-sm text-gray-500 dark:text-gray-400">{project.techCount}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </StatCard>
            </div>
          )}
          
          {/* 게시판 통계 탭 */}
          {activeTab === 'board' && (
            <div className="space-y-6">
              {/* 요약 통계 */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <StatCard title="총 게시글 수">
                  <div className="text-3xl font-bold text-blue-600 dark:text-blue-500 text-center py-4">
                    {data.board.totalPosts}
                  </div>
                </StatCard>
                
                <StatCard title="총 댓글 수">
                  <div className="text-3xl font-bold text-purple-600 dark:text-purple-500 text-center py-4">
                    {data.board.totalComments}
                  </div>
                </StatCard>
                
                <StatCard title="마지막 업데이트">
                  <div className="text-center py-4">
                    <div className="text-lg font-medium text-gray-800 dark:text-gray-200">
                      {new Date(data.lastUpdated).toLocaleDateString()}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {new Date(data.lastUpdated).toLocaleTimeString()}
                    </div>
                  </div>
                </StatCard>
              </div>
              
              {/* 도넛 차트: 카테고리별 게시글 분포 */}
              <StatCard title="카테고리별 게시글 분포">
                <DonutChart 
                  data={data.board.categoryDistribution.map(item => ({
                    name: String(item.name),
                    value: item.count
                  }))}
                  height={300}
                />
              </StatCard>
              
              {/* 라인 차트: 시간에 따른 게시글 작성 추이 */}
              <StatCard title="시간에 따른 게시글 작성 추이">
                <LineChart 
                  data={data.board.postsOverTime.map(item => ({
                    name: item.date,
                    value: item.count
                  }))}
                  dataKey="value"
                  height={250}
                  areaFill
                />
              </StatCard>
              
              {/* 인기 게시글 목록 */}
              <StatCard title="인기 게시글">
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead>
                      <tr className="border-b border-gray-200 dark:border-gray-700">
                        <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">제목</th>
                        <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">작성자</th>
                        <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">조회수</th>
                        <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">좋아요</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.board.popularPosts.map((post, index) => (
                        <tr 
                          key={post.id} 
                          className={index % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-750'}
                        >
                          <td className="py-3 px-4 text-sm text-gray-900 dark:text-white">{post.title}</td>
                          <td className="py-3 px-4 text-sm text-gray-500 dark:text-gray-400">{post.authorName}</td>
                          <td className="py-3 px-4 text-sm text-gray-500 dark:text-gray-400">{post.viewCount}</td>
                          <td className="py-3 px-4 text-sm text-gray-500 dark:text-gray-400">{post.likeCount}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </StatCard>
            </div>
          )}
          
          {/* 사용자 활동 탭 */}
          {activeTab === 'user' && (
            <div className="space-y-6">
              {/* 요약 통계 */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <StatCard title="총 방문자 수">
                  <div className="text-3xl font-bold text-blue-600 dark:text-blue-500 text-center py-4">
                    {data.user.totalVisitors}
                  </div>
                </StatCard>
                
                <StatCard title="로그인 사용자 수">
                  <div className="text-3xl font-bold text-green-600 dark:text-green-500 text-center py-4">
                    {data.user.totalUsers}
                  </div>
                </StatCard>
                
                <StatCard title="마지막 업데이트">
                  <div className="text-center py-4">
                    <div className="text-lg font-medium text-gray-800 dark:text-gray-200">
                      {new Date(data.lastUpdated).toLocaleDateString()}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {new Date(data.lastUpdated).toLocaleTimeString()}
                    </div>
                  </div>
                </StatCard>
              </div>
              
              {/* 바 차트: 사용자별 게시글 작성 순위 */}
              <StatCard title="사용자별 게시글 작성 순위">
                <BarChart 
                  data={data.user.topContributors.map(contributor => ({
                    name: contributor.userName,
                    value: contributor.postCount
                  }))}
                  dataKey="value"
                  height={250}
                />
              </StatCard>
              
              {/* 바 차트: 시간대별 방문자 분포 */}
              <StatCard title="시간대별 방문자 분포">
                <BarChart 
                  data={data.user.visitsByHour.map(hourData => ({
                    name: `${hourData.hour}시`,
                    value: hourData.count
                  }))}
                  dataKey="value"
                  height={250}
                />
              </StatCard>
              
              {/* 라인 차트: 일별 활동 추이 */}
              <StatCard title="일별 활동 추이">
                <LineChart 
                  data={data.user.activityByDay.map(item => ({
                    name: item.date,
                    visitors: item.visitors,
                    posts: item.posts,
                    comments: item.comments
                  }))}
                  height={250}
                  series={[
                    { dataKey: 'visitors', name: '방문자', color: '#3B82F6' },
                    { dataKey: 'posts', name: '게시글', color: '#10B981' },
                    { dataKey: 'comments', name: '댓글', color: '#F59E0B' }
                  ]}
                />
              </StatCard>
            </div>
          )}
        </div>
        
        {/* 모달 푸터 */}
        <div className="px-6 py-3 bg-gray-50 dark:bg-gray-750 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <div className="text-xs text-gray-500 dark:text-gray-400">
            마지막 업데이트: {new Date(data.lastUpdated).toLocaleString()}
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg text-sm transition-colors"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};

export default React.memo(DashboardModal); 