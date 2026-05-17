import { createSlice } from '@reduxjs/toolkit';
import { PayloadAction } from '@reduxjs/toolkit';
import { User } from '@shared/types/user';

type UserState = User | null;

const userSlice = createSlice({
    name: 'user',
    initialState: null as UserState,
    reducers: {
        setUserState: (state, action: PayloadAction<User>) => {
            return action.payload;
        },

        clearUserState: () => {
            return null;
        },

        updateUserState: (state, action: PayloadAction<User>) => {
            if (state) {
                return {
                    ...state,
                    ...action.payload
                };
            }
            return state;
        }
    },
});

export const { setUserState, clearUserState, updateUserState } = userSlice.actions;
export const userReducer = userSlice.reducer;

export interface AvatarUrlState {
    key: string | null;
    url: string | null;
    expiresAt: number | null;
}

const initialAvatarUrlState: AvatarUrlState = {
    key: null,
    url: null,
    expiresAt: null,
};

const avatarUrlSlice = createSlice({
    name: 'avatarUrl',
    initialState: initialAvatarUrlState,
    reducers: {
        setAvatarUrl: (
            _state,
            action: PayloadAction<{ key: string; url: string; expiresAt: number }>
        ) => action.payload,

        clearAvatarUrl: () => initialAvatarUrlState,
    },
});

export const { setAvatarUrl, clearAvatarUrl } = avatarUrlSlice.actions;
export const avatarUrlReducer = avatarUrlSlice.reducer;
