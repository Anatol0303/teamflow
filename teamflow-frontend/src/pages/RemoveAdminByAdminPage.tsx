import { useEffect, useState } from 'react';
import api from '../api/axios';
import axios from 'axios';
import AdminNavigationButtons
    from '../components/AdminNavigationButtons';

type User = {
    id: number;
    email: string;
};

function RemoveAdminByAdminPage() {

    const [admins, setAdmins] =
        useState<User[]>([]);

    const [selectedAdminId,
        setSelectedAdminId] =
        useState('');

    const [successMessage,
        setSuccessMessage] =
        useState('');

    const [errorMessage,
        setErrorMessage] =
        useState('');

    const handleGetAdmins = async () => {

        try {

            const response = await api.get(
                '/users/remove-admin-select-list'
            );

            setAdmins(response.data);

        } catch (error) {

            console.error(error);

        }
    };

    const handleRemoveAdmin = async () => {

        if (!selectedAdminId) {

            setErrorMessage(
                'Please select an ADMIN'
            );

            setTimeout(() => {

                setErrorMessage('');

            }, 5000);

            setSuccessMessage('');

            return;
        }

        try {

            await api.delete(
                `/users/${selectedAdminId}/remove-admin`
            );

            setSuccessMessage(
                'ADMIN successfully removed'
            );

            setTimeout(() => {

                setSuccessMessage('');

            }, 3000);

            setErrorMessage('');

            await handleGetAdmins();

            setSelectedAdminId('');

        } catch (error) {

            console.error(error);

            if (axios.isAxiosError(error)) {

                setErrorMessage(
                    error.response?.data?.message ||
                    'Failed to remove ADMIN'
                );

            } else {

                setErrorMessage(
                    'Failed to remove ADMIN'
                );
            }

            setTimeout(() => {

                setErrorMessage('');

            }, 5000);

            setSuccessMessage('');
        }
    };

    useEffect(() => {

        const fetchAdmins = async () => {
            await handleGetAdmins();
        };

        fetchAdmins();

    }, []);

    return (
        <div>

            <h2 className="mb-4">
                Remove Admin
            </h2>

            {admins.length === 0 ? (

                <div className="alert alert-info">

                    You can not remove any ADMIN

                </div>

            ) : (

                <>

                    <div className="mb-3">

                        <label className="form-label">
                            Select ADMIN
                        </label>

                        <select
                            className="form-select"
                            value={selectedAdminId}
                            onChange={(e) =>
                                setSelectedAdminId(
                                    e.target.value
                                )
                            }
                        >

                            <option value="">
                                Choose admin
                            </option>

                            {admins.map(
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
                        onClick={handleRemoveAdmin}
                    >
                        Remove Admin
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

export default RemoveAdminByAdminPage;