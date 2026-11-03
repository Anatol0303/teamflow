import { useEffect, useState } from 'react';
import api from '../api/axios';

function useMemberActionsAvailability() {

    const [canViewTeamMembers, setCanViewTeamMembers] =
        useState(false);

    const [canAddMember, setCanAddMember] =
        useState(false);

    const [canRemoveMember, setCanRemoveMember] =
        useState(false);

    const [canUpdateMemberRole, setCanUpdateMemberRole] =
        useState(false);

    useEffect(() => {

        const checkViewTeamMembers = async () => {

            try {

                const response = await api.get(
                    '/teams/my-select-list'
                );

                setCanViewTeamMembers(
                    response.data.length > 0
                );

            } catch (error) {

                console.error(error);
            }
        };

        const checkAddMember = async () => {

            try {

                const response = await api.get(
                    '/teams/my-manageable-select-list'
                );

                let canAdd = false;

                for (const team of response.data) {

                    const usersResponse = await api.get(
                        `/teams/${team.teamId}/addable-users`
                    );

                    if (usersResponse.data.length > 0) {
                        canAdd = true;
                        break;
                    }
                }

                setCanAddMember(canAdd);

            } catch (error) {

                console.error(error);
            }
        };

        const checkRemoveMember = async () => {

            try {

                const response = await api.get(
                    '/teams/my-removable-select-list'
                );

                setCanRemoveMember(
                    response.data.length > 0
                );

            } catch (error) {

                console.error(error);
            }
        };

        const checkUpdateMemberRole = async () => {

            try {

                const response = await api.get(
                    '/teams/my-role-updatable-select-list'
                );

                setCanUpdateMemberRole(
                    response.data.length > 0
                );

            } catch (error) {

                console.error(error);
            }
        };

        checkViewTeamMembers();
        checkAddMember();
        checkRemoveMember();
        checkUpdateMemberRole();

    }, []);

    const hasAnyMemberAction =
        canViewTeamMembers ||
        canAddMember ||
        canRemoveMember ||
        canUpdateMemberRole;

    return {
        canViewTeamMembers,
        canAddMember,
        canRemoveMember,
        canUpdateMemberRole,
        hasAnyMemberAction,
    };
}

export default useMemberActionsAvailability;