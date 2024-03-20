import AuthTemplate from '../components/Home/AuthTemplate';
import UnauthTemplate from '../components/Home/UnauthTemplate';

const Home = () => {
  return (
    <div className='flex h-screen'>
      <AuthTemplate />
      <UnauthTemplate />
    </div>
  );
};

export default Home;
