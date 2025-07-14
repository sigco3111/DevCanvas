import React, { useEffect, useState } from 'react';
import type { HeroProps } from './types';

/**
 * DevCanvas 웹사이트의 Hero 섹션 컴포넌트
 * 라이브 코드 타이핑 효과를 통한 독창적인 개발자 포트폴리오 랜딩 섹션
 */
const Hero: React.FC<HeroProps> = React.memo(({
  title = 'DevCanvas',
  subtitle = '웹앱 & 웹게임 오픈소스 허브',
  description = '다양한 게임과 웹 애플리케이션을 오픈소스로 제공하는 플랫폼입니다.',
  disableGradient = false,
  className = '',
  totalProjects,
}) => {
  // 타이핑 효과를 위한 상태 관리
  const [currentCodeIndex, setCurrentCodeIndex] = useState(0);
  const [displayedCode, setDisplayedCode] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const [showCursor, setShowCursor] = useState(true);

  // 다양한 프로그래밍 언어의 코드 스니펫들
  const codeSnippets = [
    {
      language: 'TypeScript',
      code: `// 🎯 DevCanvas에 오신 것을 환영합니다!
const devCanvas = {
  mission: "오픈소스 웹앱 & 게임 허브",
  projects: ${totalProjects || 0},
  languages: ["React", "TypeScript", "Node.js"],
  status: "🚀 활발히 개발 중..."
};

console.log("Let's build something amazing!");`,
    },
    {
      language: 'JavaScript',
      code: `// 🎮 게임 개발의 시작
function createGame() {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  // 게임 루프 시작
  function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // 마법이 일어나는 곳... ✨
    requestAnimationFrame(gameLoop);
  }
  
  gameLoop();
}

createGame(); // 당신의 아이디어를 현실로!`,
    },
    {
      language: 'Python',
      code: `# 🤖 AI와 함께하는 개발
import creativity
from innovation import breakthrough

class DevCanvas:
    def __init__(self):
        self.passion = float('inf')
        self.projects = []
        self.community = "오픈소스 러버들"
    
    def create_magic(self):
        while True:
            idea = creativity.generate()
            if idea.is_awesome():
                self.projects.append(idea)
                breakthrough.share_with_world(idea)

# 함께 만들어가는 개발자들의 캔버스 🎨`,
    },
    {
      language: 'CSS',
      code: `/* 🎨 아름다운 UI의 탄생 */
.devcanvas {
  background: linear-gradient(45deg, #667eea, #764ba2);
  animation: breathe 3s ease-in-out infinite;
  border-radius: 20px;
  box-shadow: 0 20px 40px rgba(0,0,0,0.3);
}

@keyframes breathe {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

.magic-happens-here {
  /* 여기서 디자인 마법이 일어납니다 ✨ */
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}`,
    },
  ];

  /**
   * 타이핑 효과 애니메이션 로직
   */
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    const currentSnippet = codeSnippets[currentCodeIndex];
    const targetCode = currentSnippet.code;
    
    if (isTyping) {
      // 타이핑 중일 때
      if (displayedCode.length < targetCode.length) {
        timeoutId = setTimeout(() => {
          setDisplayedCode(targetCode.slice(0, displayedCode.length + 1));
        }, Math.random() * 50 + 30); // 30-80ms 사이의 랜덤한 타이핑 속도
      } else {
        // 타이핑 완료 후 2초 대기
        timeoutId = setTimeout(() => {
          setIsTyping(false);
        }, 2000);
      }
    } else {
      // 지우기 시작
      if (displayedCode.length > 0) {
        timeoutId = setTimeout(() => {
          setDisplayedCode(displayedCode.slice(0, -1));
        }, 20); // 빠른 지우기 속도
      } else {
        // 다음 코드로 넘어가기
        setCurrentCodeIndex((prev) => (prev + 1) % codeSnippets.length);
        setIsTyping(true);
      }
    }

    return () => clearTimeout(timeoutId);
  }, [displayedCode, isTyping, currentCodeIndex, codeSnippets]);

  /**
   * 커서 깜빡임 효과
   */
  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 500);

    return () => clearInterval(cursorInterval);
  }, []);



  return (
    <section 
      id="home"
      className={`relative min-h-screen flex items-center justify-center overflow-hidden ${className}`}
    >
      {/* 터미널 스타일 배경 */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-black">
        {/* 터미널 그리드 패턴 */}
        <div className="absolute inset-0 opacity-10">
          <div className="grid grid-cols-12 gap-4 h-full">
            {Array.from({ length: 48 }, (_, i) => (
              <div key={i} className="border-l border-green-400/30 h-full"></div>
            ))}
          </div>
        </div>
        
        {/* 스캔라인 효과 */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-green-400/5 to-transparent animate-pulse"></div>
        
        {/* 글로우 효과 */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-green-400/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-blue-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* 메인 콘텐츠 */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* 터미널 헤더 */}
          <div className="mb-8 text-center">
            <div className="inline-flex items-center space-x-2 text-green-400 mb-4">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="ml-4 text-sm font-mono text-gray-400">~/DevCanvas</span>
            </div>
            <div className="text-green-400 font-mono text-sm mb-2">
              user@devcanvas:~$ cat welcome.md
            </div>
          </div>

          {/* 터미널 윈도우 */}
          <div className="bg-gray-900/90 backdrop-blur-sm rounded-lg border border-green-400/30 shadow-2xl">
            {/* 터미널 타이틀 바 */}
            <div className="flex items-center justify-between px-4 py-2 bg-gray-800/50 rounded-t-lg border-b border-green-400/30">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
              <div className="text-gray-400 text-sm font-mono">
                {codeSnippets[currentCodeIndex].language}
              </div>
              <div className="text-gray-400 text-sm font-mono">
                {totalProjects ? `${totalProjects} projects` : 'terminal'}
              </div>
            </div>

            {/* 코드 영역 */}
            <div className="p-6 min-h-[400px] font-mono text-sm">
              <pre className="text-green-400 leading-relaxed whitespace-pre-wrap">
                {displayedCode}
                <span className={`inline-block w-2 h-5 bg-green-400 ml-1 ${showCursor ? 'opacity-100' : 'opacity-0'}`}>
                  |
                </span>
              </pre>
            </div>
          </div>

          {/* 하단 정보 */}
          <div className="mt-8 text-center">
            <div className="inline-flex items-center space-x-6 text-gray-400 text-sm font-mono">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span>실시간 코드 데모</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse delay-500"></div>
                <span>오픈소스 허브</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse delay-1000"></div>
                <span>개발자 커뮤니티</span>
              </div>
            </div>
            
            <div className="mt-4 text-gray-300 font-mono text-xs">
              <p>$ echo "Welcome to DevCanvas - 웹앱 & 웹게임 오픈소스 허브"</p>
              <p className="text-green-400 mt-2">
                {title} &gt; {subtitle}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});

Hero.displayName = 'Hero';

export default Hero; 