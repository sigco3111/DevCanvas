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
  increment
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
        id: doc.id,
        ...data,
        // Firebase Timestamp를 문자열로 변환
        createdAt,
        updatedAt,
        // 통계 데이터 기본값 설정 (요구사항 4.3: 응답에 조회수와 댓글 수 포함)
        viewCount: data.viewCount || 0,
        commentCount: data.commentCount || 0
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
        id: docSnap.id,
        ...data,
        // Firebase Timestamp를 문자열로 변환
        createdAt: data.createdAt?.toDate?.()?.toISOString() || data.createdAt || new Date().toISOString(),
        updatedAt: data.updatedAt?.toDate?.()?.toISOString() || data.updatedAt || data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
        // 통계 데이터 기본값 설정 (요구사항 4.3: 응답에 조회수와 댓글 수 포함)
        viewCount: data.viewCount || 0,
        commentCount: data.commentCount || 0
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
    const docRef = await addDoc(portfoliosRef, {
      ...portfolio,
      createdAt: portfolio.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      // 새 포트폴리오의 통계 데이터 초기화
      viewCount: portfolio.viewCount || 0,
      commentCount: portfolio.commentCount || 0
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
    
    const docRef = doc(db, PORTFOLIOS_COLLECTION, id);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: new Date().toISOString()
    });
    
    console.log(`✅ 포트폴리오 업데이트 완료: ID ${id}`);
  } catch (error) {
    console.error('❌ 포트폴리오 업데이트 실패:', error);
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
        id: doc.id,
        ...data,
        // Firebase Timestamp를 문자열로 변환
        createdAt: data.createdAt?.toDate?.()?.toISOString() || data.createdAt || new Date().toISOString(),
        updatedAt: data.updatedAt?.toDate?.()?.toISOString() || data.updatedAt || data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
        // 통계 데이터 기본값 설정 (요구사항 4.3: 응답에 조회수와 댓글 수 포함)
        viewCount: data.viewCount || 0,
        commentCount: data.commentCount || 0
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
        id: doc.id,
        ...data,
        // Firebase Timestamp를 문자열로 변환
        createdAt: data.createdAt?.toDate?.()?.toISOString() || data.createdAt || new Date().toISOString(),
        updatedAt: data.updatedAt?.toDate?.()?.toISOString() || data.updatedAt || data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
        // 통계 데이터 기본값 설정 (요구사항 4.3: 응답에 조회수와 댓글 수 포함)
        viewCount: data.viewCount || 0,
        commentCount: data.commentCount || 0
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