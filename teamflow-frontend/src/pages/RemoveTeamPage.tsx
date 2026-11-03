import { useEffect, useState } from 'react';
import api from '../api/axios';
import axios from 'axios';
import NavigationButtons from '../components/NavigationButtons';

type Team = {
    teamId: number;
    name: string;
};

function RemoveTeamPage() {

    const [teams, setTeams] =
        useState<Team[]>([]);

    const [selectedTeamId,
        setSelectedTeamId] =
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
                '/teams/my-owned-select-list'
            );

            setTeams(response.data);

            return response.data;

        } catch (error) {

            console.error(error);

            return [];
        }
    };

    const handleRemoveTeam = async () => {

        if (!selectedTeamId) {

            setErrorMessage(
                'Please select team'
            );

            setSuccessMessage('');

            setTimeout(() => {

                setErrorMessage('');

            }, 5000);

            return;
        }

        try {

            await api.delete(
                `/teams/${selectedTeamId}`
            );

            setSuccessMessage(
                'Team removed successfully'
            );

            setTimeout(() => {

                setSuccessMessage('');

            }, 5000);

            setErrorMessage('');

            await handleGetTeams();

            setSelectedTeamId('');

        } catch (error) {

            console.error(error);

            if (axios.isAxiosError(error)) {

                setErrorMessage(
                    error.response?.data?.message ||
                    'Failed to remove Team'
                );

            } else {

                setErrorMessage(
                    'Failed to remove Team'
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
                Remove Team
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

                    You can not remove team.

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
                            onChange={(e) =>
                                setSelectedTeamId(e.target.value)
                            }
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

                    <button
                        className="btn btn-danger"
                        onClick={handleRemoveTeam}
                    >
                        Remove Team
                    </button>
                </>
            )}

            <NavigationButtons
                parentPath="/teams"
                parentLabel="Back to Teams"
            />

        </div>
    );

}

export default RemoveTeamPage;