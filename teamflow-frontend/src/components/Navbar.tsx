import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
function Navbar() {
    type TokenPayload = {
        userId: number;
        email: string;
        role: string;
    };

    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [role, setRole] = useState('');
    const [hasValidToken, setHasValidToken] =
        useState(false);

    useEffect(() => {

        const updateAuthInfo = () => {

            const token =
                localStorage.getItem('token');

            if (!token) {
                setEmail('');
                setRole('');
                setHasValidToken(false);
                return;
            }

            try {

                const decoded =
                    jwtDecode<TokenPayload>(token);

                setEmail(decoded.email);
                setRole(decoded.role);
                setHasValidToken(true);

            } catch {

                localStorage.removeItem('token');

                setEmail('');
                setRole('');
                setHasValidToken(false);
            }
        };

        updateAuthInfo();

        window.addEventListener(
            'authChanged',
            updateAuthInfo
        );

        window.addEventListener('storage', updateAuthInfo);

        return () => {
            window.removeEventListener(
                'authChanged',
                updateAuthInfo
            );
            window.removeEventListener('storage', updateAuthInfo);
        };

    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        window.dispatchEvent(new Event('authChanged'));
        navigate('/');
    };

    return (
        <nav className="navbar navbar-dark bg-dark px-3">

            <span
                className="navbar-brand mb-0 h1 text-decoration-none"
            >
                TeamFlow
            </span>

            <div className="d-flex gap-2">
                {hasValidToken && (
                    <>
                        <span className="text-light align-self-center">
                {role}
            </span>
                        <span className="text-light align-self-center">
                {email}
            </span>

                        <button
                            className="btn btn-outline-light"
                            onClick={handleLogout}
                        >
                            Logout
                        </button>
                    </>
                )}
            </div>
        </nav>
    );
}

export default Navbar;