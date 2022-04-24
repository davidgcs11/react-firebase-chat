import { Transition } from '@headlessui/react';
import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../../../app/hooks'
import { selectChat, selectMessages, subscribeToChatMessages, unsubscribeToChatMessages } from '../../../redux/chat/chatSlice';
import MessageTile from './MessageTile';

const MessageList = () => {
    const dispatch = useAppDispatch();
    const chatStore = useAppSelector(selectChat);
    const messages = useAppSelector(selectMessages);

    useEffect(() => {
        dispatch(subscribeToChatMessages());
        return () => dispatch(unsubscribeToChatMessages);
    }, []);

    return (
        <div className="h-full overflow-y-auto p-4">
            <Transition
                className="absolute top-1/2 left-1/2 right-1/2 "
                show={chatStore.status === 'loading'}
                leave="transition-opacity duration-500"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
            >
                <div className="items-center justify-center flex flex-col text-white animate-spin">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                </div>
            </Transition>
            {Object.keys(messages).sort((a, b) => +a - +b).map((key) => {
                const dayMessages = messages[key];
                const dayLabel = dayMessages[0].date.format('dddd DD, MMMM YYYY');
                return (
                    <div key={key}>
                        <div className="text-center text-white py-1 font-bold w-full">
                            {dayLabel}
                        </div>
                        {dayMessages.map((msg) => (<MessageTile key={msg.uid} message={msg} />))}
                    </div>
                );
            })}
        </div>
    )
}

export default MessageList