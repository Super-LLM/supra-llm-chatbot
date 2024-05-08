import { createSlice } from '@reduxjs/toolkit';
import { User } from '../../types';

interface UserState {
  currentUser: User | undefined;
}

const initialState: UserState = {
  currentUser: undefined,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setCurrentUser: (state, action) => {
      state.currentUser = action.payload;
    },
    signOutUser: (state) => {
      state.currentUser = undefined;
    },
  },
});

export const { setCurrentUser, signOutUser } = userSlice.actions;

export default userSlice.reducer;
