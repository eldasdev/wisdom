import { PublicLayout } from '@/components/layout/PublicLayout';
import { 
  BoltIcon,
  LightBulbIcon,
  AcademicCapIcon,
  GlobeAltIcon,
  HeartIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';

export default function MissionPage() {
  const values = [
    {
      icon: BoltIcon,
      title: 'Excellence',
      description: 'We strive for the highest standards in academic publishing, ensuring every piece of content meets rigorous quality criteria.',
    },
    {
      icon: LightBulbIcon,
      title: 'Innovation',
      description: 'We embrace new ideas, methodologies, and technologies to advance knowledge and practice.',
    },
    {
      icon: AcademicCapIcon,
      title: 'Education',
      description: 'We believe in the transformative power of education and research to create positive change.',
    },
    {
      icon: GlobeAltIcon,
      title: 'Accessibility',
      description: 'We make knowledge accessible to researchers, educators, and professionals worldwide.',
    },
    {
      icon: HeartIcon,
      title: 'Integrity',
      description: 'We maintain the highest ethical standards in all our publishing practices.',
    },
    {
      icon: ChartBarIcon,
      title: 'Impact',
      description: 'We focus on research and content that drives real-world impact and positive outcomes.',
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
              Our Mission
            </h1>
            <p className="text-xl sm:text-2xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
              Advancing knowledge and professional practice through accessible, high-quality academic publishing.
            </p>
          </div>
        </div>
      </div>

      {/* Mission Statement */}
      <div className="py-16 sm:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="prose prose-lg max-w-none">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission Statement</h2>
              <p className="text-xl text-gray-700 leading-relaxed mb-6">
                Prime Scientific Publishing is dedicated to advancing knowledge and professional practice by providing a platform for high-quality, peer-reviewed academic and business content. We believe that knowledge should be accessible, credible, and impactful.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed mb-6">
                Our mission is to connect researchers, educators, students, and professionals with cutting-edge research, practical insights, and innovative solutions that drive positive change in academia, business, and society.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                Through rigorous peer review, ethical publishing practices, and a commitment to excellence, we ensure that every piece of content on our platform contributes meaningfully to the advancement of knowledge and professional development.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Vision Section */}
      <div className="py-16 sm:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">Our Vision</h2>
            <p className="text-xl text-gray-700 leading-relaxed">
              To become the world's leading platform for academic and business publishing, recognized for excellence, innovation, and impact. We envision a future where knowledge flows freely, research drives progress, and education transforms lives.
            </p>
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="py-16 sm:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Our Core Values</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              The principles that guide everything we do
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <div
                key={index}
                className="p-6 bg-gradient-to-br from-gray-50 to-white rounded-2xl border border-gray-200 hover:shadow-lg transition-all duration-300"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-[#0C2C55] to-slate-600 rounded-xl flex items-center justify-center mb-4">
                  <value.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {value.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Goals Section */}
      <div className="py-16 sm:py-24 bg-gradient-to-br from-[#0C2C55] to-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Our Goals</h2>
            <p className="text-lg text-slate-300 max-w-2xl mx-auto">
              What we're working towards
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <h3 className="text-xl font-semibold text-white mb-3">Expand Global Reach</h3>
              <p className="text-slate-200 leading-relaxed">
                Connect with researchers, educators, and institutions worldwide to create a truly global knowledge network.
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <h3 className="text-xl font-semibold text-white mb-3">Enhance Content Quality</h3>
              <p className="text-slate-200 leading-relaxed">
                Continuously improve our peer review processes and editorial standards to maintain excellence.
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <h3 className="text-xl font-semibold text-white mb-3">Foster Innovation</h3>
              <p className="text-slate-200 leading-relaxed">
                Support groundbreaking research and innovative methodologies that push the boundaries of knowledge.
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <h3 className="text-xl font-semibold text-white mb-3">Promote Accessibility</h3>
              <p className="text-slate-200 leading-relaxed">
                Make high-quality academic content accessible to researchers, students, and professionals everywhere.
              </p>
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
