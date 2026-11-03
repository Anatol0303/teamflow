import { useEffect, useState } from 'react';
import api from '../api/axios';
import AdminNavigationButtons from '../components/AdminNavigationButtons';

type Team = {
    teamId: number;
    name: string;
    createdBy: number;
    createdAt: string;
};

function GetAllTeamsByAdminPage() {

    const [teams, setTeams] =
        useState<Team[]>([]);

    const handleGetTeams = async () => {

        try {

            const response =
                await api.get('/teams/admin-select-list');

            setTeams(response.data);

        } catch (error) {
            console.error(error);
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
                All Teams
            </h2>

            {teams.map((team: Team) => (
                <div
                    key={team.teamId}
                    className="card mb-3"
                >
                    <div className="card-body">

                        <h5 className="card-title">
                            {team.name}
                        </h5>

                        <p className="card-text">
                            Team ID:
                            {' '}
                            {team.teamId}
                        </p>

                        <p className="card-text">
                            Created By:
                            {' '}
                            {team.createdBy}
                        </p>

                        <p className="card-text">
                            Created:
                            {' '}
                            {new Date(
                                team.createdAt
                            ).toLocaleDateString()}
                        </p>

                    </div>
                </div>
            ))}

            <AdminNavigationButtons
                parentPath="/admin/teams"
                parentLabel="Back to Teams"
            />

        </div>
    );
}

export default GetAllTeamsByAdminPage;;