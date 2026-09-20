import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/db'

export default async function InstitutionsAdminPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user || session.user.role !== 'ADMIN') {
    redirect('/dashboard')
  }

  const institutions = await prisma.institution.findMany({
    include: {
      user: true,
      requirements: true,
      engagements: true
    },
    orderBy: { createdAt: 'desc' }
  })

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Institutions Directory</h1>
        <p className="text-slate-500 mt-1">Manage registered institutions and view their activity.</p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-0">
           <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 text-slate-500 border-b">
                 <tr>
                    <th className="px-6 py-4 font-medium">Institution Name</th>
                    <th className="px-6 py-4 font-medium">Type</th>
                    <th className="px-6 py-4 font-medium">Location</th>
                    <th className="px-6 py-4 font-medium text-center">Requirements</th>
                    <th className="px-6 py-4 font-medium text-center">Engagements</th>
                 </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                 {institutions.length === 0 ? (
                    <tr>
                       <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                         No institutions found.
                       </td>
                    </tr>
                 ) : institutions.map(inst => (
                   <tr key={inst.id} className="hover:bg-slate-50/50">
                      <td className="px-6 py-4">
                         <div className="font-semibold text-slate-900">{inst.name}</div>
                         <div className="text-xs text-slate-500">{inst.user.email}</div>
                      </td>
                      <td className="px-6 py-4 text-slate-600">{inst.type}</td>
                      <td className="px-6 py-4 text-slate-600">{inst.location}</td>
                      <td className="px-6 py-4 text-center">
                         <span className="inline-flex items-center justify-center bg-slate-100 text-slate-700 w-6 h-6 rounded-full text-xs font-semibold">
                           {inst.requirements.length}
                         </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                         <span className="inline-flex items-center justify-center bg-green-50 text-green-700 w-6 h-6 rounded-full text-xs font-semibold">
                           {inst.engagements.length}
                         </span>
                      </td>
                   </tr>
                 ))}
              </tbody>
           </table>
        </div>
      </div>
    </div>
  )
}
