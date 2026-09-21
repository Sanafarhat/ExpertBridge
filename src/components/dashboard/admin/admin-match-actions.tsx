'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Play, CheckCircle2, Search } from 'lucide-react'

export default function AdminMatchActions({ requirementId, status, hasMatches }: { requirementId: string, status: string, hasMatches: boolean }) {
  const router = useRouter()
  const [isGenerating, setIsGenerating] = useState(false)
  const [isReleasing, setIsReleasing] = useState(false)

  const handleGenerate = async () => {
    try {
      setIsGenerating(true)
      const res = await fetch(`/api/admin/requirements/${requirementId}/match`, { method: 'POST' })
      if (!res.ok) throw new Error('Failed to generate matches')
      router.refresh()
    } catch (e) {
      console.error(e)
      alert('Error generating matches')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleRelease = async () => {
    try {
      setIsReleasing(true)
      const res = await fetch(`/api/admin/requirements/${requirementId}/release`, { method: 'POST' })
      if (!res.ok) throw new Error('Failed to release matches')
      router.refresh()
    } catch (e) {
      console.error(e)
      alert('Error releasing matches')
    } finally {
      setIsReleasing(false)
    }
  }

  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-100 flex flex-col items-center text-center justify-center space-y-4">
      {!hasMatches && status === 'SUBMITTED' ? (
        <>
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm text-blue-600 mb-2">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-slate-900">Run Deterministic Matching</h3>
          <p className="text-sm text-slate-600 max-w-md">Query the database for VERIFIED experts only, and deterministically calculate domain, suitability, availability, and experience scores.</p>
          <button 
            onClick={handleGenerate}
            disabled={isGenerating}
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium flex items-center gap-2 transition-colors disabled:opacity-50"
          >
            {isGenerating ? 'Generating...' : 'Generate Recommendations'} <Play className="w-4 h-4" />
          </button>
        </>
      ) : status === 'RECOMMENDATIONS_READY' ? (
        <>
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm text-green-600 mb-2">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-slate-900">Matches Generated</h3>
          <p className="text-sm text-slate-600 max-w-md">Review the exact scores below. Once satisfied, release them to the institution.</p>
          <button 
            onClick={handleRelease}
            disabled={isReleasing}
            className="px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium flex items-center gap-2 transition-colors disabled:opacity-50"
          >
            {isReleasing ? 'Releasing...' : 'Release to Institution'} <CheckCircle2 className="w-4 h-4" />
          </button>
        </>
      ) : (
        <>
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm text-slate-400 mb-2">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-slate-900">Recommendations Released</h3>
          <p className="text-sm text-slate-600 max-w-md">The institution can now view these recommendations.</p>
        </>
      )}
    </div>
  )
}
