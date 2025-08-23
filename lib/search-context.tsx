'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { searchUsers } from './user-firestore';
import { searchProjects } from './firestore';
import { UserSearchResult, Project, ProjectSearchFilters } from './types';

interface SearchContextType {
  searchQuery: string;
  searchResults: UserSearchResult[];
  isSearching: boolean;
  setSearchQuery: (query: string) => void;
  clearSearch: () => void;
  // Project search
  projectSearchQuery: string;
  projectSearchResults: Project[];
  isSearchingProjects: boolean;
  projectFilters: ProjectSearchFilters;
  setProjectSearchQuery: (query: string) => void;
  setProjectFilters: (filters: Partial<ProjectSearchFilters>) => void;
  clearProjectSearch: () => void;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export function SearchProvider({ children }: { children: ReactNode }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<UserSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Project search state
  const [projectSearchQuery, setProjectSearchQuery] = useState('');
  const [projectSearchResults, setProjectSearchResults] = useState<Project[]>([]);
  const [isSearchingProjects, setIsSearchingProjects] = useState(false);
  const [projectFilters, setProjectFilters] = useState<ProjectSearchFilters>({});

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

  // Project search functions
  const updateProjectFilters = (filters: Partial<ProjectSearchFilters>) => {
    setProjectFilters(prev => ({ ...prev, ...filters }));
  };

  const clearProjectSearch = () => {
    setProjectSearchQuery('');
    setProjectSearchResults([]);
    setProjectFilters({});
  };

  // Project search effect
  useEffect(() => {
    const performProjectSearch = async () => {
      if (!projectSearchQuery.trim() && Object.keys(projectFilters).length === 0) {
        setProjectSearchResults([]);
        setIsSearchingProjects(false);
        return;
      }

      setIsSearchingProjects(true);
      try {
        const results = await searchProjects({
          query: projectSearchQuery,
          ...projectFilters
        });
        setProjectSearchResults(results);
      } catch (error) {
        console.error('Error searching projects:', error);
        setProjectSearchResults([]);
      } finally {
        setIsSearchingProjects(false);
      }
    };

    // Debounce search to avoid too many API calls
    const timeoutId = setTimeout(performProjectSearch, 300);

    return () => clearTimeout(timeoutId);
  }, [projectSearchQuery, projectFilters]);

  const value = {
    searchQuery,
    searchResults,
    isSearching,
    setSearchQuery,
    clearSearch,
    // Project search
    projectSearchQuery,
    projectSearchResults,
    isSearchingProjects,
    projectFilters,
    setProjectSearchQuery,
    setProjectFilters: updateProjectFilters,
    clearProjectSearch,
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