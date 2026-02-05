import { PublicLayout } from '@/components/layout/PublicLayout';
import { ShieldCheckIcon } from '@heroicons/react/24/outline';

export default function PrivacyPage() {
  const sections = [
    {
      title: 'Information We Collect',
      content: [
        'Personal information you provide when creating an account (name, email address, institutional affiliation)',
        'Content you submit for publication (articles, case studies, teaching notes, etc.)',
        'Usage data including pages visited, content accessed, and search queries',
        'Device information including browser type, operating system, and IP address',
        'Cookies and similar tracking technologies to enhance your experience',
      ],
    },
    {
      title: 'How We Use Your Information',
      content: [
        'To provide and maintain our publishing platform and services',
        'To process and publish your submitted content',
        'To communicate with you about your account, submissions, and platform updates',
        'To improve our services and develop new features',
        'To analyze usage patterns and optimize content delivery',
        'To comply with legal obligations and protect our rights',
      ],
    },
    {
      title: 'Information Sharing',
      content: [
        'We do not sell your personal information to third parties',
        'We may share information with service providers who assist in operating our platform',
        'Published content and author information are publicly available as part of our publishing services',
        'We may disclose information if required by law or to protect our rights and safety',
        'Institutional partners may receive aggregated usage statistics',
      ],
    },
    {
      title: 'Data Security',
      content: [
        'We implement industry-standard security measures to protect your information',
        'All data is encrypted in transit using SSL/TLS protocols',
        'Access to personal information is restricted to authorized personnel only',
        'We regularly review and update our security practices',
        'While we strive to protect your data, no method of transmission over the internet is 100% secure',
      ],
    },
    {
      title: 'Your Rights',
      content: [
        'Access and review your personal information',
        'Request corrections to inaccurate information',
        'Request deletion of your account and associated data',
        'Opt-out of marketing communications',
        'Export your data in a portable format',
        'Withdraw consent for data processing where applicable',
      ],
    },
    {
      title: 'Cookies and Tracking',
      content: [
        'We use cookies to enhance your browsing experience and analyze site usage',
        'Essential cookies are required for the platform to function properly',
        'Analytics cookies help us understand how visitors use our site',
        'You can manage cookie preferences through your browser settings',
        'Disabling cookies may affect certain platform features',
      ],
    },
    {
      title: 'Children\'s Privacy',
      content: [
        'Our platform is not intended for children under 13 years of age',
        'We do not knowingly collect personal information from children',
        'If you believe we have collected information from a child, please contact us immediately',
      ],
    },
    {
      title: 'Changes to This Policy',
      content: [
        'We may update this Privacy Policy from time to time',
        'Significant changes will be communicated through email or platform notifications',
        'Your continued use of the platform after changes constitutes acceptance',
        'We encourage you to review this policy periodically',
      ],
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
            <div className="w-16 h-16 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-6">
              <ShieldCheckIcon className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
              Privacy Policy
            </h1>
            <p className="text-xl sm:text-2xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
              Your privacy is important to us. Learn how we collect, use, and protect your information.
            </p>
            <p className="text-sm text-slate-400 mt-4">
              Last updated: January 2026
            </p>
          </div>
        </div>
      </div>

      {/* Policy Content */}
      <div className="py-16 sm:py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-lg max-w-none">
            <p className="text-lg text-gray-700 leading-relaxed mb-8">
              At Prime Scientific Publishing, we are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform.
            </p>

            {sections.map((section, index) => (
              <div key={index} className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  {section.title}
                </h2>
                <ul className="space-y-3">
                  {section.content.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-[#0C2C55] rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-700 leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            <div className="mt-12 p-6 bg-gray-50 rounded-xl border border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Contact Us
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                If you have questions about this Privacy Policy or wish to exercise your rights, please contact us:
              </p>
              <p className="text-gray-700">
                <strong>Email:</strong> privacy@wisdom.com<br />
                <strong>Address:</strong> Prime Scientific Publishing, [Your Address]
              </p>
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
