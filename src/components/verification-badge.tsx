import { CheckCircle2, Info } from 'lucide-react'

interface VerificationBadgeProps {
  className?: string
  showTooltip?: boolean
}

export function VerificationBadge({ className = '', showTooltip = true }: VerificationBadgeProps) {
  return (
    <div className={`inline-flex items-center gap-1.5 px-3 py-1 bg-green-50 border border-green-200 text-green-700 rounded-full text-xs font-bold tracking-wide relative group cursor-default ${className}`}>
      <CheckCircle2 className="w-3.5 h-3.5" />
      <span>VERIFIED & CERTIFIED</span>
      
      {showTooltip && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 bg-[#11132F] text-white text-xs font-normal p-3 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
          <div className="flex items-start gap-2">
            <Info className="w-4 h-4 shrink-0 text-green-400 mt-0.5" />
            <p>
              This badge indicates that the submitted professional and engagement information has been reviewed and validated by our team. 
              It does <strong className="font-semibold text-white">not</strong> imply skill ranking or guaranteed performance.
            </p>
          </div>
          {/* Tooltip arrow */}
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-900"></div>
        </div>
      )}
    </div>
  )
}
