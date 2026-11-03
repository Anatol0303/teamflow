import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { selfRemoveAdmin } from './SelfRemovingAdmin';
import axios from 'axios';

function SelfRemoveAdminPage() {
    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] =
        useState('');
    const [successMessage, setSuccessMessage] =
        useState('');
    const handleNo = () => {
        navigate('/admin-main-menu');
    };

    const handleYes = async () => {
        try {
            await selfRemoveAdmin();

            setSuccessMessage(
                'You successfully removed your own account'
            );

            setTimeout(() => {
                navigate('/');
            }, 5000);

        } catch (error) {
            console.error(error);

            if (axios.isAxiosError(error)) {
                setErrorMessage(
                    error.response?.data?.message ||
                    'Failed to remove your account'
                );
            } else {
                setErrorMessage(
                    'Failed to remove your account'
                );
            }

            setTimeout(() => {
                navigate('/admin-main-menu');
            }, 5000);
        }
    };

    return (
        <div>
            <div className="alert alert-warning text-center">
                <h4>
                    Are you sure want to remove your own account?
                </h4>
            </div>

            <div className="d-flex justify-content-center gap-3">
                <button
                    className="btn btn-success"
                    onClick={handleYes}
                >
                    Yes
                </button>

                <button
                    className="btn btn-danger"
                    onClick={handleNo}
                >
                    No
                </button>
            </div>
            {successMessage && (
                <div className="alert alert-success mt-4">
                    {successMessage}
                </div>
            )}
            {errorMessage && (
                <div className="alert alert-danger mt-4">
                    {errorMessage}
                </div>
            )}
        </div>
    );
}

export default SelfRemoveAdminPage;