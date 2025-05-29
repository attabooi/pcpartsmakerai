"use client";

import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { CpuData, ViewMode } from '../../report/cpu/page'; // Adjust path if needed

interface CpuPerformanceChartProps {
  data: CpuData[];
  viewMode: ViewMode;
}

const BRAND_COLORS: { [key: string]: string } = {
  AMD: '#FF4D4F', // Red
  Intel: '#3B82F6', // Blue
  NVIDIA: '#22C55E', // Green
  DEFAULT: '#8884d8', // Default Recharts purple
};

const getBrandColor = (brand?: string): string => {
  if (!brand) return BRAND_COLORS.DEFAULT;
  if (brand.toUpperCase().includes('AMD')) return BRAND_COLORS.AMD;
  if (brand.toUpperCase().includes('INTEL')) return BRAND_COLORS.Intel;
  if (brand.toUpperCase().includes('NVIDIA') || brand.toUpperCase().includes('GEFORCE')) return BRAND_COLORS.NVIDIA;
  return BRAND_COLORS.DEFAULT;
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-slate-800/90 backdrop-blur-sm text-white p-3 rounded-md shadow-lg border border-slate-700">
        <p className="text-sm font-semibold mb-1 border-b border-slate-600 pb-1">{data.name}</p>
        <p className="text-xs">Score: <span className="font-bold">{payload[0].value}</span></p>
        {data.price && <p className="text-xs">Price: <span className="font-bold">${data.price.toFixed(2)}</span></p>}
        {data.tdp && <p className="text-xs">TDP: <span className="font-bold">{data.tdp}W</span></p>}
        {data.core_count && <p className="text-xs">Cores: <span className="font-bold">{data.core_count}</span></p>}
        {data.boost_clock && <p className="text-xs">Boost Clock: <span className="font-bold">{data.boost_clock} GHz</span></p>}
      </div>
    );
  }
  return null;
};

const CpuPerformanceChart: React.FC<CpuPerformanceChartProps> = ({ data, viewMode }) => {
  const chartData = useMemo(() => {
    return data
      .map(cpu => ({
        name: cpu.name,
        score: viewMode === 'performance' ? cpu.performance_score || 0 : cpu.value_score || 0,
        brand: cpu.brand,
        // Include other data for tooltip
        price: cpu.price,
        tdp: cpu.tdp,
        core_count: cpu.core_count,
        boost_clock: cpu.boost_clock,
      }))
      .sort((a, b) => b.score - a.score) // Sort descending
      .slice(0, 15); // Limit to top 15 for better readability, can be adjusted
  }, [data, viewMode]);

  if (!chartData || chartData.length === 0) {
    return <div className="text-center text-slate-400 py-8">No data available for chart.</div>;
  }
  
  // Smartly truncate Y-axis labels
  const formatYAxisLabel = (value: string) => {
    if (value.length > 25) { // Adjust length as needed
      return `${value.substring(0, 22)}...`;
    }
    return value;
  };

  return (
    <div className="bg-slate-800 p-4 rounded-lg shadow-lg border border-slate-700/50 h-[500px] md:h-[600px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          layout="vertical"
          margin={{
            top: 5,
            right: 20,
            left: 100, // Increased left margin for longer labels
            bottom: 5,
          }}
          barCategoryGap="20%" // Adds some space between bars
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#475569" /> {/* slate-600 */}
          <XAxis type="number" stroke="#94a3b8" tick={{ fontSize: 10 }} /> {/* slate-400 */}
          <YAxis 
            dataKey="name" 
            type="category" 
            stroke="#94a3b8" 
            width={120} // Adjust width for Y-axis labels
            tick={{ fontSize: 10, fill: '#cbd5e1' }}  // slate-300
            tickFormatter={formatYAxisLabel}
            interval={0} // Show all labels
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(71, 85, 105, 0.3)' }} /> {/* slate-700 with opacity */}
          {/* <Legend wrapperStyle={{ fontSize: '12px', color: '#cbd5e1' }} /> */}
          <Bar dataKey="score" name={viewMode === 'performance' ? "Performance Score" : "Value Score"} animationDuration={500}>
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getBrandColor(entry.brand)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CpuPerformanceChart; 