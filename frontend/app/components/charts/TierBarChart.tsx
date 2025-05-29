"use client";

import React, { useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  LabelList,
  ReferenceArea
} from 'recharts';

// Props and Data Interfaces
export interface CpuDataItem {
  id: string;
  name: string;
  brand: 'Intel' | 'AMD' | 'Other' | string; // Allow string for flexibility
  performance_score?: number;
  value_score?: number;
  tier: 'S' | 'A' | 'B' | 'C' | string;
  price?: number;
  // Add any other fields needed for tooltip or logic
  tdp?: number;
  core_count?: number;
  boost_clock?: number;
}

export type ChartViewMode = 'performance' | 'value';

interface TierBarChartProps {
  data: CpuDataItem[];
  viewMode: ChartViewMode;
}

// Configuration
const BRAND_COLORS: { [key: string]: string } = {
  Intel: '#3B82F6', // Blue
  AMD: '#F43F5E',   // Rose (as requested)
  NVIDIA: '#22C55E', // Green (added for consistency if NVIDIA appears as CPU brand)
  Other: '#6B7280', // Gray-500
  DEFAULT: '#A0AEC0', // Gray-400
};

const TIER_STYLES: { [key: string]: { name: string; borderColor: string; lightBgColor: string; order: number; labelColor: string; } } = {
  S: { name: 'S', borderColor: '#F59E0B', lightBgColor: 'rgba(245, 158, 11, 0.05)', order: 1, labelColor: '#F59E0B' }, // amber-500
  A: { name: 'A', borderColor: '#A855F7', lightBgColor: 'rgba(168, 85, 247, 0.05)', order: 2, labelColor: '#A855F7' }, // purple-500
  B: { name: 'B', borderColor: '#3B82F6', lightBgColor: 'rgba(59, 130, 246, 0.05)', order: 3, labelColor: '#3B82F6' }, // blue-500
  C: { name: 'C', borderColor: '#22C55E', lightBgColor: 'rgba(34, 197, 94, 0.05)', order: 4, labelColor: '#22C55E' }, // green-500
  DEFAULT: { name: '?', borderColor: '#6B7280', lightBgColor: 'rgba(107, 114, 128, 0.05)', order: 5, labelColor: '#6B7280'},
};

// Utility Functions
const getBrandColor = (brand: string): string => {
  const upperBrand = brand?.toUpperCase();
  if (upperBrand?.includes('INTEL')) return BRAND_COLORS.Intel;
  if (upperBrand?.includes('AMD')) return BRAND_COLORS.AMD;
  if (upperBrand?.includes('NVIDIA') || upperBrand?.includes('GEFORCE')) return BRAND_COLORS.NVIDIA; // Handle NVIDIA
  return BRAND_COLORS.Other;
};

const getBrandInitial = (brand: string): string => {
  const upperBrand = brand?.toUpperCase();
  if (upperBrand?.includes('INTEL')) return 'I';
  if (upperBrand?.includes('AMD')) return 'A';
  if (upperBrand?.includes('NVIDIA') || upperBrand?.includes('GEFORCE')) return 'N';
  return '';
};

const truncateName = (name: string, maxLength = 25): string => {
  if (name.length <= maxLength) return name;
  // Prioritize showing the end of the model name if it's very long
  if (maxLength < 15) return `${name.substring(0, maxLength - 3)}...`;
  const firstPartLength = Math.floor((maxLength - 3) * 0.4); // Show less of the beginning
  const secondPartLength = Math.ceil((maxLength - 3) * 0.6); // Show more of the end
  return `${name.substring(0, firstPartLength)}...${name.substring(name.length - secondPartLength)}`;
};

const formatYAxisTick = (name: string, brand: string) => {
  const initial = getBrandInitial(brand);
  // Adjust truncation for Y-axis tick based on available space, e.g. 15-18 chars
  const truncatedName = truncateName(name, 18); 
  return `${initial ? `[${initial}] ` : ''}${truncatedName}`;
};

// Sample Data (as requested for standalone example)
const sampleCpuData: CpuDataItem[] = [
  { id: '1', name: 'Intel Core i9-14900K Extremely Long Name For Testing Truncation', brand: 'Intel', performance_score: 108, value_score: 75, tier: 'S', price: 429.99, tdp: 125, core_count: 24, boost_clock: 5.8 },
  { id: '2', name: 'AMD Ryzen 9 7950X3D', brand: 'AMD', performance_score: 105, value_score: 70, tier: 'S', price: 599.00, tdp: 120, core_count: 16, boost_clock: 5.7 },
  { id: 's3', name: 'Intel Xeon W9-3495X', brand: 'Intel', performance_score: 115, value_score: 30, tier: 'S', price: 5889.00 },
  { id: '3', name: 'Intel Core i7-14700K', brand: 'Intel', performance_score: 95, value_score: 80, tier: 'A', price: 389.00, tdp: 125, core_count: 20, boost_clock: 5.6 },
  { id: '4', name: 'AMD Ryzen 7 7800X3D', brand: 'AMD', performance_score: 92, value_score: 85, tier: 'A', price: 359.00, tdp: 120, core_count: 8, boost_clock: 5.0 },
  { id: 'a3', name: 'AMD Threadripper PRO 7995WX', brand: 'AMD', performance_score: 100, value_score: 25, tier: 'A', price: 9999.00},
  { id: '5', name: 'Intel Core i5-14600K', brand: 'Intel', performance_score: 80, value_score: 90, tier: 'B', price: 299.00, tdp: 125, core_count: 14, boost_clock: 5.3 },
  { id: '6', name: 'AMD Ryzen 5 7600X', brand: 'AMD', performance_score: 78, value_score: 88, tier: 'B', price: 229.00, tdp: 105, core_count: 6, boost_clock: 5.3 },
  { id: '7', name: 'Intel Core i3-13100F', brand: 'Intel', performance_score: 60, value_score: 70, tier: 'C', price: 109.99, tdp: 58, core_count: 4, boost_clock: 4.5 },
  { id: '8', name: 'AMD Ryzen 3 5300G', brand: 'AMD', performance_score: 55, value_score: 65, tier: 'C', price: 129.00, tdp: 65, core_count: 4, boost_clock: 4.2 },
  { id: '9', name: 'Very Short Name', brand: 'Other', performance_score: 50, value_score: 50, tier: 'C', price: 99.00 },
  // { id: '10', name: 'NVIDIA H100 Hopper (CPU example)', brand: 'NVIDIA', performance_score: 120, value_score: 20, tier: 'S', price: 30000.00 },
];


// Custom Tooltip Component
const CustomTooltipContent = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    // The 'label' is the CPU name for vertical bar charts
    const cpuName = label; 
    // Find the full data object from the first item in payload, which has the original item
    const dataItem = payload[0]?.payload as CpuDataItem | undefined;

    if (!dataItem) return null;

    return (
      <div className="bg-slate-900/80 backdrop-blur-md text-slate-100 p-3.5 rounded-lg shadow-xl border border-slate-700 text-xs leading-relaxed">
        <p className="text-sm font-semibold mb-2 border-b border-slate-600 pb-1.5">{dataItem.name}</p>
        <div className="grid grid-cols-2 gap-x-3 gap-y-1">
          <span className="text-slate-400">Brand:</span><span className="font-medium text-slate-200">{dataItem.brand}</span>
          <span className="text-slate-400">Score:</span><span className="font-medium text-slate-200">{payload[0].value}</span>
          <span className="text-slate-400">Tier:</span><span className="font-medium text-slate-200">{dataItem.tier}</span>
          {dataItem.price !== undefined && (<><span className="text-slate-400">Price:</span><span className="font-medium text-slate-200">${dataItem.price.toFixed(2)}</span></>)}
          {dataItem.tdp !== undefined && (<><span className="text-slate-400">TDP:</span><span className="font-medium text-slate-200">{dataItem.tdp}W</span></>)}
          {dataItem.core_count !== undefined && (<><span className="text-slate-400">Cores:</span><span className="font-medium text-slate-200">{dataItem.core_count}</span></>)}
          {dataItem.boost_clock !== undefined && (<><span className="text-slate-400">Boost:</span><span className="font-medium text-slate-200">{dataItem.boost_clock}GHz</span></>)}
        </div>
      </div>
    );
  }
  return null;
};

const TierBarChart: React.FC<TierBarChartProps> = ({ data = sampleCpuData, viewMode = 'performance' }) => {
  const processedData = useMemo(() => {
    return data
      .map(item => ({
        ...item,
        score: viewMode === 'performance' ? (item.performance_score || 0) : (item.value_score || 0),
        brand: (item.brand?.toUpperCase().includes('INTEL') ? 'Intel' : 
               item.brand?.toUpperCase().includes('AMD') ? 'AMD' : 
               (item.brand?.toUpperCase().includes('NVIDIA') || item.brand?.toUpperCase().includes('GEFORCE')) ? 'NVIDIA' : 'Other'),
        tier_display_name: item.name, // Keep original name for Y-axis dataKey
      }))
      .sort((a, b) => {
        const tierAOrder = TIER_STYLES[a.tier]?.order || TIER_STYLES.DEFAULT.order;
        const tierBOrder = TIER_STYLES[b.tier]?.order || TIER_STYLES.DEFAULT.order;
        if (tierAOrder !== tierBOrder) {
          return tierAOrder - tierBOrder;
        }
        return b.score - a.score;
      })
      // .slice(0, 20); // Optional: limit number of items displayed
  }, [data, viewMode]);

  if (processedData.length === 0) {
    return <div className="text-center text-slate-400 py-10 text-sm">No data to display for the current filter.</div>;
  }
  
  const tierAreas = useMemo(() => {
    const areas: { y1: string; y2: string; tier: string }[] = [];
    if (processedData.length === 0) return areas;

    let currentTier = processedData[0].tier;
    let tierStartIndex = 0;

    for (let i = 1; i < processedData.length; i++) {
      if (processedData[i].tier !== currentTier) {
        areas.push({
          y1: processedData[i - 1].tier_display_name, 
          y2: processedData[tierStartIndex].tier_display_name, 
          tier: currentTier,
        });
        currentTier = processedData[i].tier;
        tierStartIndex = i;
      }
    }
    areas.push({
      y1: processedData[processedData.length - 1].tier_display_name,
      y2: processedData[tierStartIndex].tier_display_name,
      tier: currentTier,
    });
    return areas;
  }, [processedData]);

  return (
    <div className="bg-slate-800/60 p-3 sm:p-4 rounded-lg shadow-xl border border-slate-700/70 h-[600px] md:h-[calc(100vh-200px)] min-h-[500px] max-h-[1200px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={processedData}
          layout="vertical"
          margin={{ top: 20, right: 40, left: 10, bottom: 5 }}
          barSize={18} // Further reduced for compactness with many items
        >
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(71, 85, 105, 0.5)" horizontal={true} vertical={false}/>
          
          {tierAreas.map((area, index) => (
            <ReferenceArea
              key={`tier-area-${index}`}
              y1={area.y1}
              y2={area.y2}
              ifOverflow="extendDomain"
              fill={TIER_STYLES[area.tier]?.lightBgColor || TIER_STYLES.DEFAULT.lightBgColor}
              stroke={TIER_STYLES[area.tier]?.borderColor || TIER_STYLES.DEFAULT.borderColor}
              strokeOpacity={0.5}
              strokeWidth={1}
              label={{
                value: TIER_STYLES[area.tier]?.name || area.tier,
                position: 'insideTopLeft', 
                fill: TIER_STYLES[area.tier]?.labelColor || TIER_STYLES.DEFAULT.labelColor, 
                fontSize: 11, 
                fontWeight: 600,
                dy: 10, 
                dx: 15,
                offset: 10,
              }}
            />
          ))}

          <XAxis 
            type="number" 
            stroke="#718096" // slate-500
            tick={{ fontSize: 9, fill: '#A0AEC0' }} // slate-400
            axisLine={{ stroke: "#4A5568" }} // slate-600
            tickLine={{ stroke: "#4A5568" }}
            allowDecimals={false}
            domain={['auto', 'auto']} // Ensure X-axis starts from a sensible value, not necessarily 0
            // tickFormatter={(tick) => tick > 0 ? tick : ''} // Hide 0 tick if desired
          />
          <YAxis
            dataKey="tier_display_name" // Use the original name for dataKey
            type="category"
            stroke="#718096"
            tickLine={false}
            axisLine={false}
            tick={(props) => {
              const { x, y, index } = props; // payload is not always reliable for custom ticks with ReferenceArea
              const item = processedData[index];
              if (!item) return null;
              return (
                <g transform={`translate(${x},${y})`}>
                  <text x={-5} y={0} dy={3.5} textAnchor="end" fill="#CBD5E1" fontSize={9.5} fontWeight={300}>
                    {formatYAxisTick(item.name, item.brand)}
                  </text>
                </g>
              );
            }}
            width={110} // Adjusted for potentially longer truncated names + initial
            interval={0} 
            scale="band" // Ensures category spacing
          />
          <Tooltip 
            content={<CustomTooltipContent />} 
            cursor={{ fill: 'rgba(75, 85, 99, 0.1)' }} // gray-600/10
            animationDuration={200}
            wrapperStyle={{ outline: 'none' }}
          />
          
          <Bar dataKey="score" radius={[0, 3, 3, 0]} animationDuration={500} minPointSize={2}>
            {processedData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getBrandColor(entry.brand)} />
            ))}
            <LabelList 
              dataKey="score" 
              position="insideRight" // Changed to insideRight for better fit
              offset={-8} // Negative offset to pull it leftwards inside the bar
              formatter={(value: number) => `${value}`}
              style={{ fontSize: '9px', fill: 'white', fontWeight: 500, pointerEvents: 'none' }}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TierBarChart;

// How to use in your page (example):
// import TierBarChart, { ChartViewMode, CpuDataItem } from './path/to/TierBarChart';
// ...
// const [viewMode, setViewMode] = useState<ChartViewMode>('performance');
// const [cpuList, setCpuList] = useState<CpuDataItem[]>([]); 
// // Ensure cpuList is populated with data matching CpuDataItem structure including 'tier'
// ...
// <TierBarChart data={cpuList} viewMode={viewMode} />
// <button onClick={() => setViewMode(prev => prev === 'performance' ? 'value' : 'performance')}>
//   Toggle View: {viewMode === 'performance' ? 'Value' : 'Performance'}
// </button> 