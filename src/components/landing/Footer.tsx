import Link from 'next/link';
import { ShieldCheck } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#FAFAFC] pt-16 pb-8 border-t border-[#E7E6EF]">
      <div className="max-w-7xl mx-auto px-6">
        
        <div className="flex flex-col md:flex-row justify-between items-start gap-12 mb-16">
          <div className="max-w-sm">
            <div className="flex items-center gap-2 mb-4">
              <img src="/logo.jpg" alt="ExpertBridge Logo" className="w-9 h-9 object-cover rounded-full shadow-sm" />
              <span className="text-xl font-bold text-[#171942] tracking-tight">ExpertBridge</span>
            </div>
            <p className="text-[#666778] font-medium">
              Verified Expertise. Trusted Institutions.
            </p>
          </div>

          <div className="flex gap-16">
            <div>
              <h4 className="font-bold text-[#171942] mb-4 uppercase tracking-wider text-sm">Navigation</h4>
              <ul className="space-y-3">
                <li><Link href="#how-it-works" className="text-[#666778] hover:text-[#6046D8] transition-colors">How It Works</Link></li>
                <li><Link href="#institutions" className="text-[#666778] hover:text-[#6046D8] transition-colors">For Institutions</Link></li>
                <li><Link href="#experts" className="text-[#666778] hover:text-[#6046D8] transition-colors">For Experts</Link></li>
                <li><Link href="#about" className="text-[#666778] hover:text-[#6046D8] transition-colors">About</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-[#171942] mb-4 uppercase tracking-wider text-sm">Account</h4>
              <ul className="space-y-3">
                <li><Link href="/login" className="text-[#666778] hover:text-[#6046D8] transition-colors">Login</Link></li>
                <li><Link href="/register" className="text-[#666778] hover:text-[#6046D8] transition-colors">Get Started</Link></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="border-t border-[#E7E6EF] pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-400">
            © {new Date().getFullYear()} ExpertBridge. All rights reserved.
          </p>
        </div>
        
      </div>
    </footer>
  );
}
