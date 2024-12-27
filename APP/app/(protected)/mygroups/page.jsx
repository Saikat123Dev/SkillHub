'use client'
import {
  BadgeInfo,
  BookUser,
  FolderKanban,
  LayoutGrid,
  RefreshCcw,
  StickyNote,
  UserCheck
} from 'lucide-react'
import { useSession } from "next-auth/react"
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { findMyAllGroups } from '../../../actions/group'

const GroupDashboard = () => {
  const [groups, setGroups] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const session = useSession();
  const userId = session?.data.user.id

  const getRoleColor = (role) => {
    switch (role.toLowerCase()) {
      case 'admin':
        return 'bg-navy-100 text-navy-800'
      default:
        return 'bg-blue-100 text-blue-800'
    }
  }

  const fetchGroups = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const myGroups = await findMyAllGroups()
      console.log('mygroups', myGroups)
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
      <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm ${getRoleColor(role)}`}>
        {role === 'ADMIN' ? (
            <span className="font-medium flex items-center gap-2">
          <BadgeInfo size={16} className="text-navy-600" />
              {role}
        </span>
        ) : (
            <span className="font-medium flex items-center gap-2">
          <UserCheck size={16} className="text-blue-600" />
              {role}
        </span>
        )}
      </div>
  )

  const GroupCard = ({ group }) => (
      <div className="bg-white border border-navy-200 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
        <div className="flex items-start justify-between">
          <div className="flex-grow">
            <h3 className="text-2xl font-semibold text-navy-800">{group.group.grpname}</h3>
            <p className="text-sm text-navy-600 mt-2">{group.group.grpbio}</p>
          </div>
          <RoleIndicator role={group.role} />
        </div>
        <div className="mt-4 flex items-center justify-between text-sm">
        <span className="text-navy-700 flex items-center gap-2">
          <FolderKanban className="h-5 w-5 text-navy-600" />
          {group.group.members.length} members
        </span>
          <Link
              className="flex items-center text-blue-600 hover:text-blue-700 font-medium"
              href={`/groupchat/${group.group.id}/${userId}`}
          >
            View Details
            <LayoutGrid className="h-4 w-4 ml-2" />
          </Link>
        </div>
      </div>
  )

  if (error) {
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="bg-white border border-navy-200 rounded-lg shadow-lg p-8 max-w-md text-center">
            <StickyNote className="h-12 w-12 mx-auto text-red-500 mb-4" />
            <div className="text-red-600">
              <p className="text-xl font-semibold mb-2">Error Loading Groups</p>
              <p className="text-sm text-navy-600 mb-4">{error}</p>
              <button
                  onClick={fetchGroups}
                  className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
    )
  }

  return (
      <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white border border-navy-200 rounded-lg shadow-md p-6 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <BookUser className="h-8 w-8 text-blue-600" />
                <h1 className="text-2xl font-bold text-navy-800">My Groups</h1>
              </div>
              <button
                  onClick={fetchGroups}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                  disabled={isLoading}
              >
                {isLoading ? (
                    <RefreshCcw className="h-5 w-5 animate-spin" />
                ) : (
                    <RefreshCcw className="h-4 w-4" />
                )}
                <span>Refresh Groups</span>
              </button>
            </div>
          </div>
          {isLoading ? (
              <div className="flex items-center justify-center h-64">
                <div className="flex flex-col items-center gap-2">
                  <RefreshCcw className="h-8 w-8 animate-spin text-blue-600" />
                  <p className="text-navy-600">Loading your groups...</p>
                </div>
              </div>
          ) : groups.length === 0 ? (
              <div className="bg-white border border-navy-200 rounded-lg shadow-md p-8 text-center">
                <BookUser className="h-12 w-12 mx-auto text-navy-400" />
                <h3 className="mt-4 text-lg font-medium text-navy-800">No Groups Found</h3>
                <p className="mt-2 text-navy-600">You are not a member of any groups yet.</p>
              </div>
          ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
