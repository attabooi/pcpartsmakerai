"use client";
import Link from "next/link";
import { ShieldCheck, BarChartBig, DatabaseZap, Cpu, Zap, Bot, ArrowRight, Layers, Search, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { db } from "../lib/firebase"; // Corrected path
import { collection, getDocs, query, where, orderBy, limit } from "firebase/firestore";

// Header Component
const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 \
                  ${isScrolled ? 'bg-brand-bg/80 backdrop-blur-lg shadow-lg' : 'bg-transparent'}`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center space-x-2">
            <Layers size={28} className="text-accent-blue" />
            <span className="text-xl font-bold text-primary-text">pcpartsmakerAI</span>
          </Link>
          <nav className="hidden md:flex space-x-2 lg:space-x-3">
            {[{ href: "#tier-lists", label: "Tier Lists" }, { href: "#data-report", label: "Data Report" }, { href: "#build-pc", label: "Build My PC" }].map((item) => (
              <Link 
                key={item.label} 
                href={item.href}
                className="px-3 py-2 rounded-md text-sm font-medium text-secondary-text hover:text-primary-text hover:bg-card-bg-hover transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <Link 
            href="#build-pc" // Or a dedicated sign-up/login page
            className="hidden md:inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-accent-blue hover:bg-opacity-80 transition-colors"
          >
            Get Started
          </Link>
          {/* Mobile Menu Button (optional) */}
        </div>
      </div>
    </header>
  );
};

// Hero Section Component
const HeroSection = () => (
  <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-28 bg-gradient-to-b from-brand-bg via-brand-bg to-content-bg text-center">
    <div className="absolute inset-0 opacity-10 bg-[url('/grid-pattern.svg')] bg-repeat"></div> {/* Optional grid pattern */}
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
      <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-primary-text mb-6">
        Build Smarter. <span className="text-accent-blue">Compare Better.</span>
      </h1>
      <p className="max-w-xl lg:max-w-2xl mx-auto text-lg sm:text-xl text-secondary-text mb-10">
        AI-powered tier lists and builds for your next gaming PC. Stop guessing, start dominating.
      </p>
      <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
        <Link 
          href="#tier-lists"
          className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3.5 border border-transparent text-base font-medium rounded-lg shadow-lg text-white bg-accent-blue hover:bg-opacity-80 transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-blue focus:ring-offset-brand-bg"
        >
          Browse Tier Lists <ArrowRight size={20} className="ml-2" />
        </Link>
        <Link 
          href="#build-pc"
          className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3.5 border border-card-border text-base font-medium rounded-lg shadow-lg text-primary-text bg-card-bg hover:bg-card-bg-hover transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-purple focus:ring-offset-brand-bg relative group"
        >
          Try AI Build Generator
          <span className="absolute -top-2 -right-3 bg-accent-purple text-white text-xs font-semibold px-2 py-0.5 rounded-full group-hover:scale-110 transition-transform">
            PREMIUM
          </span>
        </Link>
      </div>
    </div>
  </section>
);

// Base Feature Card Component (for structure and style)
interface BaseFeatureCardProps {
  icon: React.ElementType;
  title: string;
  description: string;
  children?: React.ReactNode;
  className?: string;
  href?: string; 
}
const BaseFeatureCard = ({ icon: Icon, title, description, children, className = "", href }: BaseFeatureCardProps) => {
  const cardContent = (
    <div className={`bg-card-bg border border-card-border rounded-card p-6 shadow-card-soft transition-all hover:shadow-lg hover:border-accent-blue/50 group transform hover:-translate-y-1 h-full flex flex-col ${className}`}>
      <div className="flex items-center text-accent-blue mb-4">
        <Icon size={28} className="mr-3 transition-transform group-hover:scale-110 flex-shrink-0" />
        <h3 className="text-xl font-semibold text-primary-text">{title}</h3>
      </div>
      <p className="text-secondary-text mb-4 text-sm flex-grow">{description}</p>
      {children}
    </div>
  );
  if (href) {
    return <Link href={href} className="block focus:outline-none focus:ring-2 focus:ring-accent-blue focus:ring-offset-2 focus:ring-offset-content-bg rounded-card h-full">{cardContent}</Link>;
  }
  return <div className="h-full">{cardContent}</div>;
};

// Tier List Preview Item (Static styling, dynamic data)
const TierListPreviewItem = ({ name, color, tierLabel = "S" }: { name: string, color: string, tierLabel?: string }) => (
  <div 
    style={{ backgroundColor: color }} 
    className="px-3 py-1.5 rounded-md text-sm font-medium text-white shadow-sm flex items-center justify-between mb-2 last:mb-0 opacity-90 group-hover:opacity-100 transition-opacity truncate"
  >
    <span className="truncate" title={name}>{name}</span>
    <span className="text-xs opacity-70 flex-shrink-0 ml-2">Tier {tierLabel}</span>
  </div>
);

// Skeleton Loader for TierListPreviewItem
const TierListPreviewSkeleton = () => (
  <div className="bg-gray-700/50 animate-pulse px-3 py-1.5 rounded-md mb-2 last:mb-0 h-[34px]"></div>
);

// New DynamicTierFeatureCard component for fetching S-Tier items
interface DynamicTierFeatureCardProps {
  icon: React.ElementType;
  title: string;
  description: string;
  collectionPath: string;
  reportPath: string;
  sTierColor: string;
}

interface FetchedItemData {
  name: string;
  tier?: string; // Make tier optional as it's used for filtering
  score?: number; // Make score optional as it's used for ordering
  // Potentially other fields, but name is crucial for display
}

interface FetchedItem extends FetchedItemData {
  id: string;
}

const DynamicTierFeatureCard = ({ icon, title, description, collectionPath, reportPath, sTierColor }: DynamicTierFeatureCardProps) => {
  const [sTierItems, setSTierItems] = useState<FetchedItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorOccurred, setErrorOccurred] = useState(false);

  useEffect(() => {
    const fetchSTierItems = async () => {
      setIsLoading(true);
      setErrorOccurred(false);
      console.log(`Fetching S-Tier items from ${collectionPath}...`); // Debug log
      try {
        const itemsRef = collection(db, collectionPath);
        // Ensure field names and values match your Firestore exactly
        const q = query(itemsRef, 
                        where("tier", "==", "S"), // Case-sensitive field name and value
                        orderBy("score", "desc"), // Field for ordering
                        limit(3));
        const querySnapshot = await getDocs(q);
        
        console.log(`Query to ${collectionPath} snapshot empty:`, querySnapshot.empty); // Debug log
        console.log(`Query to ${collectionPath} snapshot size:`, querySnapshot.size); // Debug log

        const items = querySnapshot.docs.map(doc => {
          const data = doc.data() as FetchedItemData;
          console.log(`Fetched doc from ${collectionPath}:`, { id: doc.id, ...data }); // Debug log for each doc
          return { id: doc.id, name: data.name, tier: data.tier, score: data.score }; // Ensure name is mapped
        });
        
        setSTierItems(items);
        if (items.length === 0) {
            console.log(`No S-Tier items found in ${collectionPath} after mapping.`); // Debug log
        }
      } catch (error) {
        console.error(`Error fetching S-Tier items from ${collectionPath}:`, error);
        setErrorOccurred(true);
        setSTierItems([]); 
      }
      setIsLoading(false);
    };
    fetchSTierItems();
  }, [collectionPath]);

  return (
    <BaseFeatureCard icon={icon} title={title} description={description} href={reportPath}>
      <div className="mt-auto pt-4 space-y-2">
        {isLoading ? (
          <>
            <TierListPreviewSkeleton />
            <TierListPreviewSkeleton />
            <TierListPreviewSkeleton />
          </>
        ) : errorOccurred ? (
          <p className="text-sm text-red-500 text-center py-2">Error loading items.</p>
        ) : sTierItems.length > 0 ? (
          sTierItems.map(item => (
            <TierListPreviewItem key={item.id} name={item.name || "Unknown Item"} color={sTierColor} tierLabel="S" />
          ))
        ) : (
          <p className="text-sm text-secondary-text text-center py-2">No S-Tier items found.</p>
        )}
      </div>
    </BaseFeatureCard>
  );
};

// Updated Feature Sections
const TierListsSection = () => (
  <section id="tier-lists" className="py-16 lg:py-24 bg-content-bg">
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h2 className="text-3xl lg:text-4xl font-bold text-primary-text">Tier Lists by Component</h2>
        <p className="text-lg text-secondary-text mt-3 max-w-2xl mx-auto">Instantly see how parts stack up with our dynamic, game-style tiering system.</p>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 items-stretch"> {/* Added items-stretch for equal height cards */}
        <DynamicTierFeatureCard 
          icon={Cpu} 
          title="CPU Tier List" 
          description="Find the perfect processor. Ranked by raw power and value for peak gaming and productivity."
          collectionPath="parts/cpu/items"
          reportPath="/report/cpu"
          sTierColor="#A855F7" // tier-s from tailwind.config.js
        />
        <DynamicTierFeatureCard 
          icon={ShieldCheck} 
          title="GPU Tier List" 
          description="Dominate your games. The latest graphics cards, tiered for ultimate visual performance."
          collectionPath="parts/gpu/items"
          reportPath="/report/gpu"
          sTierColor="#A855F7"
        />
        <DynamicTierFeatureCard 
          icon={BarChartBig} // Consider a RAM or SSD specific icon if available e.g. MemoryStick, HardDrive
          title="RAM & Storage Tiers" 
          description="Speed matters. Compare RAM kits and SSDs for optimal load times and system responsiveness."
          collectionPath="parts/ram/items" // Assuming this is the correct path for RAM/Storage
          reportPath="/report/ram"
          sTierColor="#A855F7"
        />
      </div>
    </div>
  </section>
);

const DataReportSection = () => (
  <section id="data-report" className="py-16 lg:py-24 bg-brand-bg">
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h2 className="text-3xl lg:text-4xl font-bold text-primary-text">Full Hardware Report</h2>
        <p className="text-lg text-secondary-text mt-3 max-w-2xl mx-auto">Dive deep into our comprehensive database. Filter by specs, price, brand, and more.</p>
      </div>
      <div className="bg-card-bg border border-card-border rounded-card p-8 lg:p-12 shadow-card-soft">
        <div className="flex flex-col lg:flex-row items-center">
          <div className="lg:w-1/2 lg:pr-10 mb-6 lg:mb-0">
            <DatabaseZap size={60} className="text-accent-purple mx-auto lg:mx-0 mb-4" />
            <h3 className="text-2xl font-semibold text-primary-text mb-3">Total Component Control</h3>
            <p className="text-secondary-text text-sm leading-relaxed">
              Our extensive hardware database puts all the information you need at your fingertips. No more endless tab-switching.
              Compare detailed specifications, check current market prices, and read user reviews all in one place.
              Filter by brand, socket type, core count, clock speed, VRAM, capacity, and dozens of other parameters to find exactly what you're looking for.
            </p>
          </div>
          <div className="lg:w-1/2">
            {/* Placeholder for an image/animation of the data report UI */}
            <div className="bg-content-bg rounded-lg p-6 h-64 flex items-center justify-center border border-card-border">
              <Search size={48} className="text-secondary-text opacity-50" />
              <p className="ml-4 text-secondary-text">Data Report UI Preview</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

const BuildPcSection = () => (
  <section id="build-pc" className="py-16 lg:py-24 bg-content-bg">
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h2 className="text-3xl lg:text-4xl font-bold text-primary-text">Build Your Dream PC</h2>
        <p className="text-lg text-secondary-text mt-3 max-w-2xl mx-auto">Manually select parts or let our AI co-pilot design the ultimate rig for your budget and needs.</p>
      </div>
      <div className="grid lg:grid-cols-2 gap-8">
        <BaseFeatureCard icon={Zap} title="Manual Builder" description="For the hands-on enthusiast. Pick every component, check compatibility, and fine-tune your build.">
          {/* Placeholder for manual build UI preview */}
          <div className="mt-4 bg-brand-bg rounded-lg p-4 h-48 flex items-center justify-center border border-card-border">
            <Layers size={36} className="text-secondary-text opacity-50" />
            <p className="ml-3 text-secondary-text text-sm">Manual Part Selection UI</p>
          </div>
        </BaseFeatureCard>
        <BaseFeatureCard icon={Bot} title="AI Build Generator (Premium)" description="Describe your dream PC, budget, and target games. Our AI crafts a balanced build for you.">
          {/* Placeholder for AI prompt UI preview */}
          <div className="mt-4 bg-brand-bg rounded-lg p-4 h-48 flex items-center justify-center border border-card-border relative">
             <span className="absolute top-3 right-3 bg-accent-purple text-white text-xs font-semibold px-2 py-0.5 rounded-full">PREMIUM</span>
            <Bot size={36} className="text-secondary-text opacity-50" />
            <p className="ml-3 text-secondary-text text-sm">AI Prompt & Generated Build UI</p>
          </div>
        </BaseFeatureCard>
      </div>
    </div>
  </section>
);

// Footer Component
const Footer = () => (
  <footer className="py-8 bg-brand-bg border-t border-card-border">
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <p className="text-sm text-secondary-text">
        &copy; {new Date().getFullYear()} pcpartsmakerAI. All rights reserved.
      </p>
      <p className="text-xs text-secondary-text/70 mt-1">
        Built with Next.js, TailwindCSS, and lots of <span className="text-red-500">❤</span>.
      </p>
    </div>
  </footer>
);

// Main Page Component
export default function LandingPage() {
  return (
    <div className="font-sans"> {/* Ensure Inter font from layout.tsx is applied */}
      <Header />
      <main>
        <HeroSection />
        <TierListsSection />
        <DataReportSection />
        <BuildPcSection />
      </main>
      <Footer />
    </div>
  );
}
