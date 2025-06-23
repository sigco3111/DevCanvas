import React, { useState, useEffect } from 'react';
import { BoardPost, PostCategory } from '../../types/board';
import { createPost, updatePost } from '../../services/boardService';
import { useAuth } from '../../contexts/AuthContext';

interface PostFormProps {
  mode: 'create' | 'edit';
  post?: BoardPost;
  onBack: () => void;
  onSubmit: () => void;
}

/**
 * 게시글 작성/수정 폼 컴포넌트
 * 게시글 생성과 수정을 위한 통합 폼
 */
const PostForm: React.FC<PostFormProps> = ({ mode, post, onBack, onSubmit }) => {
  // 인증 상태
  const { currentUser, getUserInfo } = useAuth();
  
  // 폼 상태
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'general' as PostCategory,
    tags: [] as string[]
  });
  const [tagInput, setTagInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // 카테고리 옵션
  const categoryOptions = [
    { value: 'general', label: '일반', emoji: '💬' },
    { value: 'question', label: '질문', emoji: '❓' },
    { value: 'tip', label: '팁', emoji: '💡' },
    { value: 'announcement', label: '공지', emoji: '📢' },
    { value: 'bug-report', label: '버그제보', emoji: '🐛' }
  ];

  // 수정 모드일 때 기존 데이터 로드
  useEffect(() => {
    if (mode === 'edit' && post) {
      setFormData({
        title: post.title,
        content: post.content,
        category: post.category,
        tags: post.tags || []
      });
    }
  }, [mode, post]);

  // 입력값 변경 처리
  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // 에러 메시지 클리어
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // 태그 추가
  const handleAddTag = () => {
    const tag = tagInput.trim();
    if (tag && !formData.tags.includes(tag) && formData.tags.length < 10) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tag]
      }));
      setTagInput('');
    }
  };

  // 태그 제거
  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  // 태그 입력 키 처리
  const handleTagKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  // 폼 유효성 검사
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = '제목을 입력해주세요.';
    } else if (formData.title.length > 100) {
      newErrors.title = '제목은 100자 이내로 입력해주세요.';
    }

    if (!formData.content.trim()) {
      newErrors.content = '내용을 입력해주세요.';
    } else if (formData.content.length > 5000) {
      newErrors.content = '내용은 5000자 이내로 입력해주세요.';
    }

    // 로그인 상태 확인
    if (!currentUser) {
      newErrors.auth = '로그인이 필요합니다.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 폼 제출 처리
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const userInfo = getUserInfo();
      if (!userInfo) {
        throw new Error('사용자 정보를 가져올 수 없습니다.');
      }

      if (mode === 'create') {
        // 새 게시글 생성
        await createPost({
          title: formData.title.trim(),
          content: formData.content.trim(),
          category: formData.category,
          tags: formData.tags,
          status: 'published',
          viewCount: 0,
          likeCount: 0,
          commentCount: 0,
          isPinned: false
        }, userInfo);
      } else if (mode === 'edit' && post?.id) {
        // 기존 게시글 수정
        await updatePost(post.id, {
          title: formData.title.trim(),
          content: formData.content.trim(),
          category: formData.category,
          tags: formData.tags
        });
      }
      
      onSubmit();
    } catch (error) {
      console.error('게시글 저장 실패:', error);
      alert(`게시글 ${mode === 'create' ? '작성' : '수정'}에 실패했습니다.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <button
            onClick={onBack}
            className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span>취소</span>
          </button>
          
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {mode === 'create' ? '✍️ 새 게시글 작성' : '✏️ 게시글 수정'}
          </h1>
        </div>
      </div>

      {/* 폼 */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          {/* 작성자 정보 표시 */}
          <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">작성자 정보</h3>
            {currentUser ? (
              <div className="flex items-center space-x-3">
                {currentUser.photoURL && (
                  <img
                    src={currentUser.photoURL}
                    alt={currentUser.displayName || '사용자'}
                    className="w-10 h-10 rounded-full"
                  />
                )}
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {currentUser.displayName || '사용자'}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {currentUser.email}
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-sm text-red-600 dark:text-red-400">
                로그인이 필요합니다.
              </p>
            )}
          </div>

          {/* 카테고리 */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              카테고리 *
            </label>
            <select
              value={formData.category}
              onChange={(e) => handleInputChange('category', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            >
              {categoryOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.emoji} {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* 제목 */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              제목 *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white ${
                errors.title ? 'border-red-500 dark:border-red-500' : 'border-gray-300 dark:border-gray-600'
              }`}
              placeholder="게시글 제목을 입력하세요"
              maxLength={100}
            />
            <div className="flex justify-between mt-1">
              {errors.title && (
                <p className="text-sm text-red-600 dark:text-red-400">{errors.title}</p>
              )}
              <p className="text-sm text-gray-500 dark:text-gray-400 ml-auto">
                {formData.title.length}/100
              </p>
            </div>
          </div>

          {/* 내용 */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              내용 *
            </label>
            <textarea
              value={formData.content}
              onChange={(e) => handleInputChange('content', e.target.value)}
              rows={12}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white ${
                errors.content ? 'border-red-500 dark:border-red-500' : 'border-gray-300 dark:border-gray-600'
              }`}
              placeholder="게시글 내용을 입력하세요"
              maxLength={5000}
            />
            <div className="flex justify-between mt-1">
              {errors.content && (
                <p className="text-sm text-red-600 dark:text-red-400">{errors.content}</p>
              )}
              <p className="text-sm text-gray-500 dark:text-gray-400 ml-auto">
                {formData.content.length}/5000
              </p>
            </div>
          </div>

          {/* 태그 */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              태그 (최대 10개)
            </label>
            <div className="flex flex-wrap gap-2 mb-3">
              {formData.tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                >
                  #{tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="ml-2 hover:bg-blue-200 dark:hover:bg-blue-800 rounded-full p-0.5"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </span>
              ))}
            </div>
            {formData.tags.length < 10 && (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleTagKeyDown}
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="태그를 입력하고 Enter를 누르세요"
                  maxLength={20}
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  disabled={!tagInput.trim()}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  추가
                </button>
              </div>
            )}
          </div>
        </div>

        {/* 액션 버튼 */}
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={onBack}
            className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            취소
          </button>

          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting 
              ? `${mode === 'create' ? '작성' : '수정'} 중...` 
              : `${mode === 'create' ? '게시글 작성' : '수정 완료'}`
            }
          </button>
        </div>
      </form>
    </div>
  );
};

export default PostForm; 