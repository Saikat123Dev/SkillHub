import React from "react";
import { IndividualGroup } from '@/actions/group';

const Page = async ({ params }) => {
  const id = params?.id;

  // Fetch the group details
  const grp = await IndividualGroup(id);

  return (
    <div className=" bg-gradient-to-br from-purple-700 via-indigo-800 to-gray-900 text-white flex items-center justify-center py-12 px-4 overflow-hidden">
      <div className="max-w-4xl w-full bg-gray-800 rounded-3xl shadow-2xl p-10">
        
        {/* Group Welcome Section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold mb-4">
            Welcome to <span className="text-yellow-400">{grp.grpname}</span>!
          </h1>
          <p className="text-lg text-gray-300">
            We are excited to have you here. Join us on a journey of collaboration, innovation, and growth.
          </p>
        </div>

        {/* Group Info Section */}
        <div className="bg-gray-700 p-6 rounded-xl shadow-lg space-y-4">
          <p className="text-md font-semibold">
            Explore the resources and projects available to the group. Feel free to contribute and collaborate with your fellow members.
          </p>
          <p className="text-sm text-gray-300">
            Whether you’re here to learn, share, or create, {grp.grpname} is a space for like-minded individuals to come together and build something amazing.
          </p>
        </div>

        {/* Action Section */}
        <div className="mt-8 flex justify-center">
          <div className="bg-yellow-500 hover:bg-yellow-600 text-white py-3 px-6 rounded-lg font-bold transition duration-300 ease-in-out shadow-lg hover:shadow-xl">
            Start Exploring
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
