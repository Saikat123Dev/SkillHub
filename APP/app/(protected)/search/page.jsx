'use client';
import { ChevronRight, Loader2, Search, Filter, ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import {  useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';

const TABLE_HEADERS = [
  { key: 'dept', label: 'Academic Stream' },
  { key: 'name', label: 'Name' },
  { key: 'primarySkill', label: 'Roles' },
  { key: 'college', label: 'Educational Institution' },
  { key: 'country', label: 'Geographic Location' },
  { key: 'profession', label: 'Professional Skills' },
  { key: 'profile', label: 'Profile Details' }
];

const LoaderComponent = () => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm">
    <div
      animate={{ rotate: 360 }}
      transition={{
        repeat: Infinity,
        duration: 0.8,
        ease: "linear"
      }}
      className="p-4 bg-white rounded-full shadow-lg"
    >
      <Loader2 className="w-12 h-12 text-blue-600" />
    </div>
  </div>
);

const EmptyState = () => (
  <div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
    className="flex flex-col items-center justify-center p-4 md:p-16 bg-gray-50/50 rounded-lg m-2 md:m-6"
  >
    <div className="p-6 bg-white rounded-full shadow-md mb-6">
      <Search className="w-8 h-8 md:w-12 md:h-12 text-gray-400" />
    </div>
    <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-3">No Matching Profiles Found</h2>
    <p className="text-gray-600 text-center max-w-md">
      Try adjusting your search criteria or filters to find more relevant results.
    </p>
  </div>
);

const Skill = ({ children }) => (
  <span className="inline-block bg-blue-50 text-blue-700 text-xs font-medium mr-1 mb-1 px-2 py-1 rounded-full border border-blue-100 hover:bg-blue-100 transition-colors duration-200">
    {children}
  </span>
);

const ScrollIndicator = ({ direction, onClick }) => (
  <button
    onClick={onClick}
    className={`absolute z-10 p-2 bg-white/10 rounded-full shadow-lg hover:bg-white transition-all duration-200 ${
      direction === 'left' ? 'left-6' : 'right-6'
    }`}
  >
    {direction === 'left' ? (
      <ChevronLeft className="w-5 h-5 text-gray-600" />
    ) : (
      <ChevronRight className="w-5 h-5 text-gray-600" />
    )}
  </button>
);

function SearchResultsPage() {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [showLeftScroll, setShowLeftScroll] = useState(false);
  const [showRightScroll, setShowRightScroll] = useState(true);
  const tableWrapperRef = useRef(null);
  const searchParams = useSearchParams();
  const observerRef = useRef(null);
  const loadingRef = useRef(null);

  const handleScroll = (direction) => {
    if (tableWrapperRef.current) {
      const scrollAmount = 300;
      const currentScroll = tableWrapperRef.current.scrollLeft;
      const newScroll = direction === 'left' 
        ? currentScroll - scrollAmount 
        : currentScroll + scrollAmount;
      
      tableWrapperRef.current.scrollTo({
        left: newScroll,
        behavior: 'smooth'
      });
    }
  };

  const updateScrollButtons = useCallback(() => {
    if (tableWrapperRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = tableWrapperRef.current;
      setShowLeftScroll(scrollLeft > 0);
      setShowRightScroll(scrollLeft < scrollWidth - clientWidth - 10);
    }
  }, []);

  useEffect(() => {
    const tableWrapper = tableWrapperRef.current;
    if (tableWrapper) {
      tableWrapper.addEventListener('scroll', updateScrollButtons);
      // Initial check
      updateScrollButtons();
      // Check after content loads
      setTimeout(updateScrollButtons, 100);
    }
    return () => {
      if (tableWrapper) {
        tableWrapper.removeEventListener('scroll', updateScrollButtons);
      }
    };
  }, [updateScrollButtons]);

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
      if (!response.ok) throw new Error('Network response was not ok');
      return await response.json();
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

  useEffect(() => {
    setPage(1);
    loadInitialData();
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-2 md:p-6 lg:p-8">
      
        {isLoading && <LoaderComponent />}
     

      <div className="max-w-full mx-auto">
        <div
          className="bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-100"
        >
          <div className="p-4 md:p-6 lg:p-8 bg-gradient-to-r from-blue-600 to-indigo-700">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
              <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-white">Professional Network Search</h1>
              <div className="flex items-center space-x-4">
                <span className="text-blue-100 text-sm">
                  {data.length} results found
                </span>
                <button className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors duration-200">
                  <Filter className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>
          </div>

          {!isLoading && data.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="relative">
              
              {showLeftScroll && <ScrollIndicator direction="left" onClick={() => handleScroll('left')} />}
              {showRightScroll && <ScrollIndicator direction="right" onClick={() => handleScroll('right')} />}

           
              <div className="h-1 bg-gray-100 mx-4 mt-2 rounded-full relative">
                <div className="absolute inset-y-0 bg-blue-600 rounded-full transition-all duration-200"
                     style={{
                       left: tableWrapperRef.current ? `${(tableWrapperRef.current.scrollLeft / (tableWrapperRef.current.scrollWidth - tableWrapperRef.current.clientWidth)) * 100}%` : '0%',
                       width: tableWrapperRef.current ? `${(tableWrapperRef.current.clientWidth / tableWrapperRef.current.scrollWidth) * 100}%` : '100%'
                     }}
                />
              </div>

              <div 
                ref={tableWrapperRef}
                className="w-full overflow-x-auto scrollbar-thin scrollbar-thumb-blue-600 scrollbar-track-gray-100"
              >
                <table className="w-full min-w-max">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      {TABLE_HEADERS.map((header) => (
                        <th
                          key={header.key}
                          className="px-3 md:px-6 py-3 md:py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap"
                        >
                          {header.label}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {data.map((item, index) => (
                      <tr
                        key={item.id || index}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{
                          duration: 0.2,
                          delay: index * 0.03
                        }}
                        className="hover:bg-gray-50/50 transition-colors duration-150"
                      >
                        <td className="px-3 md:px-6 py-3 md:py-4 text-xs md:text-sm text-gray-700 whitespace-nowrap">{item.dept}</td>
                        <td className="px-3 md:px-6 py-3 md:py-4 text-xs md:text-sm font-medium text-gray-900 whitespace-nowrap">{item.name}</td>
                        <td className="px-3 md:px-6 py-3 md:py-4">
                          <div className="flex flex-wrap gap-1 max-w-xs">
                            {item.Roles.map((skill, idx) => (
                              <Skill key={idx}>{skill.trim()}</Skill>
                            ))}
                          </div>
                        </td>
                        <td className="px-3 md:px-6 py-3 md:py-4 text-xs md:text-sm text-gray-700 whitespace-nowrap">{item.college}</td>
                        <td className="px-3 md:px-6 py-3 md:py-4 text-xs md:text-sm text-gray-700 whitespace-nowrap">{item.country}</td>
                        <td className="px-3 md:px-6 py-3 md:py-4">
                          <div className="flex flex-wrap gap-1 max-w-xs">
                            {item.Skills.map((skill, idx) => (
                              <Skill key={idx}>{skill.trim()}</Skill>
                            ))}
                          </div>
                        </td>
                        <td className="px-3 md:px-6 py-3 md:py-4">
                          <Link href={`/profile/${item.id}`}>
                            <button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className="w-8 h-8 md:w-10 md:h-10 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors duration-200 shadow-md hover:shadow-lg"
                            >
                              <ChevronRight className="w-4 h-4 md:w-5 md:h-5" />
                            </button>
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {hasMore && (
                  <div
                    ref={loadingRef}
                    className="flex justify-center p-6"
                  >
                    {isLoadingMore && (
                      <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SearchResultsPage;