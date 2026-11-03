import { useEffect, useState } from 'react';
import api from '../api/axios';
import AdminNavigationButtons from '../components/AdminNavigationButtons';

type User = {
    id: number;
    email: string;
    createdAt: string;
};

function GetAllUsersByAdminPage() {

    const [users, setUsers] =
        useState<User[]>([]);

    const handleGetUsers = async () => {

        try {

            const response =
                await api.get('/users/admin-select-list');

            setUsers(response.data);

        } catch (error) {
            console.error(error);
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
                All Users
            </h2>

            {users.length === 0 ? (
                <div className="alert alert-info">
                    There are no USER users
                </div>
            ) : (

            users.map((user: User) => (
                <div
                    key={user.id}
                    className="card mb-3"
                >
                    <div className="card-body">

                        <h5 className="card-title">
                            {user.email}
                        </h5>

                        <p className="card-text">
                            User ID: {user.id}
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
                    parentPath="/admin/users"
                    parentLabel="Back to Users"
                />

        </div>
    );
}

export default GetAllUsersByAdminPage;