import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import api from '../api/axios';

function RegisterUserPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [canRegisterAsAdmin, setCanRegisterAsAdmin] =
        useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (
        e: React.FormEvent<HTMLFormElement>
    ) => {
        e.preventDefault();

        try {
            const response = await api.post('/users/createUser', {
                email,
                password
            });

            localStorage.setItem('token', response.data.token);

            window.dispatchEvent(new Event('authChanged'));

            navigate('/user-main-menu');
        } catch (error: unknown) {
            console.error(error);

            if (axios.isAxiosError(error)) {

                const message =
                    error.response?.data?.message ||
                    'Registration failed';

                setError(message);

                if (
                    message ===
                    'There are not ADMIN in application\nYou can register only like ADMIN'
                )
                {
                    setCanRegisterAsAdmin(true);
                }else
                {
                    setCanRegisterAsAdmin(false);

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
                <h2 className="mb-4">Register</h2>

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
                {canRegisterAsAdmin && (
                    <button
                        type="button"
                        className="btn btn-primary mt-2"
                        onClick={() => navigate('/registerAdmin')}
                    >
                        Register like ADMIN
                    </button>
                )}
            </div>
        </div>
    );
}

export default RegisterUserPage;
