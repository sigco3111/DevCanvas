/**
 * 도넛 차트 컴포넌트
 * 카테고리별 데이터 분포를 원형 차트로 시각화
 */
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { BaseChartProps } from '../types';

interface DonutChartProps extends BaseChartProps {
  /** 차트 데이터 */
  data: Array<{
    name: string;
    value: number;
    color?: string;
  }>;
  
  /** 내부 레이블 표시 여부 */
  showInnerLabel?: boolean;
  
  /** 내부 레이블 텍스트 */
  innerLabel?: string | number;
  
  /** 범례 표시 위치 */
  legendPosition?: 'top' | 'bottom' | 'left' | 'right';
}

/**
 * 도넛 형태의 파이 차트를 렌더링하는 컴포넌트
 * 주로 카테고리별 분포를 시각화하는데 사용
 */
const DonutChart: React.FC<DonutChartProps> = ({
  data,
  height = 300,
  width,
  margin = { top: 5, right: 5, bottom: 5, left: 5 },
  colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#6366F1', '#D946EF', '#F97316', '#14B8A6'],
  animation = true,
  isLoading = false,
  isDarkMode = false,
  showInnerLabel = false,
  innerLabel = '',
  legendPosition = 'bottom',
}) => {
  // 데이터가 없거나 로딩 중인 경우 플레이스홀더 표시
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  
  // 데이터가 비어있는 경우 안내 메시지 표시
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-full min-h-[200px]">
        <p className="text-gray-500 dark:text-gray-400 text-center">
          데이터가 없습니다
        </p>
      </div>
    );
  }
  
  // 데이터 전처리: 합계 계산 및 퍼센트 추가
  const total = data.reduce((sum, item) => sum + item.value, 0);
  const dataWithPercent = data.map((item) => ({
    ...item,
    percent: Math.round((item.value / total) * 100),
  }));
  
  // 툴팁 커스텀 포맷터
  const customTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white dark:bg-gray-800 p-2 border border-gray-200 dark:border-gray-700 shadow-sm rounded text-sm">
          <p className="font-medium text-gray-900 dark:text-white">{data.name}</p>
          <p className="text-gray-600 dark:text-gray-300">{data.value} ({data.percent}%)</p>
        </div>
      );
    }
    return null;
  };
  
  // 범례 위치에 따른 차트 컨테이너 클래스 설정
  const getContainerClass = () => {
    switch (legendPosition) {
      case 'left':
      case 'right':
        return 'flex flex-row items-center justify-center';
      case 'top':
      case 'bottom':
      default:
        return 'flex flex-col items-center justify-center';
    }
  };
  
  // 범례 렌더링 함수
  const renderLegend = () => {
    return (
      <div className={`flex flex-wrap justify-center gap-3 ${legendPosition === 'top' ? 'mb-4' : 'mt-4'}`}>
        {dataWithPercent.map((item, index) => (
          <div key={`legend-item-${index}`} className="flex items-center">
            <div 
              className="w-3 h-3 rounded-full mr-1" 
              style={{ backgroundColor: item.color || colors[index % colors.length] }}
            ></div>
            <span className="text-xs text-gray-700 dark:text-gray-300">
              {item.name} ({item.percent}%)
            </span>
          </div>
        ))}
      </div>
    );
  };
  
  return (
    <div className={getContainerClass()}>
      {legendPosition === 'top' && renderLegend()}
      {legendPosition === 'left' && (
        <div className="mr-4">
          {renderLegend()}
        </div>
      )}
      
      <div style={{ width: width || '100%', height }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart margin={margin}>
            <Pie
              data={dataWithPercent}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={2}
              dataKey="value"
              isAnimationActive={animation}
            >
              {dataWithPercent.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.color || colors[index % colors.length]} 
                  stroke={isDarkMode ? '#1F2937' : '#FFFFFF'} 
                  strokeWidth={1}
                />
              ))}
            </Pie>
            <Tooltip content={customTooltip} />
            
            {/* 내부 레이블 표시 (선택 사항) */}
            {showInnerLabel && (
              <text
                x="50%"
                y="50%"
                textAnchor="middle"
                dominantBaseline="middle"
                className="fill-gray-700 dark:fill-gray-300 text-sm font-medium"
              >
                {innerLabel}
              </text>
            )}
          </PieChart>
        </ResponsiveContainer>
      </div>
      
      {legendPosition === 'right' && (
        <div className="ml-4">
          {renderLegend()}
        </div>
      )}
      {legendPosition === 'bottom' && renderLegend()}
    </div>
  );
};

export default React.memo(DonutChart); 