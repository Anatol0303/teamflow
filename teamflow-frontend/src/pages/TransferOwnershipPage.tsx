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

function TransferOwnershipPage() {

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

    const [successMessage,
        setSuccessMessage] =
        useState('');

    const [errorMessage,
        setErrorMessage] =
        useState('');

    const handleGetTeams = async () => {

        try {

            const response = await api.get(
                '/teams/my-transferable-select-list'
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
                `/teams/${teamId}/transferable-members`
            );

            setMembers(response.data);

        } catch (error) {

            console.error(error);
        }
    };

    const handleTransferOwnership = async () => {

        if (
            !selectedTeamId ||
            !selectedUserId
        ) {

            setErrorMessage(
                'Please select team and new owner'
            );

            setSuccessMessage('');

            setTimeout(() => {

                setErrorMessage('');

            }, 5000);

            return;
        }

        try {

            await api.patch(
                `/teams/${selectedTeamId}/transfer-ownership/${selectedUserId}`
            );

            setSuccessMessage(
                'Ownership transferred successfully'
            );

            setErrorMessage('');

            setTimeout(() => {

                setSuccessMessage('');

            }, 3000);

            await handleGetTeams();

            setMembers([]);

            setSelectedTeamId('');

            setSelectedUserId('');

        } catch (error) {

            console.error(error);

            if (axios.isAxiosError(error)) {

                setErrorMessage(
                    error.response?.data?.message ||
                    'Failed to transfer ownership'
                );

            } else {

                setErrorMessage(
                    'Failed to transfer ownership'
                );
            }

            setSuccessMessage('');

            setTimeout(() => {

                setErrorMessage('');

            }, 5000);
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
            Transfer Ownership
    </h2>

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


            {teams.length === 0 ? (

        <div className="alert alert-warning">

            You cannot transfer ownership in any team

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
        Select New Owner
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

        {members.map(
            (member: Member) => (
                <option
                    key={member.userId}
                    value={member.userId}
                >
                    {member.email} ({member.role})
                </option>
            )
        )}
        </select>

        </div>

        <button
        className="btn btn-warning"
        onClick={
                handleTransferOwnership
            }
            >
            Transfer Ownership
    </button>

        </>

    )}

        <NavigationButtons
            parentPath="/ownership"
            parentLabel="Back to Ownership"
        />

        </div>
    );
}

export default TransferOwnershipPage;