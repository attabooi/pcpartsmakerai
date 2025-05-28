"use client";

import { Zap, BarChart3, Cpu, ShieldCheck, Layers, Settings } from 'lucide-react'; // Example icons

const features = [
  {
    icon: BarChart3,
    title: "Dynamic Tier Lists",
    description: "Real-time component rankings by performance or value, powered by up-to-date data.",
    bgColor: "bg-sky-600/10",
    iconColor: "text-sky-400"
  },
  {
    icon: Cpu,
    title: "AI-Powered Builds",
    description: "Intelligent PC build recommendations tailored to your budget, needs, and favorite games.",
    bgColor: "bg-purple-600/10",
    iconColor: "text-purple-400"
  },
  {
    icon: Layers,
    title: "Comprehensive Data",
    description: "Access detailed specs, pricing, and compatibility info from our extensive hardware database.",
    bgColor: "bg-emerald-600/10",
    iconColor: "text-emerald-400"
  },
  {
    icon: Settings,
    title: "Easy Customization",
    description: "Fine-tune AI suggestions or build from scratch with our intuitive component selectors.",
    bgColor: "bg-rose-600/10",
    iconColor: "text-rose-400"
  },
  // Add 2 more features if desired to make a 2x3 or 3x2 grid on larger screens
];

const KeyFeaturesSection = () => {
  return (
    <section id="features" className="bg-black py-20 md:py-28 lg:py-32 font-sans">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-screen-xl">
        <div className="text-center mb-12 md:mb-16 lg:mb-20">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-50 mb-4">
            Transform Your PC Building Experience
          </h2>
          <p className="text-base sm:text-lg text-slate-400/80 max-w-xl lg:max-w-2xl mx-auto">
            Our AI-driven platform simplifies every step, from choosing parts to building your dream rig.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-6 md:gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div 
                key={index} 
                className={`p-6 md:p-8 rounded-xl border border-slate-800/70 bg-slate-900/50 shadow-lg hover:shadow-slate-700/20 transition-shadow duration-300 flex flex-col items-start`}
              >
                <div className={`p-3 rounded-lg ${feature.bgColor} mb-5 md:mb-6`}>
                  <Icon size={24} className={`${feature.iconColor}`} />
                </div>
                <h3 className="text-lg md:text-xl font-semibold text-slate-100 mb-2 md:mb-3">{feature.title}</h3>
                <p className="text-sm text-slate-400/90 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default KeyFeaturesSection; 