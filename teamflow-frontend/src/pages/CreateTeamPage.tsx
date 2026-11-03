import { useState } from 'react';
import api from '../api/axios';
import axios from 'axios';
import NavigationButtons from '../components/NavigationButtons';

function CreateTeamPage() {

    const [teamName, setTeamName] = useState('');
    const [successMessage, setSuccessMessage] =
        useState('');
    const [errorMessage, setErrorMessage] =
        useState('');
    const handleCreateTeam = async () => {

        if (!teamName.trim()) {

            setErrorMessage(
                'Please input team name'
            );

            setSuccessMessage('');

            setTimeout(() => {

                setErrorMessage('');

            }, 5000);

            return;
        }

        try {

            await api.post(
                '/teams',
                {
                    name: teamName
                }
            );

            setSuccessMessage(
                `Team "${teamName}" created successfully`
            );

            setErrorMessage('');

            setTeamName('');

            setTimeout(() => {

                setSuccessMessage('');

            }, 3000);

        } catch (error) {

            console.error(error);

            if (axios.isAxiosError(error)) {

                setErrorMessage(
                    error.response?.data?.message ||
                    'Failed to create team'
                );

            } else {

                setErrorMessage(
                    'Failed to create team'
                );
            }

            setSuccessMessage('');

            setTimeout(() => {

                setErrorMessage('');

            }, 5000);
        }
    };

    return (
        <div>

            <div className="mb-3">

                <label className="form-label">
                    Team Name
                </label>

                <input
                    type="text"
                    className="form-control"
                    value={teamName}
                    onChange={(e) =>
                        setTeamName(e.target.value)
                    }
                />
            </div>
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
            <div className="d-flex gap-2 mt-4 mb-3">
            <button
                className="btn btn-primary"
                onClick={handleCreateTeam}
            >
                Create Team
            </button>

            <div className="me-auto"></div>

                <NavigationButtons
                    parentPath="/teams"
                    parentLabel="Back to Teams"
                />
            </div>
        </div>
    );
}

export default CreateTeamPage;