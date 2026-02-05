'use client';

import { useState } from 'react';
import { 
  ChatBubbleLeftRightIcon, 
  XMarkIcon,
  EnvelopeIcon,
  BugAntIcon,
  LightBulbIcon,
  PaperAirplaneIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

interface ContactFormData {
  type: 'bug' | 'feature' | 'question' | 'other';
  email: string;
  subject: string;
  message: string;
}

export function ContactDeveloper() {
  const [isOpen, setIsOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState<ContactFormData>({
    type: 'bug',
    email: '',
    subject: '',
    message: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // For now, create a mailto link with the form data
    const mailtoSubject = encodeURIComponent(`[${formData.type.toUpperCase()}] ${formData.subject}`);
    const mailtoBody = encodeURIComponent(
      `Type: ${formData.type}\n` +
      `From: ${formData.email}\n` +
      `Subject: ${formData.subject}\n\n` +
      `Message:\n${formData.message}\n\n` +
      `---\nSent from Prime SP Platform`
    );
    
    // Open email client - replace with your email
    window.open(`mailto:developer@wisdom.uz?subject=${mailtoSubject}&body=${mailtoBody}`, '_blank');
    
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setIsOpen(false);
      setFormData({ type: 'bug', email: '', subject: '', message: '' });
    }, 2000);
  };

  const contactTypes = [
    { value: 'bug', label: 'Bug Report', icon: BugAntIcon, color: 'text-red-500' },
    { value: 'feature', label: 'Feature Request', icon: LightBulbIcon, color: 'text-yellow-500' },
    { value: 'question', label: 'Question', icon: ChatBubbleLeftRightIcon, color: 'text-blue-500' },
    { value: 'other', label: 'Other', icon: EnvelopeIcon, color: 'text-gray-500' },
  ];

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 group"
        title="Contact Developer"
      >
        <BugAntIcon className="w-5 h-5" />
        <span className="hidden sm:inline font-medium">Report Issue</span>
      </button>

      {/* Modal Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div 
            className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-white">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                    <ChatBubbleLeftRightIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold">Contact Developer</h2>
                    <p className="text-sm text-blue-100">We're here to help!</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-white/20 rounded-full transition-colors"
                >
                  <XMarkIcon className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>

            {/* Content */}
            {submitted ? (
              <div className="p-8 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircleIcon className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Message Sent!</h3>
                <p className="text-gray-600">Thank you for reaching out. We'll get back to you soon.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="p-6 space-y-5">
                {/* Type Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    What can we help with?
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {contactTypes.map((type) => (
                      <button
                        key={type.value}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, type: type.value as any }))}
                        className={`flex items-center gap-2 p-3 rounded-lg border-2 transition-all ${
                          formData.type === type.value
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <type.icon className={`w-5 h-5 ${type.color}`} />
                        <span className="text-sm font-medium text-gray-700">{type.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="contact-email" className="block text-sm font-medium text-gray-700 mb-1">
                    Your Email
                  </label>
                  <input
                    type="email"
                    id="contact-email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="your@email.com"
                    required
                  />
                </div>

                {/* Subject */}
                <div>
                  <label htmlFor="contact-subject" className="block text-sm font-medium text-gray-700 mb-1">
                    Subject
                  </label>
                  <input
                    type="text"
                    id="contact-subject"
                    value={formData.subject}
                    onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Brief description of the issue"
                    required
                  />
                </div>

                {/* Message */}
                <div>
                  <label htmlFor="contact-message" className="block text-sm font-medium text-gray-700 mb-1">
                    Message
                  </label>
                  <textarea
                    id="contact-message"
                    value={formData.message}
                    onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                    placeholder="Please describe the issue in detail. Include steps to reproduce if it's a bug."
                    required
                  />
                </div>

                {/* Tips for bug reports */}
                {formData.type === 'bug' && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm">
                    <p className="font-medium text-red-800 mb-1">💡 For better bug reports, include:</p>
                    <ul className="text-red-700 space-y-0.5 list-disc list-inside">
                      <li>Steps to reproduce the issue</li>
                      <li>What you expected vs what happened</li>
                      <li>Browser and device info</li>
                    </ul>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg"
                >
                  <PaperAirplaneIcon className="w-5 h-5" />
                  Send Message
                </button>

                {/* Alternative Contact */}
                <div className="text-center text-sm text-gray-500">
                  <p>Or email us directly at</p>
                  <a 
                    href="mailto:developer@wisdom.uz" 
                    className="text-blue-600 hover:underline font-medium"
                  >
                    developer@wisdom.uz
                  </a>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
