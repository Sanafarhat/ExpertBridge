import { prisma } from '@/lib/db'
import Link from 'next/link'
import { ShieldCheck, Search, Filter, MapPin, Briefcase } from 'lucide-react'

export default async function DiscoveryPage() {
  const experts = await prisma.expertProfile.findMany({
    where: {
      verificationStatus: 'VERIFIED'
    },
    include: {
      expertTags: {
        include: {
          tag: true
        }
      },
      engagements: true
    }
  })

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded bg-blue-600">
              <ShieldCheck className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900">ExpertBridge</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-medium text-slate-600 hover:text-slate-900">Sign In</Link>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 md:px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-2">Search by expertise, not by connections.</h1>
          <p className="text-slate-600 text-lg">Discover verified domain experts for your institutional requirements.</p>
        </div>

        <div className="flex flex-col md:flex-row gap-6 mb-10">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search experts, domains or expertise..." 
              className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button className="flex items-center justify-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-lg shadow-sm font-medium text-slate-700 hover:bg-slate-50">
            <Filter className="h-4 w-4" /> Filters
          </button>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {experts.map(expert => (
            <div key={expert.id} className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col">
              <div className="p-6 flex-1">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-xl font-bold text-slate-400 border-2 border-white shadow-sm">
                      {expert.fullName?.charAt(0) || 'E'}
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-slate-900">{expert.fullName}</h3>
                      <p className="text-sm text-slate-600">{expert.designation}</p>
                      <p className="text-xs text-slate-500">{expert.organization}</p>
                    </div>
                  </div>
                </div>
                
                <div className="inline-flex items-center bg-green-50 text-green-700 px-2 py-1 rounded border border-green-200 text-xs font-semibold mb-4">
                  <ShieldCheck className="w-3 h-3 mr-1" /> Verified & Certified
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {expert.expertTags.map(et => (
                    <span key={et.tag.id} className="bg-slate-100 text-slate-700 px-2 py-1 rounded text-xs font-medium">
                      {et.tag.name}
                    </span>
                  ))}
                </div>

                <div className="space-y-2 mt-4 text-sm text-slate-600">
                   <div className="flex items-center gap-2">
                     <Briefcase className="w-4 h-4 text-slate-400" /> {expert.yearsExperience} years experience
                   </div>
                   <div className="flex items-center gap-2">
                     <ShieldCheck className="w-4 h-4 text-slate-400" /> {expert.engagements.length} verified engagements
                   </div>
                   <div className="flex items-center gap-2">
                     <MapPin className="w-4 h-4 text-slate-400" /> {expert.location}
                   </div>
                </div>
              </div>
              <div className="p-4 border-t bg-slate-50 mt-auto">
                <Link href={`/login`} className="block w-full py-2 text-center text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-md transition-colors">
                  View Full Profile
                </Link>
              </div>
            </div>
          ))}

          {experts.length === 0 && (
            <div className="col-span-full py-12 text-center">
              <h3 className="text-lg font-medium text-slate-900 mb-2">No verified experts match your current criteria.</h3>
              <p className="text-slate-500">Try adjusting your search or filters.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
