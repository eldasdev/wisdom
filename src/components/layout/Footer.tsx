'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import { BookOpenIcon } from '@heroicons/react/24/outline';
import { useLanguage } from '@/contexts/LanguageContext';
import { getTranslations } from '@/lib/i18n';

export function Footer() {
  const { locale } = useLanguage();
  const t = useMemo(() => getTranslations(locale), [locale]);

  const footerNavigation = useMemo(() => ({
    content: [
      { name: t.contentTypes.article + 's', href: '/articles' },
      { name: t.contentTypes.caseStudy.replace(' ', '') === 'CaseStudy' ? 'Case Studies' : t.contentTypes.caseStudy, href: '/case-studies' },
      { name: t.contentTypes.book + 's', href: '/books' },
      { name: t.contentTypes.collection + 's', href: '/collections' },
      { name: t.contentTypes.teachingNote + 's', href: '/teaching-notes' },
    ],
    about: [
      { name: t.nav.aboutUs, href: '/about' },
      { name: t.nav.contact, href: '/contact' },
    ],
    resources: [
      { name: t.common.tags, href: '/tags' },
      { name: t.nav.pricing, href: '/pricing' },
    ],
  }), [t]);

  return (
    <footer className="bg-gradient-to-b from-gray-50 to-gray-100 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center space-x-2 group mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-[#0C2C55] to-slate-700 rounded-lg flex items-center justify-center shadow-md group-hover:scale-105 transition-transform duration-200">
                <BookOpenIcon className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-[#0C2C55] to-slate-600 bg-clip-text text-transparent">
                Prime SP
              </span>
            </Link>
            <p className="text-sm text-gray-600 max-w-xs mb-6 leading-relaxed">
              {t.home.subtitle}
            </p>
            <div className="flex space-x-3">
              {/* Instagram */}
              <a href="#" className="w-9 h-9 bg-gray-200 hover:bg-[#0C2C55] rounded-lg flex items-center justify-center text-gray-600 hover:text-white transition-all duration-200">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              {/* Telegram */}
              <a href="#" className="w-9 h-9 bg-gray-200 hover:bg-[#0C2C55] rounded-lg flex items-center justify-center text-gray-600 hover:text-white transition-all duration-200">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                </svg>
              </a>
              {/* LinkedIn */}
              <a href="#" className="w-9 h-9 bg-gray-200 hover:bg-[#0C2C55] rounded-lg flex items-center justify-center text-gray-600 hover:text-white transition-all duration-200">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Content */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
              {locale === 'uz' ? 'Kontent' : locale === 'ru' ? 'Контент' : 'Content'}
            </h3>
            <ul className="space-y-2.5">
              {footerNavigation.content.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-gray-600 hover:text-[#0C2C55] transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* About */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
              {t.nav.aboutUs}
            </h3>
            <ul className="space-y-2.5">
              {footerNavigation.about.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-gray-600 hover:text-[#0C2C55] transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
              {locale === 'uz' ? 'Resurslar' : locale === 'ru' ? 'Ресурсы' : 'Resources'}
            </h3>
            <ul className="space-y-2.5">
              {footerNavigation.resources.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-gray-600 hover:text-[#0C2C55] transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-10 pt-8 border-t border-gray-200">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-500 text-center sm:text-left">
              © 2026 Prime Scientific Publishing. {t.footer.allRightsReserved}.
            </p>
            <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
              <Link href="/privacy" className="text-sm text-gray-500 hover:text-[#0C2C55] transition-colors">
                {t.footer.privacyPolicy}
              </Link>
              <Link href="/terms" className="text-sm text-gray-500 hover:text-[#0C2C55] transition-colors">
                {t.footer.termsOfService}
              </Link>
              <Link href="/accessibility" className="text-sm text-gray-500 hover:text-[#0C2C55] transition-colors">
                {t.footer.accessibility}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
