import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import AdminPage from './pages/AdminPage';
import { ProjectModal } from './components';
import { PortfolioItem } from './types/portfolio';

/**
 * DevCanvas 메인 애플리케이션 컴포넌트
 * 라우팅과 전역 모달 상태를 관리
 * 요구사항 2.1: 프로젝트 모달 상태 관리
 */
function App() {
  // 프로젝트 모달 상태 관리 (요구사항 2.1)
  const [selectedProject, setSelectedProject] = useState<PortfolioItem | null>(null);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);

  /**
   * 프로젝트 모달 열기 핸들러
   * 프로젝트 카드에서 호출되어 모달을 열고 선택된 프로젝트를 설정
   */
  const handleProjectCardClick = (project: PortfolioItem) => {
    setSelectedProject(project);
    setIsProjectModalOpen(true);
  };

  /**
   * 프로젝트 모달 닫기 핸들러
   * 모달을 닫고 선택된 프로젝트를 초기화
   */
  const closeProjectModal = () => {
    setIsProjectModalOpen(false);
    setSelectedProject(null);
  };

  return (
    <>
      <Routes>
        {/* 홈페이지 경로 - 모달 핸들러 props 전달 */}
        <Route 
          path="/" 
          element={
            <HomePage 
              onProjectCardClick={handleProjectCardClick}
            />
          } 
        />
        
        {/* 관리자 페이지 경로 */}
        <Route path="/admin" element={<AdminPage />} />
        
        {/* 404 페이지 - 존재하지 않는 경로는 홈으로 리다이렉트 */}
        <Route 
          path="*" 
          element={
            <HomePage 
              onProjectCardClick={handleProjectCardClick}
            />
          } 
        />
      </Routes>

      {/* 전역 프로젝트 모달 - 모든 페이지에서 공유 */}
      <ProjectModal
        project={selectedProject}
        isOpen={isProjectModalOpen}
        onClose={closeProjectModal}
      />
    </>
  );
}

export default App 