import { useNavigate } from 'react-router-dom';
import api from "../api/axios.ts";
import axios from "axios";
import { useState } from "react";

function LandingPage() {

    const navigate = useNavigate();

    const [error, setError] = useState('');

    const handleGetAdmins = async () => {

        try {

            const response =
                await api.get('/users/admin-select-list-admins-without-token');

            const canRegisterAsAdmin =
                response.data;

            if (canRegisterAsAdmin) {
                navigate('/offerRegisterAdmin');
            } else {
                navigate('/registerUser');
            }

        } catch (error: unknown) {

            console.error(error);

            if (axios.isAxiosError(error)) {

                const message =
                    error.response?.data?.message ||
                    'Registration failed';

                setError(message);

            } else {

                setError('Registration failed');
            }

            setTimeout(() => {
                setError('');
            }, 5000);
        }
    };

    return (
        <div className="text-center mt-5">
            <h1 className="mb-4">Welcome to TeamFlow</h1>

            <p className="mb-4">
                Team management platform
            </p>

            <div className="d-flex justify-content-center gap-3">
                <button
                    className="btn btn-primary"
                    onClick={() => navigate('/login')}
                >
                    Login
                </button>

                <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleGetAdmins}
                >
                    Register
                </button>
            </div>

            {error && (
                <div
                    className="alert alert-danger mt-3 mx-auto"
                    style={{ maxWidth: '500px' }}
                >
                    {error}
                </div>
            )}
        </div>
    );
}

export default LandingPage;