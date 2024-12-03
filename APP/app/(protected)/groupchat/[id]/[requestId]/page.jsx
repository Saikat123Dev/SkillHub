import React from "react";
import { IndividualGroup } from "@/actions/group";

const GroupWelcome = ({ groupName }) => (
    <div className="text-center mb-8">
      <h1 className="text-4xl font-extrabold mb-4 text-navy-800">
        Welcome to <span className="text-blue-700">{groupName}</span>
      </h1>
      <p className="text-lg text-navy-600">
        We are excited to have you here. Join us on a journey of collaboration, innovation, and growth.
      </p>
    </div>
);

const GroupInfo = ({ groupName }) => (
    <div className="bg-navy-50 p-6 rounded-xl  space-y-4">
      <p className="text-md font-semibold text-navy-800">
        Explore the resources and projects available to the group. Feel free to contribute and collaborate with your fellow members.
      </p>
      <p className="text-sm text-navy-600">
        Whether you're here to learn, share, or create, {groupName} is a space for like-minded individuals to come together and build something amazing.
      </p>
    </div>
);

const ActionButton = ({ label }) => (
    <div className="mt-8 flex justify-center">
      <button className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-bold transition duration-300 ease-in-out shadow-lg hover:shadow-xl">
        {label}
      </button>
    </div>
);

const Page = async ({ params }) => {
  const id = params?.id;

  // Fetch the group details
  const grp = await IndividualGroup(id);

  return (
      <div className="bg-gradient-to-br from-navy-100 via-navy-200 to-navy-300 flex items-center justify-center py-12 px-4 overflow-hidden">
        <div className="max-w-4xl w-full bg-white border border-navy-200 rounded-3xl shadow-2xl p-10">
          {/* Group Welcome Section */}
          <GroupWelcome groupName={grp.grpname} />

          {/* Group Info Section */}
          <GroupInfo groupName={grp.grpname} />
        </div>
      </div>
  );
};

export default Page;
