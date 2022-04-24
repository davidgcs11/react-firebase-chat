import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import authReducer from '../redux/auth/authSlice';
import chatReducer from '../redux/chat/chatSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    chat: chatReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
