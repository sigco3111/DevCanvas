/**
 * 포트폴리오 관련 Firebase 서비스 (Node.js 환경용)
 * 스크립트 실행 시에만 사용
 */

import { 
  db, 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDocs, 
  getDoc, 
  query, 
  orderBy, 
  where, 
  serverTimestamp 
} from '../lib/firebase-node';
import type { PortfolioItem } from '../types/portfolio';

const COLLECTION_NAME = 'portfolios';

/**
 * 모든 포트폴리오 가져오기 (Node.js용)
 */
export const getPortfolios = async (): Promise<PortfolioItem[]> => {
  try {
    console.log('🔄 Firebase에서 포트폴리오 데이터 가져오는 중...');
    
    const portfoliosRef = collection(db, COLLECTION_NAME);
    const q = query(portfoliosRef, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    
    const portfolios: PortfolioItem[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      portfolios.push({
        id: doc.id,
        ...data,
        // Firebase Timestamp를 ISO 문자열로 변환
        createdAt: data.createdAt?.toDate?.()?.toISOString() || data.createdAt,
        updatedAt: data.updatedAt?.toDate?.()?.toISOString() || data.updatedAt
      } as PortfolioItem);
    });
    
    console.log(`✅ ${portfolios.length}개의 포트폴리오를 가져왔습니다.`);
    return portfolios;
  } catch (error) {
    console.error('❌ 포트폴리오 가져오기 실패:', error);
    throw new Error('포트폴리오 데이터를 가져오는데 실패했습니다.');
  }
};

/**
 * ID로 특정 포트폴리오 가져오기 (Node.js용)
 */
export const getPortfolioById = async (id: string): Promise<PortfolioItem | null> => {
  try {
    console.log(`🔄 포트폴리오 ID ${id} 가져오는 중...`);
    
    const docRef = doc(db, COLLECTION_NAME, id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data();
      const portfolio = {
        id: docSnap.id,
        ...data,
        // Firebase Timestamp를 ISO 문자열로 변환
        createdAt: data.createdAt?.toDate?.()?.toISOString() || data.createdAt,
        updatedAt: data.updatedAt?.toDate?.()?.toISOString() || data.updatedAt
      } as PortfolioItem;
      
      console.log(`✅ 포트폴리오 "${portfolio.title}" 가져오기 성공`);
      return portfolio;
    } else {
      console.log(`❌ ID ${id}에 해당하는 포트폴리오를 찾을 수 없습니다.`);
      return null;
    }
  } catch (error) {
    console.error('❌ 포트폴리오 가져오기 실패:', error);
    throw new Error('포트폴리오 데이터를 가져오는데 실패했습니다.');
  }
};

/**
 * 새 포트폴리오 추가 (Node.js용)
 */
export const addPortfolio = async (portfolio: Omit<PortfolioItem, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
  try {
    console.log(`🔄 새 포트폴리오 "${portfolio.title}" 추가 중...`);
    
    const portfolioData = {
      ...portfolio,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };
    
    const docRef = await addDoc(collection(db, COLLECTION_NAME), portfolioData);
    
    console.log(`✅ 포트폴리오 "${portfolio.title}" 추가 성공 (ID: ${docRef.id})`);
    return docRef.id;
  } catch (error) {
    console.error('❌ 포트폴리오 추가 실패:', error);
    throw new Error('포트폴리오 추가에 실패했습니다.');
  }
};

/**
 * 포트폴리오 업데이트 (Node.js용)
 */
export const updatePortfolio = async (id: string, updates: Partial<Omit<PortfolioItem, 'id' | 'createdAt'>>): Promise<void> => {
  try {
    console.log(`🔄 포트폴리오 ID ${id} 업데이트 중...`);
    
    const docRef = doc(db, COLLECTION_NAME, id);
    const updateData = {
      ...updates,
      updatedAt: serverTimestamp()
    };
    
    await updateDoc(docRef, updateData);
    
    console.log(`✅ 포트폴리오 ID ${id} 업데이트 성공`);
  } catch (error) {
    console.error('❌ 포트폴리오 업데이트 실패:', error);
    throw new Error('포트폴리오 업데이트에 실패했습니다.');
  }
};

/**
 * 포트폴리오 삭제 (Node.js용)
 */
export const deletePortfolio = async (id: string): Promise<void> => {
  try {
    console.log(`🔄 포트폴리오 ID ${id} 삭제 중...`);
    
    const docRef = doc(db, COLLECTION_NAME, id);
    await deleteDoc(docRef);
    
    console.log(`✅ 포트폴리오 ID ${id} 삭제 성공`);
  } catch (error) {
    console.error('❌ 포트폴리오 삭제 실패:', error);
    throw new Error('포트폴리오 삭제에 실패했습니다.');
  }
};

/**
 * 카테고리별 포트폴리오 가져오기 (Node.js용)
 */
export const getPortfoliosByCategory = async (category: string): Promise<PortfolioItem[]> => {
  try {
    console.log(`🔄 카테고리 "${category}" 포트폴리오 가져오는 중...`);
    
    const portfoliosRef = collection(db, COLLECTION_NAME);
    const q = query(
      portfoliosRef, 
      where('category', '==', category),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    
    const portfolios: PortfolioItem[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      portfolios.push({
        id: doc.id,
        ...data,
        // Firebase Timestamp를 ISO 문자열로 변환
        createdAt: data.createdAt?.toDate?.()?.toISOString() || data.createdAt,
        updatedAt: data.updatedAt?.toDate?.()?.toISOString() || data.updatedAt
      } as PortfolioItem);
    });
    
    console.log(`✅ 카테고리 "${category}"에서 ${portfolios.length}개의 포트폴리오를 가져왔습니다.`);
    return portfolios;
  } catch (error) {
    console.error('❌ 카테고리별 포트폴리오 가져오기 실패:', error);
    throw new Error('카테고리별 포트폴리오 데이터를 가져오는데 실패했습니다.');
  }
};

/**
 * 추천 포트폴리오만 가져오기 (Node.js용)
 */
export const getFeaturedPortfolios = async (): Promise<PortfolioItem[]> => {
  try {
    console.log('🔄 추천 포트폴리오 가져오는 중...');
    
    const portfoliosRef = collection(db, COLLECTION_NAME);
    const q = query(
      portfoliosRef, 
      where('featured', '==', true),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    
    const portfolios: PortfolioItem[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      portfolios.push({
        id: doc.id,
        ...data,
        // Firebase Timestamp를 ISO 문자열로 변환
        createdAt: data.createdAt?.toDate?.()?.toISOString() || data.createdAt,
        updatedAt: data.updatedAt?.toDate?.()?.toISOString() || data.updatedAt
      } as PortfolioItem);
    });
    
    console.log(`✅ ${portfolios.length}개의 추천 포트폴리오를 가져왔습니다.`);
    return portfolios;
  } catch (error) {
    console.error('❌ 추천 포트폴리오 가져오기 실패:', error);
    throw new Error('추천 포트폴리오 데이터를 가져오는데 실패했습니다.');
  }
}; 