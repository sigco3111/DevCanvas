import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  getDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  onSnapshot,
  increment,
  serverTimestamp,
  DocumentSnapshot,
  QuerySnapshot,
  Unsubscribe
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { BoardPost, BoardComment, BoardFilterOptions, PaginationInfo } from '../types/board';

// 컬렉션 참조
const POSTS_COLLECTION = 'posts';
const COMMENTS_COLLECTION = 'comments';

/**
 * Firebase 연결 상태 확인
 */
const checkFirebaseConnection = async (): Promise<void> => {
  try {
    // 간단한 쿼리로 연결 상태 확인
    const testQuery = query(collection(db, POSTS_COLLECTION), limit(1));
    await getDocs(testQuery);
  } catch (error: any) {
    console.error('Firebase 연결 오류:', error);
    
    if (error.code === 'permission-denied') {
      throw new Error('Firestore 접근 권한이 없습니다. Firebase Console에서 보안 규칙을 확인해주세요.');
    } else if (error.code === 'unavailable') {
      throw new Error('Firestore 서비스에 연결할 수 없습니다. 네트워크 연결을 확인해주세요.');
    } else if (error.code === 'unauthenticated') {
      throw new Error('Firebase 인증이 필요합니다. 프로젝트 설정을 확인해주세요.');
    } else {
      throw new Error(`Firebase 연결 실패: ${error.message || '알 수 없는 오류'}`);
    }
  }
};

/**
 * 게시글 생성
 */
export const createPost = async (
  postData: Omit<BoardPost, 'id' | 'createdAt' | 'updatedAt' | 'author'>,
  authorInfo: { uid: string; name: string; email: string; avatar: string; role: string }
): Promise<string> => {
  try {
    // Firebase 연결 상태 확인
    await checkFirebaseConnection();
    
    const docRef = await addDoc(collection(db, POSTS_COLLECTION), {
      ...postData,
      author: authorInfo,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    
    console.log('게시글 생성 성공:', docRef.id);
    return docRef.id;
  } catch (error: any) {
    console.error('게시글 생성 실패:', error);
    throw error;
  }
};

/**
 * 게시글 목록 조회
 */
export const getPosts = async (
  filterOptions: BoardFilterOptions
): Promise<{ posts: BoardPost[]; pagination: PaginationInfo }> => {
  try {
    // Firebase 연결 상태 확인
    await checkFirebaseConnection();
    
    // 인덱스 오류를 피하기 위해 가장 단순한 쿼리만 사용
    // 모든 필터링과 정렬을 클라이언트 사이드에서 처리
    const q = collection(db, POSTS_COLLECTION);
    const querySnapshot = await getDocs(q);
    
    const posts: BoardPost[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      posts.push({
        id: doc.id,
        ...data,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt
      } as BoardPost);
    });
    
    // 클라이언트 사이드에서 모든 필터링 및 정렬 처리
    let filteredPosts = posts;
    
    // 카테고리 필터링
    if (filterOptions.category && filterOptions.category !== 'all') {
      filteredPosts = filteredPosts.filter(post => post.category === filterOptions.category);
    }
    
    // 상태 필터링
    if (filterOptions.status && filterOptions.status !== 'all') {
      filteredPosts = filteredPosts.filter(post => post.status === filterOptions.status);
    }
    
    // 검색어 필터링
    if (filterOptions.searchTerm) {
      const searchTerm = filterOptions.searchTerm.toLowerCase();
      filteredPosts = filteredPosts.filter(post =>
        post.title.toLowerCase().includes(searchTerm) ||
        post.content.toLowerCase().includes(searchTerm) ||
        post.author.name.toLowerCase().includes(searchTerm) ||
        (post.tags && post.tags.some(tag => tag.toLowerCase().includes(searchTerm)))
      );
    }
    
    // 정렬 처리
    filteredPosts.sort((a, b) => {
      switch (filterOptions.sortBy) {
        case 'latest':
          return b.createdAt.toMillis() - a.createdAt.toMillis();
        case 'oldest':
          return a.createdAt.toMillis() - b.createdAt.toMillis();
        case 'popular':
          return b.likeCount - a.likeCount;
        case 'mostViewed':
          return b.viewCount - a.viewCount;
        default:
          return b.createdAt.toMillis() - a.createdAt.toMillis();
      }
    });
    
    // 페이지네이션 처리 (클라이언트 사이드)
    const startIndex = 0;
    const endIndex = Math.min(startIndex + filterOptions.limit, filteredPosts.length);
    filteredPosts = filteredPosts.slice(startIndex, endIndex);
    
    // 페이지네이션 정보 (간단한 버전)
    const pagination: PaginationInfo = {
      currentPage: 1,
      totalPages: 1,
      totalPosts: filteredPosts.length,
      postsPerPage: filterOptions.limit,
      hasNext: false,
      hasPrev: false
    };
    
    return { posts: filteredPosts, pagination };
  } catch (error: any) {
    console.error('게시글 목록 조회 실패:', error);
    throw error;
  }
};

/**
 * 게시글 상세 조회
 */
export const getPost = async (postId: string): Promise<BoardPost | null> => {
  try {
    // Firebase 연결 상태 확인
    await checkFirebaseConnection();
    
    const docRef = doc(db, POSTS_COLLECTION, postId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        ...data,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt
      } as BoardPost;
    }
    
    return null;
  } catch (error: any) {
    console.error('게시글 조회 실패:', error);
    throw error;
  }
};

/**
 * 게시글 수정
 */
export const updatePost = async (postId: string, updateData: Partial<BoardPost>): Promise<void> => {
  try {
    // Firebase 연결 상태 확인
    await checkFirebaseConnection();
    
    const docRef = doc(db, POSTS_COLLECTION, postId);
    await updateDoc(docRef, {
      ...updateData,
      updatedAt: serverTimestamp()
    });
    
    console.log('게시글 수정 성공:', postId);
  } catch (error: any) {
    console.error('게시글 수정 실패:', error);
    throw error;
  }
};

/**
 * 게시글 삭제
 */
export const deletePost = async (postId: string): Promise<void> => {
  try {
    // Firebase 연결 상태 확인
    await checkFirebaseConnection();
    
    const docRef = doc(db, POSTS_COLLECTION, postId);
    await deleteDoc(docRef);
    
    console.log('게시글 삭제 성공:', postId);
  } catch (error: any) {
    console.error('게시글 삭제 실패:', error);
    throw error;
  }
};

/**
 * 조회수 증가
 */
export const incrementViewCount = async (postId: string): Promise<void> => {
  try {
    // Firebase 연결 상태 확인
    await checkFirebaseConnection();
    
    const docRef = doc(db, POSTS_COLLECTION, postId);
    await updateDoc(docRef, {
      viewCount: increment(1)
    });
  } catch (error: any) {
    console.error('조회수 증가 실패:', error);
    // 조회수 증가 실패는 치명적이지 않으므로 에러를 던지지 않음
  }
};

/**
 * 좋아요 토글
 */
export const toggleLike = async (postId: string, isLiked: boolean): Promise<void> => {
  try {
    // Firebase 연결 상태 확인
    await checkFirebaseConnection();
    
    const docRef = doc(db, POSTS_COLLECTION, postId);
    await updateDoc(docRef, {
      likeCount: increment(isLiked ? 1 : -1)
    });
  } catch (error: any) {
    console.error('좋아요 토글 실패:', error);
    throw error;
  }
};

/**
 * 댓글 생성 - Google 인증된 사용자만 가능
 */
export const createComment = async (
  commentData: Omit<BoardComment, 'id' | 'createdAt' | 'updatedAt' | 'author'>,
  authorInfo: { uid: string; name: string; email: string; avatar: string; role: string }
): Promise<string> => {
  try {
    // Firebase 연결 상태 확인
    await checkFirebaseConnection();
    
    const docRef = await addDoc(collection(db, COMMENTS_COLLECTION), {
      ...commentData,
      author: {
        uid: authorInfo.uid,
        name: authorInfo.name,
        email: authorInfo.email,
        avatar: authorInfo.avatar,
        role: authorInfo.role
      },
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    
    // 게시글의 댓글 수 증가
    const postRef = doc(db, POSTS_COLLECTION, commentData.postId);
    await updateDoc(postRef, {
      commentCount: increment(1)
    });
    
    console.log('댓글 생성 성공:', docRef.id);
    return docRef.id;
  } catch (error: any) {
    console.error('댓글 생성 실패:', error);
    throw error;
  }
};

/**
 * 댓글 목록 조회
 */
export const getComments = async (postId: string): Promise<BoardComment[]> => {
  try {
    // Firebase 연결 상태 확인
    await checkFirebaseConnection();
    
    // 인덱스 오류를 피하기 위해 단순한 쿼리 사용
    const q = collection(db, COMMENTS_COLLECTION);
    const querySnapshot = await getDocs(q);
    const comments: BoardComment[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      comments.push({
        id: doc.id,
        ...data,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt
      } as BoardComment);
    });
    
    // 클라이언트 사이드에서 필터링 및 정렬
    const filteredComments = comments
      .filter(comment => comment.postId === postId && !comment.isDeleted)
      .sort((a, b) => a.createdAt.toMillis() - b.createdAt.toMillis());
    
    return filteredComments;
  } catch (error: any) {
    console.error('댓글 목록 조회 실패:', error);
    throw error;
  }
};

/**
 * 실시간 게시글 목록 구독
 */
export const subscribeToPostsRealtime = (
  filterOptions: BoardFilterOptions,
  callback: (posts: BoardPost[]) => void
): Unsubscribe => {
  try {
    // 인덱스 오류를 피하기 위해 가장 단순한 쿼리만 사용
    // 모든 필터링과 정렬을 클라이언트 사이드에서 처리
    const q = collection(db, POSTS_COLLECTION);
    
    return onSnapshot(q, (querySnapshot) => {
      try {
        const posts: BoardPost[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          posts.push({
            id: doc.id,
            ...data,
            createdAt: data.createdAt,
            updatedAt: data.updatedAt
          } as BoardPost);
        });
        
        // 클라이언트 사이드에서 모든 필터링 및 정렬 처리
        let filteredPosts = posts;
        
        // 카테고리 필터링
        if (filterOptions.category && filterOptions.category !== 'all') {
          filteredPosts = filteredPosts.filter(post => post.category === filterOptions.category);
        }
        
        // 상태 필터링
        if (filterOptions.status && filterOptions.status !== 'all') {
          filteredPosts = filteredPosts.filter(post => post.status === filterOptions.status);
        }
        
        // 검색어 필터링
        if (filterOptions.searchTerm) {
          const searchTerm = filterOptions.searchTerm.toLowerCase();
          filteredPosts = filteredPosts.filter(post =>
            post.title.toLowerCase().includes(searchTerm) ||
            post.content.toLowerCase().includes(searchTerm) ||
            post.author.name.toLowerCase().includes(searchTerm) ||
            (post.tags && post.tags.some(tag => tag.toLowerCase().includes(searchTerm)))
          );
        }
        
        // 정렬 처리
        filteredPosts.sort((a, b) => {
          switch (filterOptions.sortBy) {
            case 'latest':
              return b.createdAt.toMillis() - a.createdAt.toMillis();
            case 'oldest':
              return a.createdAt.toMillis() - b.createdAt.toMillis();
            case 'popular':
              return b.likeCount - a.likeCount;
            case 'mostViewed':
              return b.viewCount - a.viewCount;
            default:
              return b.createdAt.toMillis() - a.createdAt.toMillis();
          }
        });
        
        // 페이지네이션 처리 (클라이언트 사이드)
        const startIndex = 0;
        const endIndex = Math.min(startIndex + filterOptions.limit, filteredPosts.length);
        filteredPosts = filteredPosts.slice(startIndex, endIndex);
        
        callback(filteredPosts);
      } catch (err) {
        console.error('실시간 데이터 처리 오류:', err);
      }
    }, (error) => {
      console.error('실시간 구독 오류:', error);
      if (error.code === 'failed-precondition') {
        console.warn('인덱스가 필요합니다. Firebase Console에서 인덱스를 생성해주세요.');
      }
    });
  } catch (error: any) {
    console.error('실시간 구독 설정 실패:', error);
    // 빈 함수 반환 (구독 해제용)
    return () => {};
  }
}; 