import React, { useState, useEffect } from 'react';
import { BoardPost, BoardFilterOptions } from '../../types/board';
import { getPosts, subscribeToPostsRealtime } from '../../services/boardService';
import PostList from './PostList';
import PostDetail from './PostDetail';
import PostForm from './PostForm';
import BoardFilter from './BoardFilter';
import { db } from '../../lib/firebase';
import { collection, getDocs, addDoc } from 'firebase/firestore';
import { useAuth } from '../../contexts/AuthContext';

interface BoardProps {
  onBack?: () => void;
}

type BoardView = 'list' | 'detail' | 'write' | 'edit';

/**
 * 게시판 메인 컴포넌트
 * 게시글 목록, 상세, 작성, 수정 등 모든 게시판 기능을 관리
 */
const Board: React.FC<BoardProps> = ({ onBack }) => {
  // 인증 상태
  const { currentUser } = useAuth();
  
  // 상태 관리
  const [currentView, setCurrentView] = useState<BoardView>('list');
  const [posts, setPosts] = useState<BoardPost[]>([]);
  const [selectedPost, setSelectedPost] = useState<BoardPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'error'>('connecting');
  const [debugInfo, setDebugInfo] = useState<string>('');
  
  // 필터 옵션
  const [filterOptions, setFilterOptions] = useState<BoardFilterOptions>({
    category: 'all',
    status: 'published',
    searchTerm: '',
    sortBy: 'latest',
    limit: 10
  });

  // Firebase 연결 테스트 함수
  const testFirebaseConnection = async () => {
    try {
      setDebugInfo('Firebase 연결 테스트 시작...');
      
      // 1. 기본 연결 테스트
      const testCollection = collection(db, 'test');
      setDebugInfo('✅ Firebase 컬렉션 참조 생성 성공');
      
      // 2. 읽기 테스트
      await getDocs(testCollection);
      setDebugInfo(prev => prev + '\n✅ Firestore 읽기 테스트 성공');
      
      // 3. 쓰기 테스트
      const testDoc = await addDoc(testCollection, {
        test: true,
        timestamp: new Date(),
        message: 'Firebase 연결 테스트'
      });
      setDebugInfo(prev => prev + `\n✅ Firestore 쓰기 테스트 성공 (ID: ${testDoc.id})`);
      
      setConnectionStatus('connected');
      setError(null);
      
      // 실제 게시글 로드 시도
      await loadPosts();
      
    } catch (err: any) {
      console.error('Firebase 연결 테스트 실패:', err);
      setConnectionStatus('error');
      
      let errorMessage = `❌ Firebase 연결 실패: ${err.message}`;
      if (err.code) {
        errorMessage += `\n코드: ${err.code}`;
      }
      
      setDebugInfo(prev => prev + '\n' + errorMessage);
      setError(errorMessage);
    }
  };

  // 게시글 목록 로드
  const loadPosts = async () => {
    try {
      setIsLoading(true);
      setError(null);
      setConnectionStatus('connecting');
      
      const { posts } = await getPosts(filterOptions);
      setPosts(posts);
      setConnectionStatus('connected');
      setDebugInfo(prev => prev + `\n✅ 게시글 ${posts.length}개 로드 성공`);
    } catch (err: any) {
      console.error('게시글 로드 오류:', err);
      setConnectionStatus('error');
      
      // 사용자 친화적인 에러 메시지 설정
      if (err.message.includes('보안 규칙')) {
        setError('Firebase 보안 규칙을 확인해주세요. 개발 단계에서는 모든 읽기/쓰기를 허용해야 합니다.');
      } else if (err.message.includes('연결')) {
        setError('Firebase 서버에 연결할 수 없습니다. 네트워크 연결과 Firebase 설정을 확인해주세요.');
      } else if (err.message.includes('인증')) {
        setError('Firebase 프로젝트 설정을 확인해주세요. API 키와 프로젝트 ID가 올바른지 확인하세요.');
      } else {
        setError(err.message || '알 수 없는 오류가 발생했습니다.');
      }
      
      setDebugInfo(prev => prev + `\n❌ 게시글 로드 실패: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // 컴포넌트 마운트 시 Firebase 연결 테스트
  useEffect(() => {
    testFirebaseConnection();
  }, []);

  // 필터 변경 시 게시글 다시 로드
  useEffect(() => {
    if (connectionStatus === 'connected') {
      loadPosts();
    }
  }, [filterOptions]);

  // 실시간 업데이트 구독 (연결 성공 시에만)
  useEffect(() => {
    if (connectionStatus !== 'connected') return;
    
    console.log('실시간 구독 시작:', filterOptions);
    
    const unsubscribe = subscribeToPostsRealtime(filterOptions, (updatedPosts) => {
      console.log('실시간 데이터 수신:', updatedPosts.length, '개');
      setPosts(updatedPosts);
      setIsLoading(false);
      // 실시간 업데이트 성공 시 에러 초기화
      if (error && error.includes('실시간')) {
        setError(null);
      }
    });

    return () => {
      console.log('실시간 구독 해제');
      unsubscribe();
    };
  }, [filterOptions, connectionStatus]);

  // 이벤트 핸들러들
  const handlePostClick = (post: BoardPost) => {
    setSelectedPost(post);
    setCurrentView('detail');
  };

  const handleWriteClick = () => {
    if (connectionStatus !== 'connected') {
      alert('Firebase 연결이 필요합니다. 설정을 확인해주세요.');
      return;
    }
    
    // 로그인 상태 확인
    if (!currentUser) {
      alert('게시글을 작성하려면 Google 계정으로 로그인해주세요.');
      return;
    }
    
    setCurrentView('write');
  };

  const handleEditClick = (post: BoardPost) => {
    if (connectionStatus !== 'connected') {
      alert('Firebase 연결이 필요합니다. 설정을 확인해주세요.');
      return;
    }
    
    // 로그인 상태 확인
    if (!currentUser) {
      alert('게시글을 수정하려면 Google 계정으로 로그인해주세요.');
      return;
    }
    
    // 작성자 본인만 수정 가능
    if (post.author.uid !== currentUser.uid) {
      alert('본인이 작성한 게시글만 수정할 수 있습니다.');
      return;
    }
    
    setSelectedPost(post);
    setCurrentView('edit');
  };

  const handleBackToList = () => {
    setCurrentView('list');
    setSelectedPost(null);
    loadPosts(); // 목록 새로고침
  };

  const handleFilterChange = (newFilters: Partial<BoardFilterOptions>) => {
    setFilterOptions(prev => ({ ...prev, ...newFilters }));
  };

  const handlePostCreated = () => {
    handleBackToList();
  };

  const handlePostUpdated = () => {
    handleBackToList();
  };

  const handlePostDeleted = () => {
    handleBackToList();
  };

  // Firebase 연결 상태 표시 컴포넌트
  const renderConnectionStatus = () => {
    if (connectionStatus === 'connecting') {
      return (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-yellow-600 mr-3"></div>
              <span className="text-yellow-800 dark:text-yellow-200">Firebase 연결 중...</span>
            </div>
            <button
              onClick={testFirebaseConnection}
              className="px-3 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors text-sm"
            >
              연결 테스트
            </button>
          </div>
        </div>
      );
    } else if (connectionStatus === 'error') {
      return (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-red-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <h3 className="text-red-800 dark:text-red-200 font-semibold">Firebase 연결 오류</h3>
                <p className="text-red-700 dark:text-red-300 text-sm mt-1">{error}</p>
              </div>
            </div>
            <button
              onClick={testFirebaseConnection}
              className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
            >
              다시 테스트
            </button>
          </div>
          
          {/* 디버그 정보 표시 */}
          {debugInfo && (
            <div className="mt-4 p-3 bg-gray-100 dark:bg-gray-800 rounded border">
              <h4 className="text-gray-800 dark:text-gray-200 font-medium mb-2">디버그 정보:</h4>
              <pre className="text-xs text-gray-700 dark:text-gray-300 whitespace-pre-wrap overflow-auto max-h-40">
                {debugInfo}
              </pre>
            </div>
          )}
          
          {/* 해결 방법 안내 */}
          <div className="mt-4 p-3 bg-red-100 dark:bg-red-800/30 rounded border-l-4 border-red-500">
            <h4 className="text-red-800 dark:text-red-200 font-medium mb-2">해결 방법:</h4>
            <ul className="text-red-700 dark:text-red-300 text-sm space-y-1">
              <li>1. Firebase Console에서 Firestore Database가 생성되었는지 확인</li>
              <li>2. Firestore 보안 규칙을 개발용으로 설정 (모든 읽기/쓰기 허용)</li>
              <li>3. .env 파일의 Firebase 설정값이 올바른지 확인</li>
              <li>4. 네트워크 연결 상태 확인</li>
              <li>5. Firebase Console에서 필요한 인덱스 생성</li>
              <li>6. 브라우저 개발자 도구 콘솔에서 자세한 오류 확인</li>
            </ul>
          </div>
        </div>
      );
    } else {
      return (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <svg className="w-4 h-4 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-green-800 dark:text-green-200 text-sm">Firebase 연결됨</span>
            </div>
            <button
              onClick={testFirebaseConnection}
              className="px-2 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700 transition-colors"
            >
              재테스트
            </button>
          </div>
          
          {/* 성공 시 디버그 정보도 표시 */}
          {debugInfo && (
            <details className="mt-2">
              <summary className="text-green-700 dark:text-green-300 text-xs cursor-pointer">디버그 정보 보기</summary>
              <pre className="text-xs text-green-600 dark:text-green-400 whitespace-pre-wrap mt-1 p-2 bg-green-100 dark:bg-green-900/30 rounded">
                {debugInfo}
              </pre>
            </details>
          )}
        </div>
      );
    }
  };

  // 뷰 렌더링
  const renderCurrentView = () => {
    switch (currentView) {
      case 'list':
        return (
          <div>
            {renderConnectionStatus()}
            <BoardFilter 
              filterOptions={filterOptions}
              onFilterChange={handleFilterChange}
            />
            <PostList
              posts={posts}
              isLoading={isLoading}
              error={connectionStatus === 'error' ? error : null}
              onPostClick={handlePostClick}
              onWriteClick={handleWriteClick}
              onRefresh={testFirebaseConnection}
            />
          </div>
        );
      
      case 'detail':
        return selectedPost ? (
          <PostDetail
            post={selectedPost}
            onBack={handleBackToList}
            onEdit={handleEditClick}
            onDelete={handlePostDeleted}
          />
        ) : null;
      
      case 'write':
        return (
          <PostForm
            mode="create"
            onBack={handleBackToList}
            onSubmit={handlePostCreated}
          />
        );
      
      case 'edit':
        return selectedPost ? (
          <PostForm
            mode="edit"
            post={selectedPost}
            onBack={handleBackToList}
            onSubmit={handlePostUpdated}
          />
        ) : null;
      
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* 헤더 */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {onBack && (
                <>
                  <button
                    onClick={onBack}
                    className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    <span>포트폴리오로 돌아가기</span>
                  </button>
                  
                  <div className="h-6 w-px bg-gray-300 dark:bg-gray-600" />
                </>
              )}
              
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                💬 커뮤니티 게시판
              </h1>
            </div>
            
            {/* 현재 뷰 표시 */}
            <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
              {currentView === 'list' && <span>📋 게시글 목록</span>}
              {currentView === 'detail' && <span>📄 게시글 상세</span>}
              {currentView === 'write' && <span>✍️ 게시글 작성</span>}
              {currentView === 'edit' && <span>✏️ 게시글 수정</span>}
            </div>
          </div>
        </div>
      </div>

      {/* 메인 콘텐츠 */}
      <div className="container mx-auto px-4 py-8">
        {renderCurrentView()}
      </div>
    </div>
  );
};

export default Board; 