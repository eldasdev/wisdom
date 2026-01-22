import { PublicLayout } from '@/components/layout/PublicLayout';
import Link from 'next/link';
import { 
  AcademicCapIcon,
  BookOpenIcon,
  ChartBarIcon,
  StarIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';

export default function AuthorsPage() {
  const benefits = [
    {
      icon: AcademicCapIcon,
      title: 'Academic Recognition',
      description: 'Gain visibility and recognition in your field through peer-reviewed publications.',
    },
    {
      icon: BookOpenIcon,
      title: 'Publishing Support',
      description: 'Receive editorial guidance and support throughout the publishing process.',
    },
    {
      icon: ChartBarIcon,
      title: 'Impact Metrics',
      description: 'Track your research impact with detailed analytics and citation data.',
    },
    {
      icon: StarIcon,
      title: 'Quality Platform',
      description: 'Publish on a platform known for academic excellence and professional standards.',
    },
  ];

  const steps = [
    {
      number: '1',
      title: 'Create Account',
      description: 'Sign up as an author and complete your profile with your academic credentials.',
    },
    {
      number: '2',
      title: 'Submit Content',
      description: 'Submit your research, case study, or article through our submission portal.',
    },
    {
      number: '3',
      title: 'Peer Review',
      description: 'Your content undergoes rigorous peer review by experts in your field.',
    },
    {
      number: '4',
      title: 'Publish & Share',
      description: 'Once approved, your content is published and made available to our global audience.',
    },
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
              For Authors
            </h1>
            <p className="text-xl sm:text-2xl text-slate-300 max-w-3xl mx-auto leading-relaxed mb-8">
              Share your research, insights, and expertise with a global audience of researchers, educators, and professionals.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center px-6 py-3 bg-white text-[#0C2C55] rounded-xl hover:bg-gray-100 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl"
            >
              Become an Author
              <ArrowRightIcon className="w-5 h-5 ml-2" />
            </Link>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="py-16 sm:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Why Publish with Wisdom?</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Join a community of leading scholars and researchers
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

      {/* Publishing Process */}
      <div className="py-16 sm:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Publishing Process</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Simple steps to get your work published
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div
                key={index}
                className="relative"
              >
                <div className="p-6 bg-white rounded-2xl border border-gray-200 hover:shadow-lg transition-all duration-300">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#0C2C55] to-slate-600 rounded-full flex items-center justify-center mb-4 text-white font-bold text-xl">
                    {step.number}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {step.description}
                  </p>
                </div>
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gray-300 transform -translate-y-1/2">
                    <ArrowRightIcon className="w-5 h-5 text-gray-400 absolute right-0 top-1/2 transform -translate-y-1/2" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Content Types */}
      <div className="py-16 sm:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">What You Can Publish</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Multiple content types to share your expertise
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { name: 'Articles', description: 'Research articles, reviews, and academic papers' },
              { name: 'Case Studies', description: 'Real-world business challenges and solutions' },
              { name: 'Books & Chapters', description: 'Comprehensive books and book chapters' },
              { name: 'Teaching Notes', description: 'Educational materials and teaching resources' },
              { name: 'Collections', description: 'Curated collections of related content' },
            ].map((type, index) => (
              <div
                key={index}
                className="p-6 bg-gradient-to-br from-gray-50 to-white rounded-2xl border border-gray-200 hover:shadow-lg transition-all duration-300"
              >
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {type.name}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {type.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 sm:py-24 bg-gradient-to-br from-[#0C2C55] to-slate-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Ready to Publish?
          </h2>
          <p className="text-lg text-slate-300 mb-8">
            Join our community of authors and share your research with the world.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/contact"
              className="px-6 py-3 bg-white text-[#0C2C55] rounded-xl hover:bg-gray-100 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl"
            >
              Get Started
            </Link>
            <Link
              href="/contact"
              className="px-6 py-3 bg-transparent text-white rounded-xl border-2 border-white hover:bg-white/10 transition-all duration-200 font-semibold"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
