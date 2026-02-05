import { PublicLayout } from '@/components/layout/PublicLayout';
import { 
  AdjustmentsHorizontalIcon,
  EyeIcon,
  SpeakerWaveIcon,
  CursorArrowRaysIcon
} from '@heroicons/react/24/outline';

export default function AccessibilityPage() {
  const features = [
    {
      icon: EyeIcon,
      title: 'Visual Accessibility',
      description: 'High contrast modes, resizable text, and screen reader compatibility.',
    },
    {
      icon: SpeakerWaveIcon,
      title: 'Audio Support',
      description: 'Text-to-speech capabilities and audio descriptions for multimedia content.',
    },
    {
      icon: CursorArrowRaysIcon,
      title: 'Keyboard Navigation',
      description: 'Full keyboard navigation support for all platform features and content.',
    },
    {
      icon: AdjustmentsHorizontalIcon,
      title: 'Customizable Interface',
      description: 'Adjustable font sizes, color schemes, and layout options to suit your needs.',
    },
  ];

  const standards = [
    {
      title: 'WCAG 2.1 Compliance',
      description: 'Our platform adheres to Web Content Accessibility Guidelines (WCAG) 2.1 Level AA standards.',
    },
    {
      title: 'Screen Reader Support',
      description: 'Compatible with popular screen readers including JAWS, NVDA, and VoiceOver.',
    },
    {
      title: 'Keyboard Accessibility',
      description: 'All interactive elements can be accessed and operated using only a keyboard.',
    },
    {
      title: 'Alternative Text',
      description: 'All images and visual content include descriptive alternative text for screen readers.',
    },
    {
      title: 'Color Contrast',
      description: 'Text and background colors meet WCAG contrast ratio requirements for readability.',
    },
    {
      title: 'Responsive Design',
      description: 'Platform is fully responsive and accessible on all devices and screen sizes.',
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
              Accessibility
            </h1>
            <p className="text-xl sm:text-2xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
              We are committed to making our platform accessible to everyone, regardless of ability.
            </p>
          </div>
        </div>
      </div>

      {/* Commitment Section */}
      <div className="py-16 sm:py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-lg max-w-none">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Commitment</h2>
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              At Prime Scientific Publishing, we believe that knowledge should be accessible to everyone. We are committed to ensuring that our platform is usable by people with disabilities and follows accessibility best practices.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              We continuously work to improve the accessibility of our platform, incorporating feedback from users and following established accessibility standards and guidelines.
            </p>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 sm:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Accessibility Features</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Features designed to make our platform accessible to all users
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="p-6 bg-white rounded-2xl border border-gray-200 hover:shadow-lg transition-all duration-300"
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
        </div>
      </div>

      {/* Standards Section */}
      <div className="py-16 sm:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Accessibility Standards</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We follow established standards to ensure accessibility
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {standards.map((standard, index) => (
              <div
                key={index}
                className="p-6 bg-gradient-to-br from-gray-50 to-white rounded-2xl border border-gray-200 hover:shadow-lg transition-all duration-300"
              >
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {standard.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {standard.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Feedback Section */}
      <div className="py-16 sm:py-24 bg-gradient-to-br from-[#0C2C55] to-slate-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            We Welcome Your Feedback
          </h2>
          <p className="text-lg text-slate-300 mb-8">
            If you encounter any accessibility barriers or have suggestions for improvement, please contact us. We are committed to making our platform accessible to everyone.
          </p>
          <div className="p-6 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
            <p className="text-slate-200 mb-2">
              <strong>Email:</strong> accessibility@wisdom.com
            </p>
            <p className="text-slate-200">
              We aim to respond to all accessibility inquiries within 48 hours.
            </p>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
