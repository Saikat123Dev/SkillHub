'use client';

import { motion } from 'framer-motion';
import { ChevronRight, Loader2, Search } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';

function SearchResultsPage() {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();
  const observerRef = useRef(null);
  const loadingRef = useRef(null);

  const fetchUsers = async (pageNumber) => {
    try {
      const queryParams = new URLSearchParams();
      queryParams.append('page', pageNumber.toString());
      if (searchParams.has('query')) {
        queryParams.append('name', searchParams.get('query'));
      } else {

        for (const [key, value] of searchParams.entries()) {
          if (value.trim()) queryParams.append(key, value);
        }
      }

      const response = await fetch(`/api/search?${queryParams.toString()}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error fetching users:', error);
      return null;
    }
  };

  const loadInitialData = async () => {
    setIsLoading(true);
    const result = await fetchUsers(1);
    if (result) {
      setData(result.users);
      setHasMore(result.hasMore);
    }
    setIsLoading(false);
  };

  const loadMoreData = useCallback(async () => {
    if (isLoadingMore || !hasMore) return;

    setIsLoadingMore(true);
    const nextPage = page + 1;
    const result = await fetchUsers(nextPage);

    if (result) {
      setData(prevData => [...prevData, ...result.users]);
      setHasMore(result.hasMore);
      setPage(nextPage);
    }
    setIsLoadingMore(false);
  }, [page, hasMore, isLoadingMore]);

  // Initialize intersection observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasMore && !isLoadingMore) {
          loadMoreData();
        }
      },
      { threshold: 0.5 }
    );

    if (loadingRef.current) {
      observer.observe(loadingRef.current);
    }

    return () => observer.disconnect();
  }, [hasMore, isLoadingMore, loadMoreData]);

  // Load initial data when search params change
  useEffect(() => {
    setPage(1);
    loadInitialData();
  }, [searchParams]);

  // Loader Component
  const Loader = () => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/70 ">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{
          repeat: Infinity,
          duration: 0.8,
          ease: "linear"
        }}
      >
        <Loader2 className="w-16 h-16 text-gray-800 animate-spin" />
      </motion.div>
    </div>
  );

  // Empty State Component
  const EmptyState = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="flex flex-col items-center justify-center p-12 bg-gray-50 rounded-lg"
    >
      <Search className="w-16 h-16 text-gray-400 mb-4" />
      <h2 className="text-2xl font-semibold text-gray-700 mb-2">No Matching Profiles Found</h2>
      <p className="text-gray-500 text-center">Refine Your Search Criteria for Better Results</p>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-12">
    {isLoading && <Loader />}

    <div className="max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="bg-white shadow-xl rounded-2xl overflow-hidden"
      >
        <div className="p-6 bg-gradient-to-r from-blue-600 to-indigo-700">
          <h1 className="text-3xl font-bold text-white">Professional Network Search</h1>
        </div>

        {!isLoading && data.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="w-full overflow-x-auto">
            <table className="w-full table-fixed">
              <thead className="bg-gray-100 border-b border-gray-200">
                <tr>
                  {[
                    { key: 'dept', label: 'Academic Stream' },
                    { key: 'name', label: 'Professional Name' },
                    { key: 'primarySkill', label: 'Core Expertise' },
                    { key: 'college', label: 'Educational Institution' },
                    { key: 'country', label: 'Geographic Location' },
                    { key: 'profession', label: 'Professional Domain' },
                    { key: 'profile', label: 'Profile Details' }
                  ].map((header) => (
                    <th
                      key={header.key}
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/7"
                    >
                      {header.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.map((item, index) => (
                  <motion.tr
                    key={item.id || index}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{
                      duration: 0.15,
                      delay: index * 0.03 // Reduced delay between rows
                    }}
                    className="hover:bg-gray-50 transition-colors duration-150 border-b"
                  >
                    <td className="px-4 py-3 text-sm text-gray-700 truncate">{item.dept}</td>
                    <td className="px-4 py-3 text-sm text-gray-700 truncate">{item.name}</td>
                    <td className="px-4 py-3 text-sm text-gray-700 truncate">{item.primarySkill}</td>
                    <td className="px-4 py-3 text-sm text-gray-700 truncate">{item.college}</td>
                    <td className="px-4 py-3 text-sm text-gray-700 truncate">{item.country}</td>
                    <td className="px-4 py-3 text-sm text-gray-700 truncate">{item.profession}</td>
                    <td className="px-4 py-3">
                      <Link href={`/profile/${item.id}`}>
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          transition={{ duration: 0.1 }}
                          className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors duration-150"
                        >
                          <ChevronRight className="w-5 h-5" />
                        </motion.div>
                      </Link>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>

            {/* Loading more indicator */}
            {hasMore && (
              <div
                ref={loadingRef}
                className="flex justify-center p-4"
              >
                {isLoadingMore && (
                  <Loader2 className="w-6 h-6 text-gray-400 animate-spin" />
                )}
              </div>
            )}
          </div>
        )}
      </motion.div>
    </div>
  </div>
  );
}

export default SearchResultsPage;
