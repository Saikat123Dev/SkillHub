'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
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
        console.log('Fetched users:', users); // Debug: Check all users fetched
        setData(users);
        setFilteredData(users); // Set initial display to all users
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  const updateFilters = (filters) => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value.trim() !== '') {
        params.set(key, value);
      }
    });
    router.push(params.toString() ? `?${params.toString()}` : '');

    const filtered = data.filter((item) =>
      Object.entries(filters).every(([key, value]) =>
        !value || item[key]?.toLowerCase().includes(value.toLowerCase())
      )
    );
    console.log('Filtered data:', filtered); // Debug: Check filtered users
    setFilteredData(filtered.length ? filtered : data); // Default to all if no match
  };

  useEffect(() => {
    const currentFilters = {};
    for (const [key, value] of searchParams.entries()) {
      currentFilters[key] = value;
    }
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

      {filteredData.length === 0 ? (
        <p>No users found</p>
      ) : (
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
      )}
    </>
  );
}

export default Page;
