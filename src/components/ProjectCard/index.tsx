import React from 'react';
import { PortfolioItem } from '../../types/portfolio';
import { formatSafeDate } from '../../utils/dateUtils';

interface ProjectCardProps {
  project: PortfolioItem;
  onClick?: (project: PortfolioItem) => void;
}

/**
 * 간소화된 프로젝트 카드 컴포넌트
 * 썸네일 이미지, 등록일, 제목, 조회수만 표시
 */
const ProjectCard: React.FC<ProjectCardProps> = ({ project, onClick }) => {
  // 안전한 destructuring으로 에러 방지
  if (!project) {
    console.error('ProjectCard: project prop is null or undefined');
    return null;
  }

  const {
    id,
    title,
    imageUrl = '',
    createdAt,
    viewCount = 0
  } = project;

  // 날짜 포맷팅 함수 (유틸리티 함수 사용)
  const formatDate = formatSafeDate;

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

  // 카드 클릭 핸들러
  const handleCardClick = async () => {
    if (onClick) {
      try {
        // 조회수 증가 로직 (요구사항 2.1, 4.1: 카드 클릭 시 조회수 증가)
        const { incrementViewCount } = await import('../../services/portfolioService');
        await incrementViewCount(id);
        console.log(`✅ 프로젝트 "${title}" 조회수 증가 완료`);
      } catch (error) {
        console.error('❌ 조회수 증가 실패:', error);
        // 조회수 증가 실패해도 모달은 열어야 함
      }
      
      onClick(project);
    }
  };

  return (
    <div 
      className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:scale-[1.02] hover:-translate-y-1 active:scale-[0.98] active:translate-y-0 border border-transparent hover:border-blue-200 dark:hover:border-blue-700"
      onClick={handleCardClick}
    >
      {/* 썸네일 이미지 */}
      <div className="relative w-full h-48 overflow-hidden rounded-t-lg">
        <img
          src={getGoogleDriveThumbnailUrl(imageUrl || '')}
          alt={title}
          className="w-full h-full object-cover"
          onError={(e) => {
            // 이미지 로딩 실패 시 플레이스홀더 표시
            const target = e.target as HTMLImageElement;
            target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yMDAgMTUwQzIwNSAxNTAgMjEwIDE0NSAyMTAgMTQwQzIxMCAxMzUgMjA1IDEzMCAyMDAgMTMwQzE5NSAxMzAgMTkwIDEzNSAxOTAgMTQwQzE5MCAxNDUgMTk1IDE1MCAyMDAgMTUwWiIgZmlsbD0iIzlDQTNBRiIvPgo8cGF0aCBkPSJNMTcwIDE4MEwyMzAgMTgwTDIxMCAxNjBMMTkwIDE3MEwxNzAgMTgwWiIgZmlsbD0iIzlDQTNBRiIvPgo8L3N2Zz4K';
          }}
        />
      </div>

      {/* 카드 내용 */}
      <div className="p-4">
        {/* 등록일 */}
        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-2">
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span>{createdAt ? formatDate(createdAt) : '날짜 없음'}</span>
        </div>

        {/* 제목 */}
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3 line-clamp-2">
          {title}
        </h3>

        {/* 통계 정보 */}
        <div className="flex items-center justify-end text-sm text-gray-600 dark:text-gray-300">
          {/* 조회수 */}
          <div className="flex items-center">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            <span>{viewCount}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard; 