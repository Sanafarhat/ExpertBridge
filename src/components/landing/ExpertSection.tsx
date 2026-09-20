'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, UserCircle, FileBadge, CheckCircle, Search, FileText } from 'lucide-react';
import Link from 'next/link';

const tabs = [
  { id: 'profile', label: 'Profile' },
  { id: 'credentials', label: 'Credentials' },
  { id: 'verification', label: 'Verification' },
  { id: 'availability', label: 'Availability' }
];

export default function ExpertSection() {
  const [activeTab, setActiveTab] = useState('verification');

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-[#EEF5FF] rounded-full flex items-center justify-center">
                <UserCircle className="w-8 h-8 text-[#4DA3FF]" />
              </div>
              <div>
                <div className="font-bold text-[#171942] text-lg">AI & Machine Learning Expert</div>
                <div className="text-gray-500 text-sm">10+ Years Experience • Industry Leader</div>
              </div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg border border-[#E7E6EF]">
              <div className="text-xs text-gray-400 font-semibold uppercase mb-2">Domains</div>
              <div className="flex gap-2">
                <span className="bg-white border border-gray-200 px-2 py-1 rounded text-xs font-medium">Artificial Intelligence</span>
                <span className="bg-white border border-gray-200 px-2 py-1 rounded text-xs font-medium">Machine Learning</span>
              </div>
            </div>
          </div>
        );
      case 'credentials':
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 border border-[#E7E6EF] rounded-lg bg-white">
              <div className="flex items-center gap-3">
                <FileBadge className="w-5 h-5 text-[#6046D8]" />
                <span className="font-medium text-sm text-[#171942]">Ph.D. in Computer Science</span>
              </div>
              <span className="text-xs text-[#2CBFAE] font-bold bg-[#ECFBFA] px-2 py-1 rounded">Verified</span>
            </div>
            <div className="flex items-center justify-between p-3 border border-[#E7E6EF] rounded-lg bg-white">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-[#6046D8]" />
                <span className="font-medium text-sm text-[#171942]">10 Years Industry Experience</span>
              </div>
              <span className="text-xs text-[#2CBFAE] font-bold bg-[#ECFBFA] px-2 py-1 rounded">Verified</span>
            </div>
            <div className="flex items-center justify-between p-3 border border-[#E7E6EF] rounded-lg bg-white opacity-60">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-gray-400" />
                <span className="font-medium text-sm text-gray-500">Additional Certifications</span>
              </div>
              <span className="text-xs text-gray-500 font-bold bg-gray-100 px-2 py-1 rounded">Pending</span>
            </div>
          </div>
        );
      case 'verification':
        return (
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="mt-1"><Search className="w-5 h-5 text-[#4DA3FF]" /></div>
              <div>
                <div className="font-bold text-[#171942] text-sm mb-1">AI-Assisted Insights</div>
                <div className="bg-[#EEF5FF] text-[#171942] p-3 rounded-lg text-xs leading-relaxed border border-[#4DA3FF]/20">
                  <span className="block mb-1 text-[#4DA3FF] font-semibold">Findings:</span>
                  Name appears consistent across submitted documents. Qualification in Computer Science confirmed. Experience timeline is continuous from 2014 to present.
                </div>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="mt-1"><ShieldCheck className="w-5 h-5 text-[#6046D8]" /></div>
              <div className="w-full">
                <div className="font-bold text-[#171942] text-sm mb-1">Admin Decision</div>
                <div className="bg-[#F2EEFF] p-3 rounded-lg border border-[#6046D8]/20 flex items-center justify-between w-full">
                  <div className="text-xs text-[#171942] font-medium">Status: Approved</div>
                  <div className="text-[10px] font-bold bg-[#6046D8] text-white px-2 py-1 rounded uppercase tracking-wider flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" /> VERIFIED
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'availability':
        return (
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white border border-[#2CBFAE]/30 p-4 rounded-xl shadow-sm text-center">
              <div className="font-bold text-[#2CBFAE] mb-1">Online</div>
              <div className="text-xs text-gray-500">Available globally</div>
            </div>
            <div className="bg-gray-50 border border-[#E7E6EF] p-4 rounded-xl text-center opacity-70">
              <div className="font-bold text-gray-400 mb-1">Offline</div>
              <div className="text-xs text-gray-400">Currently unavailable</div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <section className="py-24 bg-white" id="experts">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col lg:flex-row gap-16 items-center">
          
          {/* Left: Interactive UI Preview */}
          <div className="w-full lg:w-1/2 order-2 lg:order-1">
            <div className="bg-white rounded-2xl shadow-xl shadow-[#171942]/5 border border-[#E7E6EF] overflow-hidden">
              
              {/* Tabs */}
              <div className="flex border-b border-[#E7E6EF] bg-[#FAFAFC] overflow-x-auto">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 py-4 px-4 text-sm font-semibold transition-colors border-b-2 whitespace-nowrap ${
                      activeTab === tab.id 
                        ? 'text-[#6046D8] border-[#6046D8] bg-white' 
                        : 'text-gray-500 border-transparent hover:text-[#171942] hover:bg-white'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Content */}
              <div className="p-6 lg:p-8 min-h-[320px] bg-white">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    {renderContent()}
                  </motion.div>
                </AnimatePresence>
              </div>
              
            </div>
          </div>

          {/* Right: Copy */}
          <div className="w-full lg:w-1/2 order-1 lg:order-2">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-[#2CBFAE]/30 text-[#2CBFAE] mb-6 shadow-sm">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span className="text-[11px] font-bold tracking-wider uppercase">For Experts</span>
            </div>
            
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#171942] mb-6 leading-tight">
              Get Verified.<br/>
              <span className="text-[#6046D8]">Become Discoverable.</span>
            </h2>
            
            <p className="text-lg text-[#666778] mb-8 leading-relaxed">
              Submit your credentials and experience evidence. AI assists with document analysis, while our human administrators make the final verification decision, ensuring you enter the pool of trusted experts.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/register" className="inline-flex justify-center items-center gap-2 bg-[#6046D8] hover:bg-[#7657E8] text-white px-8 py-3.5 rounded-full text-lg font-semibold transition-all hover:-translate-y-1 shadow-md">
                Apply as Expert
              </Link>
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
}
