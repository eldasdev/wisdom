import { PublicLayout } from '@/components/layout/PublicLayout';
import Link from 'next/link';
import { 
  BuildingLibraryIcon,
  UserGroupIcon,
  AcademicCapIcon,
  ChartBarIcon,
  ArrowRightIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';

export default function InstitutionsPage() {
  const benefits = [
    {
      icon: UserGroupIcon,
      title: 'Institutional Access',
      description: 'Provide your faculty, researchers, and students with comprehensive access to our content library.',
    },
    {
      icon: AcademicCapIcon,
      title: 'Research Support',
      description: 'Support your institution\'s research initiatives with access to peer-reviewed publications.',
    },
    {
      icon: ChartBarIcon,
      title: 'Usage Analytics',
      description: 'Track content usage and engagement across your institution with detailed analytics.',
    },
    {
      icon: ShieldCheckIcon,
      title: 'Quality Assurance',
      description: 'Ensure your community has access to high-quality, peer-reviewed academic content.',
    },
  ];

  const features = [
    'Campus-wide content access',
    'Customized institutional branding',
    'Dedicated account management',
    'Usage analytics and reporting',
    'Training and support resources',
    'Integration with library systems',
  ];

  return (
    <PublicLayout>
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#0C2C55] via-slate-800 to-slate-900">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-400 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-purple-500 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
              For Institutions
            </h1>
            <p className="text-xl sm:text-2xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
              Provide your institution with comprehensive access to high-quality academic content and research resources.
            </p>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="py-16 sm:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Institutional Benefits</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Comprehensive solutions for academic institutions
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="p-6 bg-gradient-to-br from-gray-50 to-white rounded-2xl border border-gray-200 hover:shadow-lg transition-all duration-300"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-[#0C2C55] to-slate-600 rounded-xl flex items-center justify-center mb-4">
                  <benefit.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {benefit.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 sm:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="bg-gradient-to-br from-[#0C2C55] to-slate-700 rounded-2xl p-8 sm:p-12">
              <BuildingLibraryIcon className="w-16 h-16 text-white mb-6" />
              <h3 className="text-2xl font-bold text-white mb-4">
                Institutional Partnership
              </h3>
              <p className="text-slate-200 leading-relaxed mb-6">
                Partner with Wisdom to provide your institution with comprehensive access to academic content, research resources, and publishing opportunities. We work with institutions worldwide to support their academic and research missions.
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center px-6 py-3 bg-white text-[#0C2C55] rounded-xl hover:bg-gray-100 transition-all duration-200 font-semibold"
              >
                Contact Us
                <ArrowRightIcon className="w-5 h-5 ml-2" />
              </Link>
            </div>
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
                What We Offer
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed mb-8">
                Our institutional partnerships provide comprehensive solutions tailored to your institution's needs.
              </p>
              <ul className="space-y-4">
                {features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-gradient-to-br from-[#0C2C55] to-slate-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 sm:py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Partner with Wisdom
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Learn more about our institutional partnership programs and how we can support your institution.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/contact"
              className="px-6 py-3 bg-gradient-to-r from-[#0C2C55] to-slate-600 text-white rounded-xl hover:from-[#0C2C55]/90 hover:to-slate-600/90 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl"
            >
              Contact Us
            </Link>
            <Link
              href="/pricing"
              className="px-6 py-3 bg-white text-[#0C2C55] rounded-xl border-2 border-[#0C2C55] hover:bg-[#0C2C55]/5 transition-all duration-200 font-semibold"
            >
              View Pricing
            </Link>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
