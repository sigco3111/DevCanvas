import React, { useEffect, useRef, useCallback } from 'react';
import { PortfolioItem } from '../../types/portfolio';

interface ProjectModalProps {
  project: PortfolioItem | null;
  isOpen: boolean;
  onClose: () => void;
}

/**
 * 프로젝트 상세 정보를 표시하는 모달 컴포넌트
 * 요구사항 2.1, 2.3, 2.4, 2.5, 2.6을 충족
 */
const ProjectModal: React.FC<ProjectModalProps> = ({ project, isOpen, onClose }) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

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

  // ESC 키 핸들러 (요구사항 2.6)
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!isOpen) return;

    if (event.key === 'Escape') {
      event.preventDefault();
      onClose();
      return;
    }

    // Tab 키 포커스 트랩 구현 (요구사항 2.6)
    if (event.key === 'Tab') {
      const focusableElements = modalRef.current?.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      
      if (!focusableElements || focusableElements.length === 0) return;

      const firstElement = focusableElements[0] as HTMLElement;
      const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

      if (event.shiftKey) {
        // Shift + Tab: 역방향 탭
        if (document.activeElement === firstElement) {
          event.preventDefault();
          lastElement.focus();
        }
      } else {
        // Tab: 정방향 탭
        if (document.activeElement === lastElement) {
          event.preventDefault();
          firstElement.focus();
        }
      }
    }
  }, [isOpen, onClose]);

  // 키보드 이벤트 리스너 등록 (요구사항 2.6)
  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => {
        document.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [isOpen, handleKeyDown]);

  // 모달이 열릴 때 배경 스크롤 방지 및 포커스 관리 (요구사항 2.4)
  useEffect(() => {
    if (isOpen) {
      // 스크롤바 너비 계산 (레이아웃 시프트 방지)
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      
      // body 스크롤 방지 (overflow: hidden 방식)
      document.body.style.overflow = 'hidden';
      document.body.style.paddingRight = `${scrollbarWidth}px`;
      
      // 모달이 열릴 때 닫기 버튼에 포커스 (접근성 개선)
      setTimeout(() => {
        closeButtonRef.current?.focus();
      }, 100);
    } else {
      // 모달이 닫힐 때 스크롤 복원 (overflow 방식은 자동으로 위치 유지)
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    }

    // 컴포넌트 언마운트 시 정리
    return () => {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    };
  }, [isOpen]);

  // 모달이 열려있지 않으면 렌더링하지 않음
  if (!isOpen || !project) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      {/* 배경 오버레이 - 외부 클릭으로 닫기 (요구사항 2.5) */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={(e) => {
          // 이벤트가 오버레이에서 직접 발생한 경우에만 모달 닫기
          if (e.target === e.currentTarget) {
            onClose();
          }
        }}
        aria-hidden="true"
      />
      
      {/* 모달 컨테이너 */}
      <div 
        className="flex min-h-full items-center justify-center p-4"
        onClick={(e) => {
          // 모달 컨테이너 영역 클릭 시에도 모달 닫기 (요구사항 2.5)
          if (e.target === e.currentTarget) {
            onClose();
          }
        }}
      >
        <div
          ref={modalRef}
          className="relative w-full max-w-2xl bg-white dark:bg-gray-800 rounded-lg shadow-xl transform transition-all"
          onClick={(e) => e.stopPropagation()}
        >
          {/* 모달 헤더 */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-4">
              {/* 프로젝트 썸네일 */}
              <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                {project.imageUrl ? (
                  <img
                    src={getGoogleDriveThumbnailUrl(project.imageUrl)}
                    alt={project.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      // 이미지 로딩 실패 시 기본 아이콘 표시
                      const parent = (e.target as HTMLImageElement).parentElement;
                      if (parent) {
                        parent.innerHTML = `
                          <svg class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
                          </svg>
                        `;
                      }
                    }}
                  />
                ) : (
                  <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                )}
              </div>
              
              <div>
                <h2 
                  id="modal-title"
                  className="text-xl font-semibold text-gray-900 dark:text-white"
                >
                  {project.title}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  프로젝트 상세 정보
                </p>
              </div>
            </div>
            
            {/* 닫기 버튼 (요구사항 2.3, 접근성 개선) */}
            <button
              ref={closeButtonRef}
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors p-2 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none"
              aria-label="모달 닫기 (ESC 키로도 닫을 수 있습니다)"
              title="모달 닫기"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* 모달 본문 */}
          <div 
            id="modal-description"
            className="p-6 max-h-[70vh] overflow-y-auto"
          >
            {/* 프로젝트 설명 */}
            <div className="mb-6">
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-base">
                {project.description}
              </p>
            </div>

            {/* 링크 섹션 (요구사항 2.2) */}
            <div className="mb-6">
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">링크</h4>
              <div className="flex flex-wrap gap-3">
                {project.liveUrl && (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-colors text-sm font-medium"
                    aria-label={`${project.title} 앱 실행 (새 탭에서 열림)`}
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    앱 실행
                  </a>
                )}
                
                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2 bg-gray-800 dark:bg-gray-600 text-white rounded-lg hover:bg-gray-900 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-colors text-sm font-medium"
                    aria-label={`${project.title} GitHub 저장소 (새 탭에서 열림)`}
                  >
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd" />
                    </svg>
                    GitHub
                  </a>
                )}
              </div>
            </div>

            {/* 메인 콘텐츠 영역 */}
            <div className="grid md:grid-cols-2 gap-8 mb-6">
              {/* 왼쪽: 프로젝트 이미지 */}
              <div className="flex items-start justify-center">
                <div className="w-full max-w-sm">
                  {project.imageUrl ? (
                    <img
                      src={getGoogleDriveThumbnailUrl(project.imageUrl)}
                      alt={project.title}
                      className="w-full h-48 object-cover rounded-lg shadow-md"
                      onError={(e) => {
                        // 이미지 로딩 실패 시 기본 플레이스홀더 표시
                        const target = e.target as HTMLImageElement;
                        target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yMDAgMTUwQzIwNSAxNTAgMjEwIDE0NSAyMTAgMTQwQzIxMCAxMzUgMjA1IDEzMCAyMDAgMTMwQzE5NSAxMzAgMTkwIDEzNSAxOTAgMTQwQzE5MCAxNDUgMTk1IDE1MCAyMDAgMTUwWiIgZmlsbD0iIzlDQTNBRiIvPgo8cGF0aCBkPSJNMTcwIDE4MEwyMzAgMTgwTDIxMCAxNjBMMTkwIDE3MEwxNzAgMTgwWiIgZmlsbD0iIzlDQTNBRiIvPgo8L3N2Zz4K';
                      }}
                    />
                  ) : (
                    <div className="w-full h-48 bg-gray-100 dark:bg-gray-700 rounded-lg shadow-md flex items-center justify-center">
                      <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                    </div>
                  )}
                </div>
              </div>

              {/* 오른쪽: 프로젝트 정보 */}
              <div className="space-y-6">
                {/* 카테고리 */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">카테고리</h4>
                  <span className="inline-block px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm font-medium">
                    {project.category}
                  </span>
                </div>

                {/* 기술 스택 */}
                {project.technologies && project.technologies.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">기술 스택</h4>
                    <div className="flex flex-wrap gap-2">
                      {project.technologies.map((tech, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* 개발 도구 */}
                {project.developmentTools && project.developmentTools.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">개발 도구</h4>
                    <div className="flex flex-wrap gap-2">
                      {project.developmentTools.map((tool, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-full text-sm"
                        >
                          {tool}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Gemini API 상태 */}
                {project.geminiApiStatus && project.geminiApiStatus !== 'none' && (
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Gemini API</h4>
                    <div className="flex items-center">
                      {project.geminiApiStatus === 'required' && (
                        <span className="inline-flex items-center px-2 py-1 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 rounded-full text-xs font-medium">
                          🔑 API Key 필요
                        </span>
                      )}
                      {project.geminiApiStatus === 'optional' && (
                        <span className="inline-flex items-center px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-xs font-medium">
                          💡 API Key 부분 필요
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* 프로젝트 메타 정보 */}
            <div className="grid md:grid-cols-3 gap-6 mb-6">
              <div>
                <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">등록일</h4>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  {new Date(project.createdAt).toLocaleDateString('ko-KR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>

              {project.updatedAt && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">업데이트</h4>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    {new Date(project.updatedAt).toLocaleDateString('ko-KR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              )}

              <div>
                <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">통계</h4>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center text-gray-600 dark:text-gray-300">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    <span className="text-sm">{project.viewCount} 조회</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectModal;