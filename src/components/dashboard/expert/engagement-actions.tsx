'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { CheckCircle, XCircle } from 'lucide-react'

export default function EngagementActions({ requestId }: { requestId: string }) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleAction = async (action: 'ACCEPT' | 'DECLINE') => {
    try {
      setIsSubmitting(true)
      const res = await fetch('/api/engagements/respond', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requestId, action })
      })

      if (!res.ok) throw new Error('Failed to respond to request')
      
      router.refresh()
    } catch {
      alert('Error updating request')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex items-center gap-3">
      <button 
        onClick={() => handleAction('DECLINE')}
        disabled={isSubmitting}
        className="px-4 py-2 flex items-center justify-center gap-2 border border-red-200 bg-red-50 text-red-600 rounded-lg text-sm font-medium hover:bg-red-100 disabled:opacity-50 transition-colors"
      >
        <XCircle className="w-4 h-4" /> Decline
      </button>
      <button 
        onClick={() => handleAction('ACCEPT')}
        disabled={isSubmitting}
        className="px-4 py-2 flex items-center justify-center gap-2 bg-accent text-white rounded-full text-sm font-semibold hover:bg-accent-light disabled:opacity-50 transition-colors shadow-none"
      >
        <CheckCircle className="w-4 h-4" /> Accept
      </button>
    </div>
  )
}
