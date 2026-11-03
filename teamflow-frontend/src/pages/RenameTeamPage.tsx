import { useEffect, useState } from 'react';
import api from '../api/axios';
import axios from 'axios';
import NavigationButtons from '../components/NavigationButtons';

type Team = {
    teamId: number;
    name: string;
};

function RenameTeamPage() {

    const [teams, setTeams] =
        useState<Team[]>([]);

    const [selectedTeamId,
        setSelectedTeamId] =
        useState('');

    const [selectedCurrentTeamName,
        setselectedCurrentTeamName] =
        useState('');

    const [newTeamName, setnewTeamName] = useState('');

    const [successMessage,
        setSuccessMessage] =
        useState('');

    const [errorMessage,
        setErrorMessage] =
        useState('');

    const handleGetTeams = async () => {

        try {

            const response = await api.get(
                '/teams/my-renameable-select-list'
            );

            setTeams(response.data);

            return response.data;

        } catch (error) {

            console.error(error);

            return [];
        }
    };

    const handleRenameTeam = async () => {

        if (!selectedTeamId) {

            setErrorMessage(
                'Please select team'
            );

            setSuccessMessage('');

            setselectedCurrentTeamName('');

            setnewTeamName('');

            setTimeout(() => {

                setErrorMessage('');

            }, 5000);

            return;
        }

        try {

            await api.patch(
                `/teams/${selectedTeamId}/rename`,
                {
                    name: newTeamName
                }
            );

            setSuccessMessage(
                'Team renamed successfully'
            );
            setselectedCurrentTeamName('');

            setnewTeamName('');


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
                    'Failed to rename Team'
                );

            } else {

                setErrorMessage(
                    'Failed to rename Team'
                );
            }
            setnewTeamName('');

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
                Rename Team
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

                    You can not rename team.

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
                            onChange={(e) => {
                                const teamId = e.target.value;

                                setSelectedTeamId(teamId);

                                const selectedTeam = teams.find(
                                    team => team.teamId === Number(teamId)
                                );

                                setselectedCurrentTeamName(
                                    selectedTeam?.name || ''
                                );
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

                        <div className="mt-4">
                            <label className="form-label">
                                New Team Name
                            </label>

                            <input
                                type="text"
                                className="form-control"
                                value={newTeamName}
                                onChange={(e) =>
                                    setnewTeamName(e.target.value)
                                }
                                placeholder={selectedCurrentTeamName}
                            />
                        </div>

                    </div>

                    <button
                        className="btn"
                        style={{
                            backgroundColor: '#90EE90',
                            borderColor: '#90EE90'
                        }}
                        onClick={handleRenameTeam}
                    >
                        Rename Team
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

export default RenameTeamPage;