import { Dayjs } from "dayjs";

export interface ChatMessage {
    uid: string;
    userId: string;
    username: string;
    photoUrl?: string;
    message: string;
    timestamp: number;
}

export interface ChatMessageUI extends ChatMessage {
    date: Dayjs;
}