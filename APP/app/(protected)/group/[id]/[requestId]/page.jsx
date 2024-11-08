// WhatsAppGroupPage.tsx (Server Component)
import { currentUser } from '@/lib/auth';
import { findMembers, IndividualGroup } from '@/actions/group';
import { getUserById } from '@/data/user';
import WhatsAppGroupClient from '@/components/GroupPage';



const WhatsAppGroup = async ({ params }) => {
  const { id, requestId } = params;
  const user = await currentUser();
  if (!user) {
    return <div>Unauthorized</div>;
  }

  const grp = await IndividualGroup(id);
  console.log('grp', grp);
  if (!grp) {
    return <div>Error: Cannot find group</div>;
  }

  const members = await findMembers(id);
  console.log(members[0].members);

  const admin = await getUserById(grp.adminId);
  console.log('admin', admin);
  if (!admin) {
    return <div>Error: Cannot find Admin</div>;
  }

  // Pass the fetched data to the client component
  return (
    <WhatsAppGroupClient
      group={grp}
      admin={admin}
      requestId={requestId}
      currentUser={user}
      members={members[0].members}
    />
  );
};

export default WhatsAppGroup;