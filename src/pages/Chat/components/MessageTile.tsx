import { useAppSelector } from '../../../app/hooks'
import { ChatMessageUI } from '../../../models/chat-message'
import { selectUser } from '../../../redux/auth/authSlice'

const MessageTile = ({ message }: { message: ChatMessageUI }) => {
    const user = useAppSelector(selectUser);
    const fromUser = message.userId === user?.uid;
    const onClick = () => {
        if (!fromUser) return;

    }
    return (
        <div
            key={message.uid}
            className={`
            px-3 py-1 my-2 rounded-b-xl flex flex-col
            ${fromUser ? 'bg-slate-500 rounded-l-xl hover:cursor-pointer' : 'bg-slate-800 rounded-r-xl'}
            `}
            onClick={onClick}
        >
            <div className="flex flex-row justify-between">
                <span className="text-white font-semibold">
                    {message.username}
                </span>
                <span className="ml-4 text-white text-sm">
                    {message.date.format('hh:mm A')}
                </span>
            </div>
            <span className="text-white">
                {message.message}
            </span>
        </div>
    )
}

export default MessageTile