import { useState } from 'react';
import api from '../api/axios';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

type TokenPayload = {
    userId: number;
    email: string;
    role: string;
};

function ChangePasswordPage() {

    const navigate = useNavigate();

    const token = localStorage.getItem('token');

    let role = '';

    if (token) {
        try {
            const decoded =
                jwtDecode<TokenPayload>(token);

            role = decoded.role;

        } catch {
            role = '';
        }
    }

    const [message, setMessage] =
        useState('');

    const [messageType, setMessageType] =
        useState<'success' | 'error' | ''>('');

    const [currentPassword, setCurrentPassword] =
        useState('');

    const [newPassword, setNewPassword] =
        useState('');

    const [confirmPassword, setConfirmPassword] =
        useState('');

    const [showCurrentPassword, setShowCurrentPassword] =
        useState(false);

    const [showNewPassword, setShowNewPassword] =
        useState(false);

    const [showConfirmPassword, setShowConfirmPassword] =
        useState(false);

    const handleChangePassword = async () => {

        if (newPassword !== confirmPassword) {

            setMessage(
                'New passwords do not match'
            );

            setMessageType('error');

            setTimeout(() => {
                setMessage('');
                setMessageType('');
            }, 5000);

            return;
        }

        try {

            await api.patch(
                '/users/change-password',
                {
                    currentPassword,
                    newPassword
                }
            );

            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');

            setMessage(
                'Password successfully changed'
            );

            setMessageType('success');

            setTimeout(() => {
                setMessage('');
                setMessageType('');
            }, 5000);

        } catch (error: unknown) {

            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');

            setMessageType('error');

            if (axios.isAxiosError(error)) {

                setMessage(
                    error.response?.data?.message ||
                    'Failed to change password'
                );

            } else {

                setMessage(
                    'Failed to change password'
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
                Change Password
            </h2>

            <div className="mb-3">

                <label className="form-label">
                    Current Password
                </label>

                <div className="input-group">

                    <input
                        type={
                            showCurrentPassword
                                ? 'text'
                                : 'password'
                        }
                        className="form-control"
                        value={currentPassword}
                        onChange={(e) =>
                            setCurrentPassword(
                                e.target.value
                            )
                        }
                    />

                    <button
                        type="button"
                        className="btn btn-outline-secondary"
                        onClick={() =>
                            setShowCurrentPassword(
                                !showCurrentPassword
                            )
                        }
                    >
                        {showCurrentPassword ? '👁' : '👁‍🗨'}
                    </button>

                </div>

            </div>

            <div className="mb-3">

                <label className="form-label">
                    New Password
                </label>

                <div className="input-group">

                    <input
                        type={
                            showNewPassword
                                ? 'text'
                                : 'password'
                        }
                        className="form-control"
                        value={newPassword}
                        onChange={(e) =>
                            setNewPassword(
                                e.target.value
                            )
                        }
                    />

                    <button
                        type="button"
                        className="btn btn-outline-secondary"
                        onClick={() =>
                            setShowNewPassword(
                                !showNewPassword
                            )
                        }
                    >
                        {showNewPassword ? '👁' : '👁‍🗨'}
                    </button>

                </div>

            </div>
            <div className="mb-3">

                <label className="form-label">
                    Confirm New Password
                </label>

                <div className="input-group">

                    <input
                        type={
                            showConfirmPassword
                                ? 'text'
                                : 'password'
                        }
                        className="form-control"
                        value={confirmPassword}
                        onChange={(e) =>
                            setConfirmPassword(
                                e.target.value
                            )
                        }
                    />

                    <button
                        type="button"
                        className="btn btn-outline-secondary"
                        onClick={() =>
                            setShowConfirmPassword(
                                !showConfirmPassword
                            )
                        }
                    >
                        {showConfirmPassword ? '👁' : '👁‍🗨'}
                    </button>

                </div>

            </div>

            <button
                className="btn"
                style={{
                    backgroundColor: '#6f4e37',
                    color: 'white'
                }}
                onClick={handleChangePassword}
            >
                Change Password
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

export default ChangePasswordPage;