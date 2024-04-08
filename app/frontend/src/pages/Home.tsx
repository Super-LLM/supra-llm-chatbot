import AuthTemplate from '../components/Home/AuthTemplate';
import UnauthTemplate from '../components/Home/UnauthTemplate';

const Home = () => {
  {
    return (
      <div className='flex h-screen'>
        <UnauthTemplate />
        <AuthTemplate />
      </div>
    );
  }
};

export default Home;
