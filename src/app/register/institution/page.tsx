'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ShieldCheck, ArrowRight, Building2, User, Mail, Phone, MapPin, Globe } from 'lucide-react'

export default function InstitutionRegistrationPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const [formData, setFormData] = useState({
    name: '',
    designation: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    institutionName: '',
    type: '',
    location: '',
    city: '',
    state: '',
    country: '',
    website: '',
    description: '',
    departments: ''
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      return
    }

    setIsSubmitting(true)
    
    try {
      const response = await fetch('/api/auth/register/institution', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          phone: formData.phone,
          institutionName: formData.institutionName,
          type: formData.type,
          location: formData.city ? `${formData.city}, ${formData.state}` : formData.location,
          website: formData.website,
          description: formData.description
        })
      })

      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to register institution')
      }
      
      // Redirect to login or success page
      router.push('/login?registered=true&role=institution')
      
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <img src="/logo.jpg" alt="ExpertBridge Logo" className="w-9 h-9 object-cover rounded-full shadow-sm" />
            <span className="text-2xl font-bold tracking-tight text-slate-900">ExpertBridge</span>
          </Link>
          <h2 className="text-3xl font-extrabold text-slate-900">
            Institution Registration
          </h2>
          <p className="mt-2 text-lg text-slate-600">
            Create an account to submit requirements and connect with verified experts.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200">
          <form onSubmit={handleSubmit} className="p-8">
            
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div className="space-y-8">
              {/* Account Section */}
              <div>
                <h3 className="text-lg font-semibold text-slate-900 border-b border-slate-200 pb-2 mb-4 flex items-center gap-2">
                  <User className="w-5 h-5 text-accent" /> Contact Person Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Full Name *</label>
                    <input required type="text" name="name" value={formData.name} onChange={handleChange} className="w-full rounded-lg border-slate-300 shadow-sm focus:border-accent focus:ring-accent sm:text-sm px-4 py-2 border" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Designation</label>
                    <input type="text" name="designation" value={formData.designation} onChange={handleChange} className="w-full rounded-lg border-slate-300 shadow-sm focus:border-accent focus:ring-accent sm:text-sm px-4 py-2 border" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Official Email *</label>
                    <input required type="email" name="email" value={formData.email} onChange={handleChange} className="w-full rounded-lg border-slate-300 shadow-sm focus:border-accent focus:ring-accent sm:text-sm px-4 py-2 border" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number</label>
                    <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full rounded-lg border-slate-300 shadow-sm focus:border-accent focus:ring-accent sm:text-sm px-4 py-2 border" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Password *</label>
                    <input required type="password" name="password" value={formData.password} onChange={handleChange} className="w-full rounded-lg border-slate-300 shadow-sm focus:border-accent focus:ring-accent sm:text-sm px-4 py-2 border" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Confirm Password *</label>
                    <input required type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} className="w-full rounded-lg border-slate-300 shadow-sm focus:border-accent focus:ring-accent sm:text-sm px-4 py-2 border" />
                  </div>
                </div>
              </div>

              {/* Institution Section */}
              <div>
                <h3 className="text-lg font-semibold text-slate-900 border-b border-slate-200 pb-2 mb-4 flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-accent" /> Institution Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-1">Institution Name *</label>
                    <input required type="text" name="institutionName" value={formData.institutionName} onChange={handleChange} className="w-full rounded-lg border-slate-300 shadow-sm focus:border-accent focus:ring-accent sm:text-sm px-4 py-2 border" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Institution Type</label>
                    <select name="type" value={formData.type} onChange={handleChange} className="w-full rounded-lg border-slate-300 shadow-sm focus:border-accent focus:ring-accent sm:text-sm px-4 py-2 border bg-white">
                      <option value="">Select Type</option>
                      <option value="University">University</option>
                      <option value="College">College</option>
                      <option value="Corporate">Corporate / Enterprise</option>
                      <option value="Research Institute">Research Institute</option>
                      <option value="Government">Government Body</option>
                      <option value="NGO">NGO / Non-Profit</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Website URL</label>
                    <input type="url" name="website" value={formData.website} onChange={handleChange} className="w-full rounded-lg border-slate-300 shadow-sm focus:border-accent focus:ring-accent sm:text-sm px-4 py-2 border" placeholder="https://" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">City</label>
                    <input type="text" name="city" value={formData.city} onChange={handleChange} className="w-full rounded-lg border-slate-300 shadow-sm focus:border-accent focus:ring-accent sm:text-sm px-4 py-2 border" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">State / Region</label>
                    <input type="text" name="state" value={formData.state} onChange={handleChange} className="w-full rounded-lg border-slate-300 shadow-sm focus:border-accent focus:ring-accent sm:text-sm px-4 py-2 border" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Country</label>
                    <input type="text" name="country" value={formData.country} onChange={handleChange} className="w-full rounded-lg border-slate-300 shadow-sm focus:border-accent focus:ring-accent sm:text-sm px-4 py-2 border" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-1">About Institution</label>
                    <textarea name="description" rows={3} value={formData.description} onChange={handleChange} className="w-full rounded-lg border-slate-300 shadow-sm focus:border-accent focus:ring-accent sm:text-sm px-4 py-2 border"></textarea>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-1">Departments / Areas of Interest</label>
                    <input type="text" name="departments" value={formData.departments} onChange={handleChange} className="w-full rounded-lg border-slate-300 shadow-sm focus:border-accent focus:ring-accent sm:text-sm px-4 py-2 border" placeholder="e.g. Computer Science, Mechanical Engineering, Business..." />
                  </div>
                </div>
              </div>

            </div>

            <div className="mt-10 flex items-center justify-between pt-6 border-t border-slate-200">
              <Link href="/register" className="text-sm font-medium text-slate-500 hover:text-slate-700">
                Cancel
              </Link>
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center gap-2 bg-accent text-white px-8 py-3 rounded-full font-medium hover:bg-accent-light transition-colors disabled:opacity-70"
              >
                {isSubmitting ? 'Creating Account...' : 'Create Institution Account'}
                {!isSubmitting && <ArrowRight className="w-4 h-4" />}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
