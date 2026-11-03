import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

type TokenPayload = {
    userId: number;
    email: string;
    role: string;
};

type ProtectedRouteProps = {
    children: React.ReactNode;
};

function ProtectedRoute({
                            children
                        }: ProtectedRouteProps) {

    const token = localStorage.getItem('token');

    if (!token) {
        return <Navigate to="/" replace />;
    }

    try {
        jwtDecode<TokenPayload>(token);

    } catch {
        localStorage.removeItem('token');

        return <Navigate to="/" replace />;
    }

    return <>{children}</>;
}

export default ProtectedRoute;