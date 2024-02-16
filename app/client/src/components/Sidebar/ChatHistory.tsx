/* eslint-disable react-hooks/exhaustive-deps */
import { ChangeEvent, useState } from 'react';
import { MdDelete, MdEdit } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';
import { TypeAnimation } from 'react-type-animation';
import { deleteChat, renameChat, selectChat } from '../../redux/chat/chatSlice';
import { RootState } from '../../redux/store';

const iconStyle = 'opacity-70 hover:opacity-100';

const ChatsHistory = () => {
  const dispatch = useDispatch();
  const { currentChat, chatHistory, showTypeAnimation } = useSelector(
    (state: RootState) => state.chat
  );

  // For renaming
  const [renamedChatId, setRenamedChatId] = useState('');
  const [newChatTitle, setNewChatTitle] = useState('');

  // Sorting the chat history by timestamp
  const sortedChatHistory = chatHistory
    .slice()
    .sort((a, b) => b.timestamp - a.timestamp);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setNewChatTitle(e.target.value);
  };

  const handleSubmit = (id: string, title: string) => {
    try {
      setRenamedChatId('');
      dispatch(
        renameChat(
          chatHistory.map((chat) =>
            chat.id === id ? { ...chat, title } : chat
          )
        )
      );
    } catch (e) {
      if (e instanceof Error) console.log(e.message);
    }
  };

  const handleSelectChat = (id: string) => {
    try {
      dispatch(selectChat(chatHistory.find((chat) => chat.id === id)));
    } catch (e) {
      if (e instanceof Error) console.log(e.message);
    }
  };

  const handleDeleteChat = (id: string) => {
    try {
      dispatch(deleteChat(chatHistory.filter((chat) => chat.id !== id)));
    } catch (e) {
      if (e instanceof Error) console.log(e.message);
    }
  };

  const isCurrentChat = (id: string) => {
    return currentChat?.id === id;
  };

  return (
    <div className={`flex flex-col h-full w-[240px] overflow-y-auto mt-1 px-1`}>
      {sortedChatHistory.map((chat) => (
        <div>
          {renamedChatId != '' && renamedChatId == chat.id ? (
            <form onSubmit={() => handleSubmit(chat.id, newChatTitle)}>
              <input
                className='bg-default w-full px-2 my-2 rounded-md'
                defaultValue={newChatTitle}
                onChange={handleInputChange}
                autoFocus
              />
            </form>
          ) : (
            <div
              key={chat.id}
              className={`${
                isCurrentChat(chat.id) ? 'bg-default' : 'hover:bg-hover'
              }
           cursor-pointer flex justify-between items-center rounded-md group 
          transition-transform duration-300 ease-in-out`}
            >
              {/* CHAT TITLE */}
              <div
                className='relative grow select-none overflow-hidden whitespace-nowrap p-2'
                onClick={() => handleSelectChat(chat.id)}
              >
                {showTypeAnimation && sortedChatHistory.indexOf(chat) === 0 ? (
                  <TypeAnimation
                    sequence={[chat.title]}
                    speed={20}
                    cursor={false}
                  />
                ) : (
                  chat.title
                )}
                <span
                  className={`absolute right-0 top-0 w-8 h-full
                bg-gradient-to-r from-transparent
                ${
                  isCurrentChat(chat.id)
                    ? 'to-default'
                    : 'to-black group-hover:to-hover'
                }`}
                ></span>
              </div>
              {/* CHAT ACTIONS */}
              <div
                className={`group-hover:flex gap-1 mr-1 ${
                  renamedChatId === chat.id && 'hidden'
                }
             ${currentChat?.id === chat.id ? 'flex' : 'hidden'} `}
              >
                <MdEdit
                  className={iconStyle}
                  size={20}
                  onClick={() => {
                    setRenamedChatId(chat.id);
                    setNewChatTitle(chat.title);
                  }}
                />
                <MdDelete
                  className={`text-red-500 ${iconStyle}`}
                  size={20}
                  onClick={() => handleDeleteChat(chat.id)}
                />
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ChatsHistory;
