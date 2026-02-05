'use client';

import Link from 'next/link';
import { useState, useEffect, useRef, useMemo } from 'react';
import { useSession, signOut } from 'next-auth/react';
import {
  UserIcon,
  Cog6ToothIcon,
  ChartBarIcon,
  ShieldCheckIcon,
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  XMarkIcon,
  MagnifyingGlassIcon,
  BookOpenIcon,
  ChevronDownIcon,
  InformationCircleIcon,
  ArchiveBoxIcon,
  TagIcon,
  CurrencyDollarIcon,
  NewspaperIcon
} from '@heroicons/react/24/outline';
import { LanguageSwitcher } from './LanguageSwitcher';
import { useLanguage } from '@/contexts/LanguageContext';
import { getTranslations } from '@/lib/i18n';

export function Header() {
  const { locale } = useLanguage();
  const t = useMemo(() => getTranslations(locale), [locale]);

  // Navigation with translations
  const adminNavigation = useMemo(() => [
    { name: t.nav.analytics, href: '/analytics' },
  ], [t]);

  const mainNavigation = useMemo(() => [
    {
      name: t.nav.journals || 'Journals',
      href: '/journals',
      hasDropdown: false,
    },
    {
      name: t.nav.aboutUs,
      href: '/about/publishing',
      hasDropdown: true,
      items: [
        { name: t.about.statistics, href: '/about/statistics', description: '' },
        { name: t.about.publishing, href: '/about/publishing' },
        { name: t.about.editorialBoard, href: '/about/editorial-board' },
      ]
    },
    {
      name: t.nav.archive,
      href: '/archive',
      hasDropdown: false,
    },
    {
      name: t.nav.majorTopics,
      href: '/topics/economics',
      hasDropdown: true,
      items: [
        { name: t.topics.economics, href: '/topics/economics' },
        { name: t.topics.business, href: '/topics/business' },
        { name: t.topics.languageSciences, href: '/topics/language-sciences' },
        { name: t.topics.philosophy, href: '/topics/philosophy' },
      ]
    },
    {
      name: t.nav.pricing,
      href: '/pricing',
      hasDropdown: false,
    },
  ], [t]);

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const { data: session, status } = useSession();
  const userMenuRef = useRef<HTMLDivElement>(null);
  const dropdownRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  // Close user menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
      
      // Close dropdowns when clicking outside
      Object.values(dropdownRefs.current).forEach(ref => {
        if (ref && !ref.contains(event.target as Node)) {
          setOpenDropdown(null);
        }
      });
    }
    // Use click instead of mousedown to allow link clicks to register first
    document.addEventListener('click', handleClickOutside, true);
    return () => document.removeEventListener('click', handleClickOutside, true);
  }, []);

  // Close mobile menu on resize
  useEffect(() => {
    function handleResize() {
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    }
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200/50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center space-x-2 group">
              <div className="w-8 h-8 bg-gradient-to-br from-[#0C2C55] to-slate-700 rounded-lg flex items-center justify-center shadow-md group-hover:scale-105 transition-transform duration-200">
                <BookOpenIcon className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-[#0C2C55] to-slate-600 bg-clip-text text-transparent hidden sm:block">
                Prime SP
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {/* New Main Navigation */}
            {mainNavigation.map((item) => (
              <div
                key={item.name}
                className="relative"
                ref={(el) => { dropdownRefs.current[item.name] = el; }}
              >
                {item.hasDropdown ? (
                  <>
                    <button
                      onClick={() => setOpenDropdown(openDropdown === item.name ? null : item.name)}
                      className="flex items-center text-gray-600 hover:text-gray-900 hover:bg-gray-100 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200"
                    >
                      {item.name}
                      <ChevronDownIcon className={`w-4 h-4 ml-1 transition-transform ${openDropdown === item.name ? 'rotate-180' : ''}`} />
                    </button>
                    {openDropdown === item.name && (
                      <div 
                        className="absolute top-full left-0 mt-1 w-56 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {item.items?.map((subItem) => (
                          <Link
                            key={subItem.name}
                            href={subItem.href}
                            onClick={(e) => {
                              e.stopPropagation();
                              setOpenDropdown(null);
                            }}
                            className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#0C2C55] transition-colors"
                          >
                            <div className="font-medium">{subItem.name}</div>
                            {subItem.description && (
                              <div className="text-xs text-gray-500 mt-0.5">{subItem.description}</div>
                            )}
                          </Link>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <Link
                    href={item.href}
                    className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200"
                  >
                    {item.name}
                  </Link>
                )}
              </div>
            ))}
            
            {session?.user?.role === 'ADMIN' && (
              <>
                {adminNavigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="text-[#0C2C55] hover:text-[#0C2C55]/80 hover:bg-[#0C2C55]/5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200"
                  >
                    {item.name}
                  </Link>
                ))}
              </>
            )}
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-1 sm:space-x-3">
            {/* Language Switcher */}
            <LanguageSwitcher />
            
            {/* Contact Button - hidden on mobile, shown on sm+ */}
            <Link
              href="/contact"
              className="hidden sm:flex px-4 py-2 bg-gradient-to-r from-[#0C2C55] to-slate-600 text-white rounded-lg text-sm font-medium hover:from-[#0C2C55]/90 hover:to-slate-600/90 transition-all duration-200 shadow-md hover:shadow-lg"
            >
              {t.nav.contact}
            </Link>
            
            {/* Search Button */}
            <Link 
              href="/search" 
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-all duration-200"
            >
              <MagnifyingGlassIcon className="w-5 h-5" />
            </Link>

            {/* Authentication */}
            {status === 'loading' ? (
              <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse"></div>
            ) : session ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-2 p-1.5 rounded-lg hover:bg-gray-100 transition-all duration-200"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-[#0C2C55] to-slate-600 rounded-full flex items-center justify-center text-white text-sm font-medium shadow-md">
                    {session.user?.name?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                  <span className="hidden md:block text-sm font-medium text-gray-700 max-w-[100px] truncate">
                    {session.user?.name}
                  </span>
                  <svg className="hidden md:block w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Dropdown Menu */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900 truncate">{session.user?.name}</p>
                      <p className="text-xs text-gray-500 truncate">{session.user?.email}</p>
                    </div>

                    <div className="py-1">
                      <Link
                        href="/profile"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <UserIcon className="w-4 h-4 mr-3 text-gray-400" />
                        Profile
                      </Link>

                      <Link
                        href="/settings"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <Cog6ToothIcon className="w-4 h-4 mr-3 text-gray-400" />
                        Settings
                      </Link>

                      <Link
                        href="/dashboard"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <ChartBarIcon className="w-4 h-4 mr-3 text-gray-400" />
                        Dashboard
                      </Link>

                      {session.user?.role === 'ADMIN' && (
                        <Link
                          href="/admin"
                          className="flex items-center px-4 py-2 text-sm text-[#0C2C55] hover:bg-[#0C2C55]/5"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <ShieldCheckIcon className="w-4 h-4 mr-3" />
                          Admin Panel
                        </Link>
                      )}
                    </div>

                    <div className="border-t border-gray-100 pt-1">
                      <button
                        onClick={() => signOut()}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        <ArrowRightOnRectangleIcon className="w-4 h-4 mr-3 text-gray-400" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : null}

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-all duration-200"
            >
              {isMobileMenuOpen ? (
                <XMarkIcon className="w-6 h-6" />
              ) : (
                <Bars3Icon className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-200 py-4 animate-in slide-in-from-top-2 duration-200">
            <nav className="flex flex-col space-y-1">
              {/* New Main Navigation */}
              {mainNavigation.map((item) => (
                <div key={item.name}>
                  {item.hasDropdown ? (
                    <div>
                      <button
                        onClick={() => setOpenDropdown(openDropdown === item.name ? null : item.name)}
                        className="flex items-center justify-between w-full text-gray-700 hover:text-gray-900 hover:bg-gray-100 px-3 py-2.5 rounded-lg text-base font-medium transition-colors"
                      >
                        {item.name}
                        <ChevronDownIcon className={`w-4 h-4 transition-transform ${openDropdown === item.name ? 'rotate-180' : ''}`} />
                      </button>
                      {openDropdown === item.name && (
                        <div className="pl-4 mt-1 space-y-1">
                          {item.items?.map((subItem) => (
                            <Link
                              key={subItem.name}
                              href={subItem.href}
                              className="block text-gray-600 hover:text-gray-900 hover:bg-gray-50 px-3 py-2 rounded-lg text-sm transition-colors"
                              onClick={() => {
                                setIsMobileMenuOpen(false);
                                setOpenDropdown(null);
                              }}
                            >
                              {subItem.name}
                              {subItem.description && (
                                <span className="text-xs text-gray-500 ml-2">({subItem.description})</span>
                              )}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <Link
                      href={item.href}
                      className="text-gray-700 hover:text-gray-900 hover:bg-gray-100 px-3 py-2.5 rounded-lg text-base font-medium transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  )}
                </div>
              ))}

              {session?.user?.role === 'ADMIN' && (
                <>
                  <div className="border-t border-gray-200 my-2"></div>
                  {adminNavigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="text-[#0C2C55] hover:text-[#0C2C55]/80 hover:bg-[#0C2C55]/5 px-3 py-2.5 rounded-lg text-base font-medium transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  ))}
                </>
              )}

              {/* Mobile Language Switcher */}
              <div className="border-t border-gray-200 pt-4 mt-2">
                <div className="px-3">
                  <LanguageSwitcher />
                </div>
              </div>

              {/* Mobile Contact Button */}
              <div className="border-t border-gray-200 pt-4 mt-2 px-3">
                <Link
                  href="/contact"
                  className="block w-full px-4 py-2.5 bg-gradient-to-r from-[#0C2C55] to-slate-600 text-white rounded-lg text-base font-medium hover:from-[#0C2C55]/90 hover:to-slate-600/90 transition-all duration-200 shadow-md hover:shadow-lg text-center"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {t.nav.contact}
                </Link>
              </div>

              {/* Mobile Authentication Links */}
              <div className="border-t border-gray-200 pt-4 mt-2">
                {session ? (
                  <>
                    <div className="px-3 py-2 mb-2">
                      <p className="text-sm font-medium text-gray-900">{session.user?.name}</p>
                      <p className="text-xs text-gray-500">{session.user?.email}</p>
                    </div>
                    <Link
                      href="/profile"
                      className="flex items-center text-gray-700 hover:bg-gray-100 px-3 py-2.5 rounded-lg text-base font-medium transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <UserIcon className="w-5 h-5 mr-3 text-gray-400" />
                      Profile
                    </Link>
                    <Link
                      href="/dashboard"
                      className="flex items-center text-gray-700 hover:bg-gray-100 px-3 py-2.5 rounded-lg text-base font-medium transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <ChartBarIcon className="w-5 h-5 mr-3 text-gray-400" />
                      Dashboard
                    </Link>
                    {session.user?.role === 'ADMIN' && (
                      <Link
                        href="/admin"
                        className="flex items-center text-[#0C2C55] hover:bg-[#0C2C55]/5 px-3 py-2.5 rounded-lg text-base font-medium transition-colors"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <ShieldCheckIcon className="w-5 h-5 mr-3" />
                        Admin Panel
                      </Link>
                    )}
                    <button
                      onClick={() => signOut()}
                      className="flex items-center w-full text-gray-700 hover:bg-gray-100 px-3 py-2.5 rounded-lg text-base font-medium transition-colors"
                    >
                      <ArrowRightOnRectangleIcon className="w-5 h-5 mr-3 text-gray-400" />
                      Sign Out
                    </button>
                  </>
                ) : null}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
