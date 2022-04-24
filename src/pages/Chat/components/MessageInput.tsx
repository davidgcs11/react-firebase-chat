import dayjs from 'dayjs';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import React, { useState } from 'react'
import { useAppSelector } from '../../../app/hooks';
import { fireStore } from '../../../firebase/firebase.config';
import { ChatMessage } from '../../../models/chat-message';
import { IUser } from '../../../models/user';
import { selectUser } from '../../../redux/auth/authSlice';
import { selectChat } from '../../../redux/chat/chatSlice';

const sendMessage = async (user: IUser, message: string, messages: ChatMessage[]) => {
    const userMessages = messages.filter((m) => m.userId === user.uid);

    if (userMessages.length > 0) {
        userMessages.sort((a, b) => b.timestamp - a.timestamp);
        const lastUserMessage = userMessages[0];

        const baseDelay = 5000; /// 5 seconds
        const neededDelay = userMessages.length * baseDelay;

        const neededTimestamp = lastUserMessage.timestamp + neededDelay;
        const currentTimestamp = Date.now();

        console.log(neededTimestamp);

        if (currentTimestamp < neededTimestamp) {
            const targetDate = dayjs(neededTimestamp);
            throw new Error(`Please wait until ${targetDate.format('DD/MM/YYYY hh:mm:ss A')} to send this message`);
        }
    }

    return storeMessageInFirebase(user, message);
}

const storeMessageInFirebase = async (user: IUser, message: string) => addDoc(collection(fireStore, 'messages'), {
    userId: user.uid,
    username: user.name ?? user.email,
    photoUrl: user.photoUrl,
    message: message,
    timestamp: serverTimestamp(),
});


const MessageInput = () => {
    const chatStore = useAppSelector(selectChat);
    const [message, setMessage] = useState('');
    const [sending, setSending] = useState(false);
    const [error, setError] = useState('');
    const user = useAppSelector(selectUser);

    const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setMessage(event.target.value);
    }
    const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.stopPropagation();
        event.preventDefault();
        const msg = `${message}`;

        setSending(true);
        setError('');
        setMessage('');

        try {
            await sendMessage(user!, msg, chatStore.messages);
        } catch (err) {
            setMessage(msg);
            setError(`${err}`);
        } finally {
            setSending(false);
        }
    }

    return (
        <form className="flex-col flex bg-slate-800 px-4 py-3 pb-5"
            onSubmit={onSubmit}>
            {error && (
                <span className="pb-2 text-red-600 italic">
                    {error}
                </span>
            )}
            <div className="flex-row flex w-full">
                <input
                    value={message}
                    autoFocus={true}
                    className="w-full bg-slate-700 rounded-md p-2 text-gray-300 outline-none"
                    placeholder="Write your message"
                    disabled={sending}
                    onChange={onChange}
                />
                <button
                    className="pl-3 text-white hover:text-gray-400 disabled:text-slate-700"
                    disabled={!message || sending}
                    type="submit"
                >
                    {!sending && (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                    )}
                    {sending && (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 animate-pulse text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                    )}
                </button>
            </div>
        </form>
    )
}

export default MessageInput