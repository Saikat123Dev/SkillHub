'use client'
import React, { useState, useEffect } from 'react'
import { Users, ChevronRight, Loader2, UserCircle, Crown, User } from 'lucide-react'
import { findMyAllGroups } from '@/actions/group'
import Link from 'next/link'

const GroupDashboard = () => {
  const [groups, setGroups] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  // Utility Functions
  const getRoleColor = (role) => {
    switch (role.toLowerCase()) {
      case 'admin':
        return 'bg-yellow-200 text-black'
      default:
        return 'bg-green-100 text-green-800'
    }
  }

  
  const fetchGroups = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const myGroups = await findMyAllGroups()
      console.log('mygroups',myGroups);
      setGroups(myGroups)
    } catch (error) {
      setError(error.message || 'Failed to fetch groups')
      console.error('Error in finding groups:', error.message || error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchGroups()
  }, [])






  const RoleIndicator = ({ role }) => (
    <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-sm ${getRoleColor(role)}`}>
      {role === 'ADMIN' ? (
        <span className="font-medium flex justify-between">
          <Crown size={16} />
          {role}
        </span>
      ) : (
        <span className="font-medium">
          <User size={16} />
          {role}
        </span>
      )}
    </div>
  )


  const GroupCard = ({ group }) => (
    <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-3xl font-bold text-gray-900">{group.group.grpname}</h3>
          <p className="text-base text-gray-500 mt-1">{group.group.grpbio}</p>
        </div>
        <RoleIndicator role={group.role} />
      </div>
      <div className="mt-4 flex items-center justify-between text-base">
        <span className="text-gray-500 flex text-base items-center gap-1">
          <Users className="h-5 w-5" />
          {group.group.members.length} members
        </span>
        <Link className="flex items-center text-indigo-600 hover:text-indigo-700 font-semibold" href={`/groupchat/${group.group.id}`}>
          View Details
          <ChevronRight className="h-5 w-5 ml-1" />
        </Link>
      </div>
    </div>
  )

  // Error State
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
          <div className="text-red-500 text-center">
            <p className="text-lg font-semibold">Error Loading Groups</p>
            <p className="text-sm mt-2">{error}</p>
            <button
              onClick={fetchGroups}
              className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Main Render
  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Users className="h-8 w-8 text-indigo-600" />
              <h1 className="text-2xl font-bold text-gray-900">My Groups</h1>
            </div>
            <button
              onClick={fetchGroups}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Users className="h-4 w-4" />
              )}
              <span>Refresh Groups</span>
            </button>
          </div>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
              <p className="text-gray-500">Loading your groups...</p>
            </div>
          </div>
        ) : groups.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <UserCircle className="h-12 w-12 mx-auto text-gray-400" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">No Groups Found</h3>
            <p className="mt-2 text-gray-500">You are not a member of any groups yet.</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {groups.map((group) => (
              <GroupCard key={group.id} group={group} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default GroupDashboard