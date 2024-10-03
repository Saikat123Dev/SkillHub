'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import ScrollToTop from '../my_profile/[userId]/components/helper/scroll-to-top';
import { useSearchParams, useRouter } from 'next/navigation';
import ScrollReveal from 'scrollreveal';

function Page() {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('/api/users');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const users = await response.json();
        console.log(users)
        setData(users);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  // Function to update URL and filter data
  const updateFilters = (filters) => {
    const params = new URLSearchParams();
    
    // Only add non-empty filters to the URL
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value.trim() !== '') {
        params.set(key, value);
      }
    });

    // Update the URL immediately
    router.push(params.toString() ? `?${params.toString()}` : '');

    // Filter the data
    let filtered = data;
    filtered = filtered.filter(item => {
      return Object.entries(filters).every(([key, value]) => {
        if (!value || value.trim() === '') return true;
        return item[key] && item[key].toLowerCase().includes(value.toLowerCase());
      });
    });

    setFilteredData(filtered);
  };

  useEffect(() => {
    // Create an object of current filters from searchParams
    const currentFilters = {};
    for (const [key, value] of searchParams.entries()) {
      currentFilters[key] = value;
    }

    // Update filters and data
    updateFilters(currentFilters);
  }, [searchParams, data]);

  useEffect(() => {
    ScrollReveal().reveal('.reveal', {
      duration: 1000,
      distance: '50px',
      easing: 'ease-in-out',
      origin: 'bottom',
      reset: true,
    });
  }, [filteredData]);

  return (
    <>
      <p>Search Results</p>
      <h2 className="text-2xl font-bold mb-4 text-blue-600 reveal">SearchList</h2>

      <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-md reveal">
        <thead>
          <tr className="bg-gray-200 text-gray-700">
            <th className="border border-gray-300 p-2">Stream</th>
            <th className="border border-gray-300 p-2">Username</th>
            <th className="border border-gray-300 p-2">Primary Skillset</th>
            <th className="border border-gray-300 p-2">Institution Name</th>
            <th className="border border-gray-300 p-2">Country</th>
            <th className="border border-gray-300 p-2">Profession</th>
            <th className="border border-gray-300 p-2">View Profile</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((item, index) => (
            <tr key={index} className="hover:bg-gray-100 transition duration-200 ease-in-out reveal">
              <td className="border border-gray-300 p-4 text-center bg-white text-gray-800">{item.dept}</td>
              <td className="border border-gray-300 p-4 text-center bg-white text-gray-800">{item.name}</td>
              <td className="border border-gray-300 p-4 text-center bg-white text-gray-800">{item.primarySkill}</td>
              <td className="border border-gray-300 p-4 text-center bg-white text-gray-800">{item.college}</td>
              <td className="border border-gray-300 p-4 text-center bg-white text-gray-800">{item.country}</td>
              <td className="border border-gray-300 p-4 text-center bg-white text-gray-800">{item.profession}</td>
              <td className="border border-gray-300 p-4 text-center bg-white text-gray-800">
                <Link href={`/profile/${item.id}`}>
                  <div className="w-10 h-10 bg-black rounded-full flex justify-center items-center hover:bg-gray-800 transition duration-300 cursor-pointer">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="white"
                      className="w-6 h-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <ScrollToTop />
    </>
  );
}

export default Page;