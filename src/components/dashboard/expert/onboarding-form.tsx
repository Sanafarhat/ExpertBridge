/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { CheckCircle2, ChevronRight, Upload, X } from 'lucide-react'

// Steps definition
const STEPS = [
  'Professional Profile',
  'Expertise',
  'Experience',
  'Engagement History',
  'Documents',
  'Review & Submit'
]

export default function OnboardingForm({ initialData, categories }: { initialData: any, categories: any[] }) {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  // Form states
  const [profileData, setProfileData] = useState({
    fullName: initialData?.fullName || '',
    designation: initialData?.designation || '',
    organization: initialData?.organization || '',
    bio: initialData?.bio || '',
    phone: initialData?.phone || '',
    location: initialData?.location || '',
    linkedinUrl: initialData?.linkedinUrl || '',
    yearsExperience: initialData?.yearsExperience || '',
  })

  // Expertise tags selected
  const [selectedTags, setSelectedTags] = useState<string[]>(
    initialData?.expertTags?.map((et: any) => et.tag.id) || []
  )

  // Experience roles (for now just using text in bio or we can do simplified list)
  // Let's implement simplified text array or let it be handled by a text area if schema lacks specific model for Roles.
  // Wait, schema has ExpertProfile.yearsExperience but no explicit 'Role' model. We will just use bio to store it, or add structured JSON to bio.
  // The schema doesn't have a `Role` model for previous roles. We can store it as a JSON string in a new field or just rely on 'designation' & 'organization'.
  // Actually, Phase 3 spec says "Current role, Previous roles". We'll just put a big textarea for now.
  const [experienceText, setExperienceText] = useState('')

  // Engagement History
  const [engagements, setEngagements] = useState<any[]>(initialData?.engagements || [])

  // Documents
  const [documents, setDocuments] = useState<any[]>(initialData?.documents || [])
  const [uploading, setUploading] = useState(false)

  const handleNext = async () => {
    // Basic validation before saving progress
    setError('')
    
    // Save draft state
    try {
      setIsSubmitting(true)
      const res = await fetch('/api/expert/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'SAVE_DRAFT',
          profileData,
          selectedTags,
          engagements,
        })
      })

      if (!res.ok) throw new Error('Failed to save progress')

      if (currentStep < STEPS.length - 1) {
        setCurrentStep(s => s + 1)
        window.scrollTo(0, 0)
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleBack = () => {
    if (currentStep > 0) setCurrentStep(s => s - 1)
  }

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true)
      const res = await fetch('/api/expert/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'SUBMIT_FOR_VERIFICATION',
          profileData,
          selectedTags,
          engagements,
        })
      })

      if (!res.ok) throw new Error('Failed to submit application')

      router.push('/dashboard/verification')
      router.refresh()
    } catch (err: any) {
      setError(err.message)
      setIsSubmitting(false)
    }
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const formData = new FormData()
    formData.append('file', file)
    // Basic file type metadata
    formData.append('documentType', 'OTHER')

    setUploading(true)
    setError('')
    try {
      const res = await fetch('/api/expert/upload', {
        method: 'POST',
        body: formData
      })
      if (!res.ok) throw new Error('Failed to upload document')
      const doc = await res.json()
      setDocuments(prev => [...prev, doc])
    } catch (err: any) {
      setError(err.message)
    } finally {
      setUploading(false)
      // reset file input
      e.target.value = ''
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col md:flex-row min-h-[600px]">
      
      {/* Sidebar Navigation */}
      <div className="w-full md:w-64 bg-slate-50 border-r border-slate-200 p-6 flex flex-col gap-4">
        {STEPS.map((step, idx) => (
          <div 
            key={idx} 
            className={`flex items-center gap-3 p-2 rounded-lg transition-colors ${
              currentStep === idx ? 'bg-blue-100 text-blue-700 font-medium' : 
              currentStep > idx ? 'text-slate-600' : 'text-slate-400'
            }`}
          >
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
              currentStep > idx ? 'bg-green-500 text-white' : 
              currentStep === idx ? 'bg-accent text-white' : 'bg-cream text-[#666778]'
            }`}>
              {currentStep > idx ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
            </div>
            <span className="text-sm">{step}</span>
          </div>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-6 md:p-10 flex flex-col relative">
        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg text-sm border border-red-200">
            {error}
          </div>
        )}

        <div className="flex-1">
          {/* Step 1: Professional Profile */}
          {currentStep === 0 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <h2 className="text-xl font-bold text-slate-900 border-b pb-2">Professional Profile</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Full Name *</label>
                  <input 
                    type="text" 
                    value={profileData.fullName}
                    onChange={(e) => setProfileData({...profileData, fullName: e.target.value})}
                    className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
                    placeholder="Dr. John Doe"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Designation *</label>
                  <input 
                    type="text" 
                    value={profileData.designation}
                    onChange={(e) => setProfileData({...profileData, designation: e.target.value})}
                    className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
                    placeholder="Chief Technology Officer"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Organization *</label>
                  <input 
                    type="text" 
                    value={profileData.organization}
                    onChange={(e) => setProfileData({...profileData, organization: e.target.value})}
                    className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
                    placeholder="Tech Corp Inc."
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Phone</label>
                  <input 
                    type="tel" 
                    value={profileData.phone}
                    onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                    className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
                    placeholder="+1 234 567 8900"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Location</label>
                  <input 
                    type="text" 
                    value={profileData.location}
                    onChange={(e) => setProfileData({...profileData, location: e.target.value})}
                    className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
                    placeholder="New York, USA"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">LinkedIn URL</label>
                  <input 
                    type="url" 
                    value={profileData.linkedinUrl}
                    onChange={(e) => setProfileData({...profileData, linkedinUrl: e.target.value})}
                    className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
                    placeholder="https://linkedin.com/in/..."
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Professional Bio *</label>
                <textarea 
                  rows={4}
                  value={profileData.bio}
                  onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
                  className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none" 
                  placeholder="Describe your professional journey, key achievements, and speaking style..."
                />
              </div>
            </div>
          )}

          {/* Step 2: Expertise */}
          {currentStep === 1 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <h2 className="text-xl font-bold text-slate-900 border-b pb-2">Expertise</h2>
              <p className="text-sm text-slate-500">Select domains and tags that best represent your knowledge areas.</p>
              
              {categories.map((category) => (
                <div key={category.id} className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <h3 className="font-semibold text-slate-800">{category.name}</h3>
                  <div className="flex flex-wrap gap-2">
                    {category.tags.map((tag: any) => {
                      const isSelected = selectedTags.includes(tag.id)
                      return (
                        <button
                          key={tag.id}
                          type="button"
                          onClick={() => {
                            if (isSelected) {
                              setSelectedTags(selectedTags.filter(id => id !== tag.id))
                            } else {
                              setSelectedTags([...selectedTags, tag.id])
                            }
                          }}
                          className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors border ${
                            isSelected 
                              ? 'bg-accent text-white border-accent shadow-none' 
                              : 'bg-white text-slate-600 border-slate-300 hover:border-blue-400 hover:text-blue-600'
                          }`}
                        >
                          {tag.name}
                        </button>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Step 3: Experience */}
          {currentStep === 2 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
               <h2 className="text-xl font-bold text-slate-900 border-b pb-2">Experience</h2>
               <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Total Years of Experience *</label>
                    <input 
                      type="number" 
                      value={profileData.yearsExperience}
                      onChange={(e) => setProfileData({...profileData, yearsExperience: e.target.value})}
                      className="w-full md:w-1/3 p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
                      placeholder="e.g. 15"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Career Summary & Previous Roles</label>
                    <textarea 
                      rows={6}
                      value={experienceText}
                      onChange={(e) => setExperienceText(e.target.value)}
                      className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none" 
                      placeholder="List your previous roles, e.g.&#10;2018-2022: VP Engineering at StartupX&#10;2015-2018: Senior Developer at TechCorp"
                    />
                  </div>
               </div>
            </div>
          )}

          {/* Step 4: Engagement History */}
          {currentStep === 3 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
               <div className="flex justify-between items-end border-b pb-2">
                  <h2 className="text-xl font-bold text-slate-900">Engagement History</h2>
                  <button type="button" className="text-sm text-blue-600 font-medium hover:underline">
                    + Add Engagement
                  </button>
               </div>
               <p className="text-sm text-slate-500">Add past speaking events, guest lectures, or mentorship programs you&apos;ve conducted.</p>
               
               {engagements.length === 0 ? (
                 <div className="bg-slate-50 border border-slate-200 border-dashed rounded-xl p-8 text-center">
                    <p className="text-slate-500 text-sm">No engagements added yet. This is optional but highly recommended for verification.</p>
                 </div>
               ) : (
                 <div className="space-y-4">
                    {engagements.map((eng, idx) => (
                      <div key={idx} className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm">
                         <h4 className="font-bold text-slate-800">{eng.title}</h4>
                         <p className="text-sm text-slate-600">{eng.institutionName} • {eng.programType} • {new Date(eng.date).toLocaleDateString()}</p>
                      </div>
                    ))}
                 </div>
               )}
            </div>
          )}

          {/* Step 5: Documents */}
          {currentStep === 4 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
               <h2 className="text-xl font-bold text-slate-900 border-b pb-2">Verification Documents</h2>
               <p className="text-sm text-slate-500">Upload supporting documents like certificates, event brochures, or recommendation letters. These are kept private and secure.</p>
               
               <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center bg-slate-50 hover:bg-slate-100 transition-colors relative">
                 <input 
                   type="file" 
                   onChange={handleFileUpload} 
                   disabled={uploading}
                   className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed" 
                 />
                 <Upload className="mx-auto h-8 w-8 text-slate-400 mb-3" />
                 <p className="text-sm font-medium text-slate-700">
                   {uploading ? 'Uploading...' : 'Click or drag file to upload'}
                 </p>
                 <p className="text-xs text-slate-500 mt-1">PDF, JPG, PNG up to 10MB</p>
               </div>

               {documents.length > 0 && (
                 <div className="mt-6">
                   <h4 className="font-semibold text-slate-800 mb-3">Uploaded Files</h4>
                   <div className="space-y-2">
                     {documents.map((doc, idx) => (
                       <div key={idx} className="flex items-center justify-between p-3 bg-white border border-slate-200 rounded-lg shadow-sm">
                          <span className="text-sm font-medium text-slate-700 truncate max-w-[200px] md:max-w-md">{doc.fileName}</span>
                          <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full font-medium">Uploaded</span>
                       </div>
                     ))}
                   </div>
                 </div>
               )}
            </div>
          )}

          {/* Step 6: Review & Submit */}
          {currentStep === 5 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
               <h2 className="text-xl font-bold text-slate-900 border-b pb-2">Review & Submit</h2>
               <p className="text-sm text-slate-500">Review your information before submitting. Once submitted, our team will verify your profile.</p>
               
               <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                     <div>
                        <span className="block text-slate-500 mb-1">Full Name</span>
                        <span className="font-medium text-slate-900">{profileData.fullName || '—'}</span>
                     </div>
                     <div>
                        <span className="block text-slate-500 mb-1">Designation</span>
                        <span className="font-medium text-slate-900">{profileData.designation || '—'}</span>
                     </div>
                     <div>
                        <span className="block text-slate-500 mb-1">Organization</span>
                        <span className="font-medium text-slate-900">{profileData.organization || '—'}</span>
                     </div>
                     <div>
                        <span className="block text-slate-500 mb-1">Experience</span>
                        <span className="font-medium text-slate-900">{profileData.yearsExperience ? `${profileData.yearsExperience} Years` : '—'}</span>
                     </div>
                  </div>
                  <hr className="border-slate-200 my-2" />
                  <div className="flex justify-between items-center text-sm">
                     <span className="text-slate-500">Expertise Tags Selected</span>
                     <span className="font-bold text-slate-900">{selectedTags.length}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                     <span className="text-slate-500">Engagements Listed</span>
                     <span className="font-bold text-slate-900">{engagements.length}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                     <span className="text-slate-500">Documents Uploaded</span>
                     <span className="font-bold text-slate-900">{documents.length}</span>
                  </div>
               </div>

               <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm text-amber-800">
                  By submitting your profile, you confirm that all provided information is accurate and you authorize ExpertBridge to verify these details.
               </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="mt-8 pt-6 border-t flex items-center justify-between">
          <button 
            type="button" 
            onClick={handleBack}
            disabled={currentStep === 0 || isSubmitting}
            className="px-5 py-2.5 text-sm font-medium text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Back
          </button>
          
          {currentStep < STEPS.length - 1 ? (
            <button 
              type="button" 
              onClick={handleNext}
              disabled={isSubmitting}
              className="px-6 py-2.5 text-sm font-medium text-white bg-accent rounded-full hover:bg-accent-light disabled:opacity-50 flex items-center gap-2 transition-colors shadow-none"
            >
              {isSubmitting ? 'Saving...' : 'Next Step'} <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button 
              type="button" 
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-6 py-2.5 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center gap-2 transition-colors shadow-sm"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Verification'} <CheckCircle2 className="w-4 h-4" />
            </button>
          )}
        </div>

      </div>
    </div>
  )
}
