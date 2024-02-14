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
      className={`flex flex-col w-full overflow-y-auto gap-10 items-center`}
      ref={messagesRef}
    >
      {currentChat &&
        currentChat?.messages.map((message, index) => (
          <div
            key={index}
            className={`
            flex items-start 2xl:w-[60%] w-full px-8 ${
              showSidebar ? 'md:px-24' : 'md:px-64'
            }
          `}
          >
            <div className='w-7 h-7 flex flex-shrink-0 items-center justify-center rounded-full border'>
              {message.isBot ? <FaRobot /> : <FaUser />}
            </div>
            <div className='ml-2'>
              <p className='font-bold mb-1'>{message.isBot ? 'Bot' : 'User'}</p>
              <p className='text-justify '>{message.content}</p>
            </div>
          </div>
        ))}
    </div>
  );
};
export default Messages;
