import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { Chat, Message, dfChatHistory } from '../../types';

const API_URL = 'https://ba55-34-31-203-243.ngrok-free.app/query/';
// const API_URL: string = import.meta.env.VITE_API_URL;

export const submitPrompt = createAsyncThunk(
  'chat/submitPrompt',
  async (prompt: string, { dispatch }) => {
    try {
      dispatch(sendMessageSuccess({ content: prompt, isBot: false }));

      const response = await axios.post(
        API_URL,
        { content: prompt },
        // {
        //   session_id: '1402-5',
        //   message: prompt,
        //   userId: 'testuser',
        //   llm_temp: 0,
        //   model_name: 'gpt-35-turbo',
        //   token: '',
        // },
        {
          headers: {
            'Access-Control-Allow-Origin': '*',
          },
        }
      );

      // const reader = response.data!.getReader();
      // let isStreaming = false;
      // const chunks: string[] = [];

      // const processChunk = async () => {
      //   let currentChunk = '';

      //   do {
      //     const { done, value } = await reader.read();

      //     if (done) {
      //       break;
      //     }

      //     const chunkString = new TextDecoder('utf-8').decode(value);

      //     if (chunkString.includes('type: "start"')) {
      //       isStreaming = true;
      //       currentChunk = '';
      //     }

      //     if (isStreaming) {
      //       currentChunk += chunkString;
      //     }

      //     if (chunkString.includes('type: "end"')) {
      //       isStreaming = false;
      //       chunks.push(currentChunk);
      //     }
      //   } while(isStreaming);
      // };

      // await processChunk();

      // // Do something with all accumulated chunks if needed
      // console.log('All chunks received:', chunks);

      console.log(response.data);

      dispatch(sendMessageSuccess({ content: prompt, isBot: false }));
    } catch (error) {
      if (error instanceof Error)
        console.error('Error submitting prompt:', error.message);
    }
  }
);

interface ChatState {
  chatHistory: Chat[];
  currentChat: Chat | undefined;
  stream: string | undefined;
  showTypeAnimation: boolean;
  showSidebar: boolean;
  error: string | undefined;
  loading: boolean;
}

const initialState: ChatState = {
  chatHistory: dfChatHistory,
  currentChat: undefined,
  stream: undefined,
  showTypeAnimation: false,
  showSidebar: true,
  error: undefined,
  loading: false,
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    //---------- CHAT ----------
    selectChat(state, action) {
      state.currentChat = action.payload;
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
      state.chatHistory = action.payload;
    },

    //---------- MESSAGE ----------
    sendMessageStart(state) {
      state.loading = true;
    },
    sendMessageSuccess: (state, action) => {
      const newMessage: Message = action.payload;

      // Update currentChat state
      state.currentChat!.messages.push(newMessage);
      state.currentChat!.timestamp = Date.now();

      // Update chatHistory state
      state.chatHistory = state.chatHistory.map((chat) =>
        chat.id === state.currentChat!.id
          ? {
              ...chat,
              messages: [...chat.messages, newMessage],
              timestamp: Date.now(),
            }
          : chat
      );
      state.loading = false;
      state.error = undefined;
    },
    sendMessageFailure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    updateStream: (state, action) => {
      state.stream = (state.stream || '') + action.payload;
    },

    //---------- SIDEBAR ----------
    toggleSidebar: (state, action) => {
      state.showSidebar = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(submitPrompt.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(submitPrompt.fulfilled, (state, action) => {
      // Handle the fulfilled state when the async action is successful
      // Access the result from action.payload
      console.log(action.payload);
      state.loading = false;
    });
    builder.addCase(submitPrompt.rejected, (state, action) => {
      // Handle the rejected state when the async action fails
      // Access the error from action.error.message
      console.error(action.error.message);
      state.loading = false;
    });
  },
});

export const {
  selectChat,
  sendMessageStart,
  sendMessageSuccess,
  sendMessageFailure,
  updateStream,
  newChatStart,
  newChatFinish,
  newChatFailure,
  renameChat,
  deleteChat,
  toggleSidebar,
} = chatSlice.actions;

export default chatSlice.reducer;
