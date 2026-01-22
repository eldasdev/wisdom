import { PublicLayout } from '@/components/layout/PublicLayout';
import { DocumentTextIcon } from '@heroicons/react/24/outline';

export default function TermsPage() {
  const sections = [
    {
      title: 'Acceptance of Terms',
      content: [
        'By accessing and using the Wisdom Publishing platform, you agree to be bound by these Terms of Service',
        'If you do not agree to these terms, you must not use our platform',
        'We reserve the right to modify these terms at any time, and your continued use constitutes acceptance',
        'You must be at least 13 years old to use our platform',
      ],
    },
    {
      title: 'User Accounts',
      content: [
        'You are responsible for maintaining the confidentiality of your account credentials',
        'You agree to provide accurate and complete information when creating an account',
        'You are responsible for all activities that occur under your account',
        'You must notify us immediately of any unauthorized use of your account',
        'We reserve the right to suspend or terminate accounts that violate these terms',
      ],
    },
    {
      title: 'Content Submission',
      content: [
        'You retain ownership of content you submit but grant us a license to publish and distribute it',
        'You warrant that your content is original, does not infringe on others\' rights, and is not defamatory',
        'All submitted content undergoes peer review, and we reserve the right to reject or request revisions',
        'You grant us the right to edit, format, and adapt your content for publication',
        'Published content may be removed if it violates our policies or applicable laws',
      ],
    },
    {
      title: 'Intellectual Property',
      content: [
        'All platform content, design, and functionality are protected by copyright and other intellectual property laws',
        'You may not reproduce, distribute, or create derivative works without permission',
        'Content published on our platform remains the property of its respective authors',
        'You may cite and reference published content in accordance with academic citation standards',
        'Unauthorized use of platform content may result in legal action',
      ],
    },
    {
      title: 'User Conduct',
      content: [
        'You agree to use the platform only for lawful purposes and in accordance with these terms',
        'You must not engage in any activity that disrupts or interferes with the platform',
        'Prohibited activities include hacking, spamming, or attempting to gain unauthorized access',
        'You must not upload malicious software or content that could harm the platform or users',
        'We reserve the right to remove content and ban users who violate these rules',
      ],
    },
    {
      title: 'Disclaimer of Warranties',
      content: [
        'The platform is provided "as is" without warranties of any kind, express or implied',
        'We do not guarantee that the platform will be uninterrupted, secure, or error-free',
        'We are not responsible for the accuracy, completeness, or usefulness of user-submitted content',
        'You use the platform at your own risk',
        'Some jurisdictions do not allow the exclusion of implied warranties, so some limitations may not apply',
      ],
    },
    {
      title: 'Limitation of Liability',
      content: [
        'To the maximum extent permitted by law, we shall not be liable for any indirect, incidental, or consequential damages',
        'Our total liability shall not exceed the amount you paid to us in the past 12 months',
        'We are not responsible for any loss or damage resulting from your use of the platform',
        'This limitation applies regardless of the legal theory on which the claim is based',
      ],
    },
    {
      title: 'Indemnification',
      content: [
        'You agree to indemnify and hold us harmless from any claims arising from your use of the platform',
        'This includes claims related to content you submit or your violation of these terms',
        'You agree to cooperate with us in defending any such claims',
        'We reserve the right to assume exclusive defense and control of any matter subject to indemnification',
      ],
    },
    {
      title: 'Termination',
      content: [
        'We may terminate or suspend your account at any time for violation of these terms',
        'You may terminate your account at any time by contacting us',
        'Upon termination, your right to use the platform will immediately cease',
        'Published content may remain on the platform after account termination',
        'Provisions that by their nature should survive termination will remain in effect',
      ],
    },
    {
      title: 'Governing Law',
      content: [
        'These terms shall be governed by and construed in accordance with applicable laws',
        'Any disputes arising from these terms shall be resolved through appropriate legal channels',
        'You agree to submit to the jurisdiction of the courts in our jurisdiction',
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
              <DocumentTextIcon className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
              Terms of Service
            </h1>
            <p className="text-xl sm:text-2xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
              Please read these terms carefully before using our platform.
            </p>
            <p className="text-sm text-slate-400 mt-4">
              Last updated: January 2026
            </p>
          </div>
        </div>
      </div>

      {/* Terms Content */}
      <div className="py-16 sm:py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-lg max-w-none">
            <p className="text-lg text-gray-700 leading-relaxed mb-8">
              These Terms of Service ("Terms") govern your access to and use of the Wisdom Publishing platform. By using our platform, you agree to be bound by these Terms.
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
                If you have questions about these Terms of Service, please contact us:
              </p>
              <p className="text-gray-700">
                <strong>Email:</strong> legal@wisdom.com<br />
                <strong>Address:</strong> Wisdom Publishing, [Your Address]
              </p>
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
