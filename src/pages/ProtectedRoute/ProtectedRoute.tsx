import { Navigate } from 'react-router-dom';
import { useAppSelector } from '../../app/hooks'
import { selectAuth } from '../../redux/auth/authSlice'

const ProtectedRoute = (props: { children: JSX.Element, protected: boolean, route: string }) => {
    const { user } = useAppSelector(selectAuth);

    const navigate = props.protected && !user || !props.protected && user;
    if (navigate) return (<Navigate to={props.route} />)
    return props.children;

}

export default ProtectedRoute