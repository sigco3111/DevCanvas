import React, { useState, useEffect } from 'react';
import { BoardPost, BoardComment } from '../../types/board';
import { 
  incrementViewCount, 
  toggleLike, 
  deletePost, 
  getComments, 
  createComment 
} from '../../services/boardService';
import { useAuth } from '../../contexts/AuthContext';

interface PostDetailProps {
  post: BoardPost;
  onBack: () => void;
  onEdit: (post: BoardPost) => void;
  onDelete: () => void;
}

/**
 * 게시글 상세 보기 컴포넌트
 * 게시글 내용과 댓글을 표시하고 상호작용 기능을 제공
 * Google 인증된 사용자만 댓글 작성 가능
 */
const PostDetail: React.FC<PostDetailProps> = ({ post, onBack, onEdit, onDelete }) => {
  // 인증 상태 가져오기
  const { currentUser, isLoading: authLoading } = useAuth();
  
  // 상태 관리
  const [comments, setComments] = useState<BoardComment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likeCount);
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // 컴포넌트 마운트 시 조회수 증가 및 댓글 로드
  useEffect(() => {
    if (post.id) {
      incrementViewCount(post.id);
      loadComments();
    }
  }, [post.id]);

  // 댓글 목록 로드
  const loadComments = async () => {
    try {
      if (post.id) {
        const commentList = await getComments(post.id);
        setComments(commentList);
      }
    } catch (error) {
      console.error('댓글 로드 실패:', error);
    }
  };

  // 날짜 포맷팅
  const formatDate = (timestamp: any) => {
    if (!timestamp) return '';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // 카테고리 정보
  const getCategoryInfo = (category: string) => {
    switch (category) {
      case 'general': return { name: '일반', emoji: '💬' };
      case 'question': return { name: '질문', emoji: '❓' };
      case 'tip': return { name: '팁', emoji: '💡' };
      case 'announcement': return { name: '공지', emoji: '📢' };
      case 'bug-report': return { name: '버그제보', emoji: '🐛' };
      default: return { name: category, emoji: '📝' };
    }
  };

  // 좋아요 토글
  const handleLikeToggle = async () => {
    try {
      if (post.id) {
        await toggleLike(post.id, !isLiked);
        setIsLiked(!isLiked);
        setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
      }
    } catch (error) {
      console.error('좋아요 처리 실패:', error);
    }
  };

  // 댓글 작성 - Google 인증된 사용자만 가능
  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 인증 상태 확인
    if (!currentUser) {
      alert('댓글을 작성하려면 Google 로그인이 필요합니다.');
      return;
    }
    
    if (!newComment.trim() || !post.id) return;

    setIsSubmittingComment(true);
    try {
      await createComment(
        {
          postId: post.id,
          content: newComment.trim(),
          likeCount: 0,
          isDeleted: false
        },
        {
          uid: currentUser.uid,
          name: currentUser.displayName || '익명',
          email: currentUser.email || '',
          avatar: currentUser.photoURL || '',
          role: 'user'
        }
      );
      
      setNewComment('');
      await loadComments(); // 댓글 목록 새로고침
    } catch (error) {
      console.error('댓글 작성 실패:', error);
      alert('댓글 작성에 실패했습니다.');
    } finally {
      setIsSubmittingComment(false);
    }
  };

  // 게시글 삭제
  const handleDelete = async () => {
    if (!post.id) return;
    
    if (!confirm('정말로 이 게시글을 삭제하시겠습니까?')) return;

    setIsDeleting(true);
    try {
      await deletePost(post.id);
      onDelete();
    } catch (error) {
      console.error('게시글 삭제 실패:', error);
      alert('게시글 삭제에 실패했습니다.');
    } finally {
      setIsDeleting(false);
    }
  };

  const categoryInfo = getCategoryInfo(post.category);

  return (
    <div className="max-w-4xl mx-auto">
      {/* 상단 네비게이션 */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span>목록으로 돌아가기</span>
        </button>

        {/* 수정/삭제 버튼은 작성자만 볼 수 있도록 */}
        {currentUser && post.author.uid === currentUser.uid && (
          <div className="flex items-center space-x-2">
            <button
              onClick={() => onEdit(post)}
              className="flex items-center space-x-1 px-3 py-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              <span>수정</span>
            </button>
            
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="flex items-center space-x-1 px-3 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors disabled:opacity-50"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              <span>{isDeleting ? '삭제 중...' : '삭제'}</span>
            </button>
          </div>
        )}
      </div>

      {/* 게시글 헤더 */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 mb-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-2 mb-4">
          <span className="text-xl">{categoryInfo.emoji}</span>
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
            {categoryInfo.name}
          </span>
          {post.isPinned && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
              📌 고정
            </span>
          )}
        </div>

        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4">
          {post.title}
        </h1>

        <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              {post.author.avatar && (
                <img
                  src={post.author.avatar}
                  alt={post.author.name}
                  className="w-6 h-6 rounded-full"
                />
              )}
              <span className="flex items-center space-x-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span>{post.author.name}</span>
              </span>
            </div>
            <span>{formatDate(post.createdAt)}</span>
            {post.updatedAt && post.updatedAt !== post.createdAt && (
              <span>(수정: {formatDate(post.updatedAt)})</span>
            )}
          </div>

          <div className="flex items-center space-x-3">
            <span className="flex items-center space-x-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              <span>{post.viewCount}</span>
            </span>
          </div>
        </div>

        {/* 태그 */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags.map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* 좋아요 버튼 */}
        <div className="flex items-center space-x-4">
          <button
            onClick={handleLikeToggle}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
              isLiked 
                ? 'bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400' 
                : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            <svg className="w-5 h-5" fill={isLiked ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            <span>{likeCount}</span>
          </button>
        </div>
      </div>

      {/* 게시글 내용 */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 mb-6 border border-gray-200 dark:border-gray-700">
        <div className="prose dark:prose-invert max-w-none">
          <div className="whitespace-pre-wrap text-gray-900 dark:text-white leading-relaxed">
            {post.content}
          </div>
        </div>
      </div>

      {/* 댓글 섹션 */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          💬 댓글 ({comments.length})
        </h3>

        {/* 댓글 작성 폼 - Google 인증된 사용자만 */}
        {currentUser ? (
          <form onSubmit={handleCommentSubmit} className="mb-6">
            {/* 로그인된 사용자 정보 표시 */}
            <div className="flex items-center space-x-3 mb-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              {currentUser.photoURL && (
                <img
                  src={currentUser.photoURL}
                  alt={currentUser.displayName || '사용자'}
                  className="w-8 h-8 rounded-full"
                />
              )}
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {currentUser.displayName || '익명'}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {currentUser.email}
                </p>
              </div>
            </div>
            
            <textarea
              placeholder="댓글을 작성해주세요..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white mb-3"
              required
            />
            <button
              type="submit"
              disabled={isSubmittingComment || !newComment.trim()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmittingComment ? '작성 중...' : '댓글 작성'}
            </button>
          </form>
        ) : (
          /* 로그인하지 않은 사용자에게 안내 메시지 */
          <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <div className="flex items-center space-x-2 text-blue-800 dark:text-blue-200">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-medium">댓글을 작성하려면 Google 로그인이 필요합니다.</span>
            </div>
            <p className="mt-2 text-sm text-blue-700 dark:text-blue-300">
              상단의 "Google로 로그인" 버튼을 클릭하여 로그인하세요.
            </p>
          </div>
        )}

        {/* 댓글 목록 */}
        <div className="space-y-4">
          {comments.length === 0 ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              첫 댓글을 작성해보세요!
            </div>
          ) : (
            comments.map((comment) => (
              <div key={comment.id} className="border-l-4 border-blue-200 dark:border-blue-800 pl-4 py-2">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    {comment.author.avatar && (
                      <img
                        src={comment.author.avatar}
                        alt={comment.author.name}
                        className="w-6 h-6 rounded-full"
                      />
                    )}
                    <span className="font-medium text-gray-900 dark:text-white">
                      {comment.author.name}
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {formatDate(comment.createdAt)}
                    </span>
                  </div>
                </div>
                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                  {comment.content}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default PostDetail; 