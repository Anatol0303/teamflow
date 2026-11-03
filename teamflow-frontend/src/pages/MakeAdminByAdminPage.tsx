import { useEffect, useState } from 'react';
import api from '../api/axios';
import axios from 'axios';
import AdminNavigationButtons
    from '../components/AdminNavigationButtons';

type User = {
    id: number;
    email: string;
    createdAt: string;
};

function MakeAdminByAdminPage() {

    const [users, setUsers] =
        useState<User[]>([]);

    const [selectedUserId,
        setSelectedUserId] =
        useState('');

    const [successMessage,
        setSuccessMessage] =
        useState('');

    const [errorMessage,
        setErrorMessage] =
        useState('');

    const handleGetUsers = async () => {

        try {

            const response = await api.get(
                '/users/make-admin-select-list'
            );

            setUsers(response.data);

        } catch (error) {

            console.error(error);

            if (
                axios.isAxiosError(error) &&
                error.response?.status === 400 &&
                error.response?.data?.message ===
                'No users available to make ADMIN'
            ) {
                setUsers([]);
            }
        }
    };

    const handleMakeAdmin = async () => {

        if (!selectedUserId) {

            setErrorMessage(
                'Please select a user'
            );

            setTimeout(() => {

                setErrorMessage('');

            }, 5000);

            setSuccessMessage('');

            return;
        }

        try {

            await api.patch(
                `/users/${selectedUserId}/make-admin`
            );

            setSuccessMessage(
                'User successfully promoted to ADMIN'
            );

            setTimeout(() => {

                setSuccessMessage('');

            }, 3000);

            setErrorMessage('');

            await handleGetUsers();

            setSelectedUserId('');

        } catch (error) {

            console.error(error);

            if (axios.isAxiosError(error)) {

                setErrorMessage(
                    error.response?.data?.message ||
                    'Failed to make user ADMIN'
                );

            } else {

                setErrorMessage(
                    'Failed to make user ADMIN'
                );
            }

            setTimeout(() => {

                setErrorMessage('');

            }, 5000);

            setSuccessMessage('');
        }
    };

    useEffect(() => {

        const fetchUsers = async () => {
            await handleGetUsers();
        };

        fetchUsers();

    }, []);

    return (
        <div>

            <h2 className="mb-4">
                Make Admin
            </h2>

            {users.length === 0 ? (

                <div className="alert alert-info">

                    You can not make any user ADMIN

                </div>

            ) : (

                <>

                    <div className="mb-3">

                        <label className="form-label">
                            Select User
                        </label>

                        <select
                            className="form-select"
                            value={selectedUserId}
                            onChange={(e) =>
                                setSelectedUserId(
                                    e.target.value
                                )
                            }
                        >

                            <option value="">
                                Choose user
                            </option>

                            {users.map(
                                (user: User) => (

                                    <option
                                        key={user.id}
                                        value={user.id}
                                    >
                                        {user.email}
                                        {' '}
                                        (ID: {user.id})
                                    </option>

                                )
                            )}

                        </select>

                    </div>

                    <button
                        className="btn btn-primary"
                        onClick={handleMakeAdmin}
                    >
                        Make Admin
                    </button>

                    {successMessage && (

                        <div className="alert alert-success mt-3">

                            {successMessage}

                        </div>

                    )}

                    {errorMessage && (

                        <div className="alert alert-danger mt-3">

                            {errorMessage}

                        </div>

                    )}

                </>

            )}

            <AdminNavigationButtons
                parentPath="/admin/admins"
                parentLabel="Back to Admins"
            />

        </div>
    );
}

export default MakeAdminByAdminPage;