/**
 * 통계 서비스
 * 대시보드에 표시할 각종 통계 데이터를 수집하고 가공하는 서비스
 */
import { 
  collection, 
  getDocs, 
  query, 
  Timestamp,
  doc,
  getDoc
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { getPortfolios } from './portfolioService';
import { DashboardData, PortfolioStatistics, BoardStatistics, UserStatistics, TechStackStatistics } from '../types/dashboard';
import { BoardPost, PostCategory } from '../types/board';

// 캐시 TTL (Time-to-live) 설정 (밀리초)
const CACHE_TTL = 5 * 60 * 1000; // 5분

// 캐시 데이터 및 만료 시간 저장
let dashboardCache: {
  data: DashboardData | null;
  expiresAt: number;
} = {
  data: null,
  expiresAt: 0
};

/**
 * 대시보드 데이터 조회 함수
 * 캐싱을 통해 불필요한 데이터 요청을 줄임
 */
export const getDashboardData = async (forceRefresh = false): Promise<DashboardData> => {
  // 현재 시간 확인
  const now = Date.now();
  
  // 캐시가 유효한 경우 캐시된 데이터 반환
  if (!forceRefresh && dashboardCache.data && now < dashboardCache.expiresAt) {
    console.log('캐시된 대시보드 데이터 사용');
    return dashboardCache.data;
  }
  
  console.log('새로운 대시보드 데이터 로드 중...');
  
  try {
    // 포트폴리오 통계 가져오기
    const portfolioStats = await getPortfolioStatistics();
    
    // 게시판 통계 가져오기
    const boardStats = await getBoardStatistics();
    
    // 사용자 활동 통계 가져오기
    const userStats = await getUserStatistics();
    
    // 기술 스택 통계 가져오기
    const techStats = await getTechStackStatistics();
    
    // 대시보드 데이터 조합
    const dashboardData: DashboardData = {
      portfolio: portfolioStats,
      board: boardStats,
      user: userStats,
      tech: techStats,
      lastUpdated: new Date()
    };
    
    // 캐시 업데이트
    dashboardCache = {
      data: dashboardData,
      expiresAt: now + CACHE_TTL
    };
    
    return dashboardData;
  } catch (error) {
    console.error('대시보드 데이터 로드 실패:', error);
    throw new Error('통계 데이터를 불러오는 중 오류가 발생했습니다.');
  }
};

/**
 * 포트폴리오 통계 데이터 수집 함수
 */
export const getPortfolioStatistics = async (): Promise<PortfolioStatistics> => {
  try {
    // 모든 포트폴리오 데이터 가져오기
    const portfolios = await getPortfolios();
    
    // 총 프로젝트 수
    const totalProjects = portfolios.length;
    
    // 카테고리별 프로젝트 수 집계
    const categoryCounts: { [key: string]: number } = {};
    portfolios.forEach(project => {
      if (project.category) {
        if (categoryCounts[project.category]) {
          categoryCounts[project.category]++;
        } else {
          categoryCounts[project.category] = 1;
        }
      }
    });
    
    // 카테고리 분포 데이터 생성
    const categoryDistribution = Object.entries(categoryCounts).map(([name, count]) => ({
      name,
      count
    }));
    
    // Gemini API 상태별 프로젝트 수
    const geminiApiCounts: { [key: string]: number } = {
      'required': 0,
      'optional': 0,
      'none': 0
    };
    
    portfolios.forEach(project => {
      const status = project.geminiApiStatus || 'none';
      geminiApiCounts[status]++;
    });
    
    const geminiApiDistribution = Object.entries(geminiApiCounts).map(([status, count]) => ({
      status,
      count
    }));
    
    // 최신 프로젝트 (최대 5개)
    const sortedProjects = [...portfolios].sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    
    const recentProjects = sortedProjects.slice(0, 5).map(project => ({
      id: project.id,
      title: project.title,
      createdAt: project.createdAt,
      category: project.category
    }));
    
    // 시간에 따른 프로젝트 추가 추이
    const projectsOverTime = generateTimelineData(portfolios, 'createdAt', 6);
    
    return {
      totalProjects,
      categoryDistribution,
      geminiApiDistribution,
      recentProjects,
      projectsOverTime
    };
  } catch (error) {
    console.error('포트폴리오 통계 데이터 수집 실패:', error);
    throw error;
  }
};

/**
 * 게시판 통계 데이터 수집 함수
 */
export const getBoardStatistics = async (): Promise<BoardStatistics> => {
  try {
    // 게시글 컬렉션 참조
    const postsRef = collection(db, 'posts');
    const postsQuery = query(postsRef);
    const postsSnapshot = await getDocs(postsQuery);
    
    // 게시글 데이터 추출
    const posts: BoardPost[] = [];
    postsSnapshot.forEach(doc => {
      const data = doc.data() as BoardPost;
      posts.push({
        ...data,
        id: doc.id
      });
    });
    
    // 총 게시글 수
    const totalPosts = posts.length;
    
    // 총 댓글 수 집계
    const totalComments = posts.reduce((sum, post) => sum + (post.commentCount || 0), 0);
    
    // 카테고리별 게시글 수 집계
    const categoryCounts: { [key: string]: number } = {};
    posts.forEach(post => {
      if (post.category) {
        const category = post.category;
        if (categoryCounts[category]) {
          categoryCounts[category]++;
        } else {
          categoryCounts[category] = 1;
        }
      }
    });
    
    // 카테고리 분포 데이터 생성
    const categoryDistribution: { name: PostCategory | 'all'; count: number }[] = Object.entries(categoryCounts).map(([name, count]) => ({
      name: name as PostCategory,
      count
    }));
    
    // 'all' 카테고리 추가
    categoryDistribution.push({ name: 'all', count: totalPosts });
    
    // 인기 게시글 (조회수 기준, 최대 5개)
    const popularPosts = [...posts]
      .sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0))
      .slice(0, 5)
      .map(post => ({
        id: post.id || '',
        title: post.title,
        authorName: post.author?.name || '익명',
        viewCount: post.viewCount || 0,
        likeCount: post.likeCount || 0
      }));
    
    // 시간에 따른 게시글 작성 추이
    const postsOverTime = generateTimelineData(posts, 'createdAt', 6);
    
    return {
      totalPosts,
      totalComments,
      categoryDistribution,
      popularPosts,
      postsOverTime
    };
  } catch (error) {
    console.error('게시판 통계 데이터 수집 실패:', error);
    // 게시판 데이터가 없을 경우 기본값 반환
    return {
      totalPosts: 0,
      totalComments: 0,
      categoryDistribution: [{ name: 'all', count: 0 }],
      popularPosts: [],
      postsOverTime: generateEmptyTimelineData(6)
    };
  }
};

/**
 * 사용자 활동 통계 데이터 수집 함수
 */
export const getUserStatistics = async (): Promise<UserStatistics> => {
  try {
    // 방문자 컬렉션이 있는 경우 방문자 수 가져오기
    let totalVisitors = 0;
    
    try {
      const visitorsRef = doc(db, 'statistics', 'visitors');
      const visitorsDoc = await getDoc(visitorsRef);
      
      if (visitorsDoc.exists()) {
        totalVisitors = visitorsDoc.data()?.count || 0;
      }
    } catch (e) {
      console.log('방문자 통계 데이터 없음, 기본값 사용');
    }
    
    // 사용자 컬렉션 참조
    const usersRef = collection(db, 'users');
    const usersQuery = query(usersRef);
    const usersSnapshot = await getDocs(usersQuery);
    
    // 등록된 사용자 수
    const totalUsers = usersSnapshot.size;
    
    // 게시글 컬렉션에서 사용자별 게시글 수 집계
    const postsRef = collection(db, 'posts');
    const postsSnapshot = await getDocs(postsRef);
    
    const userPostCounts: { [userId: string]: { userName: string; postCount: number } } = {};
    
    postsSnapshot.forEach(doc => {
      const post = doc.data();
      const authorId = post.author?.uid;
      const authorName = post.author?.name || '익명';
      
      if (authorId) {
        if (userPostCounts[authorId]) {
          userPostCounts[authorId].postCount++;
        } else {
          userPostCounts[authorId] = {
            userName: authorName,
            postCount: 1
          };
        }
      }
    });
    
    // 게시글 작성 상위 사용자 목록
    const topContributors = Object.entries(userPostCounts)
      .map(([userId, data]) => ({
        userId,
        userName: data.userName,
        postCount: data.postCount
      }))
      .sort((a, b) => b.postCount - a.postCount)
      .slice(0, 5);
    
    // 시간대별 방문자 분포 (더미 데이터, 실제로는 방문 로그 필요)
    const visitsByHour = generateHourlyDistributionData();
    
    // 일별 활동 추이 (더미 데이터, 실제로는 로그 필요)
    const activityByDay = generateDailyActivityData();
    
    return {
      totalVisitors,
      totalUsers,
      topContributors,
      visitsByHour,
      activityByDay
    };
  } catch (error) {
    console.error('사용자 활동 통계 데이터 수집 실패:', error);
    // 사용자 활동 데이터가 없을 경우 기본값 반환
    return {
      totalVisitors: 0,
      totalUsers: 0,
      topContributors: [],
      visitsByHour: generateHourlyDistributionData(),
      activityByDay: generateDailyActivityData()
    };
  }
};

/**
 * 기술 스택 통계 데이터 수집 함수
 */
export const getTechStackStatistics = async (): Promise<TechStackStatistics> => {
  try {
    // 모든 포트폴리오 데이터 가져오기
    const portfolios = await getPortfolios();
    
    // 기술 스택 사용 횟수 집계
    const techCounts: { [key: string]: number } = {};
    portfolios.forEach(project => {
      if (project.technologies && Array.isArray(project.technologies)) {
        project.technologies.forEach(tech => {
          if (tech) {
            const techName = tech.trim();
            if (techCounts[techName]) {
              techCounts[techName]++;
            } else {
              techCounts[techName] = 1;
            }
          }
        });
      }
    });
    
    // 개발 도구 사용 횟수 집계
    const toolCounts: { [key: string]: number } = {};
    portfolios.forEach(project => {
      if (project.developmentTools && Array.isArray(project.developmentTools)) {
        project.developmentTools.forEach(tool => {
          if (tool) {
            const toolName = tool.trim();
            if (toolCounts[toolName]) {
              toolCounts[toolName]++;
            } else {
              toolCounts[toolName] = 1;
            }
          }
        });
      }
    });
    
    // 총 기술 스택 수와 개발 도구 수
    const totalTechnologies = Object.keys(techCounts).length;
    const totalDevelopmentTools = Object.keys(toolCounts).length;
    
    // 기술 스택 분포 데이터 생성
    const technologyDistribution = Object.entries(techCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
    
    // 개발 도구 분포 데이터 생성
    const developmentToolDistribution = Object.entries(toolCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
    
    // 상위 기술 스택 (최대 10개)
    const totalProjects = portfolios.length;
    const topTechnologies = technologyDistribution
      .slice(0, 10)
      .map(tech => ({
        name: tech.name,
        count: tech.count,
        percentage: Math.round((tech.count / totalProjects) * 100)
      }));
    
    // 상위 개발 도구 (최대 10개)
    const topDevelopmentTools = developmentToolDistribution
      .slice(0, 10)
      .map(tool => ({
        name: tool.name,
        count: tool.count,
        percentage: Math.round((tool.count / totalProjects) * 100)
      }));
    
    // 프로젝트별 기술 스택 수
    const technologiesPerProject = portfolios
      .map(project => ({
        projectId: project.id,
        projectTitle: project.title,
        techCount: (project.technologies?.length || 0) + (project.developmentTools?.length || 0)
      }))
      .sort((a, b) => b.techCount - a.techCount)
      .slice(0, 10); // 상위 10개 프로젝트만
    
    return {
      totalTechnologies,
      totalDevelopmentTools,
      technologyDistribution,
      developmentToolDistribution,
      topTechnologies,
      topDevelopmentTools,
      technologiesPerProject
    };
  } catch (error) {
    console.error('기술 스택 통계 데이터 수집 실패:', error);
    // 기술 스택 데이터가 없을 경우 기본값 반환
    return {
      totalTechnologies: 0,
      totalDevelopmentTools: 0,
      technologyDistribution: [],
      developmentToolDistribution: [],
      topTechnologies: [],
      topDevelopmentTools: [],
      technologiesPerProject: []
    };
  }
};

// 헬퍼 함수: 타임라인 데이터 생성 (최근 N개월)
function generateTimelineData(items: any[], dateField: string, months: number): { date: string; count: number }[] {
  const result: { date: string; count: number }[] = [];
  const now = new Date();
  
  // 최근 N개월의 데이터 초기화
  for (let i = months - 1; i >= 0; i--) {
    const targetMonth = new Date(now.getFullYear(), now.getMonth() - i, 1);
    result.push({
      date: `${targetMonth.getFullYear()}-${String(targetMonth.getMonth() + 1).padStart(2, '0')}`,
      count: 0
    });
  }
  
  // 각 항목 날짜별로 개수 집계
  items.forEach(item => {
    if (item[dateField]) {
      let itemDate: Date;
      
      // Firebase Timestamp 또는 문자열 처리
      if (item[dateField] instanceof Timestamp) {
        itemDate = item[dateField].toDate();
      } else {
        itemDate = new Date(item[dateField]);
      }
      
      // 유효한 날짜만 처리
      if (!isNaN(itemDate.getTime())) {
        const monthStr = `${itemDate.getFullYear()}-${String(itemDate.getMonth() + 1).padStart(2, '0')}`;
        
        const targetMonth = result.find(m => m.date === monthStr);
        if (targetMonth) {
          targetMonth.count++;
        }
      }
    }
  });
  
  return result;
}

// 헬퍼 함수: 빈 타임라인 데이터 생성
function generateEmptyTimelineData(months: number): { date: string; count: number }[] {
  const result: { date: string; count: number }[] = [];
  const now = new Date();
  
  for (let i = months - 1; i >= 0; i--) {
    const targetMonth = new Date(now.getFullYear(), now.getMonth() - i, 1);
    result.push({
      date: `${targetMonth.getFullYear()}-${String(targetMonth.getMonth() + 1).padStart(2, '0')}`,
      count: 0
    });
  }
  
  return result;
}

// 헬퍼 함수: 시간대별 방문자 분포 더미 데이터 생성
function generateHourlyDistributionData(): { hour: number; count: number }[] {
  const result: { hour: number; count: number }[] = [];
  
  for (let hour = 0; hour < 24; hour++) {
    // 일반적인 방문 패턴을 모방한 더미 데이터 생성
    let count = 0;
    
    if (hour >= 9 && hour <= 18) {
      // 업무 시간대 (높은 방문율)
      count = Math.floor(Math.random() * 30) + 40;
    } else if (hour >= 19 && hour <= 23) {
      // 저녁 시간대 (중간 방문율)
      count = Math.floor(Math.random() * 20) + 20;
    } else {
      // 새벽 시간대 (낮은 방문율)
      count = Math.floor(Math.random() * 15) + 5;
    }
    
    result.push({ hour, count });
  }
  
  return result;
}

// 헬퍼 함수: 일별 활동 추이 더미 데이터 생성
function generateDailyActivityData(): { date: string; visitors: number; posts: number; comments: number }[] {
  const result: { date: string; visitors: number; posts: number; comments: number }[] = [];
  const now = new Date();
  
  // 최근 7일 데이터 생성
  for (let i = 6; i >= 0; i--) {
    const targetDate = new Date(now);
    targetDate.setDate(now.getDate() - i);
    
    const dateStr = `${targetDate.getMonth() + 1}/${targetDate.getDate()}`;
    
    // 랜덤 더미 데이터 생성
    const visitors = Math.floor(Math.random() * 100) + 50;
    const posts = Math.floor(Math.random() * 10) + 1;
    const comments = Math.floor(Math.random() * 20) + 5;
    
    result.push({
      date: dateStr,
      visitors,
      posts,
      comments
    });
  }
  
  return result;
} 