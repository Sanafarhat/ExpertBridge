'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ShieldCheck, ArrowRight, ArrowLeft, CheckCircle2, User, Briefcase, Award, Calendar, FileText, CheckCircle } from 'lucide-react'

export default function ExpertRegistrationPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  // Form State
  const [formData, setFormData] = useState({
    // Step 1: Account
    name: '', email: '', password: '', confirmPassword: '', phone: '',
    // Step 2: Professional
    designation: '', organization: '', role: '', bio: '', linkedin: '', location: '',
    // Step 3: Expertise
    primaryDomain: '', tagsInput: '', tags: [] as string[],
    // Step 4: Experience
    experienceYears: '', projects: '',
    // Step 5: Availability
    availabilityStatus: 'Online', preferredEngagementTypes: ''
  })

  // File State
  const [files, setFiles] = useState<{ [key: string]: File | null }>({
    idProof: null, educationProof: null, employmentProof: null, certificationProof: null
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: string) => {
    if (e.target.files && e.target.files.length > 0) {
      setFiles(prev => ({ ...prev, [type]: e.target.files![0] }))
    }
  }

  const handleAddTag = () => {
    if (formData.tagsInput.trim() && !formData.tags.includes(formData.tagsInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, prev.tagsInput.trim()],
        tagsInput: ''
      }))
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tagToRemove)
    }))
  }

  const nextStep = () => {
    setError(null)
    if (step === 1 && formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      return
    }
    setStep(prev => prev + 1)
  }

  const prevStep = () => setStep(prev => prev - 1)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsSubmitting(true)
    
    try {
      const submitData = new FormData()
      
      // Append JSON data
      Object.entries(formData).forEach(([key, value]) => {
        if (key === 'tags') {
          submitData.append(key, JSON.stringify(value))
        } else {
          submitData.append(key, String(value))
        }
      })
      
      // Append files
      Object.entries(files).forEach(([key, file]) => {
        if (file) submitData.append(key, file)
      })

      const response = await fetch('/api/auth/register/expert', {
        method: 'POST',
        body: submitData
      })

      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to register expert')
      }
      
      router.push('/login?registered=true&role=expert')
      
    } catch (err: any) {
      setError(err.message)
      setIsSubmitting(false)
    }
  }

  const stepIcons = [
    <User key="1" className="w-5 h-5" />, 
    <Briefcase key="2" className="w-5 h-5" />, 
    <Award key="3" className="w-5 h-5" />, 
    <Calendar key="4" className="w-5 h-5" />, 
    <FileText key="5" className="w-5 h-5" />, 
    <CheckCircle key="6" className="w-5 h-5" />
  ]

  const stepTitles = ["Account", "Professional", "Expertise", "Experience & Availability", "Documents", "Review"]

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-10">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <img src="/logo.jpg" alt="ExpertBridge Logo" className="w-9 h-9 object-cover rounded-full shadow-sm" />
            <span className="text-2xl font-bold tracking-tight text-slate-900">ExpertBridge</span>
          </Link>
          <h2 className="text-3xl font-extrabold text-slate-900">Expert Registration</h2>
          <p className="mt-2 text-lg text-slate-600">Join our network of verified domain experts.</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-14 px-2 sm:px-4">
          <div className="flex justify-between relative">
            <div className="absolute top-5 left-5 right-5 h-1 bg-slate-200 z-0 transform -translate-y-1/2"></div>
            <div className="absolute top-5 left-5 h-1 bg-accent z-0 transition-all duration-300 transform -translate-y-1/2" style={{ width: `calc(${((step - 1) / 5)} * (100% - 40px))` }}></div>
            
            {stepTitles.map((title, i) => (
              <div key={i} className="relative z-10 flex flex-col items-center w-10">
                <div className={`w-10 h-10 shrink-0 rounded-full flex items-center justify-center border-2 bg-white ${step >= i + 1 ? "border-accent text-accent" : "border-slate-300 text-slate-400"}`}>
                  {step > i + 1 ? <CheckCircle2 className="w-6 h-6 text-accent" /> : stepIcons[i]}
                </div>
                <span className={`text-xs mt-2 font-medium hidden sm:block whitespace-nowrap absolute top-11 left-1/2 transform -translate-x-1/2 ${step >= i + 1 ? 'text-slate-900' : 'text-slate-500'}`}>{title}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200">
          <form onSubmit={handleSubmit} className="p-8">
            
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* STEP 1 */}
            {step === 1 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                <h3 className="text-xl font-bold text-slate-900 mb-6">Account Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Full Name *</label>
                    <input required type="text" name="name" value={formData.name} onChange={handleChange} className="w-full rounded-lg border-slate-300 px-4 py-2 border" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Email Address *</label>
                    <input required type="email" name="email" value={formData.email} onChange={handleChange} className="w-full rounded-lg border-slate-300 px-4 py-2 border" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Password *</label>
                    <input required type="password" name="password" value={formData.password} onChange={handleChange} className="w-full rounded-lg border-slate-300 px-4 py-2 border" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Confirm Password *</label>
                    <input required type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} className="w-full rounded-lg border-slate-300 px-4 py-2 border" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number</label>
                    <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full rounded-lg border-slate-300 px-4 py-2 border" />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2 */}
            {step === 2 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                <h3 className="text-xl font-bold text-slate-900 mb-6">Professional Profile</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Current Designation *</label>
                    <input required type="text" name="designation" value={formData.designation} onChange={handleChange} placeholder="e.g. Senior Data Scientist" className="w-full rounded-lg border-slate-300 px-4 py-2 border" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Organization / Company *</label>
                    <input required type="text" name="organization" value={formData.organization} onChange={handleChange} placeholder="e.g. Acme Corp" className="w-full rounded-lg border-slate-300 px-4 py-2 border" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-1">Professional Bio</label>
                    <textarea name="bio" value={formData.bio} onChange={handleChange} rows={3} placeholder="A short description about your professional journey..." className="w-full rounded-lg border-slate-300 px-4 py-2 border"></textarea>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">LinkedIn Profile URL</label>
                    <input type="url" name="linkedin" value={formData.linkedin} onChange={handleChange} placeholder="https://linkedin.com/in/..." className="w-full rounded-lg border-slate-300 px-4 py-2 border" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Location</label>
                    <input type="text" name="location" value={formData.location} onChange={handleChange} placeholder="City, Country" className="w-full rounded-lg border-slate-300 px-4 py-2 border" />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3 */}
            {step === 3 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                <h3 className="text-xl font-bold text-slate-900 mb-6">Domain & Expertise</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-1">Primary Domain *</label>
                    <input required type="text" name="primaryDomain" value={formData.primaryDomain} onChange={handleChange} placeholder="e.g. Artificial Intelligence" className="w-full rounded-lg border-slate-300 px-4 py-2 border" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-1">Skills & Secondary Domains</label>
                    <div className="flex gap-2">
                      <input type="text" name="tagsInput" value={formData.tagsInput} onChange={handleChange} placeholder="e.g. Python, Machine Learning (Press Add)" className="flex-1 rounded-lg border-slate-300 px-4 py-2 border" />
                      <button type="button" onClick={handleAddTag} className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200">Add</button>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-3">
                      {formData.tags.map(tag => (
                        <span key={tag} className="inline-flex items-center gap-1 px-3 py-1 bg-accent/10 text-accent rounded-full text-sm">
                          {tag}
                          <button type="button" onClick={() => handleRemoveTag(tag)} className="text-accent hover:text-red-500 ml-1">&times;</button>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 4 */}
            {step === 4 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                <h3 className="text-xl font-bold text-slate-900 mb-6">Experience & Availability</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Years of Experience *</label>
                    <input required type="number" min="0" name="experienceYears" value={formData.experienceYears} onChange={handleChange} className="w-full rounded-lg border-slate-300 px-4 py-2 border" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Availability Status</label>
                    <select name="availabilityStatus" value={formData.availabilityStatus} onChange={handleChange} className="w-full rounded-lg border-slate-300 px-4 py-2 border bg-white">
                      <option value="Online">Online Sessions Only</option>
                      <option value="Offline">Offline/In-person Only</option>
                      <option value="Both">Both Online and Offline</option>
                      <option value="Limited">Limited Availability</option>
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-1">Preferred Engagement Types</label>
                    <input type="text" name="preferredEngagementTypes" value={formData.preferredEngagementTypes} onChange={handleChange} placeholder="e.g. Guest Lectures, Workshops, Mentoring" className="w-full rounded-lg border-slate-300 px-4 py-2 border" />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 5 */}
            {step === 5 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                <h3 className="text-xl font-bold text-slate-900 mb-6">Verification Documents</h3>
                <p className="text-sm text-slate-600 mb-6">
                  Please upload valid documents as evidence. Our AI and admin team will review these to verify your profile. Your documents will be kept strictly confidential. <b>PDF format preferred for faster AI processing.</b>
                </p>
                <div className="space-y-4">
                  <div className="border border-slate-200 rounded-lg p-4">
                    <label className="block font-medium text-slate-900 mb-2">Government Identity Proof *</label>
                    <input required type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={(e) => handleFileChange(e, 'idProof')} className="w-full text-sm" />
                  </div>
                  <div className="border border-slate-200 rounded-lg p-4">
                    <label className="block font-medium text-slate-900 mb-2">Highest Education/Degree Certificate *</label>
                    <input required type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={(e) => handleFileChange(e, 'educationProof')} className="w-full text-sm" />
                  </div>
                  <div className="border border-slate-200 rounded-lg p-4">
                    <label className="block font-medium text-slate-900 mb-2">Employment/Experience Evidence *</label>
                    <input required type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={(e) => handleFileChange(e, 'employmentProof')} className="w-full text-sm" />
                  </div>
                  <div className="border border-slate-200 rounded-lg p-4">
                    <label className="block font-medium text-slate-900 mb-2">Professional Certification (Optional)</label>
                    <input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={(e) => handleFileChange(e, 'certificationProof')} className="w-full text-sm" />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 6 */}
            {step === 6 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                <h3 className="text-xl font-bold text-slate-900 mb-6">Review Application</h3>
                <div className="bg-slate-50 rounded-lg p-6 border border-slate-200 space-y-4">
                  <div><strong className="text-slate-700">Name:</strong> {formData.name}</div>
                  <div><strong className="text-slate-700">Email:</strong> {formData.email}</div>
                  <div><strong className="text-slate-700">Designation:</strong> {formData.designation} at {formData.organization}</div>
                  <div><strong className="text-slate-700">Domain:</strong> {formData.primaryDomain}</div>
                  <div><strong className="text-slate-700">Experience:</strong> {formData.experienceYears} Years</div>
                  <div><strong className="text-slate-700">Documents Attached:</strong> {Object.values(files).filter(f => f !== null).length} Files</div>
                </div>
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg text-blue-800 text-sm flex gap-3 items-start">
                  <ShieldCheck className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <p>Upon submission, your application will be securely forwarded to our AI verification pipeline. Your profile will become visible to matching engines once verified by the AI and admin team.</p>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="mt-10 flex items-center justify-between pt-6 border-t border-slate-200">
              {step > 1 ? (
                <button type="button" onClick={prevStep} className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 font-medium">
                  <ArrowLeft className="w-4 h-4" /> Back
                </button>
              ) : (
                <Link href="/register" className="text-sm font-medium text-slate-500 hover:text-slate-700">Cancel</Link>
              )}
              
              {step < 6 ? (
                <button type="button" onClick={nextStep} className="inline-flex items-center gap-2 bg-slate-900 text-white px-8 py-3 rounded-full font-medium hover:bg-slate-800 transition-colors">
                  Continue <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button type="submit" disabled={isSubmitting} className="inline-flex items-center gap-2 bg-accent text-white px-8 py-3 rounded-full font-medium hover:bg-accent-light transition-colors disabled:opacity-70">
                  {isSubmitting ? 'Submitting...' : 'Submit Application'}
                  {!isSubmitting && <CheckCircle className="w-4 h-4" />}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
