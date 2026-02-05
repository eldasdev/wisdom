'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { PublicLayout } from '@/components/layout/PublicLayout';
import { 
  EnvelopeIcon, 
  LockClosedIcon, 
  ExclamationCircleIcon,
  SparklesIcon,
  BookOpenIcon
} from '@heroicons/react/24/outline';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError('Invalid email or password');
      } else {
        router.push('/');
        router.refresh();
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PublicLayout>
      <div className="min-h-screen flex">
        {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-[#0C2C55] via-slate-800 to-slate-900">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-400 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-purple-500 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2"></div>
        </div>
        
        <div className="relative flex flex-col justify-center px-12 xl:px-20">
          <Link href="/" className="flex items-center space-x-3 mb-12">
            <div className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <BookOpenIcon className="w-7 h-7 text-white" />
            </div>
            <span className="text-3xl font-bold text-white">Prime SP</span>
          </Link>
          
          <h1 className="text-4xl xl:text-5xl font-bold text-white mb-6 leading-tight">
            Welcome back to<br />
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              academic excellence
            </span>
          </h1>
          
          <p className="text-lg text-slate-300 mb-8 leading-relaxed max-w-md">
            Access your research, case studies, and teaching materials. Continue your journey of knowledge.
          </p>
          
          <div className="flex items-center space-x-4 text-sm text-slate-400">
            <div className="flex items-center">
              <SparklesIcon className="w-5 h-5 mr-2 text-emerald-400" />
              Peer-reviewed content
            </div>
            <div className="w-1 h-1 bg-slate-600 rounded-full"></div>
            <div>DOI registration</div>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <Link href="/" className="lg:hidden flex items-center justify-center space-x-2 mb-8">
            <div className="w-10 h-10 bg-[#0C2C55] rounded-xl flex items-center justify-center">
              <BookOpenIcon className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-900">Prime SP</span>
          </Link>

          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              Sign in to your account
            </h2>
            <p className="text-gray-600">
              Enter your credentials to access your account
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
                Email address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0C2C55] focus:border-transparent transition-all duration-200"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <LockClosedIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0C2C55] focus:border-transparent transition-all duration-200"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {error && (
              <div className="flex items-center p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
                <ExclamationCircleIcon className="w-5 h-5 mr-2 flex-shrink-0" />
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center py-3 px-4 border border-transparent text-base font-semibold rounded-xl text-white bg-[#0C2C55] hover:bg-[#0C2C55]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0C2C55] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg shadow-[#0C2C55]/25 hover:shadow-xl"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </>
              ) : (
                'Sign in'
              )}
            </button>

            <p className="text-center text-gray-600">
              Don't have an account?{' '}
              <Link href="/contact" className="font-semibold text-[#0C2C55] hover:text-[#0C2C55]/80 transition-colors">
                Sign up
              </Link>
            </p>
          </form>
        </div>
      </div>
      </div>
    </PublicLayout>
  );
}
