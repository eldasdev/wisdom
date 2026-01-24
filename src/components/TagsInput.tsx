'use client';

import { useState, KeyboardEvent } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface TagsInputProps {
  tags: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
  className?: string;
}

export function TagsInput({ 
  tags, 
  onChange, 
  placeholder = 'Type and press Enter or comma to add tags',
  className = ''
}: TagsInputProps) {
  const [inputValue, setInputValue] = useState('');

  const addTag = (tag: string) => {
    const trimmedTag = tag.trim().toLowerCase();
    if (trimmedTag && !tags.includes(trimmedTag)) {
      onChange([...tags, trimmedTag]);
    }
    setInputValue('');
  };

  const removeTag = (tagToRemove: string) => {
    onChange(tags.filter(tag => tag !== tagToRemove));
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag(inputValue);
    } else if (e.key === 'Backspace' && !inputValue && tags.length > 0) {
      // Remove last tag when backspace is pressed on empty input
      removeTag(tags[tags.length - 1]);
    }
  };

  const handleInputChange = (value: string) => {
    // Check if user pasted or typed a comma
    if (value.includes(',')) {
      const parts = value.split(',');
      parts.forEach((part, index) => {
        if (index < parts.length - 1) {
          // Add all parts except the last one as tags
          addTag(part);
        } else {
          // Keep the last part in the input
          setInputValue(part);
        }
      });
    } else {
      setInputValue(value);
    }
  };

  const handleBlur = () => {
    // Add any remaining text as a tag when input loses focus
    if (inputValue.trim()) {
      addTag(inputValue);
    }
  };

  return (
    <div className={`${className}`}>
      <div className="min-h-[42px] w-full px-3 py-2 border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 bg-white">
        <div className="flex flex-wrap gap-2 items-center">
          {/* Tag chips */}
          {tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full"
            >
              {tag}
              <button
                type="button"
                onClick={() => removeTag(tag)}
                className="p-0.5 hover:bg-blue-200 rounded-full transition-colors"
                title={`Remove ${tag}`}
              >
                <XMarkIcon className="w-3.5 h-3.5" />
              </button>
            </span>
          ))}
          
          {/* Input field */}
          <input
            type="text"
            value={inputValue}
            onChange={(e) => handleInputChange(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={handleBlur}
            placeholder={tags.length === 0 ? placeholder : 'Add more...'}
            className="flex-1 min-w-[150px] outline-none text-sm py-1 bg-transparent"
          />
        </div>
      </div>
      
      {/* Helper text */}
      <p className="mt-1.5 text-xs text-gray-500">
        Press <kbd className="px-1.5 py-0.5 bg-gray-100 rounded text-gray-700 font-mono">Enter</kbd> or <kbd className="px-1.5 py-0.5 bg-gray-100 rounded text-gray-700 font-mono">,</kbd> to add a tag. Click × to remove.
      </p>
    </div>
  );
}
