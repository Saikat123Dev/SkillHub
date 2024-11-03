'use client'

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [inputValue, setInputValue] = useState('');
  const [appliedFilters, setAppliedFilters] = useState<Record<string, string>>({});
  const [currentFilter, setCurrentFilter] = useState('');

  const allFilters = [
    'country',
    'college',
    'primarySkill',
    'name',
    'gender',
    'profession'
  ];

  useEffect(() => {
    const query = searchParams.get('query') || '';
    setInputValue(query);

    const filters: Record<string, string> = {};
    allFilters.forEach(filter => {
      const value = searchParams.get(filter);
      if (value) {
        filters[filter] = value;
      }
    });
    setAppliedFilters(filters);
  }, [searchParams]);
  const handleInputFocus = () => {
    router.push('/search');
  };
  const updateURL = (newFilters: Record<string, string>, newQuery?: string) => {
    const queryParams = new URLSearchParams();

    if (newQuery !== undefined && newQuery !== '') {
      queryParams.set('query', newQuery);
    }

    Object.entries(newFilters).forEach(([key, value]) => {
      if (value) {
        queryParams.set(key, value);
      }
    });

    const queryString = queryParams.toString();
    router.push(queryString ? `/search?${queryString}` : '/search');
  };

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (currentFilter) {
      // If a filter is selected, add it with the current input value
      handleAddFilter();
    } else {
      // Otherwise, treat it as a regular search
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

  const handleRemoveFilter = (filter: string) => {
    const newFilters = { ...appliedFilters };
    delete newFilters[filter];
    setAppliedFilters(newFilters);
    updateURL(newFilters, inputValue);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);

    if (!currentFilter && newValue === '') {
      // Only update URL immediately if we're not in filter mode and the input is cleared
      updateURL(appliedFilters, '');
    }
  };

  const availableFilters = allFilters.filter(filter => !appliedFilters[filter]);

  return (
    <>
      <form onSubmit={handleSearch} className="flex flex-wrap gap-2 items-center">
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onFocus={handleInputFocus} 
          placeholder={currentFilter ? `Enter ${currentFilter}...` : "Search usernames"}
          className="border border-gray-300 rounded-lg p-2 flex-grow focus:outline-none focus:ring focus:ring-blue-300 transition duration-200 ease-in-out hover:border-blue-500"
        />

        <select
          value={currentFilter}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
            setCurrentFilter(e.target.value);
            setInputValue(''); // Clear input when filter changes
          }}
          className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring focus:ring-blue-300 transition duration-200 ease-in-out hover:border-blue-500"
        >
          <option value="">Select Filter</option>
          {availableFilters.map(filter => (
            <option key={filter} value={filter}>
              {filter.charAt(0).toUpperCase() + filter.slice(1)}
            </option>
          ))}
        </select>

        {currentFilter ? (
          <button
            type="button"
            onClick={handleAddFilter}
            className="bg-blue-500 text-white rounded-lg px-4 py-2 hover:bg-blue-600 transition duration-200 ease-in-out"
          >
            Add Filter
          </button>
        ) : (
          <button
            type="submit"
            className="bg-green-500 text-white rounded-lg px-4 py-2 hover:bg-green-600 transition duration-200 ease-in-out"
          >
            Search
          </button>
        )}
      </form>

      <div className="mt-2 flex flex-wrap gap-2">
        {Object.entries(appliedFilters).map(([filter, value]) => (
          <div key={filter} className="bg-gray-200 rounded-full px-3 py-1 flex items-center">
            <span>{filter}: {value}</span>
            <button
              onClick={() => handleRemoveFilter(filter)}
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