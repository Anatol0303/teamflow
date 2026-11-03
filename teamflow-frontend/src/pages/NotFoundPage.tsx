import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

type TokenPayload = {
    userId: number;
    email: string;
    role: string;
};

function NotFoundPage() {

    const navigate = useNavigate();

    const token = localStorage.getItem('token');

    let role = '';

    if (token) {
        try {
            const decoded = jwtDecode<TokenPayload>(token);
            role = decoded.role;
        } catch {
            role = '';
        }
    }

    const handleBack = () => {
        if (role === 'ADMIN') {
            navigate('/admin-main-menu');
        } else if (role === 'USER') {
            navigate('/user-main-menu');
        } else {
            navigate('/');
        }
    };

    return (
        <div className="text-center mt-5">

        <h1 className="display-1">404</h1>

            <h2 className="mb-3">
        Page Not Found
    </h2>

    <p className="text-muted mb-4">
        The page you are looking for does not exist.
    </p>

    <button
    className="btn btn-primary"
    onClick={handleBack}
    >
    {role === 'ADMIN'
        ? 'Back to Admin Main Menu'
        : role === 'USER'
            ? 'Back to User Main Menu'
            : 'Back to Landing Page'}
    </button>

    </div>
);
}

export default NotFoundPage;