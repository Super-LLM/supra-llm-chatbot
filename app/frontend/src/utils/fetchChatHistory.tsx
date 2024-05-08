import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setChatHistory } from '../redux/chat/chatSlice';
import { RootState } from '../redux/store';
import { Chat, ChatData } from '../types';
import { readRequest } from './apiService';

export const useFetchChatHistory = () => {
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state: RootState) => state.user);
  useEffect(() => {
    const fetchData = async () => {
      if (currentUser) {
        readRequest(currentUser.id)
          .then((response) => {
            if (!response.ok) {
              throw new Error('Failed to fetch data');
            }
            return response.json();
          })
          .then((data) => {
            const chatList: Chat[] = data.map((chatData: ChatData) => ({
              id: chatData._id,
              userId: chatData.userId,
              title: chatData.title,
              messages: chatData.messages,
              timestamp: chatData.timestamp,
            }));
            // console.log(chatList);
            dispatch(setChatHistory(chatList));
          })
          .catch((error) => {
            console.error('Error fetching data:', error);
          });
      }
    };
    fetchData();
  }, [currentUser, dispatch]);
};
