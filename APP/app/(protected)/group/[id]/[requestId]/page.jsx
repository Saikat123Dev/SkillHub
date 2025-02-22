import { findMembers, IndividualGroup } from '@/actions/group';
import GitHubRepos from "@/components/Github";
import WhatsAppGroupClient from '@/components/GroupPage';
import { getUserById } from '@/data/user';
import { currentUser } from '@/lib/auth';
import { AlertTriangle, Code, Github, Target, UserCog, Users } from 'lucide-react';

const WhatsAppGroup = async ({ params }) => {
  const { id, requestId } = params;

  // Error Display Component
  const ErrorDisplay = ({ message }) => (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 p-6">
      <div className="bg-white shadow-2xl rounded-xl p-8 max-w-lg w-full text-center transform transition-all hover:scale-105">
        <AlertTriangle className="mx-auto mb-6 text-red-500 animate-pulse" size={60} />
        <h2 className="text-2xl font-bold text-gray-800 mb-3">{message}</h2>
        <p className="text-gray-600">Please verify group details or reach out to support.</p>
      </div>
    </div>
  );

  // Authentication Check
  const user = await currentUser();
  console.log("user",user);
  if (!user) return <ErrorDisplay message="Unauthorized Access" />;

  // Fetch Group Data
  const grp = await IndividualGroup(id);
  if (!grp) return <ErrorDisplay message="Group Not Found" />;

  // Fetch Members
  const members = await findMembers(id);

  // Fetch Admin
  const admin = await getUserById(grp.adminId);
  if (!admin) return <ErrorDisplay message="Group Admin Not Available" />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white shadow-2xl rounded-2xl p-8 mb-8 flex items-center justify-between transform transition-all hover:shadow-3xl">
          <div className="flex items-center gap-6">
            <UserCog className="text-blue-600" size={48} />
            <div>
              <h1 className="text-3xl font-extrabold text-gray-900">{grp.grpname || 'Unnamed Group'}</h1>
              <p className="text-gray-600 mt-1 flex items-center gap-2">
                <Users className="text-blue-500" size={18} /> {members[0].members.length} Members
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {grp.githubLink && (
              <a href={grp.githubLink} target="_blank" className="text-gray-600 hover:text-blue-600 transition-colors">
                <Github size={28} />
              </a>
            )}
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Group Info */}
          <div className="lg:col-span-1 space-y-8">
            {/* Group Bio */}
            <div className="bg-white shadow-xl rounded-2xl p-6 transform transition-all hover:shadow-2xl">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Code className="text-blue-500" size={24} /> About
              </h2>
              <p className="text-gray-700">{grp.grpbio || 'No description available.'}</p>
            </div>

            {/* Tech Stack */}
            {grp.techStack?.length > 0 && (
              <div className="bg-white shadow-xl rounded-2xl p-6 transform transition-all hover:shadow-2xl">
                <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <Code className="text-blue-500" size={24} /> Tech Stack
                </h2>
                <div className="flex flex-wrap gap-2">
                  {grp.techStack.map((tech, index) => (
                    <span key={index} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Project Goals */}
            {grp.projectGoals && (
              <div className="bg-white shadow-xl rounded-2xl p-6 transform transition-all hover:shadow-2xl">
                <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <Target className="text-blue-500" size={24} /> Project Goals
                </h2>
                <p className="text-gray-700">{grp.projectGoals}</p>
              </div>
            )}
          </div>

          {/* Right Column: GitHub and Client Component */}
          <div className="lg:col-span-2 space-y-8">
            {/* Project Details */}
            {(grp.projectTitle || grp.projectDescription) && (
              <div className="bg-white shadow-xl rounded-2xl p-6 transform transition-all hover:shadow-2xl">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Project Overview</h2>
                {grp.projectTitle && <h3 className="text-lg font-medium text-gray-900">{grp.projectTitle}</h3>}
                {grp.projectDescription && <p className="text-gray-700 mt-2">{grp.projectDescription}</p>}
              </div>
            )}

            {/* GitHub Repos */}
            {grp.githubLink && (
              <GitHubRepos githublink={grp.githubLink} />
            )}

            {/* WhatsApp Group Client */}
            <div className="bg-white shadow-xl rounded-2xl p-6 transform transition-all hover:shadow-2xl">
              <WhatsAppGroupClient
                group={grp}
                admin={admin}
                requestId={requestId}
                currentUser={user}
                members={members[0].members}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhatsAppGroup;
