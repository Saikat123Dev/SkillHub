"use client";

import React, { useEffect, useState } from 'react';
import { useCurrentUser } from '@/hooks/use-current-user';

type FriendRequest = {
  id: string;
  senderId: string;
  receiverId: string;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  createdAt: string;
  updatedAt: string;
  receiver: {
    name: string;
    email: string;
  };
  avatar: string; // If you have avatar in your friend request structure
};

const FriendRequestsPage = () => {
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const session = useCurrentUser();
  const receiverId =session.id; // Get the logged-in user's session

  const fetchFriendRequests = async () => {
    try {
      console.log('Receiver ID:', receiverId); // Log receiverId
  
      const response = await fetch(`http://localhost:3000/api/connect/getAll?receiverId=${receiverId}`);
      console.log('Response:', response); // Log full response
  
      if (!response.ok) {
        const errorData = await response.json(); // Try to get error message from the response
        throw new Error(errorData.message || 'Failed to fetch friend requests');
      }
  
      const data = await response.json();
      console.log('Data:', data); // Log the fetched data
  
      // Check if 'requests' property exists and is an array
      if (Array.isArray(data)) {
        setFriendRequests(data);
      } else if (data.message) {
        // If there's a message indicating no requests found
        console.warn(data.message); // Log the message for debugging
        setFriendRequests([]); // Optionally clear previous requests or handle it accordingly
        setError(data.message); // Set error state if you want to show a message
      } else {
        throw new Error('Invalid data format');
      }
    } catch (error) {
      console.error('Error fetching friend requests:', error); // Log error details
      setError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchFriendRequests();
  }, []);
  

  // Function to handle accepting a friend request
  const acceptFriendRequest = async (id: string) => {
    try {
      const response = await fetch('http://localhost:3000/api/connect/accept', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ requestId: id }), // Send the request ID
      });
      console.log('Response:', response);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to accept friend request');
      }
      // If accepted successfully, remove from state
      setFriendRequests((prevRequests) => prevRequests.filter((req) => req.id !== id));
    } catch (error) {
      console.log("Error while accepting friend request:", error.message);
    }
  }

  // Function to handle rejecting a friend request
  const rejectFriendRequest = async (id: string) => {
    try {
      const response = await fetch('http://localhost:3000/api/connect/reject', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ requestId: id }), // Send the request ID
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to reject friend request');
      }
      // If rejected successfully, remove from state
      setFriendRequests((prevRequests) => prevRequests.filter((req) => req.id !== id));
    } catch (error) {
      console.log("Error while rejecting friend request:", error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 to-indigo-500 flex flex-col items-center p-10">
      <h1 className="text-4xl text-white font-bold mb-8">Friend Requests</h1>
      {loading ? (
        <p className="text-white">Loading...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : friendRequests.length === 0 ? (
        <p className="text-white">No friend requests available.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-5xl">
          {friendRequests
            .filter((request) => request.status === 'PENDING') // Only show pending requests
            .map((request) => (
              <div
                key={request.id}
                className={`p-6 bg-white rounded-lg shadow-lg transition-transform duration-200 ${
                  request.status === 'ACCEPTED' ? 'border-green-500' : request.status === 'REJECTED' ? 'border-red-500' : 'border-gray-300'
                } hover:scale-105`}
              >
                <div className="flex items-center space-x-4">
                  <img
                    className="w-16 h-16 rounded-full shadow-md"
                    src={request.avatar}
                    alt={request.sender.name}
                  />
                  <div>
                    <h2 className="text-xl font-semibold text-gray-800">{request.sender.name}</h2>
                    <p className="text-sm text-gray-600">
                      Status: <span className={`font-bold ${request.status === 'PENDING' ? 'text-yellow-500' : request.status === 'ACCEPTED' ? 'text-green-500' : 'text-red-500'}`}>{request.status}</span>
                    </p>
                  </div>
                </div>
                {request.status === 'PENDING' && (
                  <div className="mt-4 flex space-x-3">
                    <button
                      onClick={() => acceptFriendRequest(request.id)} // Call the accept function here
                      className="px-4 py-2 bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600 transition-colors"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => rejectFriendRequest(request.id)} // Call the reject function here
                      className="px-4 py-2 bg-red-500 text-white rounded-lg shadow-md hover:bg-red-600 transition-colors"
                    >
                      Reject
                    </button>
                  </div>
                )}
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default FriendRequestsPage;
