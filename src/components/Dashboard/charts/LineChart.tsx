/**
 * 라인 차트 컴포넌트
 * 시간에 따른 데이터 변화를 선으로 시각화
 */
import React from 'react';
import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { BaseChartProps } from '../types';

interface LineChartProps extends BaseChartProps {
  /** 차트 데이터 */
  data: Array<{
    name: string;
    [key: string]: any;
  }>;
  
  /** 라인 데이터 키 */
  dataKey?: string;
  
  /** 라인 색상 */
  lineColor?: string;
  
  /** 여러 라인 시리즈 데이터 */
  series?: Array<{
    dataKey: string;
    name: string;
    color?: string;
    strokeWidth?: number;
    dot?: boolean;
  }>;
  
  /** 그리드 표시 여부 */
  showGrid?: boolean;
  
  /** X축 레이블 표시 여부 */
  showXAxisLabel?: boolean;
  
  /** Y축 레이블 표시 여부 */
  showYAxisLabel?: boolean;
  
  /** X축 레이블 */
  xAxisLabel?: string;
  
  /** Y축 레이블 */
  yAxisLabel?: string;
  
  /** 곡선 형태의 라인 사용 여부 */
  useCurve?: boolean;
  
  /** 영역 채우기 여부 */
  areaFill?: boolean;
  
  /** 영역 채우기 투명도 */
  areaOpacity?: number;
}

/**
 * 시간에 따른 데이터 변화를 라인 차트로 시각화하는 컴포넌트
 * 트렌드, 추세, 시계열 데이터 등을 표현할 때 사용
 */
const LineChart: React.FC<LineChartProps> = ({
  data,
  height = 300,
  width,
  margin = { top: 20, right: 30, left: 20, bottom: 20 },
  colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'],
  dataKey = 'value',
  lineColor,
  series,
  showGrid = true,
  animation = true,
  isLoading = false,
  isDarkMode = false,
  showXAxisLabel = false,
  showYAxisLabel = false,
  xAxisLabel = '',
  yAxisLabel = '',
  useCurve = true,
  areaFill = false,
  areaOpacity = 0.15,
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
        <div className="bg-white dark:bg-gray-800 p-2 border border-gray-200 dark:border-gray-700 shadow-sm rounded text-sm">
          <p className="font-medium text-gray-900 dark:text-white">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p 
              key={`tooltip-${index}`}
              className="text-gray-600 dark:text-gray-300"
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
  
  return (
    <div style={{ width: width || '100%', height }}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsLineChart
          data={data}
          margin={margin}
        >
          {showGrid && <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />}
          
          <XAxis 
            dataKey="name" 
            tick={{ fill: textColor }} 
            axisLine={{ stroke: gridColor }}
            tickLine={{ stroke: gridColor }}
            label={showXAxisLabel ? { value: xAxisLabel, position: 'insideBottom', fill: textColor } : undefined}
          />
          <YAxis 
            tick={{ fill: textColor }} 
            axisLine={{ stroke: gridColor }}
            tickLine={{ stroke: gridColor }}
            label={showYAxisLabel ? { value: yAxisLabel, angle: -90, position: 'insideLeft', fill: textColor } : undefined}
          />
          
          <Tooltip content={customTooltip} />
          
          {/* 단일 라인 렌더링 또는 시리즈 라인 렌더링 */}
          {!series || series.length === 0 ? (
            <Line
              type={useCurve ? 'monotone' : 'linear'}
              dataKey={dataKey}
              name={dataKey}
              stroke={lineColor || colors[0]}
              strokeWidth={2}
              dot={{ fill: lineColor || colors[0], strokeWidth: 1, r: 4 }}
              activeDot={{ r: 6 }}
              isAnimationActive={animation}
              animationDuration={500}
              fill={areaFill ? lineColor || colors[0] : undefined}
              fillOpacity={areaFill ? areaOpacity : undefined}
            />
          ) : (
            series.map((s, index) => (
              <Line 
                key={`line-${s.dataKey}`}
                type={useCurve ? 'monotone' : 'linear'}
                dataKey={s.dataKey}
                name={s.name}
                stroke={s.color || colors[index % colors.length]}
                strokeWidth={s.strokeWidth || 2}
                dot={s.dot !== false ? { fill: s.color || colors[index % colors.length], strokeWidth: 1, r: 4 } : false}
                activeDot={{ r: 6 }}
                isAnimationActive={animation}
                animationDuration={500 + (index * 100)}
                fill={areaFill ? s.color || colors[index % colors.length] : undefined}
                fillOpacity={areaFill ? areaOpacity : undefined}
              />
            ))
          )}
          
          {/* 여러 시리즈가 있을 경우 범례 표시 */}
          {series && series.length > 1 && <Legend />}
        </RechartsLineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default React.memo(LineChart); 