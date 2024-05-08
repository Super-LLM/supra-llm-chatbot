import { TfiWrite } from 'react-icons/tfi';
import { useDispatch, useSelector } from 'react-redux';
import {
  newChatFailure,
  newChatFinish,
  newChatStart,
} from '../redux/chat/chatSlice';
import { RootState } from '../redux/store';
import { Chat, NewChatProps } from '../types';
import { createRequest } from '../utils/apiService';

const NewChatButton = ({ text }: NewChatProps) => {
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state: RootState) => state.user);

  const handleNewChat = async () => {
    try {
      const defaultNewChat: Chat = {
        // id: uuid(),
        userId: currentUser!.id,
        title: 'New Chat Is Here',
        messages: [],
        timestamp: Date.now(),
      };

      const response = await createRequest(defaultNewChat);

      if (response.ok) {
        const finalNewChat: Chat = await response.json();
        dispatch(newChatStart(finalNewChat));

        // Set timeout for Text Animation to finish
        setTimeout(() => {
          dispatch(newChatFinish());
        }, 2000);
      } else {
        throw new Error('Failed to create new chat');
      }
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
