'use client';

import { useState, useRef, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { locales, localeNames, Locale } from '@/lib/i18n/config';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import UZ from 'country-flag-icons/react/3x2/UZ';
import GB from 'country-flag-icons/react/3x2/GB';
import RU from 'country-flag-icons/react/3x2/RU';

const flagComponents: Record<Locale, React.ComponentType<{ className?: string }>> = {
  uz: UZ,
  en: GB,
  ru: RU,
};

export function LanguageSwitcher() {
  const { locale, setLocale } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentLocale = localeNames[locale];
  const CurrentFlag = flagComponents[locale];

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg text-sm font-medium transition-all duration-200 border border-gray-200"
      >
        <CurrentFlag className="w-5 h-4 rounded-sm" />
        <span className="hidden sm:inline">{currentLocale.name}</span>
        <ChevronDownIcon className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
          {locales.map((loc) => {
            const localeInfo = localeNames[loc];
            const FlagComponent = flagComponents[loc];
            return (
              <button
                key={loc}
                onClick={() => {
                  setLocale(loc);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                  locale === loc
                    ? 'bg-indigo-50 text-indigo-600 font-medium'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <FlagComponent className="w-6 h-4 rounded-sm" />
                <span>{localeInfo.name}</span>
                {locale === loc && (
                  <span className="ml-auto text-indigo-600">✓</span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
