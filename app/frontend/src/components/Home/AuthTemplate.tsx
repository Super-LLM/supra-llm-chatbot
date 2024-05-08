import { AuthenticatedTemplate } from '@azure/msal-react';
import ChatArea from '../Chat/ChatArea';
import DeleteDialog from '../Chat/DeleteDialog';
import Sidebar from '../Sidebar/Sidebar';

const AuthTemplate = () => {
  return (
    <AuthenticatedTemplate>
      <Sidebar />
      <ChatArea />
      <DeleteDialog />
    </AuthenticatedTemplate>
  );
};

export default AuthTemplate;
