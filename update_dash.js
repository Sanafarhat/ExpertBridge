const fs = require('fs');
let content = fs.readFileSync('C:/ExpertBridge/src/app/dashboard/page.tsx', 'utf8');

// 1. Remove the dead ADMIN block inside INSTITUTION
const deadAdminBlockStart = content.indexOf('if (role === \\'ADMIN\\') {', content.indexOf('if (role === \\'INSTITUTION\\') {'));
if (deadAdminBlockStart > -1) {
    const nextIfStart = content.indexOf('const institution = await prisma.institution.findUnique', deadAdminBlockStart);
    if (nextIfStart > -1) {
        content = content.substring(0, deadAdminBlockStart) + content.substring(nextIfStart);
    }
}

// 2. Replace the bottom ADMIN block
const adminBlockStart = content.indexOf('if (role === \\'ADMIN\\') {', content.indexOf('if (role === \\'INSTITUTION\\') {') + 100);
if (adminBlockStart > -1) {
    const newAdminBlock = \if (role === 'ADMIN') {
    const pendingVerificationsCount = await prisma.verification.count({ where: { status: 'SUBMITTED' } });
    const underReviewCount = await prisma.verification.count({ where: { status: 'UNDER_REVIEW' } });
    const verifiedExpertsCount = await prisma.expertProfile.count({ where: { verificationStatus: 'VERIFIED' } });
    const referenceChecksCount = 0; // Reference checks not implemented yet
    
    const recentVerifications = await prisma.verification.findMany({
      where: { status: { not: 'DRAFT' } },
      include: {
        expert: {
          include: { expertTags: { include: { tag: true } } }
        }
      },
      orderBy: { submittedAt: 'asc' },
      take: 5
    });

    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-slate-900">Admin Console</h1>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="text-sm font-medium text-slate-500">Pending Verification</h3>
            <p className="text-2xl font-bold text-amber-600 mt-2">{pendingVerificationsCount}</p>
          </div>
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="text-sm font-medium text-slate-500">Under Review</h3>
            <p className="text-2xl font-bold text-blue-600 mt-2">{underReviewCount}</p>
          </div>
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="text-sm font-medium text-slate-500">Verified Experts</h3>
            <p className="text-2xl font-bold text-green-600 mt-2">{verifiedExpertsCount}</p>
          </div>
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="text-sm font-medium text-slate-500">Reference Checks</h3>
            <p className="text-2xl font-bold text-slate-900 mt-2">{referenceChecksCount}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-200 flex justify-between items-center">
            <h3 className="font-semibold text-slate-900">Verification Queue</h3>
            <Link href="/dashboard/verification-queue" className="text-sm font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1">
              View All <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="p-0">
             <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 text-slate-500 border-b">
                   <tr>
                      <th className="px-6 py-3 font-medium">Expert</th>
                      <th className="px-6 py-3 font-medium">Domain</th>
                      <th className="px-6 py-3 font-medium">Submitted</th>
                      <th className="px-6 py-3 font-medium">Stage</th>
                      <th className="px-6 py-3 font-medium">Action</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                   {recentVerifications.length > 0 ? recentVerifications.map(v => (
                     <tr key={v.id}>
                        <td className="px-6 py-4 font-medium text-slate-900">{v.expert.fullName}</td>
                        <td className="px-6 py-4 text-slate-500">{v.expert.expertTags[0]?.tag.name || 'Not specified'}</td>
                        <td className="px-6 py-4 text-slate-500">{v.submittedAt.toLocaleDateString()}</td>
                        <td className="px-6 py-4"><span className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs font-medium uppercase">{v.status}</span></td>
                        <td className="px-6 py-4"><Link href="/dashboard/verification-queue" className="text-slate-400 hover:text-slate-600">View</Link></td>
                     </tr>
                   )) : (
                     <tr><td colSpan={5} className="px-6 py-4 text-center text-slate-500">No pending verifications.</td></tr>
                   )}
                </tbody>
             </table>
          </div>
        </div>
      </div>
    )
  }

  return <div>Unknown role</div>
}
\;
    content = content.substring(0, adminBlockStart) + newAdminBlock;
}

fs.writeFileSync('C:/ExpertBridge/src/app/dashboard/page.tsx', content);
console.log('Successfully updated page.tsx');
