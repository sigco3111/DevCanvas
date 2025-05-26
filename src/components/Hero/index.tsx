import React, { useEffect, useState } from 'react';
import type { HeroProps, CTAButton } from './types';

/**
 * 기본 CTA 버튼 설정
 */
const DEFAULT_CTA_BUTTONS: CTAButton[] = [
  {
    text: '프로젝트 둘러보기',
    href: '#projects',
    variant: 'primary',
  },
];

/**
 * DevCanvas 웹사이트의 Hero 섹션 컴포넌트
 * 메인 타이틀, 소개 문구, CTA 버튼을 포함한 랜딩 섹션
 */
const Hero: React.FC<HeroProps> = React.memo(({
  title = 'DevCanvas',
  subtitle = '웹앱 & 웹게임 허브',
  description = '다양한 웹 애플리케이션과 게임을 한 곳에서 즐겨보세요. 창의적이고 재미있는 프로젝트들이 여러분을 기다립니다.',
  ctaButtons = DEFAULT_CTA_BUTTONS,
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

  /**
   * CTA 버튼 클릭 핸들러
   * 스크롤 이동 또는 외부 링크 처리
   */
  const handleCTAClick = (button: CTAButton) => {
    if (!button.external && button.href.startsWith('#')) {
      const targetElement = document.querySelector(button.href);
      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }
    }
  };

  /**
   * CTA 버튼 스타일 클래스 생성
   */
  const getCTAButtonClasses = (variant: CTAButton['variant'] = 'primary') => {
    const baseClasses = 'inline-flex items-center px-8 py-3 text-base font-medium rounded-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2';
    
    if (variant === 'primary') {
      return `${baseClasses} bg-white text-blue-600 hover:bg-gray-50 shadow-lg hover:shadow-xl focus:ring-white`;
    } else {
      return `${baseClasses} bg-transparent text-white border-2 border-white hover:bg-white hover:text-blue-600 focus:ring-white`;
    }
  };

  return (
    <section 
      id="home"
      className={`relative min-h-screen flex items-center justify-center overflow-hidden ${className}`}
    >
      {/* 배경 그라데이션 */}
      {!disableGradient && (
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-purple-700">
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
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6">
            <span className="block">{title}</span>
            <span className="block text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-medium text-blue-200 mt-2">
              {subtitle}
            </span>
          </h1>

          {/* 설명 텍스트 */}
          <p className={`text-lg sm:text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto mb-8 leading-relaxed transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            {description}
          </p>

          {/* CTA 버튼들 */}
          <div className={`flex flex-col sm:flex-row gap-4 justify-center items-center transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            {ctaButtons.map((button, index) => (
              <a
                key={`${button.href}-${index}`}
                href={button.href}
                onClick={(e) => {
                  if (!button.external) {
                    e.preventDefault();
                    handleCTAClick(button);
                  }
                }}
                target={button.external ? '_blank' : undefined}
                rel={button.external ? 'noopener noreferrer' : undefined}
                className={getCTAButtonClasses(button.variant)}
                aria-label={button.text}
              >
                {button.text}
                {button.external && (
                  <svg
                    className="ml-2 w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                )}
              </a>
            ))}
          </div>
        </div>

        {/* 스크롤 다운 인디케이터 */}
        <div className={`absolute bottom-8 left-1/2 transform -translate-x-1/2 transition-all duration-1000 delay-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="flex flex-col items-center text-white/70 hover:text-white transition-colors duration-300">
            <span className="text-sm mb-2">스크롤하여 더 보기</span>
            <svg
              className="w-6 h-6 animate-bounce"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
});

Hero.displayName = 'Hero';

export default Hero; 