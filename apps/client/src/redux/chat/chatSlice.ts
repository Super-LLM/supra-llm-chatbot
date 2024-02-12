import { createSlice } from '@reduxjs/toolkit';
import { Chat, Message, dfChatHistory } from '../../types';

interface ChatState {
  chatHistory: Chat[];
  currentChat: Chat | undefined;
  showTypeAnimation: boolean;
  showSidebar: boolean;
  error: string | undefined;
  loading: boolean;
}

const initialState: ChatState = {
  chatHistory: dfChatHistory,
  currentChat: undefined,
  showTypeAnimation: false,
  showSidebar: true,
  error: undefined,
  loading: false,
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    // CHAT
    selectChat(state, action) {
      state.currentChat = action.payload;
    },
    newChatStart: (state, action) => {
      state.currentChat = action.payload;
      state.chatHistory = [...state.chatHistory, action.payload];
      state.showTypeAnimation = true;
    },
    newChatFinish: (state) => {
      state.showTypeAnimation = false;
    },
    newChatFailure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    renameChat: (state, action) => {
      const { id, title } = action.payload;
      state.chatHistory = state.chatHistory.map((chat) =>
        chat.id === id ? { ...chat, title } : chat
      );
    },
    deleteChat: (state, action) => {
      state.currentChat = undefined;
      state.chatHistory = [
        ...state.chatHistory.filter((chat) => chat.id !== action.payload),
      ];
    },

    // MESSAGE
    sendMessageStart(state) {
      state.loading = true;
    },
    sendMessageSuccess: (state, action) => {
      const newMessage: Message = action.payload;
      const updatedChat: Chat = {
        ...state.currentChat!,
        messages: [...(state.currentChat?.messages as Message[]), newMessage],
        timestamp: Date.now(),
      };
      const updatedList = state.chatHistory.map((chat) =>
        chat.id === updatedChat.id ? updatedChat : chat
      );
      state.currentChat = updatedChat;
      state.chatHistory = updatedList;
      state.loading = false;
      state.error = undefined;
    },
    sendMessageFailure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },

    // SIDEBAR
    toggleSidebar: (state) => {
      state.showSidebar = !state.showSidebar;
    },
  },
});

export const {
  selectChat,
  sendMessageStart,
  sendMessageSuccess,
  sendMessageFailure,
  newChatStart,
  newChatFinish,
  newChatFailure,
  renameChat,
  deleteChat,
  toggleSidebar,
} = chatSlice.actions;

export default chatSlice.reducer;
