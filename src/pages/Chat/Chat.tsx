import React from 'react'
import MessageInput from './components/MessageInput'
import MessageList from './components/MessageList'

const Chat = () => {
    return (
        <div className="flex flex-col h-full">
            <MessageList />
            <MessageInput />
        </div>
    )
}

export default Chat