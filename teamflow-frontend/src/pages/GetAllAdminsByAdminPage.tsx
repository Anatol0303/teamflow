import { useEffect, useState } from 'react';
import api from '../api/axios';
import AdminNavigationButtons from '../components/AdminNavigationButtons';

type User = {
    id: number;
    email: string;
    createdAt: string;
};

function GetAllAdminsByAdminPage() {

    const [admins, setAdmins] =
        useState<User[]>([]);

    const handleGetAdmins = async () => {

        try {

            const response =
                await api.get('/users/admin-select-list-admins');

            setAdmins(response.data);

        } catch (error) {
            console.error(error);
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
                All Admins
            </h2>

            {admins.length === 0 ? (
                <div className="alert alert-info">
                    There are no ADMIN users
                </div>
            ) : (

            admins.map((user: User) => (
                <div
                    key={user.id}
                    className="card mb-3"
                >
                    <div className="card-body">

                        <h5 className="card-title">
                            {user.email}
                        </h5>

                        <p className="card-text">
                            Admin ID: {user.id}
                        </p>

                        <p className="card-text">
                            Created:
                            {' '}
                            {new Date(
                                user.createdAt
                            ).toLocaleDateString()}
                        </p>

                    </div>
                </div>
                ))
            )}

            <AdminNavigationButtons
                parentPath="/admin/admins"
                parentLabel="Back to Admins"
            />

        </div>
    );
}

export default GetAllAdminsByAdminPage;