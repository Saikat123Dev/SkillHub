
'use client'

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [appliedFilters, setAppliedFilters] = useState<Record<string, string>>({});
  const [currentFilter, setCurrentFilter] = useState('');
  const [currentFilterValue, setCurrentFilterValue] = useState('');
  const [params , setParams] = useState('')
  const allFilters = [
    'country',
    'institutionName',
    'primarySkillset',
    'username',
    'gender',
    'profession'
  ];

  useEffect(() => {
    const query = searchParams.get('query') || '';
    setSearchQuery(query);

    const filters: Record<string, string> = {};
    allFilters.forEach(filter => {
      const value = searchParams.get(filter);
      if (value) {
        filters[filter] = value;
      }
    });
    setAppliedFilters(filters);
  }, [searchParams]);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    applySearch();
  };
  
  const applySearch = () => {
    const queryParams = new URLSearchParams();
    if (searchQuery) {
      queryParams.set('query', searchQuery);
    }

    Object.entries(appliedFilters).forEach(([key, value]) => {
      queryParams.set(key, value);
    });
  
    router.push(`/search?${queryParams.toString()}`);
    setParams(`${queryParams.toString()}`)
  };

  const handleAddFilter = () => {
    if (currentFilter && currentFilterValue) {
      setAppliedFilters(prev => ({
        ...prev,
        [currentFilter]: currentFilterValue
      }));
      setCurrentFilter('');
      setCurrentFilterValue('');
    }
  };

  const handleRemoveFilter = (filter: string) => {
    setAppliedFilters(prev => {
      const newFilters = { ...prev };
      delete newFilters[filter];
      return newFilters;
    });
  };    
  
 const handleFocus= ()=>{
  router.push(`/search?${params}`)
 }
  const availableFilters = allFilters.filter(filter => !appliedFilters[filter]);

  return (
    <>
      <form onSubmit={handleSearch}   onFocus={handleFocus}  className="flex flex-wrap gap-2 items-center">
        <input
          type="text"
        
          value={searchQuery}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
          placeholder="Search usernames"
          className="border border-gray-300 rounded-lg p-2 flex-grow focus:outline-none focus:ring focus:ring-blue-300 transition duration-200 ease-in-out hover:border-blue-500"
        />
        
        <select
          value={currentFilter}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setCurrentFilter(e.target.value)}
          className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring focus:ring-blue-300 transition duration-200 ease-in-out hover:border-blue-500"
        >
          <option value="">Select Filter</option>
          {availableFilters.map(filter => (
            <option key={filter} value={filter}>
              {filter.charAt(0).toUpperCase() + filter.slice(1)}
            </option>
          ))}
        </select>
        
        {currentFilter && (
          <input
            type="text"
            value={currentFilterValue}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCurrentFilterValue(e.target.value)}
            placeholder={`Enter ${currentFilter}`}
            className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring focus:ring-blue-300 transition duration-200 ease-in-out hover:border-blue-500"
          />
        )}
        
        <button
          type="button"
          onClick={handleAddFilter}
          className="bg-blue-500 text-white rounded-lg px-4 py-2 hover:bg-blue-600 transition duration-200 ease-in-out"
        >
          Add Filter
        </button>
        
        <button
          type="submit"
          className="bg-green-500 text-white rounded-lg px-4 py-2 hover:bg-green-600 transition duration-200 ease-in-out"
        >
          Search
        </button>
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