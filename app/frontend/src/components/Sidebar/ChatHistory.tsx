/* eslint-disable react-hooks/exhaustive-deps */
import { ChangeEvent, useRef, useState } from 'react';
import { MdDelete, MdEdit } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';
import { TypeAnimation } from 'react-type-animation';
import {
  renameChat,
  selectChat,
  setIdToDelete,
  setIsDeleteDialogOpen
} from '../../redux/chat/chatSlice';
import { RootState } from '../../redux/store';
import { updateRequest } from '../../utils/apiService';
import { useFetchChatHistory } from '../../utils/fetchChatHistory';
import { useOutsideClickListener } from '../../utils/outsideClickListener';

const iconStyle = 'opacity-70 hover:opacity-100';

const ChatsHistory = () => {
  const dispatch = useDispatch();
  const inputRef = useRef<HTMLInputElement>(null);

  const { currentChat, chatHistory, showTypeAnimation } = useSelector(
    (state: RootState) => state.chat
  );

  // For renaming
  const [renamedChatId, setRenamedChatId] = useState('');
  const [newChatTitle, setNewChatTitle] = useState('');

  // Fetching the chat history when refreshing the page
  useFetchChatHistory();

  // Sorting the chat history by timestamp
  const sortedChatHistory = chatHistory
    .slice()
    .sort((a, b) => b.timestamp - a.timestamp);

  // Cancel to rename chat when clicked outside the input
  const handleOutsideClick = (event: MouseEvent) => {
    if (inputRef.current && !inputRef.current.contains(event.target as Node)) {
      setRenamedChatId('');
    }
  };
  useOutsideClickListener(handleOutsideClick);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setNewChatTitle(e.target.value.trim());
  };

  // Rename Chat
  const handleSubmit = async (id: string, title: string) => {
    try {
      setRenamedChatId('');
      const response = await updateRequest(id, title, null);
      if (response.ok) {
        dispatch(
          renameChat(
            chatHistory.map((chat) =>
              chat.id === id ? { ...chat, title } : chat
            )
          )
        );
      }
    } catch (e) {
      if (e instanceof Error) console.log(e.message);
    }
  };

  // Select Chat for renaming or deleting
  const handleSelectChat = (id: string) => {
    try {
      dispatch(selectChat(chatHistory.find((chat) => chat.id === id)));
    } catch (e) {
      if (e instanceof Error) console.log(e.message);
    }
  };

  // Check if current chat to highlight it
  const isCurrentChat = (id: string) => {
    return currentChat?.id === id;
  };

  const openDeleteDialog = (id: string) => {
    dispatch(setIdToDelete(id));
    dispatch(setIsDeleteDialogOpen(true));
  };

  return (
    <div className={`flex flex-col h-full w-[240px] overflow-y-auto mt-1 px-1`}>
      {sortedChatHistory.map((chat) => {
        if (chat.id) {
          const id = chat.id;
          const isCurrent = isCurrentChat(id);
          return (
            <div key={id}>
              {renamedChatId != '' && renamedChatId == id ? (
                <form onSubmit={() => handleSubmit(id, newChatTitle)}>
                  <input
                    ref={inputRef}
                    className='bg-default w-full px-2 my-2 rounded-md'
                    defaultValue={newChatTitle}
                    onChange={handleInputChange}
                    autoFocus
                  />
                </form>
              ) : (
                <div
                  key={id}
                  className={`${isCurrent ? 'bg-default' : 'hover:bg-hover'}
                cursor-pointer flex justify-between items-center rounded-md group 
                transition-transform duration-300 ease-in-out`}
                >
                  {/* CHAT TITLE */}
                  <div
                    className='relative grow select-none overflow-hidden whitespace-nowrap p-2'
                    onClick={() => handleSelectChat(id)}
                  >
                    {showTypeAnimation &&
                    sortedChatHistory.indexOf(chat) === 0 ? (
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
                ${isCurrent ? 'to-default' : 'to-black group-hover:to-hover'}`}
                    ></span>
                  </div>
                  {/* CHAT ACTIONS */}
                  <div
                    className={`group-hover:flex gap-1 mr-1 ${
                      renamedChatId === id && 'hidden' // Hide edit and delete button when renaming
                    }
             ${isCurrent ? 'flex' : 'hidden'} `}
                  >
                    <MdEdit
                      className={iconStyle}
                      size={20}
                      onClick={() => {
                        setRenamedChatId(id);
                        setNewChatTitle(chat.title);
                      }}
                    />
                    <MdDelete
                      className={`text-red-500 ${iconStyle}`}
                      size={20}
                      onClick={() => openDeleteDialog(id)}
                    />
                  </div>
                </div>
              )}
            </div>
          );
        }
      })}
    </div>
  );
};

export default ChatsHistory;
