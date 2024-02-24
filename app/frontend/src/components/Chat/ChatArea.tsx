import { BiMenuAltLeft } from 'react-icons/bi';
import { useDispatch, useSelector } from 'react-redux';
import { toggleSidebar } from '../../redux/chat/chatSlice';
import { RootState } from '../../redux/store';
import NewChatButton from '../NewChatButton';
import Messages from './Messages';
import Prompt from './Prompt';

const ChatArea = () => {
  const { showSidebar, currentChat } = useSelector(
    (state: RootState) => state.chat
  );

  const dispatch = useDispatch();

  return (
    <div className='flex flex-col justify-between items-center h-full w-full'>
      {/* HEADER */}
      <div className='bg-default py-2 px-5 text-xl w-full font-bold flex justify-between items-center md:justify-center'>
        {/*MENU ICON AND NEW CHAT BUTTON SHOWN IN MOBILE SCREEN */}
        <BiMenuAltLeft
          size={25}
          className={`hover:opacity-100 opacity-60 md:hidden 
          ${showSidebar && 'block'} 
          `}
          onClick={() => {
            dispatch(toggleSidebar(true));
          }}
        />
        Supra LLM
        <div className='block md:hidden rounded-lg bg-black hover:bg-hover'>
          <NewChatButton />
        </div>
      </div>

      {currentChat && <Messages />}
      {currentChat && <Prompt />}
      {!currentChat && (
        <div className='flex justify-center items-center font-semibold text-xl'>
          Please Create New Chat or Choose An Existing Chat
        </div>
      )}

      <p className='  py-2 text-gray-400 text-xs text-center font-semibold'>
        Version 1.0.0. Consider checking important information.
      </p>
    </div>
  );
};

export default ChatArea;
