import { TfiWrite } from 'react-icons/tfi';
import { useDispatch } from 'react-redux';
import {
  newChatFailure,
  newChatFinish,
  newChatStart,
} from '../redux/chat/chatSlice';
import { Chat } from '../types';
import { v4 as uuid } from 'uuid';

interface NewChatProps {
  text?: string;
}

const NewChatButton = ({ text }: NewChatProps) => {
  const dispatch = useDispatch();

  const handleNewChat = async () => {
    try {
      const newChat: Chat = {
        id: uuid(),
        userId: '1',
        title: 'New Chat Is Here',
        messages: [],
        timestamp: Date.now(),
      };
      dispatch(newChatStart(newChat));
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call
      dispatch(newChatFinish());
    } catch (error) {
      dispatch(newChatFailure(error));
    }
  };

  return (
    <button
      title='New Chat'
      onClick={handleNewChat}
      className={`flex items-center justify-between p-3 rounded-md transition-all duration-200 ease-in-out cursor-pointer 
      ${
        text === 'New Chat'
          ? 'bg-black hover:bg-hover'
          : 'opacity-60 hover:opacity-100'
      }
      `}
    >
      <p className='font-semibold'>{text}</p>

      <TfiWrite size={20} />
    </button>
  );
};

export default NewChatButton;
