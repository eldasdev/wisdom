'use client';

import { PublicLayout } from '@/components/layout/PublicLayout';
import { 
  AcademicCapIcon,
  BuildingOfficeIcon,
  EnvelopeIcon,
  GlobeAltIcon,
  StarIcon
} from '@heroicons/react/24/outline';

export default function EditorialBoardPage() {
  const boardMembers = [
    {
      name: 'Dr. Sarah Johnson',
      role: 'Editor-in-Chief',
      institution: 'Harvard Business School',
      expertise: 'Business Strategy & Management',
      email: 'sarah.johnson@wisdom.edu',
      image: 'SJ'
    },
    {
      name: 'Prof. Michael Chen',
      role: 'Associate Editor',
      institution: 'MIT Sloan School of Management',
      expertise: 'Economics & Finance',
      email: 'michael.chen@wisdom.edu',
      image: 'MC'
    },
    {
      name: 'Dr. Emily Rodriguez',
      role: 'Associate Editor',
      institution: 'Stanford University',
      expertise: 'Language Sciences & Linguistics',
      email: 'emily.rodriguez@wisdom.edu',
      image: 'ER'
    },
    {
      name: 'Prof. David Thompson',
      role: 'Associate Editor',
      institution: 'Oxford University',
      expertise: 'Philosophy & Ethics',
      email: 'david.thompson@wisdom.edu',
      image: 'DT'
    },
    {
      name: 'Dr. Lisa Anderson',
      role: 'Editorial Board Member',
      institution: 'Yale University',
      expertise: 'Business & Economics',
      email: 'lisa.anderson@wisdom.edu',
      image: 'LA'
    },
    {
      name: 'Prof. James Wilson',
      role: 'Editorial Board Member',
      institution: 'Cambridge University',
      expertise: 'Philosophy & Logic',
      email: 'james.wilson@wisdom.edu',
      image: 'JW'
    },
  ];

  return (
    <PublicLayout>
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-600">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl translate-x-1/3 -translate-y-1/3"></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-white rounded-full blur-3xl -translate-x-1/3 translate-y-1/3"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="text-center">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 mb-4">
              <AcademicCapIcon className="w-4 h-4 text-white mr-2" />
              <span className="text-sm font-medium text-white">Editorial Board</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4">
              Editorial Board
            </h1>
            <p className="text-xl text-emerald-100 max-w-3xl mx-auto">
              Meet our distinguished team of experts dedicated to maintaining the highest standards of academic publishing
            </p>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          {/* Introduction */}
          <div className="bg-white rounded-2xl border border-gray-200 p-8 mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">About Our Editorial Board</h2>
            <p className="text-lg text-gray-700 leading-relaxed mb-4">
              Our editorial board consists of leading scholars and researchers from top universities worldwide. 
              They bring decades of combined experience in academic publishing, peer review, and research excellence.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              Each member is committed to ensuring that only the highest quality research is published, 
              maintaining the integrity and reputation of Wisdom Publishing.
            </p>
          </div>

          {/* Board Members Grid */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Board Members</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {boardMembers.map((member, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-300"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
                      {member.image}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">{member.name}</h3>
                      <p className="text-sm text-emerald-600 font-medium">{member.role}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-start gap-2">
                      <BuildingOfficeIcon className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-600">{member.institution}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <AcademicCapIcon className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-600">{member.expertise}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <EnvelopeIcon className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                      <a
                        href={`mailto:${member.email}`}
                        className="text-sm text-emerald-600 hover:text-emerald-700"
                      >
                        {member.email}
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Responsibilities Section */}
          <div className="bg-white rounded-2xl border border-gray-200 p-8 mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Editorial Responsibilities</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  title: 'Peer Review Oversight',
                  description: 'Ensuring rigorous and fair peer review processes for all submissions.'
                },
                {
                  title: 'Quality Assurance',
                  description: 'Maintaining high standards of academic excellence and research integrity.'
                },
                {
                  title: 'Editorial Decisions',
                  description: 'Making informed decisions on manuscript acceptance and publication.'
                },
                {
                  title: 'Mentorship',
                  description: 'Providing guidance and support to authors throughout the publication process.'
                },
                {
                  title: 'Policy Development',
                  description: 'Contributing to editorial policies and best practices in academic publishing.'
                },
                {
                  title: 'Community Engagement',
                  description: 'Engaging with the academic community and promoting open access publishing.'
                },
              ].map((item, index) => (
                <div key={index} className="flex items-start gap-3">
                  <StarIcon className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
                    <p className="text-gray-600 text-sm">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Section */}
          <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl p-8 text-center text-white">
            <h2 className="text-2xl font-bold mb-3">Interested in Joining Our Editorial Board?</h2>
            <p className="text-emerald-100 mb-6 max-w-2xl mx-auto">
              We welcome distinguished scholars and researchers to contribute to our mission of advancing knowledge.
            </p>
            <a
              href="/contact"
              className="inline-block px-6 py-3 bg-white text-emerald-600 font-semibold rounded-xl hover:bg-emerald-50 transition-all duration-200 shadow-lg"
            >
              Contact Us
            </a>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
