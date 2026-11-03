import { useEffect, useState } from 'react';
import api from '../api/axios';

function useAdminTeamsActionsAvailability() {

    const [canOpenAdminTeams,
        setCanOpenAdminTeams] =
        useState(false);

    useEffect(() => {

        const checkAdminTeams = async () => {

            try {

                const response = await api.get(
                    '/teams/admin-select-list'
                );

                setCanOpenAdminTeams(
                    response.data.length > 0
                );

            } catch (error) {

                console.error(error);
            }
        };

        checkAdminTeams();

    }, []);

    const hasAnyAdminTeamsAction =
        canOpenAdminTeams;

    return {
        canOpenAdminTeams,
        hasAnyAdminTeamsAction,
    };
}

export default useAdminTeamsActionsAvailability;