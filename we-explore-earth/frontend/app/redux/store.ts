import { configureStore } from '@reduxjs/toolkit';
import { userReducer, avatarUrlReducer } from './slices/userSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    avatarUrl: avatarUrlReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;