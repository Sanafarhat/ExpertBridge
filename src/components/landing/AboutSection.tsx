import { BrainCircuit, ShieldCheck, Zap } from 'lucide-react';

export default function AboutSection() {
  return (
    <section className="py-24 bg-[#171942] relative overflow-hidden" id="about">
      
      {/* Decorative Background */}
      <div className="absolute inset-0 z-0 opacity-10">
        <svg width="100%" height="100%" preserveAspectRatio="none">
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1"/>
          </pattern>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-6">
            Built to bridge institutional needs<br/>with verified expertise.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          
          {/* Desktop connecting lines */}
          <div className="hidden md:block absolute top-12 left-1/6 right-1/6 h-0.5 bg-gradient-to-r from-transparent via-[#6046D8] to-transparent z-0"></div>

          {/* Pillar 1 */}
          <div className="bg-[#25265A] border border-[#6046D8]/30 rounded-2xl p-8 relative z-10 flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-[#171942] border border-[#6046D8]/50 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-[#6046D8]/20">
              <BrainCircuit className="w-8 h-8 text-[#4DA3FF]" />
            </div>
            <div className="text-[#4DA3FF] text-sm font-bold tracking-widest uppercase mb-2">01. Understand</div>
            <h3 className="text-xl font-bold text-white mb-3">Requirement Intelligence</h3>
            <p className="text-gray-400">
              We process your raw requirements and extract the precise domain, experience, and logistical needs required for your program.
            </p>
          </div>

          {/* Pillar 2 */}
          <div className="bg-[#25265A] border border-[#6046D8]/30 rounded-2xl p-8 relative z-10 flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-[#171942] border border-[#6046D8]/50 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-[#6046D8]/20">
              <ShieldCheck className="w-8 h-8 text-[#2CBFAE]" />
            </div>
            <div className="text-[#2CBFAE] text-sm font-bold tracking-widest uppercase mb-2">02. Verify</div>
            <h3 className="text-xl font-bold text-white mb-3">Evidence-Based Verification</h3>
            <p className="text-gray-400">
              Every expert in our pool undergoes rigorous AI-assisted credential analysis and final human administrator approval.
            </p>
          </div>

          {/* Pillar 3 */}
          <div className="bg-[#25265A] border border-[#6046D8]/30 rounded-2xl p-8 relative z-10 flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-[#171942] border border-[#6046D8]/50 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-[#6046D8]/20">
              <Zap className="w-8 h-8 text-[#F6C85F]" />
            </div>
            <div className="text-[#F6C85F] text-sm font-bold tracking-widest uppercase mb-2">03. Match</div>
            <h3 className="text-xl font-bold text-white mb-3">Transparent Matching</h3>
            <p className="text-gray-400">
              Our deterministic engine evaluates the verified pool against your exact needs, instantly delivering the top 3 recommendations.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}
