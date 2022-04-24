import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import dayjs from "dayjs";
import { collection, doc, onSnapshot, Unsubscribe } from "firebase/firestore";
import { AppThunk, RootState } from "../../app/store";
import { fireStore } from "../../firebase/firebase.config";
import { ChatMessage, ChatMessageUI } from "../../models/chat-message";


export interface ChatState {
    status: 'idle' | 'loading' | 'failed',
    error: string | null,
    messages: ChatMessage[];
}

const initialState: ChatState = {
    status: 'idle',
    error: null,
    messages: [],
}

let unsubcribe: Unsubscribe | null = null;

export const subscribeToChatMessages = createAsyncThunk(
    'chat/subscribeToChatMessages',
    async (_, store) => {
        unsubcribe = onSnapshot(collection(fireStore, 'messages'), (collection) => {
            const messages = collection.docs.map((doc) => {
                const data = doc.data();
                return <ChatMessage>{
                    uid: doc.id,
                    username: data.username,
                    photoUrl: data.photoUrl,
                    message: data.message,
                    userId: data.userId,
                    timestamp: data.timestamp ? data.timestamp.seconds * 1000 : new Date().getTime(),
                };
            });
            store.dispatch(chatSlice.actions.setMessages(messages));
        });
    }
);

export const unsubscribeToChatMessages: AppThunk = (dispatch, getState) => {
    if (unsubcribe) {
        unsubcribe();
        dispatch(chatSlice.actions.clearMessages());
    }
}

const chatSlice = createSlice({
    name: 'chat',
    initialState: initialState,
    reducers: {
        setMessages: (state, action: PayloadAction<ChatMessage[]>) => {
            state.messages = action.payload;
            state.status = 'idle';
        },
        clearMessages: (_) => initialState,
    },
    extraReducers: (builder) => {
        builder.addCase(subscribeToChatMessages.pending, (state) => {
            state.status = 'loading';
        })
    }
});

export const selectChat = (root: RootState) => root.chat;
export const selectMessages = (root: RootState): { [date: string]: ChatMessageUI[] } => {
    const record: { [date: string]: ChatMessageUI[] } = {};
    /// Group by day
    root.chat.messages.forEach((message) => {
        const date = dayjs(message.timestamp);
        const day = date.startOf('day').valueOf();

        const msg: ChatMessageUI = { ...message, date };

        if (record[day]) {
            record[day].push(msg);
        } else {
            record[day] = [msg];
        }
    });

    /// Sort older to recent
    Object.keys(record).forEach((key) => {
        record[key].sort((a, b) => a.timestamp - b.timestamp);
    })
    return record;
}

export default chatSlice.reducer;
