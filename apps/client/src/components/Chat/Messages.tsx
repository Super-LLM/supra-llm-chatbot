import { FaRobot, FaUser } from 'react-icons/fa';
import { RootState } from '../../redux/store';
import { useSelector } from 'react-redux';
import { useEffect, useRef } from 'react';

const Messages = () => {
  const { currentChat, showSidebar } = useSelector(
    (state: RootState) => state.chat
  );

  const messagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [currentChat?.messages]);

  const scrollToBottom = () => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  };

  return (
    <div
      className='flex flex-col w-full h-full overflow-y-auto'
      ref={messagesRef}
    >
      {currentChat &&
        currentChat?.messages.map((message, index) => (
          <div
            key={index}
            className={`
          px-8 ${showSidebar ? 'md:px-12' : 'md:px-64'} my-4 flex items-start
          `}
          >
            <div className='w-7 h-7 flex flex-shrink-0 items-center justify-center rounded-full border'>
              {message.isBot ? <FaRobot /> : <FaUser />}
            </div>
            <div className='ml-2'>
              <p className='font-bold mb-1'>{message.isBot ? 'Bot' : 'User'}</p>
              <p>{message.content}</p>
            </div>
          </div>
        ))}
    </div>
  );
};
export default Messages;
