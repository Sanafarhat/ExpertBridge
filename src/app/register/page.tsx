import Link from 'next/link'
import { ShieldCheck } from 'lucide-react'

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
          Create an account
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-slate-200 text-center">
          <p className="text-slate-600 mb-6">
            For this MVP demo, new user registration is disabled. Please log in using the provided demo credentials to explore the different roles and dashboards.
          </p>
          <Link href="/login" className="w-full inline-flex justify-center py-2 px-4 border border-transparent rounded-full shadow-sm text-sm font-medium text-white bg-accent hover:bg-accent-light">
            Go to Login
          </Link>
        </div>
      </div>
    </div>
  )
}
