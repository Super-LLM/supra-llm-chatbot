import { Link } from 'react-router-dom';
import logo from '../assets/images/logo.png';

const About = () => {
  return (
    <div className='mx-auto py-8 px-10 md:px-40 bg-black h-screen'>
      <Link className='flex justify-center mb-4' to='/'>
        <img
          src={logo}
          alt=''
          width={200}
          height={200}
          className='rounded hidden md:block'
        />
      </Link>
      <h1 className='text-3xl font-bold text-center mb-6'>About Us</h1>
      <div className='text-lg text-justify'>
        <p className='mb-4'>
          Welcome to LLM, your AI-powered assistant for university enrollment,
          residency, and housing for international students in Finland. Our
          mission is to make the process of studying abroad in Finland as smooth
          and seamless as possible.
        </p>
        <p>
          Whether you're looking to apply for university programs, navigate
          residency requirements, or find suitable housing options, we're here to
          help.
        </p>
      </div>
      <div className='shadow-md rounded-lg'>
        <h2 className='text-2xl font-bold my-4'>Contact Information</h2>
        <p className='text-lg mb-2'>
          If you have any questions or inquiries, feel free to reach out to us:
        </p>
        <p className='text-lg'>
          Email:{' '}
          <a
            href='mailto:honghuynhkhon@gmail.com'
            className='text-blue-500 hover:underline'
          >
            honghuynhkhon@gmail.com
          </a>
        </p>
      </div>
    </div>
  );
};

export default About;
