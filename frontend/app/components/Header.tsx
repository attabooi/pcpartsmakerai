"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Layers, Menu, X, ChevronRight } from "lucide-react"; // Using Layers as a placeholder logo

// Adjusted navItems to match the Framer template style
const navItems = [
  { href: "#features", label: "Features" }, // Corresponds to Tier Lists / Data Report
  { href: "#ai-builder", label: "AI Builder" }, // Corresponds to Build My PC
  { href: "#pricing", label: "Pricing" }, // Placeholder, if you add a pricing section
];

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  // const pathname = usePathname(); // For active link styling if using Next.js router for separate pages

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10); // Trigger earlier for template style
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 font-sans
                  ${
                    isScrolled || mobileMenuOpen
                      ? "bg-black/70 backdrop-blur-md shadow-lg"
                      : "bg-transparent pt-2 md:pt-1"
                  }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-screen-xl"> {/* Increased max-width similar to templates */}
        <div className="flex items-center justify-between h-14 md:h-16">
          <Link href="/" className="flex items-center space-x-2">
            {/* Using a simpler, more Framer-like logo representation */}
            <div className="w-7 h-7 bg-sky-500 rounded-full flex items-center justify-center">
              <Layers size={16} className="text-black" />
            </div>
            {/* Optional: Text logo for larger screens, or rely on icon only */}
            {/* <span className="text-lg font-semibold text-slate-100 hidden sm:block">pcpartsmakerAI</span> */}
          </Link>

          <nav className="hidden md:flex items-center space-x-2">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="px-3 py-1.5 rounded-md text-xs font-medium text-slate-300 hover:text-slate-50 hover:bg-slate-800/60 transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center">
            <Link
              href="#build-pc" // Main CTA, similar to "Book a Call"
              className={`hidden md:inline-flex items-center px-3.5 py-1.5 border border-transparent text-xs font-medium rounded-lg shadow-sm transition-colors
                          ${isScrolled || mobileMenuOpen ? 'text-slate-800 bg-slate-50 hover:bg-slate-200' : 'text-slate-200 bg-slate-50/10 hover:bg-slate-50/20 border-slate-50/20'}`}
            >
              Try AI Builder <ChevronRight size={14} className="ml-1" />
            </Link>
            <button
              onClick={toggleMobileMenu}
              className="ml-3 md:hidden p-2 rounded-md text-slate-300 hover:text-slate-50 hover:bg-slate-800/60 focus:outline-none"
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-menu"
            >
              <span className="sr-only">Open main menu</span>
              {mobileMenuOpen ? (
                <X className="block h-5 w-5" aria-hidden="true" />
              ) : (
                <Menu className="block h-5 w-5" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden" id="mobile-menu">
          <div className="px-2 pt-2 pb-4 space-y-1 sm:px-3 border-t border-slate-700/50">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-sm font-medium text-slate-200 hover:text-slate-50 hover:bg-slate-800/80 transition-colors"
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="#build-pc"
              onClick={() => setMobileMenuOpen(false)}
              className="block w-full mt-3 px-3 py-2.5 rounded-md text-sm font-medium text-center text-slate-800 bg-slate-50 hover:bg-slate-200 transition-colors"
            >
              Try AI Builder <ChevronRight size={16} className="inline ml-1" />
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header; 