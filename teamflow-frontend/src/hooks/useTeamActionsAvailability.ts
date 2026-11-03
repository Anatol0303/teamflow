import { useEffect, useState } from 'react';
import api from '../api/axios';

function useTeamActionsAvailability() {

    const [hasTeams, setHasTeams] =
        useState(false);

    const [hasOwnedTeams, setHasOwnedTeams] =
        useState(false);

    const [hasManagedTeams, setHasManagedTeams] =
        useState(false);

    const [hasMemberTeams, setHasMemberTeams] =
        useState(false);

    const [hasRemovableTeams, setHasRemovableTeams] =
        useState(false);

    const [hasRenameableTeams, setHasRenameableTeams] =
        useState(false);

    const canCreateTeam = true;

    useEffect(() => {

        const checkTeams = async () => {

            try {

                const response = await api.get(
                    '/teams/my-select-list'
                );

                setHasTeams(
                    response.data.length > 0
                );

            } catch (error) {

                console.error(error);
            }
        };

        const checkOwnedTeams = async () => {

            try {

                const response = await api.get(
                    '/teams/my-owned-select-list'
                );

                setHasOwnedTeams(
                    response.data.length > 0
                );

            } catch (error) {

                console.error(error);
            }
        };

        const checkRemovableTeams = async () => {

            try {

                const response = await api.get(
                    '/teams/my-owned-select-list'
                );

                setHasRemovableTeams(
                    response.data.length > 0
                );

            } catch (error) {

                console.error(error);
            }
        };

        const checkRenameableTeams = async () => {

            try {

                const response = await api.get(
                    '/teams/my-renameable-select-list'
                );

                setHasRenameableTeams(
                    response.data.length > 0
                );

            } catch (error) {

                console.error(error);
            }
        };


        const checkManagedTeams = async () => {

            try {

                const response = await api.get(
                    '/teams/my-manageable?page=1&limit=1'
                );

                setHasManagedTeams(
                    response.data.meta.total > 0
                );

            } catch (error) {

                console.error(error);
            }
        };

        const checkMemberTeams = async () => {

            try {

                const response = await api.get(
                    '/teams/my-member?page=1&limit=1'
                );

                setHasMemberTeams(
                    response.data.meta.total > 0
                );

            } catch (error) {

                console.error(error);
            }
        };

        checkTeams();
        checkOwnedTeams();
        checkManagedTeams();
        checkMemberTeams();
        checkRemovableTeams();
        checkRenameableTeams();

    }, []);

    const hasAnyTeamAction =
        canCreateTeam ||
        hasTeams ||
        hasOwnedTeams ||
        hasManagedTeams ||
        hasMemberTeams||
        hasRemovableTeams ||
        hasRenameableTeams

    return {
        hasTeams,
        hasOwnedTeams,
        hasManagedTeams,
        hasMemberTeams,
        canCreateTeam,
        hasRemovableTeams,
        hasRenameableTeams,
        hasAnyTeamAction,
    };
}

export default useTeamActionsAvailability;