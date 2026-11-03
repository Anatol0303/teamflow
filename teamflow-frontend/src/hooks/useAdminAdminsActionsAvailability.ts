import { useEffect, useState } from 'react';
import api from '../api/axios';

function useAdminAdminsActionsAvailability() {

    const [canMakeAdmin, setCanMakeAdmin] =
        useState(false);

    const [canRemoveAdmin, setCanRemoveAdmin] =
        useState(false);

    const [canOpenAllAdmins, setCanOpenAllAdmins] =
        useState(false);

    useEffect(() => {

        const checkAllAdmins = async () => {

            try {
                const response = await api.get(
                    '/users/admin-select-list-admins'
                );

                setCanOpenAllAdmins(
                    response.data.length > 0
                );

            } catch (error) {
                console.error(error);
            }
        };

        const checkMakeAdmin = async () => {

            try {
                const response = await api.get(
                    '/users/make-admin-select-list'
                );

                setCanMakeAdmin(
                    response.data.length > 0
                );

            } catch (error) {
                console.error(error);
            }
        };

        const checkRemoveAdmin = async () => {

            try {
                const response = await api.get(
                    '/users/remove-admin-select-list'
                );

                setCanRemoveAdmin(
                    response.data.length > 0
                );

            } catch (error) {
                console.error(error);
            }
        };

        checkAllAdmins();
        checkMakeAdmin();
        checkRemoveAdmin();

    }, []);

    const hasAnyAdminAdminsAction =
        canOpenAllAdmins ||
        canMakeAdmin ||
        canRemoveAdmin;

    return {
        canOpenAllAdmins,
        canMakeAdmin,
        canRemoveAdmin,
        hasAnyAdminAdminsAction,
    };
}

export default useAdminAdminsActionsAvailability;