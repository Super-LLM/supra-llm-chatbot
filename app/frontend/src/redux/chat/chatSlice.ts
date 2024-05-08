import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Chat, Message } from '../../types';

interface ChatState {
  chatHistory: Chat[];
  currentChat: Chat | undefined;
  stream: string[];
  showTypeAnimation: boolean;
  showSidebar: boolean;
  error: string | undefined;
  loading: boolean;
  isDeleteDialogOpen: false;
  idToDelete: string | null;
}

const initialState: ChatState = {
  chatHistory: [],
  currentChat: undefined,
  stream: [],
  showTypeAnimation: false,
  showSidebar: true,
  error: undefined,
  loading: false,
  isDeleteDialogOpen: false,
  idToDelete: null,
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    // ---------- CHAT HISTORY ----------
    setChatHistory(state, action) {
      state.chatHistory = [];
      state.chatHistory = action.payload;

      if (state.currentChat) {
        state.currentChat = state.chatHistory.find(
          (chat) => chat.id === state.currentChat!.id
        );
      }
    },
    emptyChatHistory(state) {
      state.chatHistory = [];
    },

    //---------- CHAT ----------
    selectChat(state, action) {
      state.currentChat = action.payload;
      state.error = undefined;
    },
    newChatStart: (state, action) => {
      state.currentChat = action.payload;
      state.chatHistory.push(action.payload);
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
      state.chatHistory = action.payload;
    },
    deleteChat: (state, action) => {
      state.currentChat = undefined;
      state.chatHistory = state.chatHistory.filter(
        (chat) => chat.id !== action.payload
      );
    },

    //---------- MESSAGE ----------
    sendMessageStart(state) {
      state.loading = true;
      state.error = undefined;
    },
    sendMessageSuccess: (state, action) => {
      const currentChatMsgs = state.currentChat!.messages;
      const newMessage: Message = action.payload;
      currentChatMsgs.push(newMessage);
    },
    sendMessageFailure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    streamStart: (state) => {
      const currentChatMsgs = state.currentChat!.messages;
      const botMessage: Message = { content: '', isBot: true };
      currentChatMsgs.push(botMessage);
    },
    streamRunning: (state, action) => {
      state.stream = [...state.stream, action.payload];
    },

    //---------- STREAM FROM BOT ----------
    streamSuccess: (state, action: PayloadAction<Message>) => {
      const currentChatMsgs = state.currentChat!.messages;
      const finalBotMessage = action.payload;

      // Update the content of the empty message with the streamed data
      currentChatMsgs[currentChatMsgs.length - 1] = finalBotMessage;

      // Update chatHistory state
      state.chatHistory = state.chatHistory.map((chat) =>
        chat.id === state.currentChat!.id
          ? {
              ...chat,
              messages: currentChatMsgs,
              timestamp: Date.now(),
            }
          : chat
      );

      state.loading = false;
      state.stream = [];
    },
    streamFailure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
      state.stream = [];
    },
    streamStop: (state) => {
      state.loading = false;
      state.stream = [];
    },

    //---------- SIDEBAR ----------
    toggleSidebar: (state, action) => {
      state.showSidebar = action.payload;
    },
    setIsDeleteDialogOpen: (state, action) => {
      state.isDeleteDialogOpen = action.payload;
    },
    setIdToDelete: (state, action) => {
      state.idToDelete = action.payload;
    },
  },
});

export const {
  setChatHistory,
  emptyChatHistory,
  selectChat,
  sendMessageStart,
  sendMessageSuccess,
  sendMessageFailure,
  streamStart,
  streamRunning,
  streamSuccess,
  streamFailure,
  streamStop,
  newChatStart,
  newChatFinish,
  newChatFailure,
  renameChat,
  deleteChat,
  toggleSidebar,
  setIsDeleteDialogOpen,
  setIdToDelete,
} = chatSlice.actions;

export default chatSlice.reducer;
