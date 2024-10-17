"use client"
import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

function Page() {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const searchParams = useSearchParams();

  const limit = 10;
  const observerRef = useRef();

  const fetchUsers = useCallback(async (pageNumber = 1) => {
    if (loading) return;

    setLoading(true);
    try {
      const queryString = searchParams.toString();
      const response = await fetch(`/api/users?${queryString}&page=${pageNumber}&limit=${limit}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const { users, totalPages } = await response.json();
      console.log('Received data:', { users, totalPages });

      if (pageNumber === 1) {
        setData(users);
      } else {
        setData((prevData) => [...prevData, ...users]);
      }

      setHasMore(pageNumber < totalPages);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  }, [searchParams]);

  useEffect(() => {
    setPage(1);
    setHasMore(true);
    setData([]); // Clear existing data when search params change
    fetchUsers(1);
  }, [searchParams, fetchUsers]);

  useEffect(() => {
    const filters = {
      country: searchParams.get('country') || '',
      college: searchParams.get('college') || '',
      primarySkill: searchParams.get('primarySkill') || '',
      name: searchParams.get('name') || '',
      gender: searchParams.get('gender') || '',
      profession: searchParams.get('profession') || '',
    };

    const query = searchParams.get('query') || '';

    const filtered = data.filter((item) => {
      const matchesQuery = query === '' || item.name.toLowerCase().includes(query.toLowerCase());
      const matchesFilters = Object.entries(filters).every(([key, value]) => {
        if (!value) return true;
        return item[key] && item[key].toLowerCase().includes(value.toLowerCase());
      });
      return matchesQuery && matchesFilters;
    });

    setFilteredData(filtered);
  }, [data, searchParams]);

  const lastUserRef = useCallback(
    (node) => {
      if (loading) return;
      if (observerRef.current) observerRef.current.disconnect();
      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prevPage) => prevPage + 1);
          fetchUsers(page + 1);
        }
      });
      if (node) observerRef.current.observe(node);
    },
    [loading, hasMore, fetchUsers, page]
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Search Results</h1>
      <h2 className="text-2xl font-semibold my-4 text-blue-600">User List</h2>

      {filteredData.length === 0 && !loading ? (
        <p className="text-lg text-gray-600">No users found</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-md">
            <thead className="sticky top-0 bg-gray-100">
              <tr className="text-gray-700">
                <th className="border-b p-3 text-left">Stream</th>
                <th className="border-b p-3 text-left">Username</th>
                <th className="border-b p-3 text-left">Primary Skillset</th>
                <th className="border-b p-3 text-left">Institution Name</th>
                <th className="border-b p-3 text-left">Country</th>
                <th className="border-b p-3 text-left">Profession</th>
                <th className="border-b p-3 text-center">View Profile</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item, index) => (
                <tr 
                  key={item.id}
                  ref={index === filteredData.length - 1 ? lastUserRef : null}
                  className="hover:bg-gray-50 transition duration-200"
                >
                  <td className="border-b p-3">{item.dept}</td>
                  <td className="border-b p-3">{item.name}</td>
                  <td className="border-b p-3">{item.primarySkill}</td>
                  <td className="border-b p-3">{item.college}</td>
                  <td className="border-b p-3">{item.country}</td>
                  <td className="border-b p-3">{item.profession}</td>
                  <td className="border-b p-3 text-center">
                    <Link href={`/profile/${item.id}`}>
                      <div className="inline-block w-8 h-8 bg-blue-500 rounded-full items-center justify-center hover:bg-blue-600 transition duration-300">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="white"
                          className="w-5 h-5"
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
        </div>
      )}

      {loading && (
        <div className="flex justify-center items-center my-8">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
          <p className="ml-4 text-lg font-semibold text-gray-700">Loading users...</p>
        </div>
      )}
    </div>
  );
}

export default Page;