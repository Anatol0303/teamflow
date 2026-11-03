import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import LandingPage from '../pages/LandingPage';

type TokenPayload = {
    userId: number;
    email: string;
    role: string;
};

function RootRoute() {
    const token = localStorage.getItem('token');

    if (!token) {
        return <LandingPage />;
    }

    let decoded: TokenPayload;

    try {
        decoded = jwtDecode<TokenPayload>(token);
    } catch {
        localStorage.removeItem('token');
        return <LandingPage />;
    }

    if (decoded.role === 'ADMIN') {
        return <Navigate to="/admin-main-menu" replace />;
    }

    if (decoded.role === 'USER') {
        return <Navigate to="/user-main-menu" replace />;
    }

    localStorage.removeItem('token');
    return <LandingPage />;
}

export default RootRoute;