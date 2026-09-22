'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminAssignRoles({ recommendationId, currentStatus, currentContact }: { recommendationId: string, currentStatus: string | null, currentContact: string | null }) {
  const router = useRouter()
  const [status, setStatus] = useState(currentStatus || '')
  const [isUpdating, setIsUpdating] = useState(false)

  const handleUpdate = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value
    setStatus(newStatus)
    try {
      setIsUpdating(true)
      const res = await fetch(`/api/admin/requirements/recommendations/${recommendationId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ selectionStatus: newStatus })
      })
      if (!res.ok) throw new Error('Failed to update')
      router.refresh()
    } catch (err) {
      console.error(err)
      alert('Error updating selection status')
      setStatus(currentStatus || '')
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <div className="flex flex-col items-end gap-2">
      <select 
        value={status} 
        onChange={handleUpdate}
        disabled={isUpdating}
        className="text-sm border border-slate-300 rounded-md px-2 py-1 bg-white font-medium text-slate-700"
      >
        <option value="">Assign Role...</option>
        <option value="PRIMARY">Primary Candidate</option>
        <option value="WAITLIST_1">Waitlist #1</option>
        <option value="WAITLIST_2">Waitlist #2</option>
      </select>
      
      {currentContact && (
        <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded ${currentContact === 'PENDING' ? 'bg-amber-100 text-amber-800' : currentContact === 'CONTACTED' ? 'bg-blue-100 text-blue-800' : currentContact === 'ACCEPTED' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          Contact: {currentContact}
        </span>
      )}
    </div>
  )
}
