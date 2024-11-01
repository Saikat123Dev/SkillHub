import { X, Plus } from 'lucide-react';
import { IndividualGroup } from '@/actions/group';
import { getUserById } from '@/data/user';
import Link from 'next/link';
import { currentUser } from '@/lib/auth';
import AcceptButton from '@/components/acceptButton';

const WhatsAppGroup = async ({ params }) => {
  const { id, requestId } = params;

  // Fetch the current user
  const user = await currentUser();
  if (!user) {
    return <div>Unauthorized</div>;
  }

  // Fetch the group data
  const grp = await IndividualGroup(id);
  if (!grp) {
    return <div>Error: Cannot find group</div>;
  }

  const currid = user.id;

  // Fetch the admin data
  const admin = await getUserById(grp.adminId);
  if (!admin) {
    return <div>Error: Cannot find Admin</div>;
  }

  // Dummy data for group members (replace with actual data from your database)
  const groupMembers = [
    { name: 'Alice Smith', username: '@alicesmith', avatar: '/api/placeholder/32/32' },
    { name: 'Bob Johnson', username: '@bobjohnson', avatar: '/api/placeholder/32/32' },
    { name: 'Carol White', username: '@carolwhite', avatar: '/api/placeholder/32/32' },
  ];

  return (
    <div className="min-w-full mx-auto bg-gray-200 rounded-lg shadow-lg overflow-hidden">
      <div className="bg-green-600 text-white p-4">
        <h1 className="text-3xl font-extrabold">{grp.grpname}</h1>
        <p className="text-sm">Created by {admin.name}</p>
      </div>

      <div className="p-4">
        <div className="flex items-center mb-4">
          <img
            src="/api/placeholder/40/40"
            alt={admin.name}
            className="w-10 h-10 rounded-full mr-3"
          />
          <div>
            <p className="font-semibold">{admin.name}</p>
            <p className="text-sm text-gray-600">@{admin.username}</p>
          </div>
        </div>

        <div className="mb-4">
          <h2 className="text-xl font-bold mb-2">Group Bio</h2>
          <p className="text-lg text-gray-700">{grp.grpbio}</p>
        </div>

        <div className="mb-4">
          <h2 className="text-xl font-semibold mb-2">Members</h2>
          <div className="flex flex-wrap">
            {groupMembers.map((member, index) => (
              <div key={index} className="flex items-center mr-4 mb-2">
                <img
                  src={member.avatar}
                  alt={member.name}
                  className="w-8 h-8 rounded-full mr-2"
                />
                <div>
                  <p className="text-lg font-semibold">{member.name}</p>
                  <p className="text-base text-gray-600">{member.username}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {currid !== grp.adminId ? (
          <div className="flex justify-between">
            <AcceptButton groupId={grp.id} requestId={requestId} userId={currid} />
            <button className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded flex items-center">
              <X size={18} className="mr-2" />
              Decline
            </button>
          </div>
        ) : (
          <div className="w-32">
            <Link
              href="/search"
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded flex items-center"
            >
              <Plus className="mr-2" size={20} />
              Members
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default WhatsAppGroup;
