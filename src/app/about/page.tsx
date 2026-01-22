import { PublicLayout } from '@/components/layout/PublicLayout';
import { 
  BookOpenIcon, 
  AcademicCapIcon, 
  ChartBarIcon,
  GlobeAltIcon,
  LightBulbIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';

export default function AboutPage() {
  const features = [
    {
      icon: BookOpenIcon,
      title: 'Peer-Reviewed Content',
      description: 'All content undergoes rigorous peer review to ensure academic excellence and credibility.',
    },
    {
      icon: AcademicCapIcon,
      title: 'Leading Scholars',
      description: 'Content from renowned academics, researchers, and industry experts worldwide.',
    },
    {
      icon: ChartBarIcon,
      title: 'Data-Driven Insights',
      description: 'Evidence-based research and case studies that drive real-world impact.',
    },
    {
      icon: GlobeAltIcon,
      title: 'Global Reach',
      description: 'Connecting scholars, educators, and professionals across continents.',
    },
    {
      icon: LightBulbIcon,
      title: 'Innovation Focus',
      description: 'Publishing cutting-edge research and forward-thinking business strategies.',
    },
    {
      icon: ShieldCheckIcon,
      title: 'Quality Assurance',
      description: 'Maintaining the highest standards of academic and professional publishing.',
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
              About Wisdom
            </h1>
            <p className="text-xl sm:text-2xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
              Professional academic and business publishing platform featuring peer-reviewed content from leading scholars.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="py-16 sm:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Introduction */}
          <div className="max-w-4xl mx-auto mb-16">
            <div className="prose prose-lg max-w-none">
              <p className="text-xl text-gray-700 leading-relaxed mb-6">
                Wisdom is a premier academic and business publishing platform dedicated to advancing knowledge and professional practice through high-quality, peer-reviewed content.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed mb-6">
                We provide a comprehensive repository of articles, case studies, books, teaching notes, and curated collections that serve researchers, educators, students, and business professionals worldwide. Our mission is to make cutting-edge research and practical insights accessible to all.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                Through rigorous peer review processes and collaboration with leading institutions, Wisdom ensures that every piece of content meets the highest standards of academic excellence and practical relevance.
              </p>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {features.map((feature, index) => (
              <div
                key={index}
                className="p-6 bg-gradient-to-br from-gray-50 to-white rounded-2xl border border-gray-200 hover:shadow-lg transition-all duration-300"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-[#0C2C55] to-slate-600 rounded-xl flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>

          {/* Stats Section */}
          <div className="bg-gradient-to-br from-[#0C2C55] to-slate-700 rounded-2xl p-8 sm:p-12 mb-16">
            <h2 className="text-3xl font-bold text-white text-center mb-8">
              Our Impact
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-4xl sm:text-5xl font-bold text-white mb-2">1000+</div>
                <div className="text-slate-300">Published Articles</div>
              </div>
              <div className="text-center">
                <div className="text-4xl sm:text-5xl font-bold text-white mb-2">500+</div>
                <div className="text-slate-300">Case Studies</div>
              </div>
              <div className="text-center">
                <div className="text-4xl sm:text-5xl font-bold text-white mb-2">200+</div>
                <div className="text-slate-300">Authors</div>
              </div>
              <div className="text-center">
                <div className="text-4xl sm:text-5xl font-bold text-white mb-2">50+</div>
                <div className="text-slate-300">Institutions</div>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Join Our Community
            </h2>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Whether you're a researcher, educator, student, or professional, Wisdom has something for you.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/mission"
                className="px-6 py-3 bg-gradient-to-r from-[#0C2C55] to-slate-600 text-white rounded-xl hover:from-[#0C2C55]/90 hover:to-slate-600/90 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl"
              >
                Learn About Our Mission
              </Link>
              <Link
                href="/contact"
                className="px-6 py-3 bg-white text-[#0C2C55] rounded-xl border-2 border-[#0C2C55] hover:bg-[#0C2C55]/5 transition-all duration-200 font-semibold"
              >
                Get in Touch
              </Link>
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
