import { useEffect, useState } from 'react';
import api from '../api/axios';
import axios from 'axios';
import NavigationButtons from '../components/NavigationButtons';

type Team = {
    teamId: number;
    name: string;
};

type Member = {
    userId: number;
    email: string;
    role: string;
};

function UpdateMemberRolePage() {

    const [teams, setTeams] =
        useState<Team[]>([]);

    const [members, setMembers] =
        useState<Member[]>([]);

    const [selectedTeamId,
        setSelectedTeamId] =
        useState('');

    const [selectedUserId,
        setSelectedUserId] =
        useState('');

    const [role, setRole] =
        useState('MEMBER');

    const [successMessage,
        setSuccessMessage] =
        useState('');

    const [errorMessage,
        setErrorMessage] =
        useState('');

    const handleGetTeams = async () => {

        try {

            const response = await api.get(
                '/teams/my-role-updatable-select-list'
            );

            setTeams(response.data);

        } catch (error) {

            console.error(error);
        }
    };

    const handleGetMembers = async (
        teamId: string
    ) => {

        try {

            const response = await api.get(
                `/teams/${teamId}/updatable-members`
            );

            setMembers(response.data);

        } catch (error) {

            console.error(error);
        }
    };

    const handleUpdateRole = async () => {

        if (
            !selectedTeamId ||
            !selectedUserId
        ) {

            setErrorMessage(
                'Please select team and member'
            );
            setTimeout(() => {

                setErrorMessage('');

            }, 5000);
            setSuccessMessage('');

            return;
        }

        try {

            await api.patch(
                `/teams/${selectedTeamId}/members/${selectedUserId}/role`,
                {
                    role
                }
            );

            setSuccessMessage(
                'Role updated successfully'
            );

            setTimeout(() => {

                setSuccessMessage('');

            }, 3000);


            setErrorMessage('');

            await handleGetMembers(
                selectedTeamId
            );

            setSelectedUserId('');

        } catch (error) {

            console.error(error);

            if (axios.isAxiosError(error)) {

                setErrorMessage(
                    error.response?.data?.message ||
                    'Failed to update role'
                );

            } else {

                setErrorMessage(
                    'Failed to update role'
                );
            }

            setTimeout(() => {

                setErrorMessage('');

            }, 5000);

            setSuccessMessage('');
        }
    };

    useEffect(() => {

        const fetchTeams = async () => {

            await handleGetTeams();
        };

        fetchTeams();

    }, []);

    return (
        <div>

            <h2 className="mb-4">
                Update Member Role
            </h2>

            {teams.length === 0 ? (

                <div className="alert alert-info">

                    You can not update any member role in any team

                </div>

            ) : (
                <>
            <div className="mb-3">

                <label className="form-label">
                    Select Team
                </label>

                <select
                    className="form-select"
                    value={selectedTeamId}
                    onChange={async (e) => {

                        const teamId =
                            e.target.value;

                        if (
                            teamId !==
                            selectedTeamId
                        ) {

                            setSelectedTeamId(
                                teamId
                            );

                            setSelectedUserId('');

                            if (teamId) {

                                await handleGetMembers(
                                    teamId
                                );
                            }
                        }
                    }}
                >

                    <option value="">
                        Choose team
                    </option>

                    {teams.map((team: Team) => (
                        <option
                            key={team.teamId}
                            value={team.teamId}
                        >
                            {team.name}
                            {' '}
                            (ID: {team.teamId})
                        </option>
                    ))}

                </select>

            </div>

            <div className="mb-3">

                <label className="form-label">
                    Select Member
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
                        Choose member
                    </option>

                    {members.map((member: Member) => (
                        <option
                            key={member.userId}
                            value={member.userId}
                        >
                            {member.email}
                            {' '}
                            ({member.role})
                        </option>
                    ))}

                </select>

            </div>

            <div className="mb-3">

                <label className="form-label">
                    Select New Role
                </label>

                <select
                    className="form-select"
                    value={role}
                    onChange={(e) =>
                        setRole(
                            e.target.value
                        )
                    }
                >

                    <option value="MEMBER">
                        MEMBER
                    </option>

                    <option value="MANAGER">
                        MANAGER
                    </option>

                </select>

            </div>

            <button
                className="btn btn-primary"
                onClick={handleUpdateRole}
            >
                Update Role
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
                <NavigationButtons
                    parentPath="/members"
                    parentLabel="Back to Members"
                />

        </div>
    );
}

export default UpdateMemberRolePage;