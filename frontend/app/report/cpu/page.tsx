"use client";

import { useState, useEffect, useMemo } from 'react';
import { db } from '../../../lib/firebase'; // Adjusted path assuming lib is at project root
import { collection, getDocs, query, orderBy as firestoreOrderBy } from "firebase/firestore"; // Renamed orderBy to avoid conflict
import { Loader2, ServerCrash, Info, TrendingUp, DollarSign } from 'lucide-react';

interface CpuData {
  id: string;
  name: string;
  price?: number;
  performance_score?: number;
  performance_tier?: 'S' | 'A' | 'B' | 'C' | string; // Allow string for flexibility
  value_score?: number;
  value_tier?: 'S' | 'A' | 'B' | 'C' | string;
  // Add any other relevant fields like boost_clock, core_count if needed for tooltips or display
}

type ViewMode = 'performance' | 'value';

interface GroupedCpus {
  S: CpuData[];
  A: CpuData[];
  B: CpuData[];
  C: CpuData[];
  [key: string]: CpuData[]; // For other potential tiers
}

const TIER_CONFIG: { [key in 'S' | 'A' | 'B' | 'C' | string]: { label: string; color: string; textColor: string; borderColor: string; order: number } } = {
  S: { label: 'S', color: 'bg-amber-500/10', textColor: 'text-amber-400', borderColor: 'border-amber-500/50', order: 1 },
  A: { label: 'A', color: 'bg-purple-500/10', textColor: 'text-purple-400', borderColor: 'border-purple-500/50', order: 2 },
  B: { label: 'B', color: 'bg-blue-500/10', textColor: 'text-blue-400', borderColor: 'border-blue-500/50', order: 3 },
  C: { label: 'C', color: 'bg-green-500/10', textColor: 'text-green-400', borderColor: 'border-green-500/50', order: 4 },
  // Fallback for unexpected tiers
  default: { label: '?', color: 'bg-gray-500/10', textColor: 'text-gray-400', borderColor: 'border-gray-500/50', order: 5 },
};

const TIER_ORDER: ('S' | 'A' | 'B' | 'C')[] = ['S', 'A', 'B', 'C'];

const CpuCard = ({ cpu, viewMode }: { cpu: CpuData; viewMode: ViewMode }) => {
  const tier = viewMode === 'performance' ? cpu.performance_tier : cpu.value_tier;
  const tierStyling = TIER_CONFIG[tier || 'default'] || TIER_CONFIG.default;
  
  const score = viewMode === 'performance' ? cpu.performance_score : cpu.value_score;
  
  const tooltipText = [
    `Name: ${cpu.name}`,
    `${viewMode === 'performance' ? 'Perf. Score' : 'Value Score'}: ${score !== undefined ? score : 'N/A'}`,
    `Price: ${cpu.price !== undefined ? '$' + cpu.price : 'N/A'}`,
    `Tier (${viewMode}): ${tier || 'N/A'}`
  ].join('\n');

  return (
    <div
      title={tooltipText}
      className={`min-w-[150px] max-w-[200px] h-20 flex flex-col justify-center items-center p-2 rounded-lg shadow-md border transition-all duration-200 ease-in-out hover:shadow-lg hover:scale-105 cursor-help ${tierStyling.color} ${tierStyling.borderColor}`}
    >
      <p className={`text-sm font-semibold truncate w-full text-center ${tierStyling.textColor}`}>{cpu.name}</p>
      <p className="text-xs text-secondary-text/80">
        {viewMode === 'performance' ? 'Score' : 'Value'}: {score !== undefined ? score : 'N/A'}
      </p>
    </div>
  );
};

const TierRow = ({ tierLabel, cpus, viewMode }: { tierLabel: 'S' | 'A' | 'B' | 'C' | string; cpus: CpuData[]; viewMode: ViewMode }) => {
  const tierStyling = TIER_CONFIG[tierLabel] || TIER_CONFIG.default;

  return (
    <div className="mb-6 last:mb-0">
      <div className="flex items-stretch">
        <div className={`w-16 md:w-20 flex-shrink-0 flex flex-col items-center justify-center ${tierStyling.color} rounded-l-lg border-y border-l ${tierStyling.borderColor}`}>
          <span className={`text-3xl md:text-4xl font-bold ${tierStyling.textColor}`}>{tierStyling.label}</span>
        </div>
        <div className={`flex-grow p-3 md:p-4 ${tierStyling.color} border-y border-r ${tierStyling.borderColor} rounded-r-lg min-h-[100px]`}>
          {cpus.length > 0 ? (
            <div className="flex space-x-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-card-border scrollbar-track-transparent">
              {cpus.map(cpu => (
                <CpuCard key={cpu.id} cpu={cpu} viewMode={viewMode} />
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
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
        // Basic query, sorting can be done client-side after grouping for simplicity here
        // Or, if data is massive, consider more complex Firestore queries.
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
      return tier && score !== undefined && TIER_ORDER.includes(tier as 'S'|'A'|'B'|'C');
    });

    const grouped = filteredCpus.reduce((acc, cpu) => {
      const tierKey = (viewMode === 'performance' ? cpu.performance_tier : cpu.value_tier) as 'S' | 'A' | 'B' | 'C';
      if (tierKey && acc[tierKey]) {
        acc[tierKey].push(cpu);
      } else if (tierKey) { // Handle unexpected tiers if any, though filtered out above.
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
      <header className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-2">CPU Tier Report</h1>
        <p className="text-center text-secondary-text text-sm md:text-base max-w-2xl mx-auto">
          Explore CPU rankings based on performance or value. Tiers (S, A, B, C) group similar performing CPUs, sorted by score within each tier.
        </p>
      </header>

      <div className="flex justify-center items-center space-x-2 sm:space-x-4 mb-8">
        <button
          onClick={() => setViewMode('performance')}
          className={`px-4 py-2 rounded-lg transition-all duration-200 ease-in-out flex items-center space-x-2 text-sm sm:text-base
                      ${viewMode === 'performance' 
                        ? 'bg-accent-blue text-white shadow-lg scale-105' 
                        : 'bg-card-bg text-secondary-text hover:bg-card-bg-hover hover:text-primary-text border border-card-border'}`}
        >
          <TrendingUp size={18} />
          <span>Performance</span>
        </button>
        <button
          onClick={() => setViewMode('value')}
          className={`px-4 py-2 rounded-lg transition-all duration-200 ease-in-out flex items-center space-x-2 text-sm sm:text-base
                      ${viewMode === 'value' 
                        ? 'bg-accent-purple text-white shadow-lg scale-105' 
                        : 'bg-card-bg text-secondary-text hover:bg-card-bg-hover hover:text-primary-text border border-card-border'}`}
        >
          <DollarSign size={18} />
          <span>Value for Money</span>
        </button>
      </div>
      
      <div className="max-w-4xl mx-auto">
        {cpus.length === 0 && !isLoading && !error && (
          <div className="text-center py-10 bg-card-bg rounded-lg shadow">
             <Info size={48} className="mx-auto text-accent-blue mb-4" />
            <p className="text-xl text-primary-text mb-2">No CPU Data Available</p>
            <p className="text-secondary-text">Could not find any CPU entries in the database.</p>
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

      <footer className="mt-12 text-center text-xs text-secondary-text/70">
        <p>CPU data is grouped into tiers (S, A, B, C) and sorted by score within each tier.</p>
        <p>Scores and tiers are indicative and may vary based on specific benchmarks and methodologies.</p>
        <p>&copy; {new Date().getFullYear()} pcpartsmakerAI. All rights reserved.</p>
      </footer>
    </div>
  );
}
