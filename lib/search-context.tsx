'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { searchUsers } from './user-firestore';
import { UserSearchResult } from './types';

interface SearchContextType {
  searchQuery: string;
  searchResults: UserSearchResult[];
  isSearching: boolean;
  setSearchQuery: (query: string) => void;
  clearSearch: () => void;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export function SearchProvider({ children }: { children: ReactNode }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<UserSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const performSearch = async () => {
      if (!searchQuery.trim()) {
        setSearchResults([]);
        setIsSearching(false);
        return;
      }

      setIsSearching(true);
      try {
        const results = await searchUsers(searchQuery);
        setSearchResults(results);
      } catch (error) {
        console.error('Error searching users:', error);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    };

    // Debounce search to avoid too many API calls
    const timeoutId = setTimeout(performSearch, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
  };

  const value = {
    searchQuery,
    searchResults,
    isSearching,
    setSearchQuery,
    clearSearch,
  };

  return (
    <SearchContext.Provider value={value}>
      {children}
    </SearchContext.Provider>
  );
}

export function useSearch() {
  const context = useContext(SearchContext);
  if (context === undefined) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
}