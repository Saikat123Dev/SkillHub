'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import ScrollReveal from 'scrollreveal';

function Page() {
  const [data, setData] = useState([]);
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
      
        const queryParams = new URLSearchParams();

        // Use `query` parameter for name search if provided
        if (searchParams.has('query')) {
          queryParams.append('name', searchParams.get('query'));
        } else {
          // Otherwise, use individual filters from URL
          for (const [key, value] of searchParams.entries()) {
            if (value.trim()) queryParams.append(key, value);
          }
        }

        const response = await fetch(`/api/search?${queryParams.toString()}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const users = await response.json();
        console.log('Fetched users:', users); // Debug: Check all users fetched
        setData(users); // Set fetched data
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, [searchParams]);

  const handleFilterChange = (filters) => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value.trim() !== '') {
        params.set(key, value);
      }
    });
    router.push(params.toString() ? `?${params.toString()}` : '');
  };

  useEffect(() => {
    ScrollReveal().reveal('.reveal', {
      duration: 1000,
      distance: '50px',
      easing: 'ease-in-out',
      origin: 'bottom',
      reset: true,
    });
  }, [data]);

  return (
    <>
      <p>Search Results</p>
      <h2 className="text-2xl font-bold mb-4 text-blue-600 reveal">SearchList</h2>

      {data.length === 0 ? (
        <p>No users found</p>
      ) : (
        <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-md">
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
            {data.map((item, index) => (
              <tr key={index} className="hover:bg-gray-100 transition duration-200 ease-in-out">
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
                    +
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
