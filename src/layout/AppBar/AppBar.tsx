import React from 'react'
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { logoutFireAuthAction, selectUser } from '../../redux/auth/authSlice'

const AppBar = () => {
    const user = useAppSelector(selectUser);
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const onLogin = () => navigate("/login");
    const onLogout = () => dispatch(logoutFireAuthAction());

    return (
        <div className="bg-slate-800 w-full flex flex-row text-white items-center justify-between px-5">
            <div className="flex-row flex py-4 font-bold">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                </svg>
                <span className="ml-2 text-xl">
                    Firebase Chat
                </span>
            </div>
            {user && (
                <div className="flex flex-row">
                    <span
                        className="py-1 px-3"
                    >
                        {user.name ?? user.email}
                    </span>
                    <button
                        className="font-semibold hover:bg-slate-900 rounded-md py-1 px-3"
                        type="button"
                        onClick={onLogout}>
                        Logout
                    </button>
                </div>
            )}
            {!user && (
                <button
                    className="font-semibold hover:bg-slate-900 rounded-md py-1 px-3"
                    type="button"
                    onClick={onLogin}>
                    Login
                </button>
            )}
        </div>
    )
}

export default AppBar