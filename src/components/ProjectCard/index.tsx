import React from 'react';
import { PortfolioItem } from '../../types/portfolio';

interface ProjectCardProps {
  project: PortfolioItem;
}

/**
 * 프로젝트 카드 컴포넌트
 * 개별 프로젝트의 정보를 카드 형태로 표시
 */
const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const {
    title,
    description,
    liveUrl,
    githubUrl,
    createdAt,
    updatedAt,
    developmentTools,
    technologies,
    geminiApiStatus
  } = project;

  // 날짜 포맷팅 함수
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // 아이콘 색상 랜덤 선택 (일관성을 위해 제목 기반으로)
  const colors = ['blue', 'red', 'green', 'purple', 'orange', 'yellow', 'indigo'];
  const colorIndex = Math.abs(title.split('').reduce((acc: number, char: string) => acc + char.charCodeAt(0), 0)) % colors.length;
  const color = colors[colorIndex];

  // 아이콘 선택 (일관성을 위해 제목 기반으로)
  const getIconPath = () => {
    const iconOptions = [
      <path key="icon1" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />,
      <path key="icon2" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />,
      <path key="icon3" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />,
      <path key="icon4" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C20.832 18.477 19.247 18 17.5 18c-1.746 0-3.332.477-4.5 1.253" />,
      <path key="icon5" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />,
      <path key="icon6" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />,
      <path key="icon7" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    ];
    
    const iconIndex = Math.abs(title.split('').reduce((acc: number, char: string) => acc + char.charCodeAt(0), 0)) % iconOptions.length;
    return iconOptions[iconIndex];
  };

  // 색상에 따른 배경색 클래스
  const getBgColorClass = () => {
    switch (color) {
      case 'blue': return 'bg-blue-100 dark:bg-blue-900';
      case 'red': return 'bg-red-100 dark:bg-red-900';
      case 'green': return 'bg-green-100 dark:bg-green-900';
      case 'purple': return 'bg-purple-100 dark:bg-purple-900';
      case 'orange': return 'bg-orange-100 dark:bg-orange-900';
      case 'yellow': return 'bg-yellow-100 dark:bg-yellow-900';
      case 'indigo': return 'bg-indigo-100 dark:bg-indigo-900';
      default: return 'bg-gray-100 dark:bg-gray-900';
    }
  };

  // 색상에 따른 텍스트 색상 클래스
  const getTextColorClass = () => {
    switch (color) {
      case 'blue': return 'text-blue-600 dark:text-blue-400';
      case 'red': return 'text-red-600 dark:text-red-400';
      case 'green': return 'text-green-600 dark:text-green-400';
      case 'purple': return 'text-purple-600 dark:text-purple-400';
      case 'orange': return 'text-orange-600 dark:text-orange-400';
      case 'yellow': return 'text-yellow-600 dark:text-yellow-400';
      case 'indigo': return 'text-indigo-600 dark:text-indigo-400';
      default: return 'text-gray-600 dark:text-gray-400';
    }
  };

  // 색상에 따른 버튼 배경색 클래스
  const getButtonBgClass = () => {
    switch (color) {
      case 'blue': return 'bg-blue-600 hover:bg-blue-700';
      case 'red': return 'bg-red-600 hover:bg-red-700';
      case 'green': return 'bg-green-600 hover:bg-green-700';
      case 'purple': return 'bg-purple-600 hover:bg-purple-700';
      case 'orange': return 'bg-orange-600 hover:bg-orange-700';
      case 'yellow': return 'bg-yellow-600 hover:bg-yellow-700';
      case 'indigo': return 'bg-indigo-600 hover:bg-indigo-700';
      default: return 'bg-gray-600 hover:bg-gray-700';
    }
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 hover:shadow-lg transition-shadow duration-300">
      <div className="flex items-center mb-4">
        <div className={`w-12 h-12 ${getBgColorClass()} rounded-lg flex items-center justify-center mr-4`}>
          <svg className={`w-6 h-6 ${getTextColorClass()}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {getIconPath()}
          </svg>
        </div>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
          {title}
        </h3>
      </div>
      <p className="text-gray-600 dark:text-gray-300 mb-4">
        {description}
      </p>
      
      {/* 날짜 정보 */}
      <div className="mb-4 text-sm text-gray-500 dark:text-gray-400">
        <div className="flex items-center mb-1">
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span>생성: {formatDate(createdAt)}</span>
        </div>
        {updatedAt && (
          <div className="flex items-center">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span>업데이트: {formatDate(updatedAt)}</span>
          </div>
        )}
      </div>
      
      {/* 개발 도구 */}
      {developmentTools && developmentTools.length > 0 && (
        <div className="mb-4">
          <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">개발 도구:</h4>
          <div className="flex flex-wrap gap-2">
            {developmentTools.map((tool, index) => (
              <span 
                key={index}
                className="inline-block bg-gray-200 dark:bg-gray-600 rounded-full px-3 py-1 text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                {tool}
              </span>
            ))}
          </div>
        </div>
      )}
      
      {/* 기술 스택 */}
      {technologies && technologies.length > 0 && (
        <div className="mb-4">
          <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">기술 스택:</h4>
          <div className="flex flex-wrap gap-2">
            {technologies.map((tech, index) => (
              <span 
                key={index}
                className="inline-block bg-gray-200 dark:bg-gray-600 rounded-full px-3 py-1 text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      )}
      
      {/* Gemini API Key 상태 표시 */}
      {geminiApiStatus === 'required' && (
        <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <span className="text-sm font-medium text-red-800 dark:text-red-200">
              🔑 이 앱을 사용하려면 Gemini API Key가 필수입니다
            </span>
          </div>
        </div>
      )}
      
      {geminiApiStatus === 'optional' && (
        <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-sm font-medium text-blue-800 dark:text-blue-200">
              💡 Gemini API Key를 입력하면 추가 기능을 사용할 수 있습니다
            </span>
          </div>
        </div>
      )}
      
      {/* 링크 버튼들 */}
      <div className="flex flex-wrap gap-2 mt-4">
        <a 
          href={liveUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          className={`inline-flex items-center px-4 py-2 ${getButtonBgClass()} text-white rounded-lg transition-colors duration-200`}
        >
          앱 실행
          <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </a>
        {githubUrl && (
          <a 
            href={githubUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition-colors duration-200"
          >
            GitHub
            <svg className="ml-2 w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0012 2z" />
            </svg>
          </a>
        )}
      </div>
    </div>
  );
};

export default ProjectCard; 