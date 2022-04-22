import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { GoogleAuthProvider, signInWithPopup, signOut, User } from "firebase/auth";
import { AppThunk, RootState } from "../../app/store";
import { fireAuth } from "../../firebase/firebase.config";
import { IUser } from "../../models/user";

export interface AuthState {
    user: IUser | null;
    status: 'idle' | 'loading' | 'initial-loading' | 'failed';
}

const initialState: AuthState = {
    user: null,
    status: 'initial-loading',
};

export const subscribeToAuthChanges = (): AppThunk => (
    dispatch,
    getState
) => {
    fireAuth.onAuthStateChanged((fireUser) => {
        console.log(fireUser?.email, selectAuth(getState()));
        let user: IUser | null = null;
        if (fireUser) {
            user = {
                uid: fireUser.uid,
                name: fireUser.displayName ?? '',
                email: fireUser.email,
                photoUrl: fireUser.photoURL,
                createdAt: new Date(fireUser.metadata.creationTime ?? new Date()).getTime(),
                lastLoginAt: fireUser.metadata.lastSignInTime ? new Date(fireUser.metadata.lastSignInTime).getTime() : null,
            }
        }
        dispatch(authSlice.actions.setUserAction(user));
    });
};

export const startGoogleAuthAction = createAsyncThunk(
    'auth/startGoogleAuth',
    async (_) => signInWithPopup(fireAuth, new GoogleAuthProvider()),
)

export const logoutFireAuthAction = createAsyncThunk(
    'auth/logoutFireAuth',
    async (_) => signOut(fireAuth),
)

const authSlice = createSlice({
    name: 'auth',
    initialState: initialState,
    reducers: {
        setUserAction: (state, action: PayloadAction<IUser | null>) => {
            state.user = action.payload;
            state.status = 'idle';
        },
    },
    extraReducers: (builder) => {
        builder.addCase(startGoogleAuthAction.pending, (state) => {
            state.status = 'loading';
        }).addCase(logoutFireAuthAction.fulfilled, (state) => {

        })
    }
});

export const selectAuth = (state: RootState) => state.auth;
export const selectUser = (state: RootState) => state.auth.user;
export default authSlice.reducer;