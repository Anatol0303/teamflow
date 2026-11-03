import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import api from '../api/axios';

function RegisterAdminPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [canRegisterAsUser, setCanRegisterAsUser] =
        useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (
        e: React.FormEvent<HTMLFormElement>
    ) => {
        e.preventDefault();

        try {
            const response = await api.post('/users/createAdmin', {
                email,
                password
            });

            localStorage.setItem('token', response.data.token);

            window.dispatchEvent(new Event('authChanged'));

            navigate('/admin-main-menu');
        } catch (error: unknown) {
            console.error(error);

            if (axios.isAxiosError(error)) {

                const message =
                    error.response?.data?.message ||
                    'Registration failed';

                setError(message);

                if (
                    message ===
                    'During this time 1 admin has appeared in application.\nNow You can registrate only like usual USER'
                )
                {
                    setCanRegisterAsUser(true);
                }else
                {
                    setCanRegisterAsUser(false);

                    setTimeout(() => {
                        setError('');
                    }, 5000)
                }

            } else {

                setError('Registration failed');

                setTimeout(() => {
                    setError('');
                }, 5000);
            }
        }
    };

    return (
        <div className="row justify-content-center">
            <div className="col-md-6">

                <h2 className="mb-4">Register ADMIN</h2>

                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label">
                            Email
                        </label>

                        <input
                            type="email"
                            className="form-control"
                            value={email}
                            onChange={(e) =>
                                setEmail(e.target.value)
                            }
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
                            onChange={(e) =>
                                setPassword(e.target.value)
                            }
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary"
                    >
                        Register
                    </button>
                </form>
                {error && (
                    <div className="alert alert-danger mt-3">
                        {error}
                    </div>
                )}
                {canRegisterAsUser && (
                    <button
                        type="button"
                        className="btn btn-primary mt-2"
                        onClick={() => navigate('/registerUser')}
                    >
                        Register like usual USER
                    </button>
                )}

            </div>
        </div>
    );
}

export default RegisterAdminPage;
