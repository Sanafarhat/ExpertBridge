import Link from 'next/link'
import { ShieldCheck, UserCircle, Building2, ArrowRight } from 'lucide-react'

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex flex-col justify-center bg-[#FAFAFC] py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent shadow-md">
              <ShieldCheck className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-slate-900">ExpertBridge</span>
          </Link>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-slate-900">
          Join ExpertBridge
        </h2>
        <p className="mt-2 text-center text-sm text-slate-600">
          Choose your account type to get started
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Expert Card */}
          <Link href="/register/expert" className="group relative bg-white py-8 px-6 shadow-sm border border-slate-200 rounded-xl hover:shadow-md hover:border-accent transition-all">
            <div className="flex items-center justify-center w-12 h-12 bg-slate-100 text-slate-600 rounded-full mb-4 group-hover:bg-accent/10 group-hover:text-accent transition-colors">
              <UserCircle className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2 group-hover:text-accent transition-colors">
              I am an Expert
            </h3>
            <p className="text-sm text-slate-600 mb-6">
              Join our verified network to connect with top institutions and provide your expertise.
            </p>
            <div className="flex items-center text-sm font-medium text-accent">
              Register as Expert <ArrowRight className="ml-1 w-4 h-4 transition-transform group-hover:translate-x-1" />
            </div>
          </Link>

          {/* Institution Card */}
          <Link href="/register/institution" className="group relative bg-white py-8 px-6 shadow-sm border border-slate-200 rounded-xl hover:shadow-md hover:border-accent transition-all">
            <div className="flex items-center justify-center w-12 h-12 bg-slate-100 text-slate-600 rounded-full mb-4 group-hover:bg-accent/10 group-hover:text-accent transition-colors">
              <Building2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2 group-hover:text-accent transition-colors">
              I am an Institution
            </h3>
            <p className="text-sm text-slate-600 mb-6">
              Find and engage with verified academic and industry experts for your requirements.
            </p>
            <div className="flex items-center text-sm font-medium text-accent">
              Register as Institution <ArrowRight className="ml-1 w-4 h-4 transition-transform group-hover:translate-x-1" />
            </div>
          </Link>
        </div>

        <p className="mt-8 text-center text-sm text-slate-600">
          Already have an account?{' '}
          <Link href="/login" className="font-medium text-accent hover:text-accent-light">
            Sign in here
          </Link>
        </p>
      </div>
    </div>
  )
}
