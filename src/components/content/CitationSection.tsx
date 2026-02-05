'use client';

import { useState, useMemo, useRef, useEffect } from 'react';
import { ClipboardIcon, CheckIcon, LinkIcon, ChevronDownIcon } from '@heroicons/react/24/outline';

interface Author {
  name: string;
}

interface CitationSectionProps {
  title: string;
  authors: Author[];
  publishedAt: string | Date;
  doi?: string | null;
  contentType: string;
  url?: string;
  publisher?: string;
}

type CitationStyle = 'harvard' | 'apa' | 'mla' | 'chicago' | 'ieee' | 'vancouver' | 'bluebook';

const CITATION_STYLES: { id: CitationStyle; name: string; description: string }[] = [
  { id: 'harvard', name: 'Harvard', description: 'Popular in UK & Australia' },
  { id: 'apa', name: 'APA (7th ed.)', description: 'Psychology, Education, Social Sciences' },
  { id: 'mla', name: 'MLA (9th ed.)', description: 'Humanities, Literature, Language' },
  { id: 'chicago', name: 'Chicago (Author-Date)', description: 'History, Arts, Sciences' },
  { id: 'ieee', name: 'IEEE', description: 'Engineering, Computer Science, Technology' },
  { id: 'vancouver', name: 'Vancouver', description: 'Medicine, Health Sciences' },
  { id: 'bluebook', name: 'Bluebook', description: 'Legal Documents' },
];

export function CitationSection({
  title,
  authors,
  publishedAt,
  doi,
  contentType,
  url,
  publisher = 'Prime Scientific Publishing',
}: CitationSectionProps) {
  const [copied, setCopied] = useState(false);
  const [copiedDoi, setCopiedDoi] = useState(false);
  const [selectedStyle, setSelectedStyle] = useState<CitationStyle>('harvard');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  // Format date components
  const dateObj = new Date(publishedAt);
  const year = dateObj.getFullYear();
  const month = dateObj.toLocaleDateString('en-US', { month: 'long' });
  const day = dateObj.getDate();

  // Get current URL for citations
  const currentUrl = url || (typeof window !== 'undefined' ? window.location.href : '');
  const accessDate = new Date().toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  // Format authors for different styles
  const formatAuthors = {
    // Harvard: Last, F. and Last, F.
    harvard: (authors: Author[]) => {
      if (!authors || authors.length === 0) return 'Anonymous';
      const format = (name: string) => {
        const parts = name.trim().split(' ');
        if (parts.length === 1) return parts[0];
        const lastName = parts[parts.length - 1];
        const initials = parts.slice(0, -1).map(p => p.charAt(0).toUpperCase() + '.').join(' ');
        return `${lastName}, ${initials}`;
      };
      if (authors.length === 1) return format(authors[0].name);
      if (authors.length === 2) return `${format(authors[0].name)} and ${format(authors[1].name)}`;
      if (authors.length <= 3) {
        const formatted = authors.map(a => format(a.name));
        return `${formatted.slice(0, -1).join(', ')} and ${formatted[formatted.length - 1]}`;
      }
      return `${format(authors[0].name)} et al.`;
    },

    // APA: Last, F. M., & Last, F. M.
    apa: (authors: Author[]) => {
      if (!authors || authors.length === 0) return 'Anonymous';
      const format = (name: string) => {
        const parts = name.trim().split(' ');
        if (parts.length === 1) return parts[0];
        const lastName = parts[parts.length - 1];
        const initials = parts.slice(0, -1).map(p => p.charAt(0).toUpperCase() + '.').join(' ');
        return `${lastName}, ${initials}`;
      };
      if (authors.length === 1) return format(authors[0].name);
      if (authors.length === 2) return `${format(authors[0].name)}, & ${format(authors[1].name)}`;
      if (authors.length <= 20) {
        const formatted = authors.map(a => format(a.name));
        return `${formatted.slice(0, -1).join(', ')}, & ${formatted[formatted.length - 1]}`;
      }
      const first19 = authors.slice(0, 19).map(a => format(a.name));
      return `${first19.join(', ')}, ... ${format(authors[authors.length - 1].name)}`;
    },

    // MLA: Last, First, and First Last
    mla: (authors: Author[]) => {
      if (!authors || authors.length === 0) return 'Anonymous';
      const formatFirst = (name: string) => {
        const parts = name.trim().split(' ');
        if (parts.length === 1) return parts[0];
        const lastName = parts[parts.length - 1];
        const firstName = parts.slice(0, -1).join(' ');
        return `${lastName}, ${firstName}`;
      };
      const formatRest = (name: string) => name;
      if (authors.length === 1) return formatFirst(authors[0].name);
      if (authors.length === 2) return `${formatFirst(authors[0].name)}, and ${formatRest(authors[1].name)}`;
      if (authors.length === 3) {
        return `${formatFirst(authors[0].name)}, ${formatRest(authors[1].name)}, and ${formatRest(authors[2].name)}`;
      }
      return `${formatFirst(authors[0].name)}, et al.`;
    },

    // Chicago: Last, First, and First Last
    chicago: (authors: Author[]) => {
      if (!authors || authors.length === 0) return 'Anonymous';
      const formatFirst = (name: string) => {
        const parts = name.trim().split(' ');
        if (parts.length === 1) return parts[0];
        const lastName = parts[parts.length - 1];
        const firstName = parts.slice(0, -1).join(' ');
        return `${lastName}, ${firstName}`;
      };
      const formatRest = (name: string) => name;
      if (authors.length === 1) return formatFirst(authors[0].name);
      if (authors.length === 2) return `${formatFirst(authors[0].name)} and ${formatRest(authors[1].name)}`;
      if (authors.length === 3) {
        return `${formatFirst(authors[0].name)}, ${formatRest(authors[1].name)}, and ${formatRest(authors[2].name)}`;
      }
      return `${formatFirst(authors[0].name)} et al.`;
    },

    // IEEE: F. M. Last
    ieee: (authors: Author[]) => {
      if (!authors || authors.length === 0) return 'Anonymous';
      const format = (name: string) => {
        const parts = name.trim().split(' ');
        if (parts.length === 1) return parts[0];
        const lastName = parts[parts.length - 1];
        const initials = parts.slice(0, -1).map(p => p.charAt(0).toUpperCase() + '.').join(' ');
        return `${initials} ${lastName}`;
      };
      if (authors.length === 1) return format(authors[0].name);
      if (authors.length === 2) return `${format(authors[0].name)} and ${format(authors[1].name)}`;
      if (authors.length <= 6) {
        const formatted = authors.map(a => format(a.name));
        return `${formatted.slice(0, -1).join(', ')}, and ${formatted[formatted.length - 1]}`;
      }
      return `${format(authors[0].name)} et al.`;
    },

    // Vancouver: Last FM, Last FM
    vancouver: (authors: Author[]) => {
      if (!authors || authors.length === 0) return 'Anonymous';
      const format = (name: string) => {
        const parts = name.trim().split(' ');
        if (parts.length === 1) return parts[0];
        const lastName = parts[parts.length - 1];
        const initials = parts.slice(0, -1).map(p => p.charAt(0).toUpperCase()).join('');
        return `${lastName} ${initials}`;
      };
      if (authors.length <= 6) {
        return authors.map(a => format(a.name)).join(', ');
      }
      const first6 = authors.slice(0, 6).map(a => format(a.name));
      return `${first6.join(', ')}, et al.`;
    },

    // Bluebook: First M. Last
    bluebook: (authors: Author[]) => {
      if (!authors || authors.length === 0) return 'Anonymous';
      if (authors.length === 1) return authors[0].name;
      if (authors.length === 2) return `${authors[0].name} & ${authors[1].name}`;
      return `${authors[0].name} et al.`;
    },
  };

  // Get content type label
  const getContentTypeLabel = (type: string) => {
    const normalized = type.toLowerCase().replace(/_/g, '-');
    switch (normalized) {
      case 'article': return 'Article';
      case 'case-study': return 'Case Study';
      case 'book': return 'Book';
      case 'book-chapter': return 'Book Chapter';
      case 'teaching-note': return 'Teaching Note';
      case 'collection': return 'Collection';
      default: return 'Publication';
    }
  };

  // Generate citations for each style
  const generateCitation = useMemo(() => {
    const typeLabel = getContentTypeLabel(contentType);
    
    return {
      // Harvard: Author(s) (Year) 'Title', Type. doi: xxx or Available at: URL (Accessed: Date).
      harvard: () => {
        const authorsText = formatAuthors.harvard(authors);
        let citation = `${authorsText} (${year}) '${title}', ${typeLabel}. `;
        if (doi) {
          citation += `doi: ${doi}.`;
        } else {
          citation += `Available at: ${currentUrl} (Accessed: ${accessDate}).`;
        }
        return citation;
      },

      // APA 7th: Author(s). (Year). Title. Publisher. DOI or URL
      apa: () => {
        const authorsText = formatAuthors.apa(authors);
        let citation = `${authorsText}. (${year}). ${title}. ${publisher}. `;
        if (doi) {
          citation += `https://doi.org/${doi}`;
        } else {
          citation += currentUrl;
        }
        return citation;
      },

      // MLA 9th: Author(s). "Title." Publisher, Year, URL.
      mla: () => {
        const authorsText = formatAuthors.mla(authors);
        let citation = `${authorsText}. "${title}." ${publisher}, ${year}`;
        if (doi) {
          citation += `, doi:${doi}.`;
        } else {
          citation += `, ${currentUrl}.`;
        }
        return citation;
      },

      // Chicago Author-Date: Author(s). Year. "Title." Publisher. DOI or URL.
      chicago: () => {
        const authorsText = formatAuthors.chicago(authors);
        let citation = `${authorsText}. ${year}. "${title}." ${publisher}. `;
        if (doi) {
          citation += `https://doi.org/${doi}.`;
        } else {
          citation += `${currentUrl}.`;
        }
        return citation;
      },

      // IEEE: [#] F. M. Last, "Title," Publisher, Month Year. [Online]. Available: URL
      ieee: () => {
        const authorsText = formatAuthors.ieee(authors);
        let citation = `${authorsText}, "${title}," ${publisher}, ${month} ${year}. `;
        if (doi) {
          citation += `doi: ${doi}.`;
        } else {
          citation += `[Online]. Available: ${currentUrl}`;
        }
        return citation;
      },

      // Vancouver: Author(s). Title. Publisher; Year. Available from: URL
      vancouver: () => {
        const authorsText = formatAuthors.vancouver(authors);
        let citation = `${authorsText}. ${title}. ${publisher}; ${year}. `;
        if (doi) {
          citation += `doi: ${doi}`;
        } else {
          citation += `Available from: ${currentUrl}`;
        }
        return citation;
      },

      // Bluebook: Author, Title, Publisher (Year), URL.
      bluebook: () => {
        const authorsText = formatAuthors.bluebook(authors);
        let citation = `${authorsText}, ${title}, ${publisher} (${year})`;
        if (doi) {
          citation += `, https://doi.org/${doi}.`;
        } else {
          citation += `, ${currentUrl}.`;
        }
        return citation;
      },
    };
  }, [authors, year, title, contentType, doi, currentUrl, accessDate, publisher, month]);

  const currentCitation = generateCitation[selectedStyle]();
  const currentStyleInfo = CITATION_STYLES.find(s => s.id === selectedStyle);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(currentCitation);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy citation:', err);
    }
  };

  const handleCopyDoi = async () => {
    if (!doi) return;
    try {
      await navigator.clipboard.writeText(`https://doi.org/${doi}`);
      setCopiedDoi(true);
      setTimeout(() => setCopiedDoi(false), 2000);
    } catch (err) {
      console.error('Failed to copy DOI:', err);
    }
  };

  return (
    <div className="bg-gradient-to-br from-slate-50 to-gray-100 rounded-2xl border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-700 to-slate-800 px-6 py-4">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Cite this content
        </h3>
      </div>

      <div className="p-6 space-y-6">
        {/* DOI Section */}
        {doi && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              DOI (Digital Object Identifier)
            </label>
            <div className="flex items-center gap-3">
              <div className="flex-1 flex items-center gap-2 px-4 py-3 bg-white rounded-lg border border-gray-200 font-mono text-sm text-blue-600">
                <LinkIcon className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <a
                  href={`https://doi.org/${doi}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline break-all"
                >
                  https://doi.org/{doi}
                </a>
              </div>
              <button
                onClick={handleCopyDoi}
                className={`px-3 py-3 rounded-lg transition-all duration-200 ${
                  copiedDoi 
                    ? 'bg-green-100 border border-green-200' 
                    : 'bg-white border border-gray-200 hover:bg-gray-50'
                }`}
                title={copiedDoi ? 'Copied!' : 'Copy DOI link'}
              >
                {copiedDoi ? (
                  <CheckIcon className="w-5 h-5 text-green-600" />
                ) : (
                  <ClipboardIcon className="w-5 h-5 text-gray-600" />
                )}
              </button>
            </div>
          </div>
        )}

        {/* Citation Style Selector */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Citation Style
          </label>
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-full flex items-center justify-between px-4 py-3 bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-colors text-left"
            >
              <div>
                <span className="font-medium text-gray-900">{currentStyleInfo?.name}</span>
                <span className="ml-2 text-sm text-gray-500">— {currentStyleInfo?.description}</span>
              </div>
              <ChevronDownIcon className={`w-5 h-5 text-gray-500 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {isDropdownOpen && (
              <div className="absolute z-50 w-full mt-2 bg-white rounded-lg border border-gray-200 shadow-lg max-h-80 overflow-y-auto">
                {CITATION_STYLES.map((style) => (
                  <button
                    key={style.id}
                    onClick={() => {
                      setSelectedStyle(style.id);
                      setIsDropdownOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-4 py-3 text-left hover:bg-gray-50 transition-colors ${
                      selectedStyle === style.id ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                    }`}
                  >
                    <div>
                      <span className={`font-medium ${selectedStyle === style.id ? 'text-blue-700' : 'text-gray-900'}`}>
                        {style.name}
                      </span>
                      <p className="text-sm text-gray-500">{style.description}</p>
                    </div>
                    {selectedStyle === style.id && (
                      <CheckIcon className="w-5 h-5 text-blue-600 flex-shrink-0" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Generated Citation */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="block text-sm font-medium text-gray-700">
              Generated Citation
            </label>
            <span className="text-xs text-white bg-slate-600 px-2 py-1 rounded-full">
              {currentStyleInfo?.name}
            </span>
          </div>
          <div className="relative">
            <div className="p-4 bg-white rounded-lg border border-gray-200 text-sm text-gray-800 leading-relaxed pr-12 min-h-[80px]">
              {currentCitation}
            </div>
            <button
              onClick={handleCopy}
              className={`absolute top-3 right-3 p-2 rounded-lg transition-all duration-200 ${
                copied
                  ? 'bg-green-100 text-green-600'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
              title={copied ? 'Copied!' : 'Copy citation'}
            >
              {copied ? (
                <CheckIcon className="w-5 h-5" />
              ) : (
                <ClipboardIcon className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Copy Button */}
        <button
          onClick={handleCopy}
          className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
            copied
              ? 'bg-green-600 text-white'
              : 'bg-slate-700 text-white hover:bg-slate-800'
          }`}
        >
          {copied ? (
            <>
              <CheckIcon className="w-5 h-5" />
              Citation Copied!
            </>
          ) : (
            <>
              <ClipboardIcon className="w-5 h-5" />
              Copy {currentStyleInfo?.name} Citation
            </>
          )}
        </button>

        {/* Citation Help */}
        <p className="text-xs text-gray-500 text-center">
          Select your preferred citation style and click to copy. Paste directly into your reference list.
        </p>
      </div>
    </div>
  );
}
