"use client";

import { useState, useEffect, useMemo } from 'react';
import { db } from '../../../lib/firebase';
import { collection, getDocs, query } from "firebase/firestore";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, Text } from 'recharts';
import { Loader2, ServerCrash } from 'lucide-react';

export interface CpuData {
  id: string;
  name: string;
  brand?: 'Intel' | 'AMD' | string;
  performance_score?: number;
  value_score?: number;
}

export type ViewMode = 'performance' | 'value';

const BRAND_COLORS: { [key: string]: string } = {
  Intel: '#3B82F6',
  AMD: '#F43F5E',
  default: '#94A3B8'
};

const formatCpuName = (name: string) => {
  const parts = name.split(' ');
  return parts.slice(0, 3).join(' ');
};

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-slate-800 border border-slate-600 rounded px-3 py-2 text-xs text-white shadow">
        <p className="font-semibold">{data.name}</p>
        <p>Score: {data.score}</p>
      </div>
    );
  }
  return null;
};

const CpuPerformanceChart = ({ data, viewMode }: { data: CpuData[]; viewMode: ViewMode }) => {
  const chartData = useMemo(() => {
    return data
      .filter(cpu => (viewMode === 'performance' ? cpu.performance_score : cpu.value_score))
      .map(cpu => ({
        name: formatCpuName(cpu.name),
        score: viewMode === 'performance' ? cpu.performance_score! : cpu.value_score!,
        brand: cpu.brand || 'default'
      }))
      .sort((a, b) => b.score - a.score);
  }, [data, viewMode]);

  return (
    <ResponsiveContainer width="100%" height={500}>
      <BarChart
        layout="vertical"
        data={chartData}
        margin={{ top: 10, right: 30, left: 80, bottom: 20 }}
      >
        <XAxis type="number" stroke="#CBD5E1" fontSize={12} />
        <YAxis
          dataKey="name"
          type="category"
          width={150}
          tick={({ x, y, payload }) => (
            <Text x={x} y={y} fill="#CBD5E1" fontSize={12} textAnchor="end" verticalAnchor="middle">
              {payload.value}
            </Text>
          )}
        />
        <Tooltip content={<CustomTooltip />} />
        <Bar dataKey="score" radius={[0, 4, 4, 0]}>
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={BRAND_COLORS[entry.brand] || BRAND_COLORS.default} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export default function CpuGraphPage() {
  const [cpus, setCpus] = useState<CpuData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('performance');

  useEffect(() => {
    const fetchCpus = async () => {
      try {
        const ref = collection(db, "parts/cpu/items");
        const snapshot = await getDocs(query(ref));
        const results = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as CpuData));
        setCpus(results);
      } catch (e) {
        console.error(e);
        setError("Failed to load CPU data.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchCpus();
  }, []);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 px-4 py-6">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold">CPU Tier Report</h1>
        <p className="text-sm text-slate-400">
          Explore CPU rankings based on performance or value. Items are grouped by tiers (S, A, B, C)
          and sorted by score.
        </p>
        <div className="mt-4 space-x-2">
          <button
            onClick={() => setViewMode('performance')}
            className={`px-3 py-1 text-xs rounded-full ${viewMode === 'performance' ? 'bg-sky-500 text-white' : 'bg-slate-700 text-slate-300'}`}
          >
            Performance
          </button>
          <button
            onClick={() => setViewMode('value')}
            className={`px-3 py-1 text-xs rounded-full ${viewMode === 'value' ? 'bg-purple-500 text-white' : 'bg-slate-700 text-slate-300'}`}
          >
            Value
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-sky-500" />
        </div>
      ) : error ? (
        <div className="text-center text-red-500 py-10">
          <ServerCrash className="w-6 h-6 mx-auto mb-2" />
          {error}
        </div>
      ) : (
        <>
          <h2 className="text-lg font-semibold text-center mb-4">CPU Tier Graph</h2>
          <CpuPerformanceChart data={cpus} viewMode={viewMode} />
        </>
      )}
    </div>
  );
}
