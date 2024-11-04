<<<<<<< HEAD:APP/app/(protected)/group/[id]/page.jsx
// WhatsAppGroupPage.tsx (Server Component)
=======

import { X, Plus } from 'lucide-react';
import { IndividualGroup } from '@/actions/group';
import { getUserById } from '@/data/user';
import Link from 'next/link';
>>>>>>> b318bc201fe20ecff922a0e4ab95e7ffcb90e23c:APP/app/(protected)/group/[id]/[requestId]/page.jsx
import { currentUser } from '@/lib/auth';
import { findMembers, IndividualGroup } from '@/actions/group';
import { getUserById } from '@/data/user';
import WhatsAppGroupClient from '../../../../components/GroupPage';

<<<<<<< HEAD:APP/app/(protected)/group/[id]/page.jsx
const WhatsAppGroupPage = async ({ params }) => {
  const { id } = params;
  
  // Fetch data on the server side
=======
const WhatsAppGroup = async ({ params }) => {
  const {id,requestId} = params;
>>>>>>> b318bc201fe20ecff922a0e4ab95e7ffcb90e23c:APP/app/(protected)/group/[id]/[requestId]/page.jsx
  const user = await currentUser();
  if (!user) {
    return <div>Unauthorized</div>;
  }

  const grp = await IndividualGroup(id);
  console.log('grp',grp);
  if (!grp) {
    return <div>Error: Cannot find group</div>;
  }

<<<<<<< HEAD:APP/app/(protected)/group/[id]/page.jsx
  const members=await findMembers(id);
  console.log(members[0].members);
=======
  const currid =user.id;
>>>>>>> b318bc201fe20ecff922a0e4ab95e7ffcb90e23c:APP/app/(protected)/group/[id]/[requestId]/page.jsx

  const admin = await getUserById(grp.adminId);
  console.log('admin',admin);
  if (!admin) {
    return <div>Error: Cannot find Admin</div>;
  }

  // Pass the fetched data to the client component
  return (
<<<<<<< HEAD:APP/app/(protected)/group/[id]/page.jsx
    <WhatsAppGroupClient 
      group={grp}
      admin={admin}
      currentUser={user}
      members={members[0].members}
    />
=======
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
>>>>>>> b318bc201fe20ecff922a0e4ab95e7ffcb90e23c:APP/app/(protected)/group/[id]/[requestId]/page.jsx
  );
};

export default WhatsAppGroupPage;