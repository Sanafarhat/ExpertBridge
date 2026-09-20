/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { FileText, CheckCircle, XCircle, AlertCircle, FileLock, BrainCircuit, RefreshCw } from 'lucide-react'

export default function VerificationWorkspace({ initialData }: { initialData: any }) {
  const router = useRouter()
  const [data, setData] = useState(initialData)
  const [selectedDoc, setSelectedDoc] = useState<any | null>(null)
  const [notes, setNotes] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isRunningAI, setIsRunningAI] = useState(false)

  const handleRunAI = async () => {
    try {
      setIsRunningAI(true)
      const res = await fetch('/api/admin/verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'RUN_AI_VERIFICATION',
          verificationId: data.id,
        })
      })
      if (!res.ok) throw new Error('AI analysis failed')
      
      const { verification } = await res.json()
      setData(verification)
      router.refresh()
    } catch (err) {
      alert('Error running AI Verification. Check configuration.')
    } finally {
      setIsRunningAI(false)
    }
  }

  const handleDocumentAction = async (documentId: string, status: string) => {
    try {
      setIsSubmitting(true)
      const res = await fetch('/api/admin/verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'UPDATE_DOCUMENT_STATUS',
          documentId,
          status,
          notes
        })
      })
      if (!res.ok) throw new Error('Failed to update document')
      
      const { document } = await res.json()
      
      setData((prev: any) => ({
        ...prev,
        documents: prev.documents.map((d: any) => d.id === document.id ? document : d)
      }))
      setNotes('')
    } catch (err) {
      alert('Error updating document')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleExpertAction = async (status: string) => {
    try {
      setIsSubmitting(true)
      const res = await fetch('/api/admin/verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'UPDATE_VERIFICATION_STATUS',
          verificationId: data.id,
          expertId: data.expertId,
          status,
          notes
        })
      })
      if (!res.ok) throw new Error('Failed to update verification')
      
      const { verification } = await res.json()
      setData((prev: any) => ({ ...prev, status: verification.status }))
      setNotes('')
      router.refresh()
    } catch (err) {
      alert('Error updating expert')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex h-full flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-slate-200">
      
      {/* Column 1: Expert Profile Summary */}
      <div className="w-full md:w-1/3 flex flex-col h-full bg-slate-50">
        <div className="p-4 border-b bg-white font-semibold text-slate-800">
          Expert Profile
        </div>
        <div className="p-6 overflow-y-auto flex-1 space-y-6 text-sm">
          <div>
            <h3 className="text-slate-500 font-medium mb-1">Full Name</h3>
            <p className="font-semibold text-slate-900 text-base">{data.expert.fullName}</p>
          </div>
          <div>
            <h3 className="text-slate-500 font-medium mb-1">Current Role</h3>
            <p className="text-slate-900">{data.expert.designation} at {data.expert.organization}</p>
          </div>
          <div>
            <h3 className="text-slate-500 font-medium mb-1">Experience</h3>
            <p className="text-slate-900">{data.expert.yearsExperience} Years</p>
          </div>
          <div>
            <h3 className="text-slate-500 font-medium mb-1">Contact</h3>
            <p className="text-slate-900">{data.expert.phone || 'N/A'}</p>
            <p className="text-slate-900">{data.expert.location || 'N/A'}</p>
          </div>
          <div>
            <h3 className="text-slate-500 font-medium mb-2">Expertise Domains</h3>
            <div className="flex flex-wrap gap-2">
              {data.expert.expertTags.map((et: any) => (
                <span key={et.tag.id} className="px-2.5 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                  {et.tag.name}
                </span>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-slate-500 font-medium mb-2">Professional Bio</h3>
            <p className="text-slate-700 leading-relaxed bg-white p-3 rounded border border-slate-200">
              {data.expert.bio}
            </p>
          </div>
          <div>
            <h3 className="text-slate-500 font-medium mb-2">Engagement History</h3>
            {data.expert.engagements.length === 0 ? (
               <p className="text-slate-400 italic">No engagements listed.</p>
            ) : (
               <ul className="space-y-3">
                 {data.expert.engagements.map((eng: any) => (
                   <li key={eng.id} className="bg-white p-3 rounded border border-slate-200">
                     <p className="font-semibold text-slate-800">{eng.title}</p>
                     <p className="text-slate-600 text-xs">{eng.institutionName} • {eng.programType}</p>
                   </li>
                 ))}
               </ul>
            )}
          </div>
        </div>
      </div>

      {/* Column 2: Documents & Evidence */}
      <div className="w-full md:w-1/3 flex flex-col h-full bg-white relative">
        <div className="p-4 border-b font-semibold text-slate-800 flex justify-between items-center">
          <span>Documents & Evidence</span>
          <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full text-xs">{data.documents.length}</span>
        </div>
        <div className="p-4 overflow-y-auto flex-1 space-y-3">
          {data.documents.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-400">
               <FileLock className="w-12 h-12 mb-3 opacity-20" />
               <p>No documents uploaded.</p>
            </div>
          ) : (
            data.documents.map((doc: any) => (
              <button
                key={doc.id}
                onClick={() => setSelectedDoc(doc)}
                className={`w-full text-left p-4 rounded-xl border transition-all ${
                  selectedDoc?.id === doc.id 
                    ? 'border-blue-500 bg-blue-50 shadow-sm' 
                    : 'border-slate-200 hover:border-blue-300 bg-white'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg ${
                    doc.status === 'APPROVED' ? 'bg-green-100 text-green-600' :
                    doc.status === 'REJECTED' ? 'bg-red-100 text-red-600' :
                    'bg-slate-100 text-slate-500'
                  }`}>
                    {doc.status === 'APPROVED' ? <CheckCircle className="w-5 h-5" /> :
                     doc.status === 'REJECTED' ? <XCircle className="w-5 h-5" /> :
                     <FileText className="w-5 h-5" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-slate-900 truncate">{doc.fileName}</p>
                    <p className="text-xs text-slate-500 mt-1 uppercase tracking-wider">{doc.documentType} • {(doc.fileSize / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Column 3: Verification Actions & AI */}
      <div className="w-full md:w-1/3 flex flex-col h-full bg-slate-50 relative">
        <div className="p-4 border-b bg-white font-semibold text-slate-800 flex justify-between items-center">
          <span>Verification Actions</span>
        </div>
        <div className="p-6 overflow-y-auto flex-1 flex flex-col">

          {/* AI Insights Panel */}
          <div className="bg-white rounded-xl border border-blue-200 shadow-sm mb-6 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 border-b border-blue-100 flex items-center justify-between">
              <div className="flex items-center gap-2 font-semibold text-blue-900">
                <BrainCircuit className="w-5 h-5 text-blue-600" />
                AI Verification Insights
              </div>
              {!data.aiProcessedAt && (
                <button 
                  onClick={handleRunAI} 
                  disabled={isRunningAI}
                  className="text-xs bg-accent text-white px-4 py-1.5 rounded-full flex items-center gap-1 font-semibold hover:bg-accent-light disabled:opacity-50 shadow-none"
                >
                  {isRunningAI ? <RefreshCw className="w-3 h-3 animate-spin" /> : 'Run Analysis'}
                </button>
              )}
            </div>
            
            <div className="p-4 space-y-4 text-sm">
              {!data.aiProcessedAt ? (
                <div className="text-slate-500 text-center py-4">
                  <p>AI has not analyzed this submission yet.</p>
                  <p className="text-xs mt-1">Run analysis to get automated consistency checks.</p>
                </div>
              ) : (
                <>
                  <div className="flex justify-between items-center border-b pb-3">
                    <span className="text-slate-600">Analysis Complete</span>
                    <span className="font-bold text-blue-700">Confidence: {data.aiConfidence}%</span>
                  </div>
                  
                  <div>
                    <p className="font-medium text-slate-900 mb-2">Findings Summary:</p>
                    <p className="text-slate-700 bg-slate-50 p-3 rounded border text-xs">{data.aiSummary}</p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-start gap-2 text-green-700 bg-green-50 p-2 rounded">
                      <CheckCircle className="w-4 h-4 mt-0.5 shrink-0" />
                      <div>
                        <span className="font-medium">Consistent: </span>
                        {data.aiConsistent ? 'Profile information is consistent with evidence.' : 'Issues detected.'}
                      </div>
                    </div>

                    {data.aiInconsistencies && JSON.parse(data.aiInconsistencies).length > 0 && (
                      <div className="flex items-start gap-2 text-amber-700 bg-amber-50 p-2 rounded">
                        <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                        <div>
                          <span className="font-medium">Potential Inconsistencies: </span>
                          <ul className="list-disc pl-4 mt-1 space-y-1 text-xs">
                            {JSON.parse(data.aiInconsistencies).map((inc: string, i: number) => <li key={i}>{inc}</li>)}
                          </ul>
                        </div>
                      </div>
                    )}

                    {data.aiMissingInfo && JSON.parse(data.aiMissingInfo).length > 0 && (
                      <div className="flex items-start gap-2 text-red-700 bg-red-50 p-2 rounded">
                        <XCircle className="w-4 h-4 mt-0.5 shrink-0" />
                        <div>
                          <span className="font-medium">Missing Evidence: </span>
                          <ul className="list-disc pl-4 mt-1 space-y-1 text-xs">
                            {JSON.parse(data.aiMissingInfo).map((miss: string, i: number) => <li key={i}>{miss}</li>)}
                          </ul>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <p className="text-[11px] text-slate-400 mt-2 italic text-center">
                    AI assists verification. Final decisions are made by authorized administrators.
                  </p>
                </>
              )}
            </div>
          </div>
          
          
          {selectedDoc ? (
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm mb-6 animate-in fade-in">
               <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                 Document Review
                 <span className="text-xs font-normal text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">{selectedDoc.status}</span>
               </h3>
               
               <a 
                 href={`/api/documents/${selectedDoc.id}`} 
                 target="_blank" 
                 rel="noreferrer"
                 className="flex items-center justify-center gap-2 w-full py-2 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-lg text-sm font-medium transition-colors mb-4"
               >
                 <FileText className="w-4 h-4" /> View Document securely
               </a>

               <div className="space-y-3">
                 <textarea 
                   placeholder="Add notes for this document (optional)..."
                   value={notes}
                   onChange={e => setNotes(e.target.value)}
                   className="w-full p-3 text-sm border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 resize-none h-24"
                 />
                 <div className="grid grid-cols-2 gap-2">
                   <button 
                     disabled={isSubmitting || selectedDoc.status === 'REJECTED'}
                     onClick={() => handleDocumentAction(selectedDoc.id, 'REJECTED')}
                     className="py-2 flex items-center justify-center gap-2 border border-red-200 bg-red-50 text-red-600 rounded-lg text-sm font-medium hover:bg-red-100 disabled:opacity-50 transition-colors"
                   >
                     <XCircle className="w-4 h-4" /> Reject
                   </button>
                   <button 
                     disabled={isSubmitting || selectedDoc.status === 'APPROVED'}
                     onClick={() => handleDocumentAction(selectedDoc.id, 'APPROVED')}
                     className="py-2 flex items-center justify-center gap-2 border border-green-200 bg-green-50 text-green-600 rounded-lg text-sm font-medium hover:bg-green-100 disabled:opacity-50 transition-colors"
                   >
                     <CheckCircle className="w-4 h-4" /> Approve
                   </button>
                 </div>
               </div>
            </div>
          ) : (
            <div className="bg-slate-100 border border-slate-200 border-dashed rounded-xl p-6 text-center text-slate-500 text-sm mb-6">
               Select a document from the center column to review it.
            </div>
          )}

          <div className="mt-auto pt-6 border-t border-slate-200">
            <h3 className="font-semibold text-slate-900 mb-1">Final Decision</h3>
            <p className="text-sm text-slate-500 mb-4">Current Status: <span className="font-bold text-slate-700">{data.status}</span></p>

            <textarea 
               placeholder="Add final verification notes..."
               value={selectedDoc ? '' : notes} // Use notes state if no doc selected
               onChange={e => !selectedDoc && setNotes(e.target.value)}
               className="w-full p-3 text-sm border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 resize-none h-24 mb-4"
               disabled={!!selectedDoc}
            />

            <div className="space-y-3">
              <button 
                disabled={isSubmitting}
                onClick={() => handleExpertAction('VERIFIED')}
                className="w-full py-2.5 flex items-center justify-center gap-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 disabled:opacity-50 transition-colors shadow-sm"
              >
                <CheckCircle className="w-4 h-4" /> Verify & Approve Expert
              </button>
              
              <button 
                disabled={isSubmitting}
                onClick={() => handleExpertAction('NEEDS_CLARIFICATION')}
                className="w-full py-2.5 flex items-center justify-center gap-2 bg-amber-500 text-white rounded-lg text-sm font-medium hover:bg-amber-600 disabled:opacity-50 transition-colors shadow-sm"
              >
                <AlertCircle className="w-4 h-4" /> Request Clarification
              </button>

              <button 
                disabled={isSubmitting}
                onClick={() => handleExpertAction('REJECTED')}
                className="w-full py-2.5 flex items-center justify-center gap-2 border border-red-200 bg-white text-red-600 rounded-lg text-sm font-medium hover:bg-red-50 disabled:opacity-50 transition-colors"
              >
                <XCircle className="w-4 h-4" /> Reject Expert
              </button>
            </div>
          </div>

        </div>
      </div>

    </div>
  )
}
