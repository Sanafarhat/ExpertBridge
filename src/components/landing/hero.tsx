'use client';

import Link from "next/link";
import { ArrowRight, ShieldCheck, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section className="relative w-full min-h-[calc(100vh-130px)] flex flex-col justify-center overflow-hidden bg-[#FAFAFC] border-b border-[#E7E6EF]">
      {/* Background Subtle Elements */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[10%] right-[10%] w-[600px] h-[600px] rounded-full bg-[#6046D8]/[0.03] blur-3xl" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-[#4DA3FF]/[0.04] blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-6 w-full relative z-10 flex flex-col lg:flex-row items-center gap-12 lg:gap-8 py-16 lg:py-0">
        
        {/* LEFT SIDE: COPY & CTAS */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="flex-1 flex flex-col items-start text-left max-w-2xl w-full"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-[#E7E6EF] shadow-sm mb-6">
            <span className="text-[11px] font-bold tracking-wider text-[#171942] uppercase flex items-center gap-2">
              <ShieldCheck className="w-3.5 h-3.5 text-[#6046D8]" /> AI-Assisted Expert Verification
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#171942] leading-[1.1] mb-6">
            Tell Us What You Need.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#6046D8] to-[#7657E8]">
              We&apos;ll Find the Right Experts.
            </span>
          </h1>

          <p className="text-lg md:text-xl text-[#666778] mb-8 leading-relaxed font-medium">
            Submit your requirement and let ExpertBridge identify verified experts who best match your program, expertise, experience, and availability.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
            <Link href="/register" className="bg-[#171942] hover:bg-[#25265A] text-white px-8 py-4 rounded-full text-lg font-semibold transition-all hover:shadow-xl hover:-translate-y-1 flex items-center justify-center gap-2 w-full sm:w-auto">
              Submit a Requirement <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href="#how-it-works" className="bg-white hover:bg-gray-50 text-[#171942] border border-[#E7E6EF] shadow-sm px-8 py-4 rounded-full text-lg font-semibold transition-all hover:shadow-md hover:-translate-y-1 flex items-center justify-center w-full sm:w-auto">
              See How It Works
            </Link>
          </div>
        </motion.div>

        {/* RIGHT SIDE: ILLUSTRATION */}
        <div className="flex-1 w-full flex justify-center lg:justify-end relative h-[450px] lg:h-[550px] mt-8 lg:mt-0">
          
          <div className="relative w-full max-w-[600px] h-full flex items-center justify-center">
            
            {/* The Bridge Arc */}
            <svg className="absolute inset-0 w-full h-full z-0 pointer-events-none overflow-visible" viewBox="0 0 600 500">
              <defs>
                <linearGradient id="bridgeGrad" x1="0%" y1="100%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#4DA3FF" stopOpacity="0.2" />
                  <stop offset="50%" stopColor="#6046D8" stopOpacity="0.6" />
                  <stop offset="100%" stopColor="#6046D8" stopOpacity="0.1" />
                </linearGradient>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
                  <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>
              
              {/* Abstract sweeping connection path */}
              <motion.path 
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                d="M 120,380 C 250,380 350,150 480,150" 
                fill="none" 
                stroke="url(#bridgeGrad)" 
                strokeWidth="4"
              />
              
              {/* Outer decorative arcs */}
              <motion.path 
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 0.3 }}
                transition={{ duration: 2, delay: 0.5, ease: "easeOut" }}
                d="M 100,400 C 260,420 380,110 500,120" 
                fill="none" 
                stroke="#6046D8" 
                strokeWidth="1"
                strokeDasharray="4 4"
              />
            </svg>

            {/* ExpertBridge Branding on Bridge */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5, duration: 1 }}
              className="absolute left-[45%] top-[45%] -translate-x-1/2 -translate-y-1/2 z-10"
            >
              <div className="bg-white/80 backdrop-blur-md px-4 py-1.5 rounded-full border border-[#E7E6EF] shadow-sm flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-[#6046D8]" />
                <span className="text-xs font-bold text-[#171942] tracking-wide">ExpertBridge</span>
              </div>
            </motion.div>

            {/* INSTITUTION CLUSTER (Bottom Left) */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="absolute left-0 bottom-4 lg:bottom-12 z-20 flex flex-col items-center"
            >
              {/* Requirement Tag */}
              <motion.div 
                animate={{ y: [0, -4, 0] }}
                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                className="mb-4 ml-12 bg-white px-3 py-1.5 rounded-lg border border-[#E7E6EF] shadow-sm flex items-center gap-2"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-[#4DA3FF]" />
                <span className="text-[10px] font-bold text-[#171942]">Requirement:<br/><span className="text-gray-500 font-medium">Faculty Workshop</span></span>
              </motion.div>

              {/* Institution Architectural Visual */}
              <div className="w-[140px] h-[140px] bg-white rounded-2xl border border-[#E7E6EF] shadow-xl shadow-[#171942]/5 flex items-center justify-center p-4 relative overflow-hidden">
                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#FAFAFC] to-transparent" />
                <svg width="100" height="100" viewBox="0 0 120 120" fill="none" className="relative z-10">
                  <rect x="15" y="90" width="90" height="10" fill="#171942" rx="2" />
                  <rect x="5" y="100" width="110" height="8" fill="#171942" rx="2" />
                  <rect x="25" y="45" width="10" height="45" fill="#4DA3FF" rx="1" opacity="0.8" />
                  <rect x="55" y="45" width="10" height="45" fill="#4DA3FF" rx="1" opacity="0.8" />
                  <rect x="85" y="45" width="10" height="45" fill="#4DA3FF" rx="1" opacity="0.8" />
                  <path d="M10 45 L60 15 L110 45 Z" fill="#171942" />
                  <path d="M25 40 L60 20 L95 40 Z" fill="#FAFAFC" />
                  <circle cx="60" cy="32" r="4" fill="#6046D8" />
                </svg>
              </div>
            </motion.div>

            {/* EXPERT CLUSTER (Top Right) */}
            <motion.div 
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.6 }}
              className="absolute right-0 lg:-right-4 top-4 lg:top-8 z-20 w-[240px] h-[240px]"
            >
              
              {/* Verified Badge */}
              <motion.div 
                animate={{ y: [0, 5, 0] }}
                transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
                className="absolute -left-8 top-12 bg-white px-3 py-1.5 rounded-full border border-[#2CBFAE]/30 shadow-md flex items-center gap-1.5 z-30"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-[#2CBFAE]" />
                <span className="text-[10px] font-bold text-[#171942] uppercase tracking-wider">Verified</span>
              </motion.div>

              {/* Domain Badge */}
              <motion.div 
                animate={{ y: [0, -5, 0] }}
                transition={{ repeat: Infinity, duration: 4.5, ease: "easeInOut", delay: 1 }}
                className="absolute right-0 bottom-4 bg-[#6046D8] px-3 py-1.5 rounded-lg shadow-lg shadow-[#6046D8]/20 z-30"
              >
                <span className="text-[10px] font-bold text-white uppercase tracking-wider">Domain: AI / ML</span>
              </motion.div>

              {/* Expert 1: Professor */}
              <div className="absolute top-0 right-10 w-24 h-24 bg-white rounded-full border border-[#E7E6EF] shadow-lg flex items-center justify-center overflow-hidden z-20">
                <div className="absolute inset-0 bg-[#EEF5FF] opacity-50" />
                <svg width="70" height="70" viewBox="0 0 80 80" fill="none" className="relative z-10 mt-4">
                  <circle cx="40" cy="28" r="14" fill="#171942" />
                  <path d="M18 70 C18 52 28 44 40 44 C52 44 62 52 62 70" fill="#4DA3FF" />
                  <rect x="26" y="24" width="12" height="6" rx="2" stroke="#FAFAFC" strokeWidth="2" fill="none" />
                  <rect x="42" y="24" width="12" height="6" rx="2" stroke="#FAFAFC" strokeWidth="2" fill="none" />
                  <line x1="38" y1="27" x2="42" y2="27" stroke="#FAFAFC" strokeWidth="2" />
                </svg>
              </div>

              {/* Expert 2: Industry Professional */}
              <div className="absolute bottom-12 right-24 w-20 h-20 bg-white rounded-full border border-[#E7E6EF] shadow-md flex items-center justify-center overflow-hidden z-10">
                <div className="absolute inset-0 bg-[#F2EEFF] opacity-50" />
                <svg width="60" height="60" viewBox="0 0 80 80" fill="none" className="relative z-10 mt-4">
                  <path d="M22 40 C22 20 30 15 40 15 C50 15 58 20 58 40 C58 48 52 45 40 45 C28 45 22 48 22 40Z" fill="#171942" />
                  <circle cx="40" cy="30" r="10" fill="#6046D8" opacity="0.9" />
                  <path d="M18 70 C18 56 28 50 40 50 C52 50 62 56 62 70" fill="#6046D8" />
                </svg>
              </div>

              {/* Expert 3: Trainer/Mentor */}
              <div className="absolute top-16 -right-2 w-16 h-16 bg-white rounded-full border border-[#E7E6EF] shadow-sm flex items-center justify-center overflow-hidden z-10">
                <div className="absolute inset-0 bg-[#FFF4EB] opacity-50" />
                <svg width="50" height="50" viewBox="0 0 80 80" fill="none" className="relative z-10 mt-4">
                  <circle cx="40" cy="28" r="12" fill="#F6C85F" />
                  <path d="M22 70 C22 56 32 50 40 50 C48 50 58 56 58 70" fill="#171942" />
                </svg>
              </div>

            </motion.div>

          </div>
        </div>

      </div>
    </section>
  );
}
