"use client";

import Link from "next/link";
import { ArrowRight, Cpu, Layers, Zap, Bot } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative bg-gradient-to-br from-gray-900 via-gray-850 to-slate-900 text-primary-text py-24 sm:py-32 lg:py-40 overflow-hidden font-sans">
      {/* Decorative Background Elements - Abstracted Mockups */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 transform-gpu overflow-hidden blur-3xl"
      >
        <div
          className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#264DFF] to-[#7C2AFF] opacity-15 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
          style={{
            clipPath:
              'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
          }}
        />
      </div>
      
      {/* Faded Tier List Mockup - Left */}
      <div className="absolute top-1/4 left-0 -translate-x-1/3 opacity-5 group-hover:opacity-10 transition-opacity duration-500 hidden lg:block select-none pointer-events-none" aria-hidden="true">
        <div className="w-72 h-96 bg-slate-700/30 backdrop-blur-sm rounded-xl p-6 shadow-2xl transform -rotate-6">
          <Layers size={48} className="text-slate-500/50 mb-4" />
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-10 bg-slate-600/40 rounded-md"></div>
            ))}
            <div className="h-10 bg-slate-600/30 rounded-md w-3/4"></div>
          </div>
        </div>
      </div>

      {/* Faded PC Build Mockup - Right */}
      <div className="absolute top-1/3 right-0 translate-x-1/3 opacity-5 group-hover:opacity-10 transition-opacity duration-500 hidden lg:block select-none pointer-events-none" aria-hidden="true">
        <div className="w-72 h-96 bg-slate-700/30 backdrop-blur-sm rounded-xl p-6 shadow-2xl transform rotate-6">
          <Cpu size={48} className="text-slate-500/50 mb-4" />
          <div className="space-y-3">
            <div className="h-16 bg-slate-600/40 rounded-md"></div>
            {[...Array(2)].map((_, i) => (
              <div key={i} className="h-8 bg-slate-600/30 rounded-md"></div>
            ))}
            <div className="h-8 bg-slate-600/20 rounded-md w-4/5"></div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-slate-100 via-slate-200 to-slate-50 mb-6 sm:mb-8 leading-tight">
          Build Your Dream PC, <span className="block sm:inline">Smarter & Faster.</span>
        </h1>
        <p className="max-w-lg sm:max-w-xl lg:max-w-2xl mx-auto text-base sm:text-lg lg:text-xl text-slate-300 mb-10 sm:mb-12">
          Stop the guesswork. Get AI-powered component tier lists, data-driven insights, and intelligent PC build recommendations. Craft your perfect rig with confidence and ease.
        </p>
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-5">
          <Link
            href="#tier-lists" // Update this href to your actual tier list section ID or page
            className="w-full sm:w-auto inline-flex items-center justify-center px-7 py-3.5 text-sm sm:text-base font-medium rounded-lg shadow-lg text-white bg-accent-blue hover:bg-accent-blue/90 transition-all duration-200 ease-in-out transform hover:scale-[1.03] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-blue focus:ring-offset-gray-900"
          >
            <Layers size={18} className="mr-2.5" /> Browse Tier Lists
          </Link>
          <Link
            href="#build-pc" // Update this href to your actual AI builder section ID or page
            className="w-full sm:w-auto inline-flex items-center justify-center px-7 py-3.5 text-sm sm:text-base font-medium rounded-lg shadow-lg text-primary-text bg-slate-700/50 hover:bg-slate-700/80 border border-slate-600/70 hover:border-slate-500 transition-all duration-200 ease-in-out transform hover:scale-[1.03] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-purple focus:ring-offset-gray-900 relative group"
          >
            <Bot size={18} className="mr-2.5" /> Try AI Build Generator
            <span className="absolute -top-2.5 -right-3 bg-accent-purple text-white text-[0.6rem] font-semibold px-2 py-0.5 rounded-full shadow-md group-hover:scale-110 transition-transform duration-150">
              PREMIUM
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HeroSection; 