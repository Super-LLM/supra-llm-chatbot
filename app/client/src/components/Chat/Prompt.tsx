import { useState } from 'react';
import { FaArrowUp } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import {
  sendMessageFailure,
  sendMessageStart,
  submitPrompt
} from '../../redux/chat/chatSlice';
import { AppDispatch, RootState } from '../../redux/store';
import Spinner from '../Spinner';

const Prompt = () => {
  const { showSidebar, loading } = useSelector(
    (state: RootState) => state.chat
  );
  const dispatch = useDispatch<AppDispatch>();

  const [prompt, setPrompt] = useState('');

  // For changing the submit button's color bg when input is not empty
  const isPromptEmpty = prompt.trim() === '';

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPrompt(e.target.value);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim() !== '') {
      try {
        dispatch(sendMessageStart());
        dispatch(submitPrompt(prompt));
        setPrompt('');
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
          disabled={loading}
          className='w-full border-none focus:outline-none bg-transparent placeholder:font-semibold'
          onChange={handleInputChange}
          value={prompt}
        />
        <button
          className={`w-8 h-8 flex items-center justify-center rounded-lg p-2 ${
            isPromptEmpty ? 'bg-gray-500' : 'bg-gray-200'
          }`}
          title='Send Message'
        >
          <div className='text-default '>
            {loading ? <Spinner /> : <FaArrowUp />}
          </div>
        </button>
      </form>
    </div>
  );
};

export default Prompt;
