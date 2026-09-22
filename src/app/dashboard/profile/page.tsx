import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/db'
import { FileText, Sparkles, MapPin, Briefcase, Link as LinkIcon, Calendar, CheckCircle2, ShieldCheck, BadgeCheck, FileBadge, Info, Clock, AlertTriangle } from 'lucide-react'
import Link from 'next/link'

export default async function ExpertProfilePage() {
  const session = await getServerSession(authOptions)

  if (!session?.user || session.user.role !== 'EXPERT') {
    redirect('/dashboard')
  }

  const profile = await prisma.expertProfile.findUnique({
    where: { userId: session.user.id },
    include: {
      expertTags: {
        include: {
          tag: {
            include: {
              category: true
            }
          }
        }
      },
      documents: true,
      availability: true,
    }
  })

  if (!profile) {
    return <div className="p-8">Profile not found.</div>
  }

  // Initials for avatar
  const initials = profile.fullName ? profile.fullName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'EX';

  const getVerificationBadge = () => {
    switch (profile.verificationStatus) {
      case 'VERIFIED':
        return (
          <div className="flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm font-medium border border-green-200">
            <ShieldCheck className="w-4 h-4" />
            Verified
          </div>
        );
      case 'NEEDS_INFO':
        return (
          <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-700 rounded-full text-sm font-medium border border-amber-200">
            <Info className="w-4 h-4" />
            Additional Information Required
          </div>
        );
      case 'UNDER_REVIEW':
      case 'SUBMITTED':
        return (
          <div className="flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium border border-blue-200">
            <Clock className="w-4 h-4" />
            Verification Under Review
          </div>
        );
      case 'REJECTED':
        return (
          <div className="flex items-center gap-1.5 px-3 py-1 bg-red-50 text-red-700 rounded-full text-sm font-medium border border-red-200">
            <AlertTriangle className="w-4 h-4" />
            Verification Requires Attention
          </div>
        );
      default:
        return (
          <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-50 text-slate-700 rounded-full text-sm font-medium border border-slate-200">
            Draft
          </div>
        );
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 space-y-8">
      <div className="mb-4">
        <h1 className="text-3xl font-bold text-slate-900">Professional Profile</h1>
        <p className="text-slate-500 mt-2">Manage your expertise, availability, and professional identity.</p>
      </div>

      {/* Profile Header Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden relative">
        <div className="h-32 bg-gradient-to-r from-slate-900 via-accent to-purple-800 relative">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_1px_1px,#ffffff_1px,transparent_0)] [background-size:20px_20px]"></div>
        </div>
        
        <div className="px-8 pb-8 relative">
          <div className="flex justify-between items-end -mt-12 mb-4">
            <div className="w-24 h-24 rounded-full border-4 border-white bg-slate-100 flex items-center justify-center text-3xl font-bold text-slate-400 shadow-sm relative z-10">
              {initials}
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-2xl font-bold text-slate-900">{profile.fullName}</h1>
                {getVerificationBadge()}
              </div>
              <h2 className="text-lg text-slate-700 font-medium">{profile.designation} at {profile.organization || 'Independent'}</h2>
              
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-slate-600 mt-4">
                {profile.location && (
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-slate-400" />
                    {profile.location}
                  </div>
                )}
                {profile.yearsExperience !== null && (
                  <div className="flex items-center gap-1.5">
                    <Briefcase className="w-4 h-4 text-slate-400" />
                    {profile.yearsExperience} Years Experience
                  </div>
                )}
                {profile.linkedinUrl && (
                  <a href={profile.linkedinUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-accent hover:underline">
                    <LinkIcon className="w-4 h-4" />
                    LinkedIn Profile
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* About Section */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
        <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
          <FileText className="w-5 h-5 text-accent" />
          About
        </h3>
        <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">
          {profile.bio || "No professional bio provided."}
        </p>
      </div>

      {/* Expertise & Domains */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
        <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
          <BadgeCheck className="w-5 h-5 text-accent" />
          Expertise & Domains
        </h3>
        {profile.expertTags.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {profile.expertTags.map(et => (
              <span key={et.tag.id} className="px-3 py-1.5 bg-slate-50 border border-slate-200 text-slate-700 rounded-lg text-sm font-medium">
                {et.tag.name}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-slate-500 text-sm">No expertise tags specified.</p>
        )}
      </div>

      {/* Availability & Preferences */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
        <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-accent" />
          Availability & Preferences
        </h3>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Availability Status</p>
            {profile.availability && profile.availability.length > 0 ? (
              <div className="flex items-center gap-2 text-slate-800 font-medium">
                <span className="w-2.5 h-2.5 rounded-full bg-green-500"></span>
                {profile.availability[0].status}
              </div>
            ) : (
              <p className="text-slate-500 italic">Not specified</p>
            )}
          </div>
          
        </div>
      </div>
      
      {/* Verification Documents */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
        <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
          <FileBadge className="w-5 h-5 text-accent" />
          Verification Documents
        </h3>
        
        {profile.documents && profile.documents.length > 0 ? (
          <div className="grid sm:grid-cols-2 gap-4">
            {profile.documents.map(doc => (
              <div key={doc.id} className="flex items-start gap-3 p-4 border border-slate-200 rounded-xl bg-slate-50">
                <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-slate-900 capitalize">{doc.documentType.replace('Proof', ' Proof')}</p>
                  <p className="text-xs text-slate-500 mt-1">{new Date(doc.uploadedAt).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-slate-500 text-sm">No verification documents have been uploaded.</p>
        )}
      </div>

    </div>
  )
}
