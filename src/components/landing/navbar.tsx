"use client";

import { useState } from "react";
import Link from "next/link";
import { ShieldCheck, Menu, X } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const closeMenu = () => setIsOpen(false);

  return (
    <nav className="w-full bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-[#E7E6EF]/50 shadow-[0_4px_30px_rgba(0,0,0,0.02)]">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        
        {/* Brand / Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <img src="/logo.jpg" alt="ExpertBridge Logo" className="w-10 h-10 object-cover rounded-full transition-transform group-hover:scale-105 shadow-sm" />
          <span className="text-xl md:text-2xl font-bold tracking-tight text-[#11132F]">ExpertBridge</span>
        </Link>
        
        {/* Desktop Links */}
        <div className="hidden lg:flex items-center gap-8 text-[15px] font-medium text-[#17182C]">
          <a href="#how-it-works" className="hover:text-[#6046D8] hover:bg-[#F2EEFF] px-3 py-1.5 rounded-lg transition-all duration-200">
            How It Works
          </a>
          <Link href="#institutions" className="hover:text-[#5865F2] hover:bg-[#EEF5FF] px-3 py-1.5 rounded-lg transition-all duration-200">
            For Institutions
          </Link>
          <Link href="#experts" className="hover:text-[#2CBFAE] hover:bg-[#ECFBFA] px-3 py-1.5 rounded-lg transition-all duration-200">
            For Experts
          </Link>
          <Link href="#about" className="hover:text-[#F6C85F] hover:bg-[#FFF8E5] px-3 py-1.5 rounded-lg transition-all duration-200">
            About
          </Link>
        </div>

        {/* Desktop Actions */}
        <div className="hidden lg:flex items-center gap-4">
          <Link href="/login" className="text-[15px] font-semibold text-[#171942] hover:text-[#6046D8] hover:bg-[#F2EEFF] px-4 py-2 rounded-lg transition-all duration-200">
            Login
          </Link>
          <Link href="/register" className="bg-gradient-to-r from-[#6046D8] to-[#5865F2] hover:from-[#5865F2] hover:to-[#6046D8] text-white px-6 py-2.5 rounded-full text-[15px] font-semibold transition-all duration-300 shadow-md hover:shadow-[#6046D8]/30 hover:-translate-y-0.5">
            Get Started
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="lg:hidden p-2 text-[#17182C] hover:bg-gray-100 rounded-lg transition-colors"
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          aria-label="Toggle navigation menu"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

      </div>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className="lg:hidden absolute top-full left-0 w-full bg-white border-b border-[#E7E6EF] shadow-xl flex flex-col py-4 px-6 gap-2">
          <a href="#how-it-works" onClick={closeMenu} className="text-[#17182C] font-medium hover:text-[#6046D8] py-3 border-b border-gray-50">
            How It Works
          </a>
          <Link href="#institutions" onClick={closeMenu} className="text-[#17182C] font-medium hover:text-[#5865F2] py-3 border-b border-gray-50">
            For Institutions
          </Link>
          <Link href="#experts" onClick={closeMenu} className="text-[#17182C] font-medium hover:text-[#2CBFAE] py-3 border-b border-gray-50">
            For Experts
          </Link>
          <Link href="#about" onClick={closeMenu} className="text-[#17182C] font-medium hover:text-[#F6C85F] py-3 mb-4">
            About
          </Link>
          
          <div className="flex flex-col gap-3 pt-2">
            <Link href="/login" onClick={closeMenu} className="w-full text-center text-[#171942] font-semibold bg-gray-50 hover:bg-gray-100 py-3 rounded-xl transition-colors">
              Login
            </Link>
            <Link href="/register" onClick={closeMenu} className="w-full text-center bg-gradient-to-r from-[#6046D8] to-[#5865F2] text-white py-3 rounded-xl font-semibold shadow-md">
              Get Started
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
