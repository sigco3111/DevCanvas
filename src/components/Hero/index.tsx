import React, { useEffect, useState } from 'react';
import type { HeroProps } from './types';

/**
 * DevCanvas 웹사이트의 Hero 섹션 컴포넌트
 * 메인 타이틀, 소개 문구, CTA 버튼을 포함한 랜딩 섹션
 */
const Hero: React.FC<HeroProps> = React.memo(({
  title = 'DevCanvas',
  subtitle = '웹앱 & 웹게임 허브',
  description = '다양한 자동진행 게임과 웹 애플리케이션을 한 곳에서 즐겨보세요.',
  disableGradient = false,
  className = '',
}) => {
  // 애니메이션을 위한 상태 관리
  const [isVisible, setIsVisible] = useState(false);

  /**
   * 컴포넌트 마운트 시 애니메이션 트리거
   */
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);



  return (
    <section 
      id="home"
      className={`relative h-48 md:h-64 flex items-center justify-center overflow-hidden ${className}`}
    >
      {/* 배경 그라데이션 */}
      {!disableGradient && (
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-purple-700">
          {/* 개발 관련 아이콘들 */}
          <div className="absolute inset-0 opacity-5">
            {/* 코드 브래킷 */}
            <div className="absolute top-10 left-10 text-white text-6xl font-mono">{'{ }'}</div>
            <div className="absolute top-20 right-20 text-white text-4xl font-mono">{'</>'}</div>
            <div className="absolute bottom-20 left-20 text-white text-5xl font-mono">{'[]'}</div>
            <div className="absolute bottom-10 right-10 text-white text-3xl font-mono">{'()'}</div>
            <div className="absolute top-1/2 right-10 text-white text-4xl font-mono">{'&&'}</div>
            <div className="absolute bottom-1/3 left-10 text-white text-3xl font-mono">{'||'}</div>
            
            {/* 개발 아이콘들 */}
            {/* 코드 브래킷 아이콘 */}
            <div className="absolute top-1/3 left-1/4 text-white">
              <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 24 24">
                <path d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0L19.2 12l-4.6-4.6L16 6l6 6-6 6-1.4-1.4z"/>
              </svg>
            </div>
            
            {/* 별 아이콘 */}
            <div className="absolute top-2/3 right-1/3 text-white">
              <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
            </div>
            
            {/* 체크 아이콘 */}
            <div className="absolute top-1/2 left-1/6 text-white">
              <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
            </div>
            
            {/* 기어 아이콘 */}
            <div className="absolute top-1/4 right-1/4 text-white">
              <svg className="w-14 h-14" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 15.5A3.5 3.5 0 0 1 8.5 12A3.5 3.5 0 0 1 12 8.5a3.5 3.5 0 0 1 3.5 3.5 3.5 3.5 0 0 1-3.5 3.5m7.43-2.53c.04-.32.07-.64.07-.97 0-.33-.03-.66-.07-1l2.11-1.63c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.31-.61-.22l-2.49 1c-.52-.39-1.06-.73-1.69-.98l-.37-2.65A.506.506 0 0 0 14 2h-4c-.25 0-.46.18-.5.42l-.37 2.65c-.63.25-1.17.59-1.69.98l-2.49-1c-.22-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64L4.57 11c-.04.34-.07.67-.07 1 0 .33.03.65.07.97l-2.11 1.66c-.19.15-.25.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1.01c.52.4 1.06.74 1.69.99l.37 2.65c.04.24.25.42.5.42h4c.25 0 .46-.18.5-.42l.37-2.65c.63-.26 1.17-.59 1.69-.99l2.49 1.01c.22.08.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.66Z"/>
              </svg>
            </div>
            
            {/* 터미널 아이콘 */}
            <div className="absolute bottom-1/4 right-1/6 text-white">
              <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20 4H4c-1.11 0-2 .89-2 2v12c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4V8h16v10zm-10-1h6v-2h-6v2zm-4-3l2-2-2-2-1.5 1.5L6 12l-1.5 1.5L6 15z"/>
              </svg>
            </div>
            
            {/* 데이터베이스 아이콘 */}
            <div className="absolute top-3/4 left-1/3 text-white">
              <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 3C7.58 3 4 4.79 4 7s3.58 4 8 4 8-1.79 8-4-3.58-4-8-4zM4 9v3c0 2.21 3.58 4 8 4s8-1.79 8-4V9c0 2.21-3.58 4-8 4s-8-1.79-8-4zm0 5v3c0 2.21 3.58 4 8 4s8-1.79 8-4v-3c0 2.21-3.58 4-8 4s-8-1.79-8-4z"/>
              </svg>
            </div>
            
            {/* 브랜치 아이콘 (Git) */}
            <div className="absolute top-1/6 left-1/2 text-white">
              <svg className="w-11 h-11" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 2C4.89 2 4 2.89 4 4s.89 2 2 2c.8 0 1.5-.5 1.83-1.21C8.39 5.36 9.2 6 10.13 6H14c.55 0 1 .45 1 1v3.17c-.5.33-1 .83-1 1.83 0 1.11.89 2 2 2s2-.89 2-2c0-1-.5-1.5-1-1.83V7c0-1.66-1.34-3-3-3h-3.87c-.93 0-1.74-.64-2.3-1.21C7.5 2.5 6.8 2 6 2zm0 2c.55 0 1-.45 1-1s-.45-1-1-1-1 .45-1 1 .45 1 1 1zm10 8c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zM6 16c-1.11 0-2 .89-2 2s.89 2 2 2 2-.89 2-2-.89-2-2-2zm0 2c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1z"/>
              </svg>
            </div>
            
            {/* 함수 아이콘 */}
            <div className="absolute bottom-1/2 right-1/5 text-white">
              <svg className="w-9 h-9" fill="currentColor" viewBox="0 0 24 24">
                <path d="M15.6 5.5L11 1l-1.4 1.4L13.2 6H4v2h9.2l-3.6 3.6L11 13l4.6-4.5L11 4l4.6 4.5zm-7.2 13L4.8 22 6 23.4 10.6 19 6 14.4 4.8 15.8 8.4 19.5z"/>
              </svg>
            </div>
          </div>
          
          {/* 배경 패턴 오버레이 */}
          <div className="absolute inset-0 bg-black/20"></div>
          
          {/* 애니메이션 배경 요소들 */}
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
      )}

      {/* 메인 콘텐츠 */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          {/* 메인 타이틀 */}
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2">
            <span className="block">{title}</span>
            <span className="block text-lg sm:text-xl md:text-2xl lg:text-3xl font-medium text-blue-200 mt-1">
              {subtitle}
            </span>
          </h1>

          {/* 설명 텍스트 */}
          <p className={`text-sm sm:text-base md:text-lg text-blue-100 max-w-xl mx-auto mb-4 leading-relaxed transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            {description}
          </p>


        </div>


      </div>
    </section>
  );
});

Hero.displayName = 'Hero';

export default Hero; 