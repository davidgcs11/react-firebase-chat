import { useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { Route, Routes } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "./app/hooks";
import AppBar from "./layout/AppBar/AppBar";
import SplashLoading from "./layout/SplashLoading/SplashLoading";
import Chat from "./pages/Chat/Chat";
import Login from "./pages/Login/Login";
import ProtectedRoute from "./pages/ProtectedRoute/ProtectedRoute";
import { selectAuth, subscribeToAuthChanges } from "./redux/auth/authSlice";


function App() {
  const authStore = useAppSelector(selectAuth);
  const dispatch = useAppDispatch();
  useEffect(() => dispatch(subscribeToAuthChanges()), []);

  return (
    <div className="bg-slate-700 h-screen w-screen">
      <Toaster />
      <SplashLoading show={authStore.status === 'initial-loading'} />
      {authStore.status !== 'initial-loading' && (
        <div className="h-full flex flex-col">
          <AppBar />
          <Routes>
            <Route path="/" element={
              <ProtectedRoute protected={true} route={'/login'}>
                <Chat />
              </ProtectedRoute>
            } />
            <Route path="/login" element={
              <ProtectedRoute protected={false} route={'/'}>
                <Login />
              </ProtectedRoute>
            } />
          </Routes>
        </div>
      )}

    </div>
  );
}

export default App;
