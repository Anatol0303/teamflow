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

function AdminProtectedRoute({ children }: Props) {
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

    if (decoded.role === 'USER') {
        return <Navigate to="/user-main-menu" />;
    }

    if (decoded.role !== 'ADMIN') {
        localStorage.removeItem('token');
        return <Navigate to="/" />;
    }

    return children;
}

export default AdminProtectedRoute;