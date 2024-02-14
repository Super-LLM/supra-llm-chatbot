import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import {
  sendMessageFailure,
  sendMessageStart,
  sendMessageSuccess,
} from '../../redux/chat/chatSlice';
import Spinner from '../Spinner';
import { FaArrowUp } from 'react-icons/fa';

const MessageInput = () => {
  const { showSidebar, loading } = useSelector(
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
    <div
      className={`${
        showSidebar ? 'md:px-24' : 'md:px-64'
      } px-8 pt-1 w-full 2xl:w-[60%]`}
    >
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
    </div>
  );
};

export default MessageInput;
