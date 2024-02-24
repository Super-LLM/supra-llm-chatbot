import ChatArea from '../components/Chat/ChatArea';
import Sidebar from '../components/Sidebar/Sidebar';
const Home = () => {
  return (
    <div className='flex h-screen'>
      <Sidebar />
      <ChatArea />
    </div>
  );
};

export default Home;
