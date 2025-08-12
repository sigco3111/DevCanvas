import { 
  collection, 
  getDocs, 
  doc, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc,
  query,
  orderBy,
  where,
  increment,
  deleteField
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { PortfolioItem, PortfolioItemSimplified } from '../types/portfolio';

// Firebase 컬렉션 상수
const PORTFOLIOS_COLLECTION = 'portfolios';

/**
 * 모든 포트폴리오 데이터를 가져오는 함수
 * Firebase Firestore에서 포트폴리오 컬렉션의 모든 문서를 조회
 */
export const getPortfolios = async (): Promise<PortfolioItem[]> => {
  try {
    console.log('📱 Firebase에서 포트폴리오 데이터 가져오는 중...');
    
    const portfoliosRef = collection(db, PORTFOLIOS_COLLECTION);
    const portfoliosQuery = query(portfoliosRef, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(portfoliosQuery);
    
    const portfolios: PortfolioItem[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      
      // 날짜 변환 디버깅 (첫 번째 항목만)
      const createdAt = data.createdAt?.toDate?.()?.toISOString() || data.createdAt || new Date().toISOString();
      const updatedAt = data.updatedAt?.toDate?.()?.toISOString() || data.updatedAt || data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString();
      
      if (portfolios.length === 0) {
        console.log('🔍 브라우저 환경 날짜 변환 디버깅:');
        console.log('원본 createdAt:', data.createdAt, '타입:', typeof data.createdAt);
        console.log('원본 updatedAt:', data.updatedAt, '타입:', typeof data.updatedAt);
        console.log('변환된 createdAt:', createdAt);
        console.log('변환된 updatedAt:', updatedAt);
        console.log('Date 테스트:', new Date(createdAt).toString());
      }
      
      portfolios.push({
        ...data,
        // Firebase Timestamp를 문자열로 변환
        createdAt,
        updatedAt,
        // 통계 데이터 기본값 설정 (요구사항 4.3: 응답에 조회수와 댓글 수 포함)
        viewCount: data.viewCount || 0,
        commentCount: data.commentCount || 0,
        // 항상 Firestore 문서 ID로 덮어써서 레거시 data.id를 무력화
        id: doc.id,
      } as PortfolioItem);
    });
    
    console.log(`✅ ${portfolios.length}개의 포트폴리오 데이터 가져오기 완료`);
    return portfolios;
  } catch (error) {
    console.error('❌ 포트폴리오 데이터 가져오기 실패:', error);
    throw new Error('포트폴리오 데이터를 가져올 수 없습니다. 잠시 후 다시 시도해주세요.');
  }
};

/**
 * 특정 포트폴리오 데이터를 ID로 가져오는 함수
 */
export const getPortfolioById = async (id: string): Promise<PortfolioItem | null> => {
  try {
    console.log(`📱 ID: ${id}로 포트폴리오 데이터 가져오는 중...`);
    
    const docRef = doc(db, PORTFOLIOS_COLLECTION, id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data();
      console.log(`✅ 포트폴리오 데이터 가져오기 완료: ${data.title}`);
      return {
        ...data,
        // Firebase Timestamp를 문자열로 변환
        createdAt: data.createdAt?.toDate?.()?.toISOString() || data.createdAt || new Date().toISOString(),
        updatedAt: data.updatedAt?.toDate?.()?.toISOString() || data.updatedAt || data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
        // 통계 데이터 기본값 설정 (요구사항 4.3: 응답에 조회수와 댓글 수 포함)
        viewCount: data.viewCount || 0,
        commentCount: data.commentCount || 0,
        id: docSnap.id,
      } as PortfolioItem;
    } else {
      console.log('❌ 해당 ID의 포트폴리오를 찾을 수 없습니다.');
      return null;
    }
  } catch (error) {
    console.error('❌ 포트폴리오 데이터 가져오기 실패:', error);
    throw new Error('포트폴리오 데이터를 가져올 수 없습니다.');
  }
};

/**
 * 새로운 포트폴리오를 추가하는 함수
 */
export const addPortfolio = async (portfolio: Omit<PortfolioItem, 'id'>): Promise<string> => {
  try {
    console.log('📱 새 포트폴리오 추가 중...', portfolio.title);
    
    const portfoliosRef = collection(db, PORTFOLIOS_COLLECTION);
    // 빈 문자열 선택 필드 제거 유틸
    const trimOrOmit = <T extends Record<string, unknown>>(obj: T, keys: Array<keyof T>): T => {
      const result: Record<string, unknown> = { ...obj };
      keys.forEach((key) => {
        const val = result[key];
        // undefined는 문서에 저장하지 않도록 제거
        if (val === undefined) {
          delete result[key];
          return;
        }
        if (typeof val === 'string') {
          const trimmed = (val as string).trim();
          if (trimmed.length === 0) {
            delete result[key];
          } else {
            result[key] = trimmed;
          }
        }
      });
      return result as T;
    };

    let cleaned = trimOrOmit(portfolio, ['liveUrl', 'githubUrl', 'imageUrl'] as any);
    if ((cleaned as any).liveUrl && typeof (cleaned as any).liveUrl === 'string') {
      const lv = ((cleaned as any).liveUrl as string).trim();
      (cleaned as any).liveUrl = lv.toLowerCase() === 'local' ? 'local' : lv;
    }

    // 필수 아닌 불리언/숫자 기본값 보정
    if ((cleaned as any).featured === undefined) (cleaned as any).featured = false;
    if ((cleaned as any).viewCount === undefined) (cleaned as any).viewCount = 0;
    if ((cleaned as any).commentCount === undefined) (cleaned as any).commentCount = 0;

    const docRef = await addDoc(portfoliosRef, {
      ...cleaned,
      createdAt: (cleaned as any).createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      // 새 포트폴리오의 통계 데이터 초기화
      viewCount: (cleaned as any).viewCount,
      commentCount: (cleaned as any).commentCount
    });
    
    console.log(`✅ 포트폴리오 추가 완료: ${portfolio.title} (ID: ${docRef.id})`);
    return docRef.id;
  } catch (error) {
    console.error('❌ 포트폴리오 추가 실패:', error);
    throw new Error('포트폴리오를 추가할 수 없습니다.');
  }
};

/**
 * 기존 포트폴리오를 업데이트하는 함수
 */
export const updatePortfolio = async (id: string, updates: Partial<PortfolioItem>): Promise<void> => {
  try {
    console.log(`📱 포트폴리오 업데이트 중... ID: ${id}`);
    
    // ID 유효성 검증: 빈 문자열/공백/undefined 방지
    if (typeof id !== 'string' || id.trim().length === 0) {
      throw new Error('유효하지 않은 프로젝트 ID입니다. 다시 시도해주세요.');
    }

    const docRef = doc(db, PORTFOLIOS_COLLECTION, id);
    // 업데이트 페이로드 구성: 공란 입력 시 해당 필드 삭제 처리
    const payload: Record<string, unknown> = { updatedAt: new Date().toISOString() };
    const deletePayload: Record<string, unknown> = {};

    // 기타 일반 필드 복사 (문자열 트림)
    Object.entries(updates).forEach(([k, v]) => {
      if (k === 'liveUrl' || k === 'githubUrl' || k === 'imageUrl') return; // 아래에서 별도 처리
      if (typeof v === 'string') {
        payload[k] = v.trim();
      } else if (v !== undefined) {
        payload[k] = v;
      }
    });

    // 선택 필드 처리: 빈 문자열 -> deleteField(), 비어있지 않으면 트림 후 설정, undefined면 변경 없음
    if ('liveUrl' in updates) {
      const v = updates.liveUrl;
      if (v === undefined) deletePayload['liveUrl'] = deleteField();
      else if (typeof v === 'string' && v.trim().length === 0) deletePayload['liveUrl'] = deleteField();
      else if (typeof v === 'string') {
        const trimmed = v.trim();
        payload['liveUrl'] = trimmed.toLowerCase() === 'local' ? 'local' : trimmed;
      }
    }
    if ('githubUrl' in updates) {
      const v = updates.githubUrl;
      if (v === undefined) deletePayload['githubUrl'] = deleteField();
      else if (typeof v === 'string' && v.trim().length === 0) deletePayload['githubUrl'] = deleteField();
      else if (typeof v === 'string') payload['githubUrl'] = v.trim();
    }
    if ('imageUrl' in updates) {
      const v = updates.imageUrl;
      if (v === undefined) deletePayload['imageUrl'] = deleteField();
      else if (typeof v === 'string' && v.trim().length === 0) deletePayload['imageUrl'] = deleteField();
      else if (typeof v === 'string') payload['imageUrl'] = v.trim();
    }

    // 1) 삭제 먼저 처리
    if (Object.keys(deletePayload).length > 0) {
      console.log('🧹 deletePayload:', deletePayload);
      await updateDoc(docRef, deletePayload);
    }
    // 2) 일반 업데이트 처리
    console.log('✏️ update payload:', payload);
    await updateDoc(docRef, payload);
    
    console.log(`✅ 포트폴리오 업데이트 완료: ID ${id}`);
  } catch (error: any) {
    console.error('❌ 포트폴리오 업데이트 실패:', {
      name: error?.name,
      code: error?.code,
      message: error?.message,
    });
    throw new Error('포트폴리오를 업데이트할 수 없습니다.');
  }
};

/**
 * 포트폴리오를 삭제하는 함수
 */
export const deletePortfolio = async (id: string): Promise<void> => {
  try {
    console.log(`📱 포트폴리오 삭제 중... ID: ${id}`);
    
    const docRef = doc(db, PORTFOLIOS_COLLECTION, id);
    await deleteDoc(docRef);
    
    console.log(`✅ 포트폴리오 삭제 완료: ID ${id}`);
  } catch (error) {
    console.error('❌ 포트폴리오 삭제 실패:', error);
    throw new Error('포트폴리오를 삭제할 수 없습니다.');
  }
};

/**
 * 카테고리별 포트폴리오를 가져오는 함수
 */
export const getPortfoliosByCategory = async (category: string): Promise<PortfolioItem[]> => {
  try {
    console.log(`📱 카테고리 ${category}로 포트폴리오 데이터 가져오는 중...`);
    
    const portfoliosRef = collection(db, PORTFOLIOS_COLLECTION);
    const portfoliosQuery = query(
      portfoliosRef, 
      where('category', '==', category),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(portfoliosQuery);
    
      const portfolios: PortfolioItem[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      portfolios.push({
        ...data,
        // Firebase Timestamp를 문자열로 변환
        createdAt: data.createdAt?.toDate?.()?.toISOString() || data.createdAt || new Date().toISOString(),
        updatedAt: data.updatedAt?.toDate?.()?.toISOString() || data.updatedAt || data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
        // 통계 데이터 기본값 설정 (요구사항 4.3: 응답에 조회수와 댓글 수 포함)
        viewCount: data.viewCount || 0,
        commentCount: data.commentCount || 0,
        id: doc.id,
      } as PortfolioItem);
    });
    
    console.log(`✅ 카테고리 ${category}에서 ${portfolios.length}개의 포트폴리오 데이터 가져오기 완료`);
    return portfolios;
  } catch (error) {
    console.error('❌ 카테고리별 포트폴리오 데이터 가져오기 실패:', error);
    throw new Error('포트폴리오 데이터를 가져올 수 없습니다.');
  }
};

/**
 * 추천 포트폴리오만 가져오는 함수
 */
export const getFeaturedPortfolios = async (): Promise<PortfolioItem[]> => {
  try {
    console.log('📱 추천 포트폴리오 데이터 가져오는 중...');
    
    const portfoliosRef = collection(db, PORTFOLIOS_COLLECTION);
    const portfoliosQuery = query(
      portfoliosRef, 
      where('featured', '==', true),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(portfoliosQuery);
    
    const portfolios: PortfolioItem[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      portfolios.push({
        ...data,
        // Firebase Timestamp를 문자열로 변환
        createdAt: data.createdAt?.toDate?.()?.toISOString() || data.createdAt || new Date().toISOString(),
        updatedAt: data.updatedAt?.toDate?.()?.toISOString() || data.updatedAt || data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
        // 통계 데이터 기본값 설정 (요구사항 4.3: 응답에 조회수와 댓글 수 포함)
        viewCount: data.viewCount || 0,
        commentCount: data.commentCount || 0,
        id: doc.id,
      } as PortfolioItem);
    });
    
    console.log(`✅ ${portfolios.length}개의 추천 포트폴리오 데이터 가져오기 완료`);
    return portfolios;
  } catch (error) {
    console.error('❌ 추천 포트폴리오 데이터 가져오기 실패:', error);
    throw new Error('추천 포트폴리오 데이터를 가져올 수 없습니다.');
  }
};

/**
 * 포트폴리오 조회수를 증가시키는 함수
 * 요구사항 4.1, 4.4: 프로젝트가 조회될 때 조회수를 증가시키고 데이터베이스에 저장
 */
export const incrementViewCount = async (id: string): Promise<void> => {
  try {
    console.log(`📊 포트폴리오 조회수 증가 중... ID: ${id}`);
    
    const docRef = doc(db, PORTFOLIOS_COLLECTION, id);
    await updateDoc(docRef, {
      viewCount: increment(1),
      updatedAt: new Date().toISOString()
    });
    
    console.log(`✅ 포트폴리오 조회수 증가 완료: ID ${id}`);
  } catch (error) {
    console.error('❌ 포트폴리오 조회수 증가 실패:', error);
    throw new Error('조회수를 업데이트할 수 없습니다.');
  }
};

/**
 * 포트폴리오 댓글 수를 업데이트하는 함수
 * 요구사항 4.2, 4.5: 댓글이 추가될 때 댓글 수를 증가시키고 데이터베이스에 저장
 */
export const updateCommentCount = async (id: string, incrementValue: number = 1): Promise<void> => {
  try {
    console.log(`📊 포트폴리오 댓글 수 업데이트 중... ID: ${id}, 증가량: ${incrementValue}`);
    
    const docRef = doc(db, PORTFOLIOS_COLLECTION, id);
    await updateDoc(docRef, {
      commentCount: increment(incrementValue),
      updatedAt: new Date().toISOString()
    });
    
    console.log(`✅ 포트폴리오 댓글 수 업데이트 완료: ID ${id}`);
  } catch (error) {
    console.error('❌ 포트폴리오 댓글 수 업데이트 실패:', error);
    throw new Error('댓글 수를 업데이트할 수 없습니다.');
  }
};

/**
 * 카드 표시용 간소화된 포트폴리오 데이터를 가져오는 함수
 * 요구사항 1.1, 1.2, 1.3, 1.4, 1.5, 1.6: 성능 최적화를 위해 필수 필드만 조회
 */
export const getPortfoliosSimplified = async (): Promise<PortfolioItemSimplified[]> => {
  try {
    console.log('📱 간소화된 포트폴리오 데이터 가져오는 중...');
    
    const portfoliosRef = collection(db, PORTFOLIOS_COLLECTION);
    const portfoliosQuery = query(portfoliosRef, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(portfoliosQuery);
    
    const portfolios: PortfolioItemSimplified[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      
      // 간소화된 데이터만 추출
      portfolios.push({
        id: doc.id,
        title: data.title || '',
        imageUrl: data.imageUrl || '',
        createdAt: data.createdAt?.toDate?.()?.toISOString() || data.createdAt || new Date().toISOString(),
        commentCount: data.commentCount || 0,
        viewCount: data.viewCount || 0
      });
    });
    
    console.log(`✅ ${portfolios.length}개의 간소화된 포트폴리오 데이터 가져오기 완료`);
    return portfolios;
  } catch (error) {
    console.error('❌ 간소화된 포트폴리오 데이터 가져오기 실패:', error);
    throw new Error('포트폴리오 데이터를 가져올 수 없습니다. 잠시 후 다시 시도해주세요.');
  }
};

/**
 * 상세 정보 조회용 포트폴리오 데이터를 가져오는 함수
 * 요구사항 1.1, 1.2, 1.3, 1.4, 1.5, 1.6: 모달에서 사용할 전체 데이터 조회
 */
export const getPortfolioDetail = async (id: string): Promise<PortfolioItem | null> => {
  try {
    console.log(`📱 상세 포트폴리오 데이터 가져오는 중... ID: ${id}`);
    
    const docRef = doc(db, PORTFOLIOS_COLLECTION, id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data();
      console.log(`✅ 상세 포트폴리오 데이터 가져오기 완료: ${data.title}`);
      
      return {
        id: docSnap.id,
        ...data,
        // Firebase Timestamp를 문자열로 변환
        createdAt: data.createdAt?.toDate?.()?.toISOString() || data.createdAt || new Date().toISOString(),
        updatedAt: data.updatedAt?.toDate?.()?.toISOString() || data.updatedAt || data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
        // 통계 데이터 기본값 설정
        viewCount: data.viewCount || 0,
        commentCount: data.commentCount || 0
      } as PortfolioItem;
    } else {
      console.log('❌ 해당 ID의 포트폴리오를 찾을 수 없습니다.');
      return null;
    }
  } catch (error) {
    console.error('❌ 상세 포트폴리오 데이터 가져오기 실패:', error);
    throw new Error('포트폴리오 상세 데이터를 가져올 수 없습니다.');
  }
};

/**
 * 카테고리별 간소화된 포트폴리오 데이터를 가져오는 함수
 * 성능 최적화를 위한 필드 선택적 조회
 */
export const getPortfoliosSimplifiedByCategory = async (category: string): Promise<PortfolioItemSimplified[]> => {
  try {
    console.log(`📱 카테고리 ${category}로 간소화된 포트폴리오 데이터 가져오는 중...`);
    
    const portfoliosRef = collection(db, PORTFOLIOS_COLLECTION);
    const portfoliosQuery = query(
      portfoliosRef, 
      where('category', '==', category),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(portfoliosQuery);
    
    const portfolios: PortfolioItemSimplified[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      
      // 간소화된 데이터만 추출
      portfolios.push({
        id: doc.id,
        title: data.title || '',
        imageUrl: data.imageUrl || '',
        createdAt: data.createdAt?.toDate?.()?.toISOString() || data.createdAt || new Date().toISOString(),
        commentCount: data.commentCount || 0,
        viewCount: data.viewCount || 0
      });
    });
    
    console.log(`✅ 카테고리 ${category}에서 ${portfolios.length}개의 간소화된 포트폴리오 데이터 가져오기 완료`);
    return portfolios;
  } catch (error) {
    console.error('❌ 카테고리별 간소화된 포트폴리오 데이터 가져오기 실패:', error);
    throw new Error('포트폴리오 데이터를 가져올 수 없습니다.');
  }
};

/**
 * 추천 포트폴리오 간소화된 데이터를 가져오는 함수
 * 성능 최적화를 위한 필드 선택적 조회
 */
export const getFeaturedPortfoliosSimplified = async (): Promise<PortfolioItemSimplified[]> => {
  try {
    console.log('📱 추천 포트폴리오 간소화된 데이터 가져오는 중...');
    
    const portfoliosRef = collection(db, PORTFOLIOS_COLLECTION);
    const portfoliosQuery = query(
      portfoliosRef, 
      where('featured', '==', true),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(portfoliosQuery);
    
    const portfolios: PortfolioItemSimplified[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      
      // 간소화된 데이터만 추출
      portfolios.push({
        id: doc.id,
        title: data.title || '',
        imageUrl: data.imageUrl || '',
        createdAt: data.createdAt?.toDate?.()?.toISOString() || data.createdAt || new Date().toISOString(),
        commentCount: data.commentCount || 0,
        viewCount: data.viewCount || 0
      });
    });
    
    console.log(`✅ ${portfolios.length}개의 추천 포트폴리오 간소화된 데이터 가져오기 완료`);
    return portfolios;
  } catch (error) {
    console.error('❌ 추천 포트폴리오 간소화된 데이터 가져오기 실패:', error);
    throw new Error('추천 포트폴리오 데이터를 가져올 수 없습니다.');
  }
}; 