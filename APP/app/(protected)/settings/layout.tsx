import UserPage from "../client/page";

import Link from "next/link";

interface ProtectedLayoutProps {
  children: React.ReactNode;
};

const ProtectedLayout = ({ children }: ProtectedLayoutProps) => {
    return (
      
        <div className="flex flex-row   w-full overflow-auto">
          <nav className="flex flex-col space-y-4 w-72 min-h-full bg-slate-500 p-1 rounded-lg shadow-lg overflow-y-auto">
            <div className="relative w-full mb-6 mt-5">
              <UserPage />
            </div>
            <Link
              href='/settings'
              className="p-2 w-full text-left text-white bg-gray-900 hover:bg-blue-900 transition-all duration-200 ease-in-out rounded-lg shadow-md"
            >
              Edit Profile
            </Link>
            <button
              className="p-2 w-full text-left text-white bg-gray-900 hover:bg-blue-900 transition-all duration-200 ease-in-out rounded-lg shadow-md"
            >
              Password Management
            </button>
            <Link
              href='/settings/projects'
              className="p-2 w-full text-left text-white bg-gray-900 hover:bg-blue-900 transition-all duration-200 ease-in-out rounded-lg shadow-md"
            >
              Add Projects
            </Link>
            <Link
              href='/settings/experience'
              className="p-2 w-full text-left text-white bg-gray-900 hover:bg-blue-900 transition-all duration-200 ease-in-out rounded-lg shadow-md"
            >
              Add Experiences
            </Link>
          </nav>
  
          <div className="flex-grow bg-white rounded-lg shadow-lg">
            {children}
          </div>
        </div>
      
    );
  }
  
  export default ProtectedLayout;