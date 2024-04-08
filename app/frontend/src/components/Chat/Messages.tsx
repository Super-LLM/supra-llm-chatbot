import { useEffect, useRef } from 'react';
import { FaRobot, FaUser } from 'react-icons/fa';
import { TbOvalFilled } from 'react-icons/tb';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';

const Messages = () => {
  const { currentChat, showSidebar, error, loading, stream } = useSelector(
    (state: RootState) => state.chat
  );

  const messagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [stream, currentChat]);

  const scrollToBottom = () => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  };

  return (
    <div
      className={`flex flex-col w-full h-full overflow-y-auto gap-10 items-center pb-10`}
      ref={messagesRef}
    >
      {currentChat &&
        currentChat?.messages.map((message, index) => {
          const isLastMessage = index === currentChat?.messages.length - 1;

          const isBotAnswering = loading && stream.length > 0 && isLastMessage;

          return (
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
                <p className='font-bold mb-1'>
                  {message.isBot ? 'Bot' : 'User'}
                </p>
                <p className='text-justify'>
                  {isBotAnswering
                    ? stream.map((chunk, index) => (
                        <span
                          className={
                            index === stream.length - 1 ? 'inline-flex' : ''
                          }
                        >
                          <span key={index}>{chunk} </span>
                          {index === stream.length - 1 && <TbOvalFilled />}
                        </span>
                      ))
                    : message.content}
                 
                </p>
              </div>
            </div>
          );
        })}
      {error && typeof error === 'string' && <p className='text-red-500 font-bold'>{error}</p>}
    </div>
  );
};
export default Messages;
