
import React from 'react';
import { User, Users, Info, Check, X } from 'lucide-react';
// import { useRouter } from 'next/navigation'; 
import { IndividualGroup } from '@/actions/group';

import { getUserById } from "@/data/user";
import {Plus} from 'lucide-react'
import Link from 'next/link'
import { useCurrentUser } from "../../../../hooks/use-current-user"

const WhatsAppGroup = async({params}) => {
  console.log('params',params);
  const id=params?.id;
 

  

 
  // const router = useRouter();


  const grp=await IndividualGroup(id);
  console.log('grp',grp);
  const admin = await getUserById(grp.adminId);
  if (!admin) {
    return { error: "Cannot find Admin" };
  }
  console.log('admin',admin);
  // const user=await currentUser();

  const session=useCurrentUser();
  const currid=session?.id;
  


  const groupCreator = {
    name: "John Doe",
    username: "@johndoe",
    avatar: "/api/placeholder/40/40"
  };

  const groupMembers = [
    { name: "Alice Smith", username: "@alicesmith", avatar: "/api/placeholder/32/32" },
    { name: "Bob Johnson", username: "@bobjohnson", avatar: "/api/placeholder/32/32" },
    { name: "Carol White", username: "@carolwhite", avatar: "/api/placeholder/32/32" },
  ];



  return (
    <div className="min-w-full mx-auto bg-gray-200 rounded-lg shadow-lg overflow-hidden">
      <div className="bg-green-600 text-white p-4">
        <h1 className="text-3xl font-extrabold">{grp.grpname}</h1>
        <p className="text-sm">Created by {admin.name}</p>
      </div>

      <div className="p-4">
        <div className="flex items-center mb-4">
          <img src={groupCreator.avatar} alt={admin.name} className="w-10 h-10 rounded-full mr-3" />
          <div>
            <p className="font-semibold">{admin.name}</p>
            <p className="text-sm text-gray-600">{admin.username}</p>
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
                <img src={member.avatar} alt={member.name} className="w-8 h-8 rounded-full mr-2" />
                <div>
                  <p className="text-lg font-semibold">{member.name}</p>
                  <p className="text-base text-gray-600">{member.username}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

       {currid!==grp.adminId && <div className="flex justify-between">
          <button 
          //  onClick={groupenable} 
           
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded flex items-center"
          >
            <Check size={18} className="mr-2" />
            Accept
          </button>
          <button 
            className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded flex items-center"
          >
            <X size={18} className="mr-2" />
            Decline
          </button>
        </div>}
        {currid===grp.adminId && <div>
          <button 
          //  onClick={groupenable} 
           
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded flex items-center"
          >
           <Link
              href="/search"
              className="text-white rounded-full font-bold flex items-center"
            >
              <Plus className="mr-2" size={18} />{" "}
             Members
            </Link>
          </button>
          </div>}
      </div>
    </div>
  );
};

export default WhatsAppGroup;
