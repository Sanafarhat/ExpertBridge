'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Cpu, Search, Users, Scale, CheckCircle2 } from 'lucide-react';

const steps = [
  { id: 'submit', title: 'Submit Requirement', icon: FileText, desc: 'Institutions submit a structured requirement or PDF.' },
  { id: 'understand', title: 'Understand', icon: Cpu, desc: 'AI extracts key parameters from the requirement.' },
  { id: 'match', title: 'Match', icon: Search, desc: 'Engine evaluates the verified expert pool deterministically.' },
  { id: 'top3', title: 'Top 3', icon: Users, desc: 'The most suitable experts are identified.' },
  { id: 'compare', title: 'Compare', icon: Scale, desc: 'Institution reviews the recommendations side-by-side.' },
  { id: 'engage', title: 'Engage', icon: CheckCircle2, desc: 'Final selection and engagement request is sent.' }
];

export default function WorkflowSection() {
  const [activeStep, setActiveStep] = useState('submit');

  const renderMockup = () => {
    switch (activeStep) {
      case 'submit':
        return (
          <div className="bg-white rounded-xl shadow-lg border border-[#E7E6EF] p-6 text-sm w-full max-w-sm">
            <div className="font-bold text-[#171942] mb-4 border-b pb-2">Requirement Form</div>
            <div className="space-y-3">
              <div className="bg-gray-50 p-2 rounded border border-gray-100 text-gray-500">Title: AI & ML Workshop</div>
              <div className="bg-gray-50 p-2 rounded border border-gray-100 text-gray-500">Domain: Artificial Intelligence</div>
              <div className="bg-[#6046D8] text-white text-center py-2 rounded font-medium mt-4">Submit</div>
            </div>
          </div>
        );
      case 'understand':
        return (
          <div className="bg-white rounded-xl shadow-lg border border-[#E7E6EF] p-6 text-sm w-full max-w-sm">
            <div className="flex items-center gap-2 text-[#6046D8] font-bold mb-4 border-b pb-2">
              <Cpu className="w-4 h-4" /> AI Analysis Complete
            </div>
            <div className="space-y-2">
              <div className="flex justify-between"><span className="text-gray-500">Topic:</span> <span className="font-medium text-[#171942]">Machine Learning</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Experience:</span> <span className="font-medium text-[#171942]">5+ Years</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Mode:</span> <span className="font-medium text-[#171942]">Offline</span></div>
            </div>
          </div>
        );
      case 'match':
        return (
          <div className="bg-[#171942] rounded-xl shadow-lg border border-[#25265A] p-6 text-sm w-full max-w-sm text-white">
            <div className="font-bold mb-4 border-b border-[#25265A] pb-2 text-center">Transparent Matching Engine</div>
            <div className="space-y-3">
              <div className="flex justify-between items-center"><span>Domain Relevance</span> <span className="text-[#4DA3FF]">40% Weight</span></div>
              <div className="flex justify-between items-center"><span>Program Suitability</span> <span className="text-[#2CBFAE]">30% Weight</span></div>
              <div className="flex justify-between items-center"><span>Availability & Mode</span> <span className="text-[#F6C85F]">15% Weight</span></div>
              <div className="flex justify-between items-center"><span>Experience Level</span> <span className="text-[#FF7B72]">15% Weight</span></div>
            </div>
          </div>
        );
      case 'top3':
        return (
          <div className="w-full max-w-md flex gap-3">
            {[92, 88, 84].map((score, i) => (
              <div key={i} className="flex-1 bg-white rounded-xl shadow-md border border-[#E7E6EF] p-3 text-center">
                <div className="bg-[#ECFBFA] text-[#2CBFAE] text-[9px] font-bold px-1 py-0.5 rounded uppercase mb-2 inline-block">✓ Verified</div>
                <div className="text-[10px] text-gray-500 mb-2">Expert {i + 1}</div>
                <div className="text-lg font-bold text-[#171942]">{score}%</div>
                <div className="text-[9px] text-gray-400 uppercase">Requirement Match</div>
              </div>
            ))}
          </div>
        );
      case 'compare':
        return (
          <div className="bg-white rounded-xl shadow-lg border border-[#E7E6EF] p-4 text-xs w-full max-w-md">
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="font-bold text-[#171942]">Expert A</div>
              <div className="font-bold text-[#171942]">Expert B</div>
              <div className="font-bold text-[#171942]">Expert C</div>
              <div className="text-gray-500 border-t pt-2">Offline</div>
              <div className="text-gray-500 border-t pt-2">Online</div>
              <div className="text-gray-500 border-t pt-2">Hybrid</div>
              <div className="col-span-3 mt-2"><button className="w-full bg-[#6046D8] text-white py-2 rounded font-medium">Institution Selects</button></div>
            </div>
          </div>
        );
      case 'engage':
        return (
          <div className="bg-[#EEF5FF] rounded-xl shadow-lg border border-[#4DA3FF]/20 p-6 text-sm w-full max-w-sm text-center">
            <CheckCircle2 className="w-12 h-12 text-[#4DA3FF] mx-auto mb-3" />
            <div className="font-bold text-[#171942] mb-1">Engagement Confirmed</div>
            <div className="text-gray-600 text-xs">The expert has accepted your request.</div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <section id="how-it-works" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#171942] mb-4">The ExpertBridge Workflow</h2>
          <p className="text-lg text-[#666778] max-w-2xl mx-auto">From requirement to engagement, ExpertBridge handles the discovery and verification process.</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-12 items-center">
          {/* Steps List */}
          <div className="w-full lg:w-1/2 flex flex-col gap-2">
            {steps.map((step, index) => {
              const isActive = activeStep === step.id;
              const Icon = step.icon;
              return (
                <button 
                  key={step.id} 
                  onClick={() => setActiveStep(step.id)}
                  className={`text-left p-4 rounded-xl transition-all duration-200 border flex items-start gap-4 ${isActive ? 'bg-[#FAFAFC] border-[#6046D8] shadow-sm' : 'bg-white border-transparent hover:border-[#E7E6EF]'}`}
                >
                  <div className={`p-2 rounded-lg ${isActive ? 'bg-[#6046D8] text-white' : 'bg-gray-100 text-gray-400'}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className={`font-bold ${isActive ? 'text-[#171942]' : 'text-gray-500'}`}>0{index + 1}. {step.title}</div>
                    {isActive && <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="text-sm text-[#666778] mt-1">{step.desc}</motion.div>}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Product Visualization Area */}
          <div className="w-full lg:w-1/2 h-[400px] bg-[#FAFAFC] rounded-3xl border border-[#E7E6EF] flex items-center justify-center p-8 relative overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeStep}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="w-full flex justify-center"
              >
                {renderMockup()}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
