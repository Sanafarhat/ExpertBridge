'use client';

import { motion } from 'framer-motion';
import { UserCheck, Check } from 'lucide-react';

export default function ComparisonSection() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#171942] mb-4">
            Three suitable experts.<br/>One informed decision.
          </h2>
          <p className="text-lg text-[#666778] max-w-2xl mx-auto">
            ExpertBridge provides the recommendations, but your institution makes the final selection. Compare the top 3 verified matches side-by-side.
          </p>
        </div>

        <div className="max-w-5xl mx-auto overflow-x-auto pb-6">
          <div className="min-w-[800px] border border-[#E7E6EF] rounded-2xl bg-white shadow-xl shadow-[#171942]/5 overflow-hidden">
            
            {/* Header Row */}
            <div className="grid grid-cols-4 bg-[#FAFAFC] border-b border-[#E7E6EF]">
              <div className="p-6 flex items-center justify-center border-r border-[#E7E6EF]">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Compare</span>
              </div>
              
              <div className="p-6 text-center border-r border-[#E7E6EF] bg-white relative">
                <div className="absolute top-0 inset-x-0 h-1 bg-[#6046D8]"></div>
                <div className="w-12 h-12 bg-[#EEF5FF] rounded-full mx-auto mb-3 flex items-center justify-center">
                  <UserCheck className="w-6 h-6 text-[#4DA3FF]" />
                </div>
                <div className="font-bold text-[#171942]">AI/ML Expert</div>
                <div className="text-xs text-gray-500">Verified Professional</div>
              </div>

              <div className="p-6 text-center border-r border-[#E7E6EF]">
                <div className="w-12 h-12 bg-gray-50 rounded-full mx-auto mb-3 flex items-center justify-center">
                  <UserCheck className="w-6 h-6 text-gray-400" />
                </div>
                <div className="font-bold text-[#171942]">AI Specialist</div>
                <div className="text-xs text-gray-500">Verified Professional</div>
              </div>

              <div className="p-6 text-center">
                <div className="w-12 h-12 bg-gray-50 rounded-full mx-auto mb-3 flex items-center justify-center">
                  <UserCheck className="w-6 h-6 text-gray-400" />
                </div>
                <div className="font-bold text-[#171942]">ML Architect</div>
                <div className="text-xs text-gray-500">Verified Professional</div>
              </div>
            </div>

            {/* Data Rows */}
            <div className="divide-y divide-[#E7E6EF]">
              
              <div className="grid grid-cols-4">
                <div className="p-4 bg-[#FAFAFC] border-r border-[#E7E6EF] font-semibold text-sm text-[#171942] flex items-center">Requirement Match</div>
                <div className="p-4 border-r border-[#E7E6EF] text-center font-bold text-[#2CBFAE] bg-[#ECFBFA]/50">Strong Match</div>
                <div className="p-4 border-r border-[#E7E6EF] text-center font-semibold text-gray-700">High Match</div>
                <div className="p-4 text-center font-semibold text-gray-600">Good Match</div>
              </div>

              <div className="grid grid-cols-4">
                <div className="p-4 bg-[#FAFAFC] border-r border-[#E7E6EF] font-semibold text-sm text-[#171942] flex items-center">Experience</div>
                <div className="p-4 border-r border-[#E7E6EF] text-center text-sm text-gray-600">8+ Years</div>
                <div className="p-4 border-r border-[#E7E6EF] text-center text-sm text-gray-600">7+ Years</div>
                <div className="p-4 text-center text-sm text-gray-600">10+ Years</div>
              </div>

              <div className="grid grid-cols-4">
                <div className="p-4 bg-[#FAFAFC] border-r border-[#E7E6EF] font-semibold text-sm text-[#171942] flex items-center">Mode</div>
                <div className="p-4 border-r border-[#E7E6EF] text-center text-sm text-gray-600">Online / Offline</div>
                <div className="p-4 border-r border-[#E7E6EF] text-center text-sm text-gray-600">Offline</div>
                <div className="p-4 text-center text-sm text-gray-600">Online</div>
              </div>

              {/* Action Row */}
              <div className="grid grid-cols-4 bg-[#FAFAFC]">
                <div className="p-6 border-r border-[#E7E6EF]"></div>
                <div className="p-6 border-r border-[#E7E6EF] bg-white">
                  <button className="w-full bg-[#171942] hover:bg-[#25265A] text-white py-2.5 rounded-lg font-semibold transition-all shadow-md flex justify-center items-center gap-2">
                    <Check className="w-4 h-4" /> Select Expert
                  </button>
                </div>
                <div className="p-6 border-r border-[#E7E6EF]">
                  <button className="w-full bg-white border border-[#E7E6EF] text-[#171942] py-2.5 rounded-lg font-semibold transition-all hover:border-gray-300">
                    Select Expert
                  </button>
                </div>
                <div className="p-6">
                  <button className="w-full bg-white border border-[#E7E6EF] text-[#171942] py-2.5 rounded-lg font-semibold transition-all hover:border-gray-300">
                    Select Expert
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
