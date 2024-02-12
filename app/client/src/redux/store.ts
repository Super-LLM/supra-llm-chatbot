import { combineReducers, configureStore } from '@reduxjs/toolkit';
import persistReducer from 'redux-persist/lib/persistReducer';
import { persistStore } from 'redux-persist';
import userReducer from './user/userSlice';
import chatReducer from './chat/chatSlice';
import storage from 'redux-persist/lib/storage';


const rootReducer = combineReducers({
    user: userReducer,
    chat: chatReducer,
  });
  
  const persistConfig = {
    key: 'root',
    storage,
    version: 1,
  };
  
  const persistedReducer = persistReducer(persistConfig, rootReducer);
  
  export const store = configureStore({
    reducer: persistedReducer,
  });
  
  export const persistor = persistStore(store);
  
  // Infer the `RootState` and `AppDispatch` types from the store itself
  export type RootState = ReturnType<typeof store.getState>;
  // Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
  export type AppDispatch = typeof store.dispatch;