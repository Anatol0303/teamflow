import { useEffect, useState } from 'react';
import api from '../api/axios';

function useAdminUsersActionsAvailability() {

    const [canOpenAdminUsers,
        setCanOpenAdminUsers] =
        useState(false);

    useEffect(() => {

        const checkAdminUsers = async () => {

            try {

                const response = await api.get(
                    '/users/admin-select-list'
                );

                setCanOpenAdminUsers(
                    response.data.length > 0
                );

            } catch (error) {

                console.error(error);
            }
        };

        checkAdminUsers();

    }, []);

    const hasAnyAdminUsersAction =
        canOpenAdminUsers;

    return {
        canOpenAdminUsers,
        hasAnyAdminUsersAction,
    };
}

export default useAdminUsersActionsAvailability;