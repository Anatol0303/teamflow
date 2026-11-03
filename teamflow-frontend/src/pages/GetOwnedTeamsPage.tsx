import api from '../api/axios';
import { useEffect, useState } from 'react';
import NavigationButtons from '../components/NavigationButtons';

type Team = {
    teamId: number;
    name: string;
    createdAt: string;
};

function GetOwnedTeamsPage() {
    const [teamsData, setTeamsData] =
        useState<{
            data: Team[];
            meta: {
                total: number;
                page: number;
                limit: number;
            };
        } | null>(null)

    const [page, setPage] = useState(1);

    const totalPages = teamsData
        ? Math.ceil(
            teamsData.meta.total /
            teamsData.meta.limit
        )
        : 1;

    const handleGetMyTeams = async (currentPage = page) => {
        try {
            const response = await api.get(
                `/teams/my-owned?page=${currentPage}&limit=10`
            );

            setTeamsData(response.data);

        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {

        const fetchTeams = async () => {
            await handleGetMyTeams(page);
        };

        fetchTeams();

    }, []);
    return (
        <div>
            <h2 className="mb-4">Owned Teams</h2>

            {teamsData ? (

                teamsData.meta.total === 0 ? (

                    <div className="alert alert-info">

                        You do not have owned teams yet

                    </div>

                ) : (
                    <>
                <div className="mt-4">

                    {teamsData.data.map((team) => (
                        <div
                            key={team.teamId}
                            className="card mb-3"
                        >
                            <div className="card-body">

                                <h5 className="card-title">
                                    {team.name}
                                </h5>

                                <p className="card-text">
                                    Team ID: {team.teamId}
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
                    <div>
                        <div className="d-flex gap-2 mt-4 mb-3">
                            {(page > 1) &&
                                <button
                                    className="btn btn-secondary"
                                    onClick={() => {
                                        const previousPage = page - 1;

                                        setPage(previousPage);

                                        handleGetMyTeams(previousPage);
                                    }}
                                >
                                    Previous
                                </button>
                            }
                            <div className="align-self-center">
                                Page {page} of {totalPages}
                            </div>
                            {(page < totalPages) &&
                                <button
                                    className="btn btn-secondary"
                                    onClick={() => {
                                        const nextPage = page + 1;

                                        setPage(nextPage);

                                        handleGetMyTeams(nextPage);
                                    }}
                                >
                                    Next
                                </button>
                            }
                            <div className="me-auto"></div>

                        </div>

                    </div>
                </div>
                </>
                )
            ): null}
            <NavigationButtons
                parentPath="/teams"
                parentLabel="Back to Teams"
            />

        </div>
            );
}

export default GetOwnedTeamsPage;