'use client'

import { useState } from 'react'
import { Send, CheckCircle } from 'lucide-react'

export default function RequestEngagementButton({ 
  requirementId, 
  expertId, 
  institutionId 
}: { 
  requirementId: string, 
  expertId: string, 
  institutionId: string 
}) {
  const [status, setStatus] = useState<'IDLE' | 'LOADING' | 'SENT'>('IDLE')

  const handleRequest = async () => {
    try {
      setStatus('LOADING')
      const res = await fetch('/api/engagements/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requirementId, expertId, institutionId, message: '' })
      })

      if (!res.ok) throw new Error('Failed to send request')
      
      setStatus('SENT')
    } catch {
      alert('Error sending request')
      setStatus('IDLE')
    }
  }

  if (status === 'SENT') {
    return (
      <button disabled className="w-full py-2.5 px-4 flex items-center justify-center gap-2 bg-green-50 text-green-600 rounded-lg text-sm font-medium border border-green-200">
        <CheckCircle className="w-4 h-4" /> Request Sent
      </button>
    )
  }

  return (
    <button 
      onClick={handleRequest}
      disabled={status === 'LOADING'}
      className="w-full py-2.5 px-4 flex items-center justify-center gap-2 bg-accent text-white rounded-full text-sm font-semibold hover:bg-accent-light disabled:opacity-50 transition-colors shadow-none"
    >
      <Send className="w-4 h-4" /> {status === 'LOADING' ? 'Sending...' : 'Request Engagement'}
    </button>
  )
}
