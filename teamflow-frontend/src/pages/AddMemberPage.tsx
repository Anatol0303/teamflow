import { useEffect, useState } from 'react';
import api from '../api/axios';
import axios from 'axios';
import NavigationButtons from '../components/NavigationButtons';

type Team = {
    teamId: number;
    name: string;
};

type User = {
    userId: number;
    email: string;
};


function AddMemberPage() {

    const [teams, setTeams] =
        useState<Team[]>([]);

    const [users, setUsers] =
        useState<User[]>([]);

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
                '/teams/my-manageable-select-list'
            );

            const filteredTeams = [];

            for (const team of response.data) {

                const usersResponse = await api.get(
                    `/teams/${team.teamId}/addable-users`
                );

                if (usersResponse.data.length > 0) {
                    filteredTeams.push(team);
                }
            }

            setTeams(filteredTeams);

        } catch (error) {
            console.error(error);
        }
    };

    const handleGetMembers = async (
        teamId: string
    ) => {

        try {

            const response = await api.get(
                `/teams/${teamId}/addable-users`
            );

            setUsers(response.data);

        } catch (error) {
            console.error(error);
        }
    };

    const handleAddMember = async () => {

        if (!selectedTeamId || !selectedUserId) {

            setErrorMessage(
                'Please select team and user'
            );

            setSuccessMessage('');

            setTimeout(() => {

                setErrorMessage('');

            }, 5000);

            return;
        }

        try {

            await api.post(
                `/teams/${selectedTeamId}/members`,
                {
                    userId: Number(selectedUserId),
                    role
                }
            );

            await handleGetTeams();

            await handleGetMembers(selectedTeamId);

            setSelectedUserId('');

            setSuccessMessage(
                'Member added successfully'
            );

            setTimeout(() => {

                setSuccessMessage('');

            }, 3000);

            setErrorMessage('');

        } catch (error) {

            console.error(error);

            if (axios.isAxiosError(error)) {

                setErrorMessage(
                    error.response?.data?.message ||
                    'Failed to add member'
                );

            } else {

                setErrorMessage(
                    'Failed to add member'
                );
            }

            setTimeout(() => {

                setErrorMessage('');

            }, 5000);

            setSuccessMessage('');
        }
    };


    useEffect(() => {

        const fetchData = async () => {

            await handleGetTeams();
        };

        fetchData();

    }, []);


return (
    <div>

        <h2 className="mb-4">
            Add Member
        </h2>

        {successMessage && (
            <div className="alert alert-success mb-3">
                {successMessage}
            </div>
        )}

        {errorMessage && (
            <div className="alert alert-danger mb-3">
                {errorMessage}
            </div>
        )}

        {teams.length === 0 ? (

            <div className="alert alert-warning">

                You cannot add members to any team

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

                            const teamId = e.target.value;

                            setSelectedTeamId(teamId);

                            setSelectedUserId('');

                            if (teamId) {

                                await handleGetMembers(
                                    teamId
                                );

                            } else {

                                setUsers([]);

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
                        Select User
                    </label>

                    <select
                        className="form-select"
                        value={selectedUserId}
                        onChange={(e) =>
                            setSelectedUserId(e.target.value)
                        }
                    >

                        <option value="">
                            Choose user
                        </option>

                        {users.map((user: User) => (
                            <option
                                key={user.userId}
                                value={user.userId}
                            >
                                {user.email}
                            </option>
                        ))}

                    </select>

                </div>

                <div className="mb-3">

                    <label className="form-label">
                        Role
                    </label>

                    <select
                        className="form-select"
                        value={role}
                        onChange={(e) =>
                            setRole(e.target.value)
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
                    onClick={handleAddMember}
                >
                    Add Member
                </button>

            </>
        )}

            <NavigationButtons
                parentPath="/members"
                parentLabel="Back to Members"
            />

    </div>
);
}

export default AddMemberPage;