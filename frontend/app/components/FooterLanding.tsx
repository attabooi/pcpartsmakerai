"use client";

import Link from "next/link";
import { Layers } from "lucide-react"; // Placeholder logo

const FooterLanding = () => {
  return (
    <footer className="bg-gray-900 border-t border-slate-700/50 text-slate-400 font-sans">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          {/* Logo and Copyright */}
          <div className="flex flex-col items-center md:items-start">
            <Link href="/" className="flex items-center space-x-2 mb-3">
              <Layers size={28} className="text-accent-blue" />
              <span className="text-xl font-bold text-slate-100">pcpartsmakerAI</span>
            </Link>
            <p className="text-xs text-center md:text-left">
              &copy; {new Date().getFullYear()} pcpartsmakerAI. <br />All rights reserved.
            </p>
          </div>

          {/* Quick Links (Example) */}
          <div className="text-center md:col-span-1">
            <h5 className="text-sm font-semibold text-slate-200 mb-2.5">Quick Links</h5>
            <ul className="space-y-1.5 text-xs">
              <li><Link href="#tier-lists" className="hover:text-sky-400 transition-colors">Tier Lists</Link></li>
              <li><Link href="#data-report" className="hover:text-sky-400 transition-colors">Data Report</Link></li> 
              <li><Link href="#build-pc" className="hover:text-sky-400 transition-colors">AI PC Builder</Link></li>
              <li><Link href="/privacy" className="hover:text-sky-400 transition-colors">Privacy Policy</Link></li> 
            </ul>
          </div>

          {/* Social/Contact (Example) */}
          <div className="text-center md:text-right">
            <h5 className="text-sm font-semibold text-slate-200 mb-2.5">Connect</h5>
            <ul className="space-y-1.5 text-xs">
              <li><Link href="mailto:contact@pcpartsmaker.ai" className="hover:text-sky-400 transition-colors">contact@pcpartsmaker.ai</Link></li>
              <li><Link href="https://twitter.com/pcpartsmakerai" target="_blank" rel="noopener noreferrer" className="hover:text-sky-400 transition-colors">Twitter</Link></li>
              {/* Add more social links if needed */}
            </ul>
          </div>
        </div>
        <div className="mt-10 pt-8 border-t border-slate-700/50 text-center text-xs text-slate-500">
          <p>Built with passion for PC enthusiasts. Data is indicative; always verify before purchasing.</p>
        </div>
      </div>
    </footer>
  );
};

export default FooterLanding; 