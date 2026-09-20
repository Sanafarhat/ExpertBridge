'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Building2, ArrowRight, CheckCircle2, UserCheck, Loader2, Search } from 'lucide-react';
import Link from 'next/link';

export default function InstitutionSection() {
  const [matchState, setMatchState] = useState<'idle' | 'matching' | 'found'>('idle');

  const handleMatch = () => {
    setMatchState('matching');
    setTimeout(() => setMatchState('found'), 2000);
  };

  return (
    <section className="py-24 bg-[#FAFAFC] border-y border-[#E7E6EF]" id="institutions">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col lg:flex-row gap-16 items-center">
          
          {/* Left: Copy */}
          <div className="w-full lg:w-1/2">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-[#4DA3FF]/30 text-[#4DA3FF] mb-6 shadow-sm">
              <Building2 className="w-3.5 h-3.5" />
              <span className="text-[11px] font-bold tracking-wider uppercase">For Institutions</span>
            </div>
            
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#171942] mb-6 leading-tight">
              Your requirement.<br/>
              <span className="text-[#4DA3FF]">Our expert matching.</span>
            </h2>
            
            <p className="text-lg text-[#666778] mb-8 leading-relaxed">
              Stop searching through endless directories. Submit exactly what your program needs, and ExpertBridge will instantly evaluate our verified pool to present your top 3 most suitable experts.
            </p>
            
            <Link href="/register" className="inline-flex items-center gap-2 bg-[#171942] hover:bg-[#25265A] text-white px-8 py-3.5 rounded-full text-lg font-semibold transition-all hover:-translate-y-1 shadow-md">
              Create Institution Account <ArrowRight className="w-5 h-5" />
            </Link>
          </div>

          {/* Right: Dashboard Mockup */}
          <div className="w-full lg:w-1/2">
            <div className="bg-white rounded-2xl shadow-2xl border border-[#E7E6EF] overflow-hidden">
              <div className="bg-[#171942] px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-2 text-white font-semibold">
                  <Building2 className="w-5 h-5 text-[#4DA3FF]" /> Institution Dashboard
                </div>
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50" />
                  <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50" />
                </div>
              </div>
              
              <div className="p-6 lg:p-8 bg-gray-50/50 min-h-[380px] flex flex-col justify-center relative">
                
                {matchState === 'idle' && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="bg-white rounded-xl shadow-sm border border-[#E7E6EF] p-6">
                    <h3 className="font-bold text-[#171942] text-lg mb-4">New Requirement</h3>
                    <div className="bg-[#FAFAFC] p-4 rounded-lg border border-[#E7E6EF] space-y-2 mb-6">
                      <div className="font-semibold text-[#171942]">AI & ML Faculty Workshop</div>
                      <div className="grid grid-cols-2 gap-y-2 text-sm text-[#666778] mt-3">
                        <div><span className="text-gray-400">Domain:</span> AI</div>
                        <div><span className="text-gray-400">Experience:</span> 5+ Years</div>
                        <div><span className="text-gray-400">Mode:</span> Offline</div>
                        <div><span className="text-gray-400">Participants:</span> 100</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-[#2CBFAE] font-medium mb-6">
                      <CheckCircle2 className="w-4 h-4" /> Requirement Ready
                    </div>
                    <button onClick={handleMatch} className="w-full bg-[#6046D8] hover:bg-[#7657E8] text-white py-3 rounded-lg font-semibold transition-colors flex justify-center items-center gap-2">
                      <Search className="w-5 h-5" /> Find My Top 3 Experts
                    </button>
                  </motion.div>
                )}

                {matchState === 'matching' && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-12">
                    <Loader2 className="w-10 h-10 text-[#6046D8] animate-spin mb-4" />
                    <div className="text-[#171942] font-semibold mb-2">Finding suitable verified experts...</div>
                    <div className="text-sm text-gray-500">Evaluating domain relevance and availability</div>
                  </motion.div>
                )}

                {matchState === 'found' && (
                  <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-bold text-[#171942]">Top 3 Recommendations</h3>
                      <button onClick={() => setMatchState('idle')} className="text-sm text-[#6046D8] font-medium hover:underline">Start Over</button>
                    </div>
                    
                    {[
                      { match: 'Strong Match', score: '92%', expert: 'AI/ML Expert', exp: '8+ Years' },
                      { match: 'High Match', score: '88%', expert: 'AI Specialist', exp: '7+ Years' },
                      { match: 'Good Match', score: '84%', expert: 'ML Architect', exp: '10+ Years' },
                    ].map((item, i) => (
                      <div key={i} className="bg-white p-4 rounded-xl border border-[#E7E6EF] shadow-sm flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="bg-[#EEF5FF] p-2 rounded-lg">
                            <UserCheck className="w-5 h-5 text-[#4DA3FF]" />
                          </div>
                          <div>
                            <div className="font-semibold text-[#171942] text-sm">{item.expert}</div>
                            <div className="text-xs text-gray-500">{item.exp} • Verified</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-[10px] text-gray-400 uppercase mb-0.5">Requirement Match</div>
                          <div className="text-xs text-[#2CBFAE] font-bold bg-[#ECFBFA] px-2 py-1 rounded inline-block">{item.match}</div>
                        </div>
                      </div>
                    ))}
                  </motion.div>
                )}

              </div>
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
}
