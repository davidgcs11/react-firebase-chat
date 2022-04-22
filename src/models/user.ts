export interface IUser {
    uid: string;
    name: string;
    email: string | null;
    photoUrl: string | null;
    createdAt: number;
    lastLoginAt: number | null;
}