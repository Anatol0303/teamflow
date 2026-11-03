import { useState } from 'react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import { jwtDecode } from 'jwt-decode';
function LoginPage() {

    type TokenPayload = {
        userId: number;
        email: string;
        role: string;
    };

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            const response = await api.post('/users/login', {
                email,
                password
            });

            const token = response.data.token;

            let decoded: TokenPayload;

            try {
                decoded = jwtDecode<TokenPayload>(token);
            } catch {
                setError('Invalid authentication token');
                setTimeout(() => {
                    setError('');
                }, 5000);
                return;
            }

            localStorage.setItem('token', token);

            window.dispatchEvent(new Event('authChanged'));

            if (decoded.role === 'ADMIN') {
                navigate('/admin-main-menu');
            } else if (decoded.role === 'USER') {
                navigate('/user-main-menu');
            } else {
                localStorage.removeItem('token');

                setError('Invalid role');

                setTimeout(() => {
                    setError('');
                }, 5000);
            }
        }

        catch (error) {
            console.error(error);

            if (axios.isAxiosError(error)) {
                setError(
                    error.response?.data?.message || 'Loginization failed'
                );
            } else {
                setError('Loginization failed');
            }

            setTimeout(() => {
                setError('');
            }, 5000);
        }
    };

    return (
        <div className="row justify-content-center">
            <div className="col-md-6">
                <h2 className="mb-4">Login</h2>

                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label">
                            Email
                        </label>

                        <input
                            type="email"
                            className="form-control"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">
                            Password
                        </label>

                        <input
                            type="password"
                            className="form-control"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <button
                        type="submit"

                        className="btn btn-primary"
                    >
                        Login
                    </button>
                </form>
                {error && (
                    <div className="alert alert-danger mt-3">
                        {error}
                    </div>
                )}
            </div>
        </div>
    );
}

export default LoginPage;