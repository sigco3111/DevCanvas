/**
 * 바 차트 컴포넌트
 * 카테고리별 수치 데이터를 바 형태로 시각화
 */
import React from 'react';
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { BaseChartProps } from '../types';

interface BarChartProps extends BaseChartProps {
  /** 차트 데이터 */
  data: Array<{
    name: string;
    value: number;
    [key: string]: any;
  }>;
  
  /** 바 데이터 키 */
  dataKey?: string;
  
  /** 바 색상 */
  barColor?: string;
  
  /** 여러 바 시리즈 데이터 */
  series?: Array<{
    dataKey: string;
    name: string;
    color?: string;
  }>;
  
  /** 그리드 표시 여부 */
  showGrid?: boolean;
  
  /** 가로 방향 바 여부 */
  layout?: 'vertical' | 'horizontal';
  
  /** X축 레이블 표시 여부 */
  showXAxisLabel?: boolean;
  
  /** Y축 레이블 표시 여부 */
  showYAxisLabel?: boolean;
  
  /** X축 레이블 */
  xAxisLabel?: string;
  
  /** Y축 레이블 */
  yAxisLabel?: string;
  
  /** X축 레이블 높이 */
  xAxisHeight?: number;
}

/**
 * 다양한 데이터를 바 차트로 시각화하는 컴포넌트
 * 수치 비교, 카테고리별 분포 등을 표현할 때 사용
 */
const BarChart: React.FC<BarChartProps> = ({
  data,
  height = 300,
  width,
  margin = { top: 20, right: 30, left: 20, bottom: 20 },
  colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'],
  dataKey = 'value',
  barColor,
  series,
  showGrid = true,
  animation = true,
  isLoading = false,
  isDarkMode = false,
  layout = 'horizontal',
  showXAxisLabel = false,
  showYAxisLabel = false,
  xAxisLabel = '',
  yAxisLabel = '',
  xAxisHeight = 60,
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
  
  // 다크 모드에 따른 차트 스타일 설정
  const gridColor = isDarkMode ? '#374151' : '#E5E7EB';
  const textColor = isDarkMode ? '#D1D5DB' : '#4B5563';
  
  // 툴팁 커스텀 포맷터
  const customTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className={`p-2 border shadow-sm rounded text-sm ${
          isDarkMode 
            ? 'bg-gray-800 border-gray-600' 
            : 'bg-white border-gray-200'
        }`}>
          <p className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{label}</p>
          {payload.map((entry: any, index: number) => (
            <p 
              key={`tooltip-${index}`}
              className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}
              style={{ color: entry.color }}
            >
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };
  
  // 차트 레이아웃 결정 (가로/세로)
  const isVertical = layout === 'vertical';
  
  // X축 레이블이 길 경우를 위한 마진 조정
  const bottomMargin = margin.bottom || 20;
  const adjustedMargin = {
    ...margin,
    bottom: isVertical ? bottomMargin : (bottomMargin + 40)
  };
  
  // X축 레이블 렌더링 함수 (긴 텍스트 처리)
  const renderXAxisTick = (props: any) => {
    const { x, y, payload } = props;
    
    return (
      <g transform={`translate(${x},${y})`}>
        <text 
          x={0} 
          y={0} 
          dy={16} 
          textAnchor="end" 
          fill={textColor} 
          fontSize={12}
          transform="rotate(-45)"
        >
          {payload.value}
        </text>
      </g>
    );
  };
  
  return (
    <div style={{ width: width || '100%', height }}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsBarChart
          data={data}
          margin={adjustedMargin}
          layout={layout}
        >
          {showGrid && <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />}
          
          {isVertical ? (
            <>
              <XAxis 
                type="number" 
                tick={{ fill: textColor }} 
                axisLine={{ stroke: gridColor }}
                tickLine={{ stroke: gridColor }}
                label={showXAxisLabel ? { value: xAxisLabel, position: 'insideBottom', fill: textColor } : undefined}
              />
              <YAxis 
                type="category" 
                dataKey="name" 
                tick={{ fill: textColor }} 
                axisLine={{ stroke: gridColor }}
                tickLine={{ stroke: gridColor }}
                width={120}
                label={showYAxisLabel ? { value: yAxisLabel, angle: -90, position: 'insideLeft', fill: textColor } : undefined}
              />
            </>
          ) : (
            <>
              <XAxis 
                type="category" 
                dataKey="name" 
                height={xAxisHeight}
                tick={renderXAxisTick}
                axisLine={{ stroke: gridColor }}
                tickLine={{ stroke: gridColor }}
                interval={0}
                label={showXAxisLabel ? { value: xAxisLabel, position: 'insideBottom', fill: textColor } : undefined}
              />
              <YAxis 
                tick={{ fill: textColor }} 
                axisLine={{ stroke: gridColor }}
                tickLine={{ stroke: gridColor }}
                label={showYAxisLabel ? { value: yAxisLabel, angle: -90, position: 'insideLeft', fill: textColor } : undefined}
              />
            </>
          )}
          
          <Tooltip content={customTooltip} />
          
          {/* 단일 바 렌더링 또는 시리즈 바 렌더링 */}
          {!series || series.length === 0 ? (
            <Bar 
              dataKey={dataKey}
              name={dataKey}
              fill={barColor || colors[0]}
              isAnimationActive={animation}
              animationDuration={500}
            />
          ) : (
            series.map((s, index) => (
              <Bar 
                key={`bar-${s.dataKey}`}
                dataKey={s.dataKey}
                name={s.name}
                fill={s.color || colors[index % colors.length]}
                isAnimationActive={animation}
                animationDuration={500 + (index * 100)}
              />
            ))
          )}
          
          {/* 여러 시리즈가 있을 경우 범례 표시 */}
          {series && series.length > 1 && (
            <Legend 
              wrapperStyle={{ 
                color: isDarkMode ? '#D1D5DB' : '#4B5563',
                fontSize: '12px'
              }}
            />
          )}
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default React.memo(BarChart); 