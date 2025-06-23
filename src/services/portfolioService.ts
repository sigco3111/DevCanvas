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
  serverTimestamp
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { PortfolioItem } from '../types/portfolio';

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
        updatedAt
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
        updatedAt: data.updatedAt?.toDate?.()?.toISOString() || data.updatedAt || data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString()
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
      updatedAt: new Date().toISOString()
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
        updatedAt: data.updatedAt?.toDate?.()?.toISOString() || data.updatedAt || data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString()
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
        updatedAt: data.updatedAt?.toDate?.()?.toISOString() || data.updatedAt || data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString()
      } as PortfolioItem);
    });
    
    console.log(`✅ ${portfolios.length}개의 추천 포트폴리오 데이터 가져오기 완료`);
    return portfolios;
  } catch (error) {
    console.error('❌ 추천 포트폴리오 데이터 가져오기 실패:', error);
    throw new Error('추천 포트폴리오 데이터를 가져올 수 없습니다.');
  }
}; 