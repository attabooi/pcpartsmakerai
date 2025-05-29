"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { db } from '../../lib/firebase'; // Adjust path if your firebase.ts is elsewhere
import { collection, getDocs, query, where, orderBy, limit } from "firebase/firestore";
import {
  Cpu as CpuIcon,
  ShieldCheck as GpuIcon,
  DatabaseZap as RamIcon, // Using DatabaseZap for RAM/Storage
  HardDrive as StorageIcon,
  Settings as MotherboardIcon, // Use Settings icon for Motherboard
  Power as PowerSupplyIcon,
  Box as CaseIcon,
  Fan as CoolingIcon,
  Loader2,
  Info,
  CalendarDays,
  GitMerge,
  Cpu as ActualCpuIcon // Explicit for tooltip
} from 'lucide-react';

interface PartData {
  id: string;
  name: string;
  price?: number;
  performance_score?: number; // Assuming this is the primary score for S-tier ranking
  performance_tier?: 'S' | 'A' | 'B' | 'C' | string;
  brand?: 'Intel' | 'AMD' | 'NVIDIA' | 'Corsair' | 'Samsung' | string; // For CPU/GPU
  core_count?: number;    // CPU specific
  thread_count?: number;  // CPU specific
  // GPU specific fields (add if needed for tooltip, e.g., vram_gb)
  // RAM specific fields (add if needed, e.g., capacity_gb, speed_mhz)
  release_date?: string; 
  tdp?: string; // Or number
}

const BRAND_COLORS: { [key: string]: string } = {
  AMD: 'text-red-500',
  Intel: 'text-blue-500',
  NVIDIA: 'text-green-500',
  Corsair: 'text-yellow-500',
  Samsung: 'text-sky-500',
  default: 'text-slate-500'
};

const PartCard = ({ part }: { part: PartData }) => {
  const brandTextColor = BRAND_COLORS[part.brand || 'default'] || BRAND_COLORS.default;

  return (
    <div className={`relative group bg-slate-800/70 border border-slate-700/80 rounded-lg p-2 transition-all duration-200 ease-in-out hover:shadow-lg hover:scale-[1.02] min-h-[80px] flex flex-col justify-between cursor-pointer`}>
      <div className="flex justify-between items-center">
        <h3 className={`text-xs font-semibold ${brandTextColor} truncate`} title={part.name}>{part.name}</h3>
        <span className="text-xs font-bold text-sky-200">{part.performance_score !== undefined ? part.performance_score : 'N/A'}</span>
      </div>
      <div className="flex justify-between items-center mt-1">
        <span className={`badge ${part.performance_tier === 'S' ? 'bg-green-500' : part.performance_tier === 'A' ? 'bg-blue-500' : 'bg-yellow-500'} text-white text-[0.6rem] font-semibold rounded-full px-2 py-0.5`}>{part.performance_tier}</span>
      </div>
    </div>
  );
};

interface TierCategoryCardProps {
  icon: React.ElementType;
  title: string;
  description: string;
  collectionPath: string; // e.g., "parts/cpu/items"
  sTierColorAccent?: string; // e.g. text-amber-400 for S-tier section header
  slug: string;
}

const TierCategoryCard = ({ icon: Icon, title, description, collectionPath, sTierColorAccent = 'text-sky-400', slug }: TierCategoryCardProps) => {
  const [sTierItems, setSTierItems] = useState<PartData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTopItems = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const itemsRef = collection(db, collectionPath);
      const q = query(itemsRef, orderBy("performance_score", "desc"), limit(3));
      const querySnapshot = await getDocs(q);
      const items = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as PartData));
      setSTierItems(items);
    } catch (err) {
      console.error(`Error fetching items from ${collectionPath}:`, err);
      setError("Coming Soon");
      setSTierItems([]); 
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchTopItems();
  }, [collectionPath, title]);

  return (
    <div className="bg-slate-800/40 border border-slate-700/70 rounded-lg p-3 shadow-md flex flex-col h-full">
      <div className="flex items-center mb-2">
        <Icon size={20} className={`mr-2 ${sTierColorAccent}`} />
        <h3 className={`text-lg font-semibold text-slate-100`}>{title}</h3>
      </div>
      <p className="text-xs text-slate-400/80 mb-3 flex-grow">{description}</p>
      {isLoading ? (
        <div className="grid grid-cols-1 gap-1 mt-auto">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-[50px] bg-slate-700/50 rounded-md animate-pulse"></div>
          ))}
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center text-center text-red-400/80 mt-auto py-2">
          <Info size={18} className="mb-1" />
          <p className="text-xs">{error}</p>
        </div>
      ) : sTierItems.length > 0 ? (
        <div className="grid grid-cols-3 gap-2">
          {sTierItems.map(item => (
            <PartCard key={item.id} part={item} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center text-center text-slate-500 mt-auto py-2">
          <Info size={18} className="mb-1" />
          <p className="text-xs">No items found for preview.</p>
        </div>
      )}
      <Link href={`/report/${slug}`} 
        className="block text-center mt-3 text-xs font-medium text-sky-400 hover:text-sky-300 transition-colors duration-150">
        View Full {title} &rarr;
      </Link>
    </div>
  );
};

const TierListSectionLanding = () => {
  return (
    <section id="tier-lists" className="py-20 md:py-28 lg:py-32 bg-black font-sans">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-100">Component Tier Lists</h2>
          <p className="text-base sm:text-lg text-slate-400/80 mt-3 md:mt-4 max-w-xl lg:max-w-2xl mx-auto">
            Instantly compare parts with our dynamic, S-A-B-C tiering system. Top S-Tier previews shown below.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 items-stretch">
          <TierCategoryCard 
            icon={CpuIcon} 
            title="CPU Tiers"
            description="Processors ranked by performance and value. Find the best CPU for gaming, streaming, or productivity."
            collectionPath="cpu"
            sTierColorAccent="text-amber-400"
            slug="cpu"
          />
          <TierCategoryCard 
            icon={GpuIcon} 
            title="GPU Tiers" 
            description="Graphics cards tiered for raw gaming power and visual fidelity. See how the latest GPUs stack up."
            collectionPath="video-card"
            sTierColorAccent="text-purple-400"
            slug="video-card"
          />
          <TierCategoryCard 
            icon={RamIcon} 
            title="RAM & Storage Tiers" 
            description="Memory and SSDs compared for speed and capacity. Optimize your system's responsiveness."
            collectionPath="memory"
            sTierColorAccent="text-green-400"
            slug="memory"
          />
          <TierCategoryCard 
            icon={StorageIcon} 
            title="Storage Tiers" 
            description="SSDs and HDDs ranked by speed and capacity. Find the best storage solution for your needs."
            collectionPath="internal-hard-drive"
            sTierColorAccent="text-blue-400"
            slug="internal-hard-drive"
          />
          <TierCategoryCard 
            icon={MotherboardIcon} 
            title="Motherboard Tiers" 
            description="Motherboards evaluated for compatibility and features. Choose the right foundation for your build."
            collectionPath="cpu-cooler"
            sTierColorAccent="text-red-400"
            slug="cpu-cooler"
          />
          <TierCategoryCard 
            icon={PowerSupplyIcon} 
            title="Power Supply Tiers" 
            description="Power supplies rated for efficiency and reliability. Ensure stable power delivery to your components."
            collectionPath="power-supply"
            sTierColorAccent="text-yellow-400"
            slug="power-supply"
          />
          <TierCategoryCard 
            icon={CaseIcon} 
            title="Case Tiers" 
            description="PC cases assessed for airflow and aesthetics. Find the perfect case to showcase your build."
            collectionPath="case"
            sTierColorAccent="text-pink-400"
            slug="case"
          />
          <TierCategoryCard 
            icon={CoolingIcon} 
            title="Cooling Tiers" 
            description="Cooling solutions ranked by performance and noise levels. Keep your system cool and quiet."
            collectionPath="cpu-cooler"
            sTierColorAccent="text-teal-400"
            slug="cpu-cooler"
          />
        </div>
      </div>
    </section>
  );
};

export default TierListSectionLanding; 