import { useState } from 'react';
import { BiMenuAltLeft } from 'react-icons/bi';
import { FaArrowUp } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import {
  sendMessageFailure,
  sendMessageStart,
  sendMessageSuccess,
  toggleSidebar,
} from '../../redux/chat/chatSlice';
import { RootState } from '../../redux/store';
import NewChatButton from '../NewChatButton';
import Spinner from '../Spinner';
import Messages from './Messages';

const ChatArea = () => {
  const { loading, showSidebar, currentChat } = useSelector(
    (state: RootState) => state.chat
  );
  const dispatch = useDispatch();
  const [message, setMessage] = useState('');

  // For changing the submit button's color bg when input is not empty
  const isInputEmpty = message.trim() === '';

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() !== '') {
      dispatch(sendMessageStart());
      try {
        await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call
        dispatch(sendMessageSuccess({ content: message, isBot: false }));
        setMessage('');
      } catch (error) {
        dispatch(sendMessageFailure(error));
      }
    }
  };

  return (
    <div className='flex flex-col justify-between h-full w-full'>
      {/* HEADER */}
      <div className='bg-default py-2 px-5 text-xl font-bold flex justify-between items-center md:justify-center'>
        {/*MENU ICON AND NEW CHAT BUTTON SHOWN IN MOBILE SCREEN */}
        <BiMenuAltLeft
          size={25}
          className={`hover:opacity-100 opacity-60 md:hidden 
          ${showSidebar && 'block'} 
          `}
          onClick={() => {
            dispatch(toggleSidebar());
          }}
        />
        Supra LLM
        <div className='block md:hidden rounded-lg bg-black hover:bg-hover'>
          <NewChatButton />
        </div>
      </div>

      {currentChat && <Messages />}

      <div
        className={`${showSidebar ? 'md:px-12' : 'md:px-64'} px-8 pt-1 w-full`}
      >
        {currentChat !== undefined ? (
          <form
            onSubmit={handleSendMessage}
            className={`flex bg-default border border-gray-600 rounded-2xl pl-4 pr-2 py-2`}
          >
            <input
              type='text'
              placeholder='Message...'
              className='w-full border-none focus:outline-none bg-transparent placeholder:font-semibold'
              onChange={handleInputChange}
              value={message}
            />
            <button
              className={`w-8 h-8 flex rounded-lg p-2  ${
                isInputEmpty ? 'bg-gray-500' : 'bg-gray-200'
              }`}
              title='Send Message'
            >
              <div className='text-default'>
                {loading ? <Spinner /> : <FaArrowUp />}
              </div>
            </button>
          </form>
        ) : (
          <div className='flex justify-center items-center font-semibold text-xl'>
            Please Create New Chat or Choose An Existing Chat
          </div>
        )}
      </div>
      <p className='  py-2 text-gray-400 text-xs text-center font-semibold'>
        Version 1.0.0. Consider checking important information.
      </p>
    </div>
  );
};

export default ChatArea;
