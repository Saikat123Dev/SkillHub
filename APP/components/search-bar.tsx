// SearchBar.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

type FilterType = 'country' | 'college' | 'primarySkill' | 'name' | 'gender' | 'profession';

function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [inputValue, setInputValue] = useState<string>('');
  const [appliedFilters, setAppliedFilters] = useState<Record<FilterType, string>>({});
  const [currentFilter, setCurrentFilter] = useState<FilterType | ''>('');

  const allFilters: FilterType[] = [
    'country',
    'college',
    'primarySkill',
    'name',
    'gender',
    'profession'
  ];

  useEffect(() => {
    const filters: Partial<Record<FilterType, string>> = {};
    allFilters.forEach(filter => {
      const value = searchParams.get(filter);
      if (value) {
        filters[filter] = value;
      }
    });
    setAppliedFilters(filters as Record<FilterType, string>);
    setInputValue(searchParams.get('query') || '');
  }, [searchParams]);

  const updateURL = (newFilters: Record<FilterType, string>, newQuery?: string) => {
    const queryParams = new URLSearchParams();

    Object.entries(newFilters).forEach(([key, value]) => {
      if (value) {
        queryParams.set(key, value);
      }
    });

    if (newQuery) {
      queryParams.set('query', newQuery);
    }

    const queryString = queryParams.toString();
    router.push(queryString ? `/search?${queryString}` : '/search', { scroll: false });
  };

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (currentFilter) {
      handleAddFilter();
    } else {
      updateURL(appliedFilters, inputValue);
    }
  };

  const handleAddFilter = () => {
    if (currentFilter && inputValue) {
      const newFilters = {
        ...appliedFilters,
        [currentFilter]: inputValue
      };
      setAppliedFilters(newFilters);
      updateURL(newFilters);
      setCurrentFilter('');
      setInputValue('');
    }
  };

  const handleRemoveFilter = (filter: FilterType) => {
    const newFilters = { ...appliedFilters };
    delete newFilters[filter];
    setAppliedFilters(newFilters);
    updateURL(newFilters);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCurrentFilter(e.target.value as FilterType);
    setInputValue('');
  };

  const availableFilters = allFilters.filter(filter => !appliedFilters[filter]);
  const handleBlur=()=>{
    router.push('/search');


  }

  return (
    <>
      <form onSubmit={handleSearch} onBlur={handleBlur} className="flex flex-wrap gap-2 items-center">
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          placeholder={currentFilter ? `Enter ${currentFilter}...` : "Search usernames"}
          className="border border-gray-300 rounded-lg p-2 flex-grow focus:outline-none focus:ring focus:ring-blue-300 transition duration-200 ease-in-out hover:border-blue-500"
        />

        <select
          value={currentFilter}
          onChange={handleFilterChange}
          className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring focus:ring-blue-300 transition duration-200 ease-in-out hover:border-blue-500"
        >
          <option value="">Select Filter</option>
          {availableFilters.map(filter => (
            <option key={filter} value={filter}>
              {filter.charAt(0).toUpperCase() + filter.slice(1)}
            </option>
          ))}
        </select>

        <button
          type="submit"
          className="bg-green-500 text-white rounded-lg px-4 py-2 hover:bg-green-600 transition duration-200 ease-in-out"
        >
          {currentFilter ? 'Add Filter' : 'Search'}
        </button>
      </form>

      <div className="mt-2 flex flex-wrap gap-2">
        {Object.entries(appliedFilters).map(([filter, value]) => (
          <div key={filter} className="bg-gray-200 rounded-full px-3 py-1 flex items-center">
            <span>{filter}: {value}</span>
            <button
              onClick={() => handleRemoveFilter(filter as FilterType)}
              className="ml-2 text-red-500 hover:text-red-700"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </>
  );
}

export default SearchBar;