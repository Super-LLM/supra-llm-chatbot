import { AuthenticatedTemplate } from '@azure/msal-react'
import ChatArea from '../Chat/ChatArea'
import Sidebar from '../Sidebar/Sidebar'


const AuthTemplate = () => {
  return (
    <AuthenticatedTemplate>
    <Sidebar />
    <ChatArea />
  </AuthenticatedTemplate>
  )
}

export default AuthTemplate