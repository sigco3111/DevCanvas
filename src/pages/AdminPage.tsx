import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminLogin, ThemeToggle } from '../components';
import { isAdminAuthenticated, adminLogoutWithNotification, onAdminAuthStateChange } from '../services/adminAuthService';
import { getPortfolios, addPortfolio, updatePortfolio, deletePortfolio } from '../services/portfolioService';
import { PortfolioItem } from '../types/portfolio';

/**
 * 관리자 대시보드 컴포넌트
 * 프로젝트 관리 및 통계 기능 제공
 */
const AdminDashboard: React.FC = () => {
  const [portfolios, setPortfolios] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'overview' | 'projects' | 'stats'>('overview');
  const [editingProject, setEditingProject] = useState<PortfolioItem | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  // 구글 드라이브 이미지 링크를 썸네일 URL로 변환하는 함수
  const getGoogleDriveThumbnailUrl = (url: string): string => {
    // URL이 없거나 빈 문자열인 경우 플레이스홀더 반환
    if (!url || url.trim() === '') {
      return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yMDAgMTUwQzIwNSAxNTAgMjEwIDE0NSAyMTAgMTQwQzIxMCAxMzUgMjA1IDEzMCAyMDAgMTMwQzE5NSAxMzAgMTkwIDEzNSAxOTAgMTQwQzE5MCAxNDUgMTk1IDE1MCAyMDAgMTUwWiIgZmlsbD0iIzlDQTNBRiIvPgo8cGF0aCBkPSJNMTcwIDE4MEwyMzAgMTgwTDIxMCAxNjBMMTkwIDE3MEwxNzAgMTgwWiIgZmlsbD0iIzlDQTNBRiIvPgo8L3N2Zz4K';
    }
    
    // 구글 드라이브 공유 링크 패턴: https://drive.google.com/file/d/{FILE_ID}/view?usp=sharing
    const driveFileIdMatch = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
    if (driveFileIdMatch) {
      const fileId = driveFileIdMatch[1];
      // 썸네일 URL 형식: https://drive.google.com/thumbnail?id={FILE_ID}&sz=w400
      return `https://drive.google.com/thumbnail?id=${fileId}&sz=w400`;
    }
    // 구글 드라이브 링크가 아닌 경우 원본 URL 반환
    return url;
  };

  // 포트폴리오 데이터 로드
  useEffect(() => {
    loadPortfolios();
  }, []);

  const loadPortfolios = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await getPortfolios();
      setPortfolios(data);
    } catch (err) {
      setError('포트폴리오 데이터를 불러오는데 실패했습니다.');
      console.error('포트폴리오 로드 실패:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProject = async (id: string, title: string) => {
    if (!confirm(`"${title}" 프로젝트를 삭제하시겠습니까?`)) {
      return;
    }

    try {
      await deletePortfolio(id);
      await loadPortfolios();
      alert('프로젝트가 성공적으로 삭제되었습니다.');
    } catch (err) {
      alert('프로젝트 삭제에 실패했습니다.');
      console.error('프로젝트 삭제 실패:', err);
    }
  };

  const handleEditProject = (project: PortfolioItem) => {
    setEditingProject(project);
    setActiveTab('projects');
  };

  const handleSaveProject = async (projectData: Partial<PortfolioItem>) => {
    try {
      if (editingProject) {
        // 방어: Firestore 문서 ID가 비어있는 경우 대비
        const targetId = (editingProject.id || '').trim();
        if (!targetId) {
          throw new Error('유효하지 않은 프로젝트 ID입니다. 다시 시도하세요.');
        }
        // 수정
        await updatePortfolio(targetId, projectData);
        alert('프로젝트가 성공적으로 수정되었습니다.');
      } else {
        // 추가
        await addPortfolio({
          ...projectData,
          id: '', // Firebase에서 자동 생성
          createdAt: new Date().toISOString(),
          viewCount: 0,
          commentCount: 0
        } as PortfolioItem);
        alert('프로젝트가 성공적으로 추가되었습니다.');
      }
      
      setEditingProject(null);
      setShowAddForm(false);
      await loadPortfolios();
    } catch (err) {
      alert('프로젝트 저장에 실패했습니다.');
      console.error('프로젝트 저장 실패:', err);
    }
  };

  const totalProjects = portfolios.length;
  const totalViews = portfolios.reduce((sum, p) => sum + p.viewCount, 0);
  const totalComments = portfolios.reduce((sum, p) => sum + p.commentCount, 0);

  return (
    <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        {/* 탭 네비게이션 */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'overview'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              개요
            </button>
            <button
              onClick={() => setActiveTab('projects')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'projects'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              프로젝트 관리
            </button>
            <button
              onClick={() => setActiveTab('stats')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'stats'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              통계
            </button>
          </nav>
        </div>

        {/* 에러 메시지 */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
            <div className="flex">
              <svg className="h-5 w-5 text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        )}

        {/* 개요 탭 */}
        {activeTab === 'overview' && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">대시보드 개요</h2>
            
            {/* 통계 카드 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <svg className="h-6 w-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          총 프로젝트
                        </dt>
                        <dd className="text-lg font-medium text-gray-900">
                          {totalProjects}개
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <svg className="h-6 w-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          총 조회수
                        </dt>
                        <dd className="text-lg font-medium text-gray-900">
                          {totalViews.toLocaleString()}회
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <svg className="h-6 w-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          총 댓글수
                        </dt>
                        <dd className="text-lg font-medium text-gray-900">
                          {totalComments.toLocaleString()}개
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>


            </div>

            {/* 최근 프로젝트 */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                  최근 프로젝트
                </h3>
                {loading ? (
                  <div className="text-center py-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  </div>
                ) : portfolios.length > 0 ? (
                  <div className="space-y-3">
                    {portfolios.slice(0, 5).map((project) => (
                      <div key={project.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            {project.imageUrl ? (
                              <img
                                className="h-10 w-10 rounded-lg object-cover"
                                src={getGoogleDriveThumbnailUrl(project.imageUrl)}
                                alt={project.title}
                                onError={(e) => {
                                  // 이미지 로딩 실패 시 플레이스홀더 표시
                                  const target = e.target as HTMLImageElement;
                                  target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yMDAgMTUwQzIwNSAxNTAgMjEwIDE0NSAyMTAgMTQwQzIxMCAxMzUgMjA1IDEzMCAyMDAgMTMwQzE5NSAxMzAgMTkwIDEzNSAxOTAgMTQwQzE5MCAxNDUgMTk1IDE1MCAyMDAgMTUwWiIgZmlsbD0iIzlDQTNBRiIvPgo8cGF0aCBkPSJNMTcwIDE4MEwyMzAgMTgwTDIxMCAxNjBMMTkwIDE3MEwxNzAgMTgwWiIgZmlsbD0iIzlDQTNBRiIvPgo8L3N2Zz4K';
                                }}
                              />
                            ) : (
                              <div className="h-10 w-10 rounded-lg bg-gray-200 flex items-center justify-center">
                                <svg className="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                              </div>
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{project.title}</div>
                            <div className="text-sm text-gray-500">{project.category}</div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span>조회 {project.viewCount}</span>
                          <span>댓글 {project.commentCount}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-4">등록된 프로젝트가 없습니다.</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* 프로젝트 관리 탭 */}
        {activeTab === 'projects' && (
          <ProjectManagement
            portfolios={portfolios}
            loading={loading}
            onEdit={handleEditProject}
            onDelete={handleDeleteProject}
            onAdd={() => setShowAddForm(true)}
            editingProject={editingProject}
            showAddForm={showAddForm}
            onSave={handleSaveProject}
            onCancel={() => {
              setEditingProject(null);
              setShowAddForm(false);
            }}
          />
        )}

        {/* 통계 탭 */}
        {activeTab === 'stats' && (
          <StatisticsView portfolios={portfolios} loading={loading} />
        )}
      </div>
    </main>
  );
};

/**
 * 관리자 페이지 컴포넌트
 * /admin 경로로 접근 가능
 */
const AdminPage: React.FC = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // 컴포넌트 마운트 시 인증 상태 확인
  useEffect(() => {
    const checkAuthStatus = () => {
      const authStatus = isAdminAuthenticated();
      setIsAuthenticated(authStatus);
      setIsLoading(false);
    };

    checkAuthStatus();

    // 인증 상태 변경 리스너 등록
    const unsubscribe = onAdminAuthStateChange((authStatus) => {
      setIsAuthenticated(authStatus);
    });

    return unsubscribe;
  }, []);

  /**
   * 관리자 인증 성공 핸들러
   */
  const handleAuthenticated = () => {
    setIsAuthenticated(true);
  };

  /**
   * 로그인 취소 핸들러 - 홈으로 이동
   */
  const handleLoginCancel = () => {
    navigate('/');
  };

  /**
   * 로그아웃 핸들러
   */
  const handleLogout = () => {
    adminLogoutWithNotification();
    setIsAuthenticated(false);
  };

  /**
   * 홈으로 돌아가기 핸들러
   */
  const handleGoHome = () => {
    navigate('/');
  };

  // 로딩 중 표시
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">인증 상태를 확인하는 중...</p>
        </div>
      </div>
    );
  }

  // 인증되지 않은 경우 로그인 화면 표시
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* 헤더 */}
        <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div className="flex items-center">
                <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                  DevCanvas 관리자
                </h1>
              </div>
              <div className="flex items-center space-x-4">
                <ThemeToggle size="md" />
                <button
                  onClick={handleGoHome}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  홈으로 돌아가기
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* 로그인 화면 */}
        <main className="flex-1">
          <AdminLogin 
            onAuthenticated={handleAuthenticated}
            onCancel={handleLoginCancel}
          />
        </main>
      </div>
    );
  }

  // 인증된 경우 관리자 대시보드 표시
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* 관리자 헤더 */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                DevCanvas 관리자 패널
              </h1>
              <span className="ml-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">
                인증됨
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <ThemeToggle size="md" />
              <button
                onClick={handleGoHome}
                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                홈으로
              </button>
              <button
                onClick={handleLogout}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                로그아웃
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* 관리자 대시보드 콘텐츠 */}
      <AdminDashboard />
    </div>
  );
};

/**
 * 프로젝트 관리 컴포넌트
 */
interface ProjectManagementProps {
  portfolios: PortfolioItem[];
  loading: boolean;
  onEdit: (project: PortfolioItem) => void;
  onDelete: (id: string, title: string) => void;
  onAdd: () => void;
  editingProject: PortfolioItem | null;
  showAddForm: boolean;
  onSave: (projectData: Partial<PortfolioItem>) => void;
  onCancel: () => void;
}

const ProjectManagement: React.FC<ProjectManagementProps> = ({
  portfolios,
  loading,
  onEdit,
  onDelete,
  onAdd,
  editingProject,
  showAddForm,
  onSave,
  onCancel
}) => {
  // 검색 및 정렬 상태
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'title' | 'category' | 'createdAt' | 'viewCount'>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  
  // 페이징 상태
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // 구글 드라이브 이미지 링크를 썸네일 URL로 변환하는 함수
  const getGoogleDriveThumbnailUrl = (url: string): string => {
    // URL이 없거나 빈 문자열인 경우 플레이스홀더 반환
    if (!url || url.trim() === '') {
      return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yMDAgMTUwQzIwNSAxNTAgMjEwIDE0NSAyMTAgMTQwQzIxMCAxMzUgMjA1IDEzMCAyMDAgMTMwQzE5NSAxMzAgMTkwIDEzNSAxOTAgMTQwQzE5MCAxNDUgMTk1IDE1MCAyMDAgMTUwWiIgZmlsbD0iIzlDQTNBRiIvPgo8cGF0aCBkPSJNMTcwIDE4MEwyMzAgMTgwTDIxMCAxNjBMMTkwIDE3MEwxNzAgMTgwWiIgZmlsbD0iIzlDQTNBRiIvPgo8L3N2Zz4K';
    }
    
    // 구글 드라이브 공유 링크 패턴: https://drive.google.com/file/d/{FILE_ID}/view?usp=sharing
    const driveFileIdMatch = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
    if (driveFileIdMatch) {
      const fileId = driveFileIdMatch[1];
      // 썸네일 URL 형식: https://drive.google.com/thumbnail?id={FILE_ID}&sz=w400
      return `https://drive.google.com/thumbnail?id=${fileId}&sz=w400`;
    }
    // 구글 드라이브 링크가 아닌 경우 원본 URL 반환
    return url;
  };

  // 검색 및 정렬된 프로젝트 목록
  const filteredAndSortedProjects = useMemo(() => {
    let filtered = portfolios;

    // 검색 필터링
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = portfolios.filter(project =>
        project.title.toLowerCase().includes(term) ||
        project.category.toLowerCase().includes(term) ||
        project.description.toLowerCase().includes(term) ||
        project.technologies.some(tech => tech.toLowerCase().includes(term))
      );
    }

    // 정렬
    filtered.sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (sortBy) {
        case 'title':
          aValue = a.title.toLowerCase();
          bValue = b.title.toLowerCase();
          break;
        case 'category':
          aValue = a.category.toLowerCase();
          bValue = b.category.toLowerCase();
          break;
        case 'createdAt':
          aValue = new Date(a.createdAt).getTime();
          bValue = new Date(b.createdAt).getTime();
          break;
        case 'viewCount':
          aValue = a.viewCount || 0;
          bValue = b.viewCount || 0;
          break;
        default:
          return 0;
      }

      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [portfolios, searchTerm, sortBy, sortOrder]);

  // 페이징 계산
  const totalItems = filteredAndSortedProjects.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPageProjects = filteredAndSortedProjects.slice(startIndex, endIndex);

  // 검색어나 정렬, 페이지 크기가 변경될 때 첫 페이지로 이동
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, sortBy, sortOrder, itemsPerPage]);

  // 페이지 변경 핸들러
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // 페이지 변경 시 테이블 상단으로 스크롤
    const tableElement = document.getElementById('projects-table');
    if (tableElement) {
      tableElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">프로젝트 관리</h2>
        <button
          onClick={onAdd}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          새 프로젝트 추가
        </button>
      </div>

      {/* 검색 및 정렬 컨트롤 */}
      <div className="bg-white shadow rounded-lg mb-6">
        <div className="px-4 py-4 sm:px-6">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* 검색 입력 */}
            <div className="flex-1">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="프로젝트 제목, 카테고리, 설명, 기술 스택으로 검색..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* 정렬 및 페이지 크기 선택 */}
            <div className="flex gap-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-md"
              >
                <option value="createdAt">생성일</option>
                <option value="title">제목</option>
                <option value="category">카테고리</option>
                <option value="viewCount">조회수</option>
              </select>
              
              <button
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                title={sortOrder === 'asc' ? '오름차순' : '내림차순'}
              >
                {sortOrder === 'asc' ? (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4" />
                  </svg>
                )}
              </button>

              <select
                value={itemsPerPage}
                onChange={(e) => setItemsPerPage(Number(e.target.value))}
                className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-md"
                title="페이지당 항목 수"
              >
                <option value={5}>5개씩</option>
                <option value={10}>10개씩</option>
                <option value={20}>20개씩</option>
                <option value={50}>50개씩</option>
              </select>
            </div>
          </div>

          {/* 검색 결과 정보 */}
          {searchTerm && (
            <div className="mt-3 text-sm text-gray-600">
              "{searchTerm}"에 대한 검색 결과: {filteredAndSortedProjects.length}개 프로젝트
              {filteredAndSortedProjects.length !== portfolios.length && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="ml-2 text-blue-600 hover:text-blue-800"
                >
                  검색 초기화
                </button>
              )}
            </div>
          )}

          {/* 페이징 정보 */}
          {totalItems > 0 && (
            <div className="mt-3 text-sm text-gray-600">
              전체 {totalItems}개 중 {startIndex + 1}-{Math.min(endIndex, totalItems)}개 표시 
              {totalPages > 1 && ` (${currentPage}/${totalPages} 페이지)`}
            </div>
          )}
        </div>
      </div>

      {/* 프로젝트 폼 */}
      {(showAddForm || editingProject) && (
        <ProjectForm
          project={editingProject}
          onSave={onSave}
          onCancel={onCancel}
        />
      )}

      {/* 프로젝트 목록 */}
      <div className="bg-white shadow rounded-lg" id="projects-table">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
            프로젝트 목록 ({filteredAndSortedProjects.length}개 / 전체 {portfolios.length}개)
          </h3>
          
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-gray-500">프로젝트를 불러오는 중...</p>
            </div>
          ) : filteredAndSortedProjects.length > 0 ? (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        프로젝트
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        카테고리
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        통계
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        작업
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {currentPageProjects.map((project) => (
                    <tr key={project.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            {project.imageUrl ? (
                              <img
                                className="h-10 w-10 rounded-lg object-cover"
                                src={getGoogleDriveThumbnailUrl(project.imageUrl)}
                                alt={project.title}
                                onError={(e) => {
                                  // 이미지 로딩 실패 시 플레이스홀더 표시
                                  const target = e.target as HTMLImageElement;
                                  target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yMDAgMTUwQzIwNSAxNTAgMjEwIDE0NSAyMTAgMTQwQzIxMCAxMzUgMjA1IDEzMCAyMDAgMTMwQzE5NSAxMzAgMTkwIDEzNSAxOTAgMTQwQzE5MCAxNDUgMTk1IDE1MCAyMDAgMTUwWiIgZmlsbD0iIzlDQTNBRiIvPgo8cGF0aCBkPSJNMTcwIDE4MEwyMzAgMTgwTDIxMCAxNjBMMTkwIDE3MEwxNzAgMTgwWiIgZmlsbD0iIzlDQTNBRiIvPgo8L3N2Zz4K';
                                }}
                              />
                            ) : (
                              <div className="h-10 w-10 rounded-lg bg-gray-200 flex items-center justify-center">
                                <svg className="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                              </div>
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">{project.title}</div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {new Date(project.createdAt).toLocaleDateString('ko-KR', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {project.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex space-x-4">
                          <span>조회 {project.viewCount}</span>
                          <span>댓글 {project.commentCount}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => onEdit(project)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            수정
                          </button>
                          <button
                            onClick={() => onDelete(project.id, project.title)}
                            className="text-red-600 hover:text-red-900"
                          >
                            삭제
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* 페이징 컨트롤 */}
            {totalPages > 1 && (
              <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                <div className="flex-1 flex justify-between sm:hidden">
                  {/* 모바일 페이징 */}
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                      currentPage === 1
                        ? 'text-gray-400 bg-gray-100 cursor-not-allowed'
                        : 'text-gray-700 bg-white hover:bg-gray-50'
                    }`}
                  >
                    이전
                  </button>
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                      currentPage === totalPages
                        ? 'text-gray-400 bg-gray-100 cursor-not-allowed'
                        : 'text-gray-700 bg-white hover:bg-gray-50'
                    }`}
                  >
                    다음
                  </button>
                </div>
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      전체 <span className="font-medium">{totalItems}</span>개 중{' '}
                      <span className="font-medium">{startIndex + 1}</span>-
                      <span className="font-medium">{Math.min(endIndex, totalItems)}</span>개 표시
                    </p>
                  </div>
                  <div>
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                      {/* 이전 페이지 버튼 */}
                      <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 text-sm font-medium ${
                          currentPage === 1
                            ? 'text-gray-400 bg-gray-100 cursor-not-allowed'
                            : 'text-gray-500 bg-white hover:bg-gray-50'
                        }`}
                      >
                        <span className="sr-only">이전</span>
                        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </button>

                      {/* 페이지 번호 버튼들 */}
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                        // 현재 페이지 주변의 페이지만 표시 (최대 5개)
                        const showPage = 
                          page === 1 || 
                          page === totalPages || 
                          (page >= currentPage - 2 && page <= currentPage + 2);
                        
                        if (!showPage) {
                          // 생략 표시
                          if (page === currentPage - 3 || page === currentPage + 3) {
                            return (
                              <span
                                key={page}
                                className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700"
                              >
                                ...
                              </span>
                            );
                          }
                          return null;
                        }

                        return (
                          <button
                            key={page}
                            onClick={() => handlePageChange(page)}
                            className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                              page === currentPage
                                ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                                : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                            }`}
                          >
                            {page}
                          </button>
                        );
                      })}

                      {/* 다음 페이지 버튼 */}
                      <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 text-sm font-medium ${
                          currentPage === totalPages
                            ? 'text-gray-400 bg-gray-100 cursor-not-allowed'
                            : 'text-gray-500 bg-white hover:bg-gray-50'
                        }`}
                      >
                        <span className="sr-only">다음</span>
                        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            )}
            </>
          ) : (
            <div className="text-center py-8">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {searchTerm ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                )}
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                {searchTerm ? '검색 결과가 없습니다' : '프로젝트가 없습니다'}
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm ? '다른 검색어를 시도해보세요.' : '새 프로젝트를 추가해보세요.'}
              </p>
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="mt-3 inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  검색 초기화
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/**
 * 프로젝트 폼 컴포넌트
 */
interface ProjectFormProps {
  project: PortfolioItem | null;
  onSave: (projectData: Partial<PortfolioItem>) => void;
  onCancel: () => void;
}

const ProjectForm: React.FC<ProjectFormProps> = ({ project, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    title: project?.title || '',
    description: project?.description || '',
    category: project?.category || '',
    technologies: project?.technologies?.join(', ') || '',
    liveUrl: project?.liveUrl || '',
    githubUrl: project?.githubUrl || '',
    imageUrl: project?.imageUrl || '',
    developmentTools: project?.developmentTools?.join(', ') || '',
    geminiApiStatus: project?.geminiApiStatus || 'none'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // 라이브 URL 정규화: 공백 -> undefined, 'local' (대소문자 무시) -> 'local', 그 외는 트림
    const normalizeLiveUrl = (value: string): string | undefined => {
      const trimmed = (value || '').trim();
      if (!trimmed) return undefined;
      if (trimmed.toLowerCase() === 'local') return 'local';
      return trimmed;
    };

    const projectData: Partial<PortfolioItem> = {
      title: formData.title,
      description: formData.description,
      category: formData.category,
      technologies: formData.technologies.split(',').map(t => t.trim()).filter(t => t),
      liveUrl: normalizeLiveUrl(formData.liveUrl),
      githubUrl: formData.githubUrl || undefined,
      imageUrl: formData.imageUrl || undefined,
      developmentTools: formData.developmentTools.split(',').map(t => t.trim()).filter(t => t),
      geminiApiStatus: formData.geminiApiStatus as any
    };

    onSave(projectData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  return (
    <div className="bg-white shadow rounded-lg mb-6">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
          {project ? '프로젝트 수정' : '새 프로젝트 추가'}
        </h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                제목 *
              </label>
              <input
                type="text"
                name="title"
                id="title"
                required
                value={formData.title}
                onChange={handleChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                카테고리 *
              </label>
              <input
                type="text"
                name="category"
                id="category"
                required
                value={formData.category}
                onChange={handleChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              설명 *
            </label>
            <textarea
              name="description"
              id="description"
              required
              rows={3}
              value={formData.description}
              onChange={handleChange}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="technologies" className="block text-sm font-medium text-gray-700">
                기술 스택 (쉼표로 구분)
              </label>
              <input
                type="text"
                name="technologies"
                id="technologies"
                value={formData.technologies}
                onChange={handleChange}
                placeholder="React, TypeScript, Firebase"
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div>
              <label htmlFor="developmentTools" className="block text-sm font-medium text-gray-700">
                개발 도구 (쉼표로 구분)
              </label>
              <input
                type="text"
                name="developmentTools"
                id="developmentTools"
                value={formData.developmentTools}
                onChange={handleChange}
                placeholder="VS Code, Figma, Git"
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="liveUrl" className="block text-sm font-medium text-gray-700">
                라이브 URL
              </label>
              <input
                type="text"
                name="liveUrl"
                id="liveUrl"
                value={formData.liveUrl}
                onChange={handleChange}
                placeholder="https://example.com 또는 local"
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div>
              <label htmlFor="githubUrl" className="block text-sm font-medium text-gray-700">
                GitHub URL
              </label>
              <input
                type="url"
                name="githubUrl"
                id="githubUrl"
                value={formData.githubUrl}
                onChange={handleChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700">
              이미지 URL
            </label>
            <input
              type="url"
              name="imageUrl"
              id="imageUrl"
              value={formData.imageUrl}
              onChange={handleChange}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="프로젝트 이미지 URL을 입력하세요 (선택사항)"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="geminiApiStatus" className="block text-sm font-medium text-gray-700">
                Gemini API 상태
              </label>
              <select
                name="geminiApiStatus"
                id="geminiApiStatus"
                value={formData.geminiApiStatus}
                onChange={handleChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="none">필요없음</option>
                <option value="optional">선택</option>
                <option value="required">필수</option>
              </select>
            </div>
            

          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              취소
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {project ? '수정' : '추가'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

/**
 * 통계 뷰 컴포넌트
 */
interface StatisticsViewProps {
  portfolios: PortfolioItem[];
  loading: boolean;
}

const StatisticsView: React.FC<StatisticsViewProps> = ({ portfolios, loading }) => {
  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-2 text-gray-500">통계를 불러오는 중...</p>
      </div>
    );
  }

  const totalViews = portfolios.reduce((sum, p) => sum + p.viewCount, 0);
  const totalComments = portfolios.reduce((sum, p) => sum + p.commentCount, 0);
  const avgViews = portfolios.length > 0 ? Math.round(totalViews / portfolios.length) : 0;
  const avgComments = portfolios.length > 0 ? Math.round(totalComments / portfolios.length) : 0;

  // 카테고리별 통계
  const categoryStats = portfolios.reduce((acc, project) => {
    if (!acc[project.category]) {
      acc[project.category] = { count: 0, views: 0, comments: 0 };
    }
    acc[project.category].count++;
    acc[project.category].views += project.viewCount;
    acc[project.category].comments += project.commentCount;
    return acc;
  }, {} as Record<string, { count: number; views: number; comments: number }>);

  // 인기 프로젝트 (조회수 기준)
  const topProjects = [...portfolios]
    .sort((a, b) => b.viewCount - a.viewCount)
    .slice(0, 10);

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">통계 정보</h2>
      
      {/* 전체 통계 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    총 조회수
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {totalViews.toLocaleString()}회
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    총 댓글수
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {totalComments.toLocaleString()}개
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    평균 조회수
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {avgViews.toLocaleString()}회
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    평균 댓글수
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {avgComments.toLocaleString()}개
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 카테고리별 통계 */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              카테고리별 통계
            </h3>
            <div className="space-y-3">
              {Object.entries(categoryStats).map(([category, stats]) => (
                <div key={category} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{category}</div>
                    <div className="text-sm text-gray-500">{stats.count}개 프로젝트</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-900">조회 {stats.views.toLocaleString()}</div>
                    <div className="text-sm text-gray-500">댓글 {stats.comments.toLocaleString()}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 인기 프로젝트 */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              인기 프로젝트 (조회수 기준)
            </h3>
            <div className="space-y-3">
              {topProjects.map((project, index) => (
                <div key={project.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 w-6 text-center">
                      <span className="text-sm font-medium text-gray-500">#{index + 1}</span>
                    </div>
                    <div className="ml-3">
                      <div className="text-sm font-medium text-gray-900">{project.title}</div>
                      <div className="text-sm text-gray-500">{project.category}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-900">조회 {project.viewCount.toLocaleString()}</div>
                    <div className="text-sm text-gray-500">댓글 {project.commentCount.toLocaleString()}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;