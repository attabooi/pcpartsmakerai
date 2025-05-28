"use client";

import Link from "next/link";
import { Layers, Bot, BarChartBig, Cpu } from "lucide-react";

const HeroSectionLanding = () => {
  return (
    <section className="relative bg-black overflow-hidden h-[100vh] flex flex-col justify-center items-center text-center px-6">
      {/* Animated background PC images */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute w-[120%] h-[120%] bg-[url('/bg/pc1.jpg')] bg-cover bg-center opacity-10 animate-slow-move" />
        <div className="absolute w-[130%] h-[130%] bg-[url('/bg/pc2.jpg')] bg-cover bg-center opacity-10 animate-slower-move" />
        <div className="absolute w-[110%] h-[110%] bg-[url('/bg/pc3.jpg')] bg-cover bg-center opacity-10 animate-slowest-move" />
      </div>

      <h1 className="text-white text-4xl md:text-6xl font-extrabold">
        AI builds your best PC.
      </h1>
      <p className="mt-4 text-gray-300 text-lg">
        Explore tiered rankings, performance data, and smart builds powered by real specs and price data.
      </p>

      <div className="mt-6 flex gap-4 justify-center">
        <a href="/tierlist" className="bg-blue-600 text-white px-5 py-3 rounded-xl font-semibold">
          Browse Tier Lists
        </a>
        <a href="/build" className="bg-white text-black px-5 py-3 rounded-xl font-semibold">
          Try AI Build Generator
        </a>
      </div>
    </section>
  );
};

export default HeroSectionLanding; 