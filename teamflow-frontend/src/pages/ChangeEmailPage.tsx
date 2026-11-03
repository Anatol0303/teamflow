import { useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import api from '../api/axios';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

type TokenPayload = {
    userId: number;
    email: string;
    role: string;
};

function ChangeEmailPage() {

    const token = localStorage.getItem('token');
    const navigate = useNavigate();
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] =
        useState<'success' | 'error' | ''>('');
    let currentEmail = '';
    let role = '';

    if (token) {
        try {
            const decoded =
                jwtDecode<TokenPayload>(token);

            currentEmail = decoded.email;
            role = decoded.role;

        } catch {
            currentEmail = '';
            role = '';
        }
    }

    const [email, setEmail] = useState('');
    const [currentUserEmail, setCurrentUserEmail] =
        useState(currentEmail);

    const handleChangeEmail = async () => {

        try {

            const response = await api.patch(
                '/users/change-email',
                {
                    newEmail: email
                }
            );

            localStorage.setItem(
                'token',
                response.data.token
            );

            window.dispatchEvent(
                new Event('authChanged')
            );

            setCurrentUserEmail(email);
            setEmail('');

            setMessage(
                'Email successfully changed'
            );

            setMessageType('success');

            setTimeout(() => {
                setMessage('');
                setMessageType('');
            }, 5000);

        } catch (error: unknown) {

            setEmail('');
            setMessageType('error');

            if (axios.isAxiosError(error)) {
                setMessage(
                    error.response?.data?.message ||
                    'Failed to change email'
                );
            } else {
                setMessage(
                    'Failed to change email'
                );
            }

            setTimeout(() => {
                setMessage('');
                setMessageType('');
            }, 5000);
        }
    };

    return (
        <div>

            <h2 className="mb-4">
                Change Email
            </h2>

            <div className="mb-3">

                <label className="form-label">
                    New Email
                </label>

                <input
                    type="email"
                    className="form-control"
                    value={email}
                    onChange={(e) =>
                        setEmail(e.target.value)
                    }
                    placeholder={currentUserEmail}
                />

            </div>

            <button
                className="btn btn-primary"
                onClick={handleChangeEmail}
            >
                Change Email
            </button>

            {message && (
                <div
                    className={`alert ${
                        messageType === 'success'
                            ? 'alert-success'
                            : 'alert-danger'
                    } mt-3`}
                >
                    {message}
                </div>
            )}

            <div className="d-flex justify-content-end mt-4">
                <button
                    className="btn btn-outline-primary"
                    onClick={() => {
                        if (role === 'ADMIN') {
                            navigate('/admin-main-menu');
                        } else {
                            navigate('/user-main-menu');
                        }
                    }}
                >
                    {role === 'ADMIN'
                        ? 'Back to Admin Main Menu'
                        : 'Back to User Main Menu'}
                </button>
            </div>


        </div>
    );
}

export default ChangeEmailPage;