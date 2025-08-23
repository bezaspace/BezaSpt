'use client';

import { useState, useRef, useEffect } from 'react';
import { useSearch } from '@/lib/search-context';
import { UserCard } from '@/components/user-card';
import { Input } from '@/components/ui/input';

export function SearchBar() {
  const { searchQuery, searchResults, isSearching, setSearchQuery, clearSearch } = useSearch();
  const [isOpen, setIsOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    setIsOpen(value.length > 0);
  };

  const handleInputFocus = () => {
    if (searchQuery.length > 0) {
      setIsOpen(true);
    }
  };

  const handleClearSearch = () => {
    clearSearch();
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={searchRef}>
      <div className="relative">
        <Input
          type="text"
          placeholder="Search users..."
          value={searchQuery}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          className="w-64 bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500"
        />
        {searchQuery && (
          <button
            onClick={handleClearSearch}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
          {isSearching ? (
            <div className="p-4 text-center text-gray-400">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mx-auto mb-2"></div>
              Searching...
            </div>
          ) : searchResults.length > 0 ? (
            <div className="py-2">
              {searchResults.map((user) => (
                <UserCard
                  key={user.uid}
                  user={user}
                  onClick={() => {
                    setIsOpen(false);
                    clearSearch();
                  }}
                />
              ))}
            </div>
          ) : searchQuery.length > 0 ? (
            <div className="p-4 text-center text-gray-400">
              No users found for "{searchQuery}"
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}