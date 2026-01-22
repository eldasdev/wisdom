'use client';

import { useState } from 'react';
import { PublicLayout } from '@/components/layout/PublicLayout';
import { 
  EnvelopeIcon, 
  PhoneIcon, 
  MapPinIcon, 
  ClockIcon,
  PaperAirplaneIcon,
  ChatBubbleLeftRightIcon,
  QuestionMarkCircleIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    inquiryType: 'general'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1500));

    setIsSubmitted(true);
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: '',
      inquiryType: 'general'
    });
    setIsSubmitting(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const contactMethods = [
    {
      icon: EnvelopeIcon,
      title: 'Email Us',
      description: 'We\'ll respond within 24 hours',
      contact: 'contact@wisdompub.com',
      link: 'mailto:contact@wisdompub.com',
      color: 'from-blue-500 to-indigo-600'
    },
    {
      icon: PhoneIcon,
      title: 'Call Us',
      description: 'Mon-Fri, 9AM-6PM EST',
      contact: '+1 (555) 123-4567',
      link: 'tel:+15551234567',
      color: 'from-emerald-500 to-teal-600'
    },
    {
      icon: MapPinIcon,
      title: 'Visit Us',
      description: 'Academic District',
      contact: '123 University Ave',
      link: '#',
      color: 'from-purple-500 to-violet-600'
    },
    {
      icon: ClockIcon,
      title: 'Business Hours',
      description: 'We\'re here to help',
      contact: 'Mon-Fri: 9-6 EST',
      link: '#',
      color: 'from-orange-500 to-amber-600'
    }
  ];

  const inquiryTypes = [
    { value: 'general', label: 'General Inquiry' },
    { value: 'support', label: 'Technical Support' },
    { value: 'business', label: 'Business Partnership' },
    { value: 'academic', label: 'Academic Collaboration' },
    { value: 'press', label: 'Press & Media' },
    { value: 'feedback', label: 'Feedback & Suggestions' }
  ];

  return (
    <PublicLayout>
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#0C2C55] via-slate-800 to-slate-900">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-400 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-purple-500 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24">
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-6">
              <ChatBubbleLeftRightIcon className="w-4 h-4 text-blue-300 mr-2" />
              <span className="text-sm font-medium text-white/90">We'd Love to Hear From You</span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6 tracking-tight">
              Contact Us
            </h1>
            <p className="text-base sm:text-lg lg:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed px-4">
              Have questions about our platform, need support, or interested in partnerships? We're here to help.
            </p>
          </div>
        </div>
      </div>

      {/* Contact Methods */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 sm:-mt-12 relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {contactMethods.map((method, index) => (
            <a
              key={index}
              href={method.link}
              className="group bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-200 p-4 sm:p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br ${method.color} flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300`}>
                <method.icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-1">{method.title}</h3>
              <p className="text-xs sm:text-sm text-gray-500 mb-2">{method.description}</p>
              <p className="text-xs sm:text-sm font-medium text-[#0C2C55]">{method.contact}</p>
            </a>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Contact Form */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl sm:rounded-3xl shadow-lg border border-gray-200 p-6 sm:p-8 lg:p-10">
              {isSubmitted ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-emerald-100 flex items-center justify-center">
                    <CheckCircleIcon className="w-8 h-8 text-emerald-600" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Message Sent!</h3>
                  <p className="text-gray-600 mb-6">We'll get back to you within 24 hours.</p>
                  <button
                    onClick={() => setIsSubmitted(false)}
                    className="text-[#0C2C55] font-semibold hover:underline"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <>
                  <div className="mb-6 sm:mb-8">
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Send us a Message</h2>
                    <p className="text-gray-600 text-sm sm:text-base">Fill out the form and we'll be in touch soon.</p>
                  </div>
                  
                  <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1.5">
                          Full Name
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          required
                          value={formData.name}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0C2C55] focus:border-transparent transition-all duration-200"
                          placeholder="John Doe"
                        />
                      </div>
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
                          Email Address
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          required
                          value={formData.email}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0C2C55] focus:border-transparent transition-all duration-200"
                          placeholder="you@example.com"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="inquiryType" className="block text-sm font-medium text-gray-700 mb-1.5">
                        Type of Inquiry
                      </label>
                      <select
                        id="inquiryType"
                        name="inquiryType"
                        value={formData.inquiryType}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0C2C55] focus:border-transparent transition-all duration-200"
                      >
                        {inquiryTypes.map((type) => (
                          <option key={type.value} value={type.value}>{type.label}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1.5">
                        Subject
                      </label>
                      <input
                        type="text"
                        id="subject"
                        name="subject"
                        required
                        value={formData.subject}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0C2C55] focus:border-transparent transition-all duration-200"
                        placeholder="How can we help?"
                      />
                    </div>

                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1.5">
                        Message
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        required
                        rows={5}
                        value={formData.message}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0C2C55] focus:border-transparent transition-all duration-200 resize-none"
                        placeholder="Tell us more about your inquiry..."
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full flex items-center justify-center py-3 sm:py-4 px-6 text-base font-semibold rounded-xl text-white bg-[#0C2C55] hover:bg-[#0C2C55]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0C2C55] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg shadow-[#0C2C55]/25 hover:shadow-xl"
                    >
                      {isSubmitting ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Sending...
                        </>
                      ) : (
                        <>
                          <PaperAirplaneIcon className="w-5 h-5 mr-2" />
                          Send Message
                        </>
                      )}
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-2 space-y-6">
            {/* Department Contacts */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 sm:p-8">
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-5">Department Contacts</h3>
              <div className="space-y-4">
                {[
                  { name: 'General Support', email: 'support@wisdompub.com' },
                  { name: 'Business Development', email: 'business@wisdompub.com' },
                  { name: 'Academic Partnerships', email: 'academic@wisdompub.com' },
                  { name: 'Press & Media', email: 'press@wisdompub.com' },
                ].map((dept, index) => (
                  <div key={index} className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-3 border-b border-gray-100 last:border-0 last:pb-0">
                    <span className="font-medium text-gray-900 text-sm">{dept.name}</span>
                    <a href={`mailto:${dept.email}`} className="text-[#0C2C55] hover:underline text-sm mt-1 sm:mt-0">
                      {dept.email}
                    </a>
                  </div>
                ))}
              </div>
            </div>

            {/* FAQ Section */}
            <div className="bg-gradient-to-br from-[#0C2C55] to-slate-800 rounded-2xl p-6 sm:p-8 text-white">
              <div className="flex items-center mb-5">
                <QuestionMarkCircleIcon className="w-6 h-6 mr-2" />
                <h3 className="text-lg sm:text-xl font-bold">Quick FAQ</h3>
              </div>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-1 text-sm">How quickly do you respond?</h4>
                  <p className="text-slate-300 text-xs sm:text-sm">Within 24 hours on business days.</p>
                </div>
                <div>
                  <h4 className="font-medium mb-1 text-sm">Do you offer demos?</h4>
                  <p className="text-slate-300 text-xs sm:text-sm">Yes! Contact business development.</p>
                </div>
                <div>
                  <h4 className="font-medium mb-1 text-sm">Need urgent support?</h4>
                  <p className="text-slate-300 text-xs sm:text-sm">Call us during business hours.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
