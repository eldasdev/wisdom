'use client';

import { PublicLayout } from '@/components/layout/PublicLayout';
import { 
  CurrencyDollarIcon,
  CheckCircleIcon,
  XMarkIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';

export default function PricingPage() {
  const plans = [
    {
      name: 'Free',
      price: '$0',
      period: 'forever',
      description: 'Perfect for individual researchers and students',
      features: [
        'Access to all published content',
        'Basic search and filtering',
        'Download PDFs',
        'View statistics',
        'Community support'
      ],
      limitations: [
        'No priority review',
        'Standard publication timeline'
      ],
      color: 'from-gray-500 to-gray-700',
      buttonText: 'Get Started Free',
      buttonLink: '/contact'
    },
    {
      name: 'Author',
      price: '$99',
      period: 'per submission',
      description: 'For authors publishing their research',
      features: [
        'Everything in Free',
        'Priority peer review',
        'Fast-track publication (2-3 weeks)',
        'Professional copyediting',
        'DOI registration included',
        'Author dashboard access',
        'Publication analytics',
        'Email support'
      ],
      limitations: [],
      color: 'from-blue-500 to-indigo-600',
      buttonText: 'Start Publishing',
      buttonLink: '/auth/signup?plan=author',
      popular: true
    },
    {
      name: 'Institution',
      price: 'Custom',
      period: 'annual',
      description: 'For universities and research institutions',
      features: [
        'Everything in Author',
        'Unlimited submissions',
        'Dedicated account manager',
        'Custom branding options',
        'Bulk DOI registration',
        'Advanced analytics dashboard',
        'Priority support (24/7)',
        'Training and workshops',
        'API access',
        'Custom integrations'
      ],
      limitations: [],
      color: 'from-purple-500 to-pink-600',
      buttonText: 'Contact Sales',
      buttonLink: '/contact'
    },
  ];

  return (
    <PublicLayout>
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl translate-x-1/3 -translate-y-1/3"></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-white rounded-full blur-3xl -translate-x-1/3 translate-y-1/3"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="text-center">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 mb-4">
              <CurrencyDollarIcon className="w-4 h-4 text-white mr-2" />
              <span className="text-sm font-medium text-white">Pricing</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4">
              Simple, Transparent Pricing
            </h1>
            <p className="text-xl text-indigo-100 max-w-3xl mx-auto">
              Choose the plan that works best for you. All plans include open access publishing.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {plans.map((plan, index) => (
              <div
                key={index}
                className={`relative bg-white rounded-2xl border-2 ${
                  plan.popular ? 'border-indigo-500 shadow-xl scale-105' : 'border-gray-200'
                } p-8 hover:shadow-lg transition-all duration-300`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                      Most Popular
                    </span>
                  </div>
                )}
                
                <div className="text-center mb-6">
                  <div className={`w-16 h-16 bg-gradient-to-br ${plan.color} rounded-xl flex items-center justify-center mx-auto mb-4`}>
                    <CurrencyDollarIcon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <p className="text-gray-600 text-sm mb-4">{plan.description}</p>
                  <div className="mb-2">
                    <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                    {plan.period !== 'forever' && (
                      <span className="text-gray-600 text-lg ml-2">/{plan.period}</span>
                    )}
                  </div>
                </div>

                <div className="space-y-4 mb-6">
                  <div className="text-sm font-semibold text-gray-900 mb-2">Features:</div>
                  {plan.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-start gap-2">
                      <CheckCircleIcon className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-700">{feature}</span>
                    </div>
                  ))}
                  {plan.limitations.length > 0 && (
                    <>
                      <div className="text-sm font-semibold text-gray-900 mb-2 mt-4">Limitations:</div>
                      {plan.limitations.map((limitation, limitIndex) => (
                        <div key={limitIndex} className="flex items-start gap-2">
                          <XMarkIcon className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                          <span className="text-sm text-gray-500">{limitation}</span>
                        </div>
                      ))}
                    </>
                  )}
                </div>

                <a
                  href={plan.buttonLink}
                  className={`block w-full text-center px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                    plan.popular
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 shadow-lg'
                      : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                  }`}
                >
                  {plan.buttonText}
                </a>
              </div>
            ))}
          </div>

          {/* FAQ Section */}
          <div className="bg-white rounded-2xl border border-gray-200 p-8 mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Frequently Asked Questions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  question: 'Is there a free option?',
                  answer: 'Yes! Our Free plan gives you access to all published content and basic features. Perfect for readers and students.'
                },
                {
                  question: 'What payment methods do you accept?',
                  answer: 'We accept all major credit cards, PayPal, and bank transfers for institutional plans.'
                },
                {
                  question: 'Can I upgrade or downgrade my plan?',
                  answer: 'Yes, you can change your plan at any time. Changes take effect immediately.'
                },
                {
                  question: 'Do you offer discounts for students?',
                  answer: 'Yes! Students with valid .edu email addresses receive a 50% discount on Author plans.'
                },
                {
                  question: 'What happens if my submission is rejected?',
                  answer: 'If your submission is rejected during peer review, you can resubmit after revisions at no additional cost within 6 months.'
                },
                {
                  question: 'Are there any hidden fees?',
                  answer: 'No hidden fees. The price you see is the price you pay. All plans include DOI registration and basic formatting.'
                },
              ].map((faq, index) => (
                <div key={index} className="border-b border-gray-200 pb-4">
                  <h3 className="font-semibold text-gray-900 mb-2">{faq.question}</h3>
                  <p className="text-gray-600 text-sm">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Section */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-center text-white">
            <SparklesIcon className="w-12 h-12 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-3">Still Have Questions?</h2>
            <p className="text-indigo-100 mb-6 max-w-2xl mx-auto">
              Our team is here to help. Contact us and we'll get back to you within 24 hours.
            </p>
            <a
              href="/contact"
              className="inline-block px-6 py-3 bg-white text-indigo-600 font-semibold rounded-xl hover:bg-indigo-50 transition-all duration-200 shadow-lg"
            >
              Contact Us
            </a>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
