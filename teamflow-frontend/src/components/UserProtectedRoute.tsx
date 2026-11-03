import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
type Props = {
    children: React.ReactNode;
};

type TokenPayload = {
    userId: number;
    email: string;
    role: string;
};

function UserProtectedRoute({ children }: Props) {
    const token = localStorage.getItem('token');

    if (!token) {
        return <Navigate to="/" />;
    }

    let decoded: TokenPayload;

    try {
        decoded = jwtDecode<TokenPayload>(token);
    } catch {
        localStorage.removeItem('token');
        return <Navigate to="/" />;
    }

    if (decoded.role === 'ADMIN') {
        return <Navigate to="/admin-main-menu" />;
    }

    if (decoded.role !== 'USER') {
        localStorage.removeItem('token');
        return <Navigate to="/" />;
    }

    return children;
}

export default UserProtectedRoute;