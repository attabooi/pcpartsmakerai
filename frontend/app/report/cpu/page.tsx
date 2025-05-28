"use client";

import { useState, useEffect, useMemo } from 'react';
import { db } from '../../../lib/firebase';
import { collection, getDocs, query } from "firebase/firestore";
import { Loader2, ServerCrash, Info, TrendingUp, DollarSign, Cpu as CpuIcon, CalendarDays, GitMerge } from 'lucide-react';

interface CpuData {
  id: string;
  name: string;
  price?: number;
  performance_score?: number;
  performance_tier?: 'S' | 'A' | 'B' | 'C' | string;
  value_score?: number;
  value_tier?: 'S' | 'A' | 'B' | 'C' | string;
  brand?: 'Intel' | 'AMD' | string; 
  core_count?: number;
  thread_count?: number;
  release_date?: string; 
}

type ViewMode = 'performance' | 'value';

interface GroupedCpus {
  S: CpuData[];
  A: CpuData[];
  B: CpuData[];
  C: CpuData[];
  [key: string]: CpuData[];
}

const TIER_CONFIG: { [key in 'S' | 'A' | 'B' | 'C' | string]: { label: string; color: string; textColor: string; borderColor: string; order: number } } = {
  S: { label: 'S', color: 'bg-amber-500/10', textColor: 'text-amber-400', borderColor: 'border-amber-500/50', order: 1 },
  A: { label: 'A', color: 'bg-purple-500/10', textColor: 'text-purple-400', borderColor: 'border-purple-500/50', order: 2 },
  B: { label: 'B', color: 'bg-blue-500/10', textColor: 'text-blue-400', borderColor: 'border-blue-500/50', order: 3 },
  C: { label: 'C', color: 'bg-green-500/10', textColor: 'text-green-400', borderColor: 'border-green-500/50', order: 4 },
  default: { label: '?', color: 'bg-gray-500/10', textColor: 'text-gray-400', borderColor: 'border-gray-500/50', order: 5 },
};

const TIER_ORDER: ('S' | 'A' | 'B' | 'C')[] = ['S', 'A', 'B', 'C'];

const BRAND_COLORS: { [key: string]: string } = {
  AMD: 'border-red-500',
  Intel: 'border-blue-500',
  default: 'border-gray-500' 
};

const CpuCard = ({ cpu, viewMode }: { cpu: CpuData; viewMode: ViewMode }) => {
  const tier = viewMode === 'performance' ? cpu.performance_tier : cpu.value_tier;
  const tierStyling = TIER_CONFIG[tier || 'default'] || TIER_CONFIG.default;
  const score = viewMode === 'performance' ? cpu.performance_score : cpu.value_score;
  const brandBorderColor = BRAND_COLORS[cpu.brand || 'default'] || BRAND_COLORS.default;

  return (
    <div className={`relative group bg-card-bg border ${tierStyling.borderColor} rounded-lg shadow-md p-3 transition-all duration-200 ease-in-out hover:shadow-xl hover:scale-[1.02]`}>
      <div className={`absolute top-0 left-0 h-full w-1.5 ${brandBorderColor} rounded-l-lg`}></div>
      <div className="pl-2">
        <h3 className={`text-base font-semibold truncate ${tierStyling.textColor} mb-1`} title={cpu.name}>{cpu.name}</h3>
        <p className="text-sm text-secondary-text mb-2">
          {viewMode === 'performance' ? 'Perf. Score' : 'Value Score'}: <span className="font-medium text-primary-text">{score !== undefined ? score : 'N/A'}</span>
        </p>
        <div className="text-xs text-secondary-text/80">
          {cpu.price !== undefined && <p>Price: <span className="font-medium text-primary-text">${cpu.price}</span></p>}
          <p>Tier: <span className="font-medium" style={{ color: tierStyling.textColor.replace('text-', '') }}>{tier || 'N/A'}</span></p>
        </div>
      </div>
      {/* Hover Tooltip for extra details */}
      <div className="absolute z-10 bottom-full mb-2 left-1/2 -translate-x-1/2 w-max max-w-xs bg-content-bg border border-card-border p-2.5 rounded-md shadow-lg 
                      opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none group-hover:pointer-events-auto">
        <p className="text-sm font-semibold text-primary-text mb-1.5">{cpu.name} - Details</p>
        <div className="text-xs space-y-1 text-secondary-text">
          {cpu.core_count && <div><CpuIcon size={12} className="inline mr-1.5" />Cores: <span className="text-primary-text">{cpu.core_count}</span></div>}
          {cpu.thread_count && <div><GitMerge size={12} className="inline mr-1.5" />Threads: <span className="text-primary-text">{cpu.thread_count}</span></div>}
          {cpu.release_date && <div><CalendarDays size={12} className="inline mr-1.5" />Released: <span className="text-primary-text">{cpu.release_date}</span></div>}
          {!cpu.core_count && !cpu.thread_count && !cpu.release_date && <p>No additional details available.</p>}
        </div>
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-2 h-2 bg-content-bg border-b border-r border-card-border rotate-45"></div> {/* Tooltip arrow */}
      </div>
    </div>
  );
};

const TierRow = ({ tierLabel, cpus, viewMode }: { tierLabel: 'S' | 'A' | 'B' | 'C' | string; cpus: CpuData[]; viewMode: ViewMode }) => {
  const tierStyling = TIER_CONFIG[tierLabel] || TIER_CONFIG.default;

  return (
    <div className="mb-8 last:mb-0">
      <div className="flex items-start">
        <div className={`w-16 md:w-20 h-auto sticky top-24 flex-shrink-0 flex flex-col items-center justify-center py-4 ${tierStyling.color} rounded-l-xl border-t border-b border-l ${tierStyling.borderColor} shadow-sm`}>
          <span className={`text-4xl md:text-5xl font-bold ${tierStyling.textColor}`}>{tierStyling.label}</span>
        </div>
        <div className={`flex-grow p-4 md:p-5 ${tierStyling.color} border-t border-b border-r ${tierStyling.borderColor} rounded-r-xl min-h-[120px]`}>
          {cpus.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {cpus.map(cpu => (
                <CpuCard key={cpu.id} cpu={cpu} viewMode={viewMode} />
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center h-full min-h-[80px]">
              <p className="text-secondary-text italic">No CPUs in this tier for the current view.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default function CpuTierReportPage() {
  const [cpus, setCpus] = useState<CpuData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('performance');

  useEffect(() => {
    const fetchCpus = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const cpuCollectionRef = collection(db, "parts/cpu/items");
        const q = query(cpuCollectionRef);
        const querySnapshot = await getDocs(q);
        const fetchedCpus = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as CpuData));
        setCpus(fetchedCpus);
      } catch (err) {
        console.error("Error fetching CPU data:", err);
        setError("Failed to load CPU data. Please try again later.");
      }
      setIsLoading(false);
    };
    fetchCpus();
  }, []);

  const groupedAndSortedCpus = useMemo((): GroupedCpus => {
    const initialGroups: GroupedCpus = { S: [], A: [], B: [], C: [] };
    const filteredCpus = cpus.filter(cpu => {
      const tier = viewMode === 'performance' ? cpu.performance_tier : cpu.value_tier;
      const score = viewMode === 'performance' ? cpu.performance_score : cpu.value_score;
      return tier && score !== undefined && TIER_ORDER.includes(tier as 'S' | 'A' | 'B' | 'C');
    });

    const grouped = filteredCpus.reduce((acc, cpu) => {
      const tierKey = (viewMode === 'performance' ? cpu.performance_tier : cpu.value_tier) as 'S' | 'A' | 'B' | 'C';
      if (tierKey && acc[tierKey]) {
        acc[tierKey].push(cpu);
      } else if (tierKey) {
        acc[tierKey] = [cpu];
      }
      return acc;
    }, initialGroups);

    for (const tier in grouped) {
      grouped[tier].sort((a, b) => {
        const scoreA = (viewMode === 'performance' ? a.performance_score : a.value_score) || 0;
        const scoreB = (viewMode === 'performance' ? b.performance_score : b.value_score) || 0;
        return scoreB - scoreA; // Descending
      });
    }
    return grouped;
  }, [cpus, viewMode]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-brand-bg text-primary-text p-4">
        <Loader2 className="w-16 h-16 animate-spin text-accent-blue mb-4" />
        <p className="text-xl">Loading CPU Tier Report...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-brand-bg text-red-500 p-4">
        <ServerCrash className="w-16 h-16 mb-4" />
        <p className="text-xl text-center">{error}</p>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-content-bg text-primary-text p-4 md:p-8 font-sans">
      <header className="mb-8 md:mb-12">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-3">CPU Tier Report</h1>
        <p className="text-center text-secondary-text text-sm md:text-base max-w-2xl mx-auto">
          Explore CPU rankings based on performance or value. Tiers (S, A, B, C) group similar performing CPUs, sorted by score within each tier.
        </p>
      </header>

      <div className="flex justify-center items-center space-x-2 sm:space-x-4 mb-8 md:mb-12 sticky top-4 bg-content-bg/80 backdrop-blur-md py-3 z-20 rounded-lg shadow-sm">
        <button
          onClick={() => setViewMode('performance')}
          className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg transition-all duration-200 ease-in-out flex items-center space-x-2 text-xs sm:text-sm font-medium
                      ${viewMode === 'performance' 
                        ? 'bg-accent-blue text-white shadow-lg scale-105' 
                        : 'bg-card-bg text-secondary-text hover:bg-card-bg-hover hover:text-primary-text border border-card-border'}`}
        >
          <TrendingUp size={16} />
          <span>Performance</span>
        </button>
        <button
          onClick={() => setViewMode('value')}
          className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg transition-all duration-200 ease-in-out flex items-center space-x-2 text-xs sm:text-sm font-medium
                      ${viewMode === 'value' 
                        ? 'bg-accent-purple text-white shadow-lg scale-105' 
                        : 'bg-card-bg text-secondary-text hover:bg-card-bg-hover hover:text-primary-text border border-card-border'}`}
        >
          <DollarSign size={16} />
          <span>Value for Money</span>
        </button>
      </div>
      
      <div className="max-w-6xl mx-auto">
        {cpus.length === 0 && !isLoading && !error && (
          <div className="text-center py-12 bg-card-bg rounded-lg shadow-md">
             <Info size={52} className="mx-auto text-accent-blue mb-5" />
            <p className="text-2xl text-primary-text mb-2.5">No CPU Data Available</p>
            <p className="text-secondary-text">Could not find any CPU entries in the database at this time.</p>
          </div>
        )}

        {TIER_ORDER.map(tierKey => (
          <TierRow 
            key={tierKey}
            tierLabel={tierKey}
            cpus={groupedAndSortedCpus[tierKey] || []}
            viewMode={viewMode}
          />
        ))}
      </div>

      <footer className="mt-16 text-center text-xs text-secondary-text/70 py-6 border-t border-card-border">
        <p>CPU data is grouped into tiers (S, A, B, C) and sorted by score within each tier. Brand indicators: <span className="inline-block w-2 h-2 bg-blue-500 rounded-full"></span> Intel, <span className="inline-block w-2 h-2 bg-red-500 rounded-full"></span> AMD.</p>
        <p>Scores, tiers, and additional details are indicative and for demonstration purposes. Verify information before making purchasing decisions.</p>
        <p>&copy; {new Date().getFullYear()} pcpartsmakerAI. All rights reserved.</p>
      </footer>
    </div>
  );
}
