'use client';

import { PublicLayout } from '@/components/layout/PublicLayout';
import { 
  BookOpenIcon,
  DocumentCheckIcon,
  ClockIcon,
  ShieldCheckIcon,
  AcademicCapIcon,
  SparklesIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

export default function PublishingPage() {
  const features = [
    {
      icon: DocumentCheckIcon,
      title: 'Rigorous Peer Review',
      description: 'All submissions undergo a thorough peer review process to ensure quality and academic integrity.'
    },
    {
      icon: ClockIcon,
      title: 'Fast Publication',
      description: 'Efficient review process with average publication time of 4-6 weeks after acceptance.'
    },
    {
      icon: ShieldCheckIcon,
      title: 'Open Access',
      description: 'All published content is freely accessible to readers worldwide, promoting knowledge sharing.'
    },
    {
      icon: AcademicCapIcon,
      title: 'Expert Editorial Board',
      description: 'Our distinguished editorial board ensures high standards and provides valuable feedback.'
    },
    {
      icon: SparklesIcon,
      title: 'DOI Registration',
      description: 'All publications receive a Digital Object Identifier (DOI) for permanent citation and tracking.'
    },
    {
      icon: BookOpenIcon,
      title: 'Multiple Formats',
      description: 'Content available in multiple formats including PDF, HTML, and structured data formats.'
    },
  ];

  const process = [
    {
      step: 1,
      title: 'Submission',
      description: 'Authors submit their work through our platform with all required materials.'
    },
    {
      step: 2,
      title: 'Initial Review',
      description: 'Editorial team conducts initial screening for scope, quality, and formatting.'
    },
    {
      step: 3,
      title: 'Peer Review',
      description: 'Expert reviewers evaluate the submission for originality, methodology, and contribution.'
    },
    {
      step: 4,
      title: 'Revision',
      description: 'Authors address reviewer comments and submit revised versions if needed.'
    },
    {
      step: 5,
      title: 'Acceptance',
      description: 'Accepted manuscripts proceed to copyediting and final formatting.'
    },
    {
      step: 6,
      title: 'Publication',
      description: 'Final publication with DOI registration and indexing in major databases.'
    },
  ];

  return (
    <PublicLayout>
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl translate-x-1/3 -translate-y-1/3"></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-white rounded-full blur-3xl -translate-x-1/3 translate-y-1/3"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="text-center">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 mb-4">
              <BookOpenIcon className="w-4 h-4 text-white mr-2" />
              <span className="text-sm font-medium text-white">About Publishing</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4">
              About Publishing
            </h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Discover our commitment to academic excellence, open access, and innovative publishing practices
            </p>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          {/* Mission Section */}
          <div className="bg-white rounded-2xl border border-gray-200 p-8 mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
            <p className="text-lg text-gray-700 leading-relaxed mb-4">
              Prime Scientific Publishing is dedicated to advancing knowledge through open access academic publishing. 
              We provide a platform for researchers, scholars, and practitioners to share their work with a global audience, 
              fostering collaboration and innovation across disciplines.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              Our commitment to quality, transparency, and accessibility ensures that valuable research reaches those who need it most, 
              regardless of geographical or financial barriers.
            </p>
          </div>

          {/* Features Grid */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Key Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div
                    key={index}
                    className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-300"
                  >
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                    <p className="text-gray-600 text-sm">{feature.description}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Publication Process */}
          <div className="bg-white rounded-2xl border border-gray-200 p-8 mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Publication Process</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {process.map((item) => (
                <div key={item.step} className="relative">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                      {item.step}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
                      <p className="text-gray-600 text-sm">{item.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Benefits Section */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-white mb-12">
            <h2 className="text-2xl font-bold mb-6 text-center">Benefits for Authors</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                'Wide global reach and visibility',
                'Fast and transparent review process',
                'Professional copyediting and formatting',
                'DOI registration for citations',
                'Open access for maximum impact',
                'Expert editorial guidance'
              ].map((benefit, index) => (
                <div key={index} className="flex items-center gap-3">
                  <CheckCircleIcon className="w-5 h-5 flex-shrink-0" />
                  <span>{benefit}</span>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Ready to Publish?</h2>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Join our community of authors and researchers. Start your publishing journey today.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="/contact"
                className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-lg"
              >
                Get Started
              </a>
              <a
                href="/about/editorial-board"
                className="px-6 py-3 bg-white text-indigo-600 font-semibold rounded-xl hover:bg-gray-50 transition-all duration-200 border-2 border-indigo-600"
              >
                Meet Our Editorial Board
              </a>
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
