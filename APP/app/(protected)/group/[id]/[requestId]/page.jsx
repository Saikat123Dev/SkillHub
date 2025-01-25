import { findMembers, IndividualGroup } from '@/actions/group';
import WhatsAppGroupClient from '@/components/GroupPage';
import { getUserById } from '@/data/user';
import { currentUser } from '@/lib/auth';
import { AlertTriangle, UserCog, Users } from 'lucide-react';

const WhatsAppGroup = async ({ params }) => {
  const { id, requestId } = params;

  // Enhanced error handling with consistent UI
  const ErrorDisplay = ({ message }) => (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white shadow-md rounded-lg p-6 max-w-md w-full text-center">
        <AlertTriangle className="mx-auto mb-4 text-red-500" size={48} />
        <h2 className="text-xl font-semibold text-gray-800 mb-2">
          {message}
        </h2>
        <p className="text-gray-600">
          Please check the group details or contact support.
        </p>
      </div>
    </div>
  );

  // User authentication check
  const user = await currentUser();
  if (!user) {
    return <ErrorDisplay message="Unauthorized Access" />;
  }

  // Group retrieval with enhanced error handling
  const grp = await IndividualGroup(id);
  if (!grp) {
    return <ErrorDisplay message="Group Not Found" />;
  }

  // Members retrieval
  const members = await findMembers(id);

  // Admin retrieval
  const admin = await getUserById(grp.adminId);
  if (!admin) {
    return <ErrorDisplay message="Group Admin Not Available" />;
  }

  // Rich metadata display before client component
  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="p-6 bg-blue-50 flex items-center">
            <UserCog className="mr-4 text-blue-500" size={40} />
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                {grp.name || 'Group Details'}
              </h1>
              <p className="text-gray-600 flex items-center">
                <Users className="mr-2" size={16} />
                {members[0].members.length} Members
              </p>
            </div>
          </div>

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
  );
};

export default WhatsAppGroup;
