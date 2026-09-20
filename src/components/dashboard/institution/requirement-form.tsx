'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search, Calendar, Clock, Users, DollarSign, ArrowRight, CheckCircle2, FileText, Upload } from 'lucide-react'

const PROGRAM_TYPES = [
  'Guest Lecture', 'Workshop', 'Panel Discussion', 'Mentoring', 'Faculty Development', 'Industry Interaction', 'Other'
]

export default function RequirementForm({}: { categories: unknown[] }) {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [inputType, setInputType] = useState<'form' | 'pdf'>('form')
  const [pdfFile, setPdfFile] = useState<File | null>(null)

  const [formData, setFormData] = useState({
    domain: '',
    programType: '',
    preferredDate: '',
    duration: '',
    audience: '',
    budget: '',
    description: ''
  })

  const handleNext = () => setStep(s => s + 1)
  const handleBack = () => setStep(s => s - 1)

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true)
      setError('')

      let requirementId = ''

      if (inputType === 'pdf') {
        if (!pdfFile) throw new Error('Please select a PDF file')
        const fd = new FormData()
        fd.append('file', pdfFile)

        const res = await fetch('/api/institution/requirements/upload', {
          method: 'POST',
          body: fd
        })
        if (!res.ok) {
          const errData = await res.json()
          throw new Error(errData.error || 'Failed to upload and analyze PDF')
        }
        const { requirement } = await res.json()
        requirementId = requirement.id
      } else {
        const res = await fetch('/api/institution/requirements', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        })

        if (!res.ok) throw new Error('Failed to create requirement')
        
        const { requirement } = await res.json()
        requirementId = requirement.id
      }
      
      // Redirect to the matching page
      router.push(`/dashboard/requirements/${requirementId}/matches`)
    } catch (err) {
      console.error('Submit error:', err)
      setError((err as Error).message || 'Failed to submit requirement')
      setIsSubmitting(false)
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      
      <div className="flex border-b border-slate-200">
        <button 
          onClick={() => setInputType('form')} 
          className={`flex-1 py-4 text-sm font-semibold transition-colors ${inputType === 'form' ? 'text-blue-700 border-b-2 border-blue-700 bg-blue-50/50' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'}`}
        >
          Fill Requirement Form
        </button>
        <button 
          onClick={() => setInputType('pdf')} 
          className={`flex-1 py-4 text-sm font-semibold transition-colors flex items-center justify-center gap-2 ${inputType === 'pdf' ? 'text-blue-700 border-b-2 border-blue-700 bg-blue-50/50' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'}`}
        >
          <FileText className="w-4 h-4" /> Upload Requirement PDF
        </button>
      </div>

      {inputType === 'form' ? (
        <>
          {/* Progress Bar */}
          <div className="flex border-b border-slate-200">
        {[1, 2, 3, 4].map((s) => (
          <div key={s} className="flex-1 h-2 relative">
             <div className={`absolute inset-0 transition-colors ${step >= s ? 'bg-accent' : 'bg-cream'}`} />
             {s < 4 && <div className="absolute right-0 top-0 bottom-0 w-px bg-white z-10" />}
          </div>
        ))}
      </div>

      <div className="p-8 md:p-12 min-h-[400px]">
        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg text-sm border border-red-200">
            {error}
          </div>
        )}

        {/* Step 1: Domain & Program Type */}
        {step === 1 && (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
            <div>
              <h2 className="text-xl font-bold text-slate-900 mb-4">What topic or domain are you looking for?</h2>
              <div className="relative">
                <Search className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input 
                  type="text"
                  value={formData.domain}
                  onChange={(e) => setFormData({...formData, domain: e.target.value})}
                  placeholder="e.g. Artificial Intelligence, Marketing Strategy, Corporate Governance..."
                  className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>

            <div>
              <h2 className="text-xl font-bold text-slate-900 mb-4">Select the program type</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {PROGRAM_TYPES.map(type => (
                  <button
                    key={type}
                    onClick={() => setFormData({...formData, programType: type})}
                    className={`p-3 border rounded-xl text-sm font-medium text-left transition-all ${
                      formData.programType === type 
                        ? 'border-blue-600 bg-blue-50 text-blue-700 ring-1 ring-blue-600' 
                        : 'border-slate-200 hover:border-blue-300 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Logistics */}
        {step === 2 && (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
             <h2 className="text-xl font-bold text-slate-900">When and how long?</h2>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                    <Calendar className="w-4 h-4 text-slate-400" /> Preferred Date
                  </label>
                  <input 
                    type="date"
                    value={formData.preferredDate}
                    onChange={(e) => setFormData({...formData, preferredDate: e.target.value})}
                    className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div className="space-y-3">
                  <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                    <Clock className="w-4 h-4 text-slate-400" /> Duration
                  </label>
                  <select
                    value={formData.duration}
                    onChange={(e) => setFormData({...formData, duration: e.target.value})}
                    className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                  >
                    <option value="">Select duration...</option>
                    <option value="1 Hour">1 Hour</option>
                    <option value="2 Hours">2 Hours</option>
                    <option value="Half Day">Half Day</option>
                    <option value="Full Day">Full Day</option>
                    <option value="Multiple Days">Multiple Days</option>
                  </select>
                </div>
             </div>
          </div>
        )}

        {/* Step 3: Audience & Budget */}
        {step === 3 && (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
             <h2 className="text-xl font-bold text-slate-900">Audience & Budget</h2>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                    <Users className="w-4 h-4 text-slate-400" /> Target Audience
                  </label>
                  <input 
                    type="text"
                    value={formData.audience}
                    onChange={(e) => setFormData({...formData, audience: e.target.value})}
                    placeholder="e.g. 50 MBA Students, 20 Senior Executives..."
                    className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div className="space-y-3">
                  <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                    <DollarSign className="w-4 h-4 text-slate-400" /> Budget (Optional)
                  </label>
                  <input 
                    type="text"
                    value={formData.budget}
                    onChange={(e) => setFormData({...formData, budget: e.target.value})}
                    placeholder="e.g. $500, Travel Covered, Pro-bono..."
                    className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
             </div>
          </div>
        )}

        {/* Step 4: Additional Requirements */}
        {step === 4 && (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
             <h2 className="text-xl font-bold text-slate-900">Additional Requirements</h2>
             <div className="space-y-3">
                <label className="text-sm font-medium text-slate-700">Provide any specific goals or expectations</label>
                <textarea 
                  rows={5}
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="We are looking for an expert who can share practical case studies on..."
                  className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                />
             </div>
          </div>
        )}

      </div>

      {/* Footer Actions */}
      <div className="bg-slate-50 p-6 border-t border-slate-200 flex justify-between items-center">
         <button
           onClick={handleBack}
           disabled={step === 1 || isSubmitting}
           className="px-6 py-2.5 text-sm font-medium text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 transition-colors"
         >
           Back
         </button>
         
         {step < 4 ? (
           <button
             onClick={handleNext}
             disabled={step === 1 && (!formData.domain || !formData.programType)}
             className="px-6 py-2.5 text-sm font-semibold text-white bg-accent rounded-full hover:bg-accent-light disabled:opacity-50 flex items-center gap-2 transition-colors shadow-none"
           >
             Continue <ArrowRight className="w-4 h-4" />
           </button>
         ) : (
           <button
             onClick={handleSubmit}
             disabled={isSubmitting}
             className="px-8 py-2.5 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center gap-2 transition-colors shadow-sm"
           >
             {isSubmitting ? 'Searching...' : 'Find Matching Experts'} <CheckCircle2 className="w-4 h-4" />
           </button>
         )}
      </div>
        </>
      ) : (
        <div className="p-8 md:p-12 min-h-[400px] flex flex-col items-center justify-center text-center">
          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg text-sm border border-red-200 w-full max-w-md">
              {error}
            </div>
          )}
          <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-6">
            <Upload className="w-8 h-8 text-blue-600" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">Upload Requirement PDF</h2>
          <p className="text-slate-500 mb-8 max-w-md">
            Our AI will automatically extract the topic, duration, audience, and other requirements from your document to find the perfect expert.
          </p>
          
          <label className="cursor-pointer">
            <input 
              type="file" 
              accept="application/pdf" 
              className="hidden" 
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  setPdfFile(e.target.files[0])
                }
              }}
            />
            <div className={`px-8 py-4 border-2 border-dashed rounded-xl transition-colors ${pdfFile ? 'border-blue-500 bg-blue-50' : 'border-slate-300 hover:border-slate-400 bg-slate-50 hover:bg-slate-100'}`}>
              <span className="font-medium text-slate-700">
                {pdfFile ? pdfFile.name : 'Select PDF File'}
              </span>
            </div>
          </label>

          <button
            onClick={handleSubmit}
            disabled={!pdfFile || isSubmitting}
            className="mt-8 px-8 py-3 font-medium text-white bg-blue-600 rounded-full hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2 transition-colors"
          >
            {isSubmitting ? 'Analyzing Document & Searching...' : 'Analyze & Find Experts'} <CheckCircle2 className="w-5 h-5" />
          </button>
        </div>
      )}

    </div>
  )
}
