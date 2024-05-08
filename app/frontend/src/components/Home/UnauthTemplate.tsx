import { UnauthenticatedTemplate, useMsal } from '@azure/msal-react';
import { TypeAnimation } from 'react-type-animation';
import logo from '../../assets/images/logo.png';
import { animationTexts } from '../../utils/const';

const UnauthTemplate = () => {
  const { instance } = useMsal();

  const handleSignIn = async () => {
    try {
      await instance.loginRedirect();
    } catch (error) {
      console.error('Error signing in:', error);
    }
  };

  // const handleSignUp = async () => {
  //   try {
  //     await instance.loginRedirect({
  //       ...signUpRequest,
  //       prompt: 'create',
  //     });
  //   } catch (error) {
  //     console.error('Error signing up:', error);
  //   }
  // };

  return (
    <UnauthenticatedTemplate>
      <div className='flex w-full'>
        <div className='sm:flex hidden flex-1 px-10 items-center'>
          <TypeAnimation
            className='text-4xl font-bold text-purple-500'
            sequence={animationTexts}
            speed={20}
          />
        </div>
        <div className='flex flex-col gap-3 justify-center items-center bg-black w-full sm:w-2/5'>
          <h2 className='text-3xl font-bold mb-1'>Get Started</h2>
          <button
            onClick={handleSignIn}
            className='bg-blue-500 hover:bg-blue-700 w-1/2 py-2 font-semibold  rounded focus:outline-none focus:shadow-outline'
          >
            Sign In
          </button>
          {/* <button
            onClick={handleSignUp}
            className='bg-cyan-500 hover:bg-cyan-700 w-1/2 py-2 font-semibold  rounded focus:outline-none focus:shadow-outline'
          >
            Sign Up
          </button> */}

          <div className='absolute bottom-2 text-gray-400 text-base text-center font-semibold flex items-center gap-2'>
            <img src={logo} alt='' width={40} height={40} />
            <div>Supra LLM</div>
          </div>
        </div>
      </div>
    </UnauthenticatedTemplate>
  );
};

export default UnauthTemplate;
