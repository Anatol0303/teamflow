import { useNavigate } from 'react-router-dom';
import useTeamActionsAvailability
    from '../hooks/useTeamActionsAvailability';
function TeamsPage() {

    const navigate = useNavigate();
    const {
        hasTeams,
        hasOwnedTeams,
        hasManagedTeams,
        hasMemberTeams,
        canCreateTeam,
        hasRemovableTeams,
        hasRenameableTeams
    } = useTeamActionsAvailability();

    return (
        <div>

            <h2 className="mb-2">
                Teams
            </h2>

            <p className="text-muted mb-4">
                Manage your teams.
            </p>

            <div className="d-grid gap-3">

                <button
                    className="btn btn-primary"
                    onClick={() => navigate('/teams/my')}
                    disabled={!hasTeams}
                >
                    Get My Teams
                </button>

                <button
                    className="btn btn-primary"
                    onClick={() => navigate('/teams/my-owned')}
                    disabled={!hasOwnedTeams}
                >
                    Get My Owned Teams
                </button>

                <button
                    className="btn btn-primary"
                    onClick={() => navigate('/teams/my-manageable')}
                    disabled={!hasManagedTeams}
                >
                    Get My Manageable Teams
                </button>

                <button
                    className="btn btn-primary"
                    onClick={() => navigate('/teams/my-member')}
                    disabled={!hasMemberTeams}
                >
                    Get My Member Teams
                </button>

                <button
                    className="btn btn-primary"
                    onClick={() => navigate('/teams/create')}
                    disabled={!canCreateTeam}
                >
                    Create Team
                </button>

                <button
                    className="btn btn-primary"
                    onClick={() => navigate('/teams/remove-team')}
                    disabled={!hasRemovableTeams}
                >
                    Remove Team
                </button>

                <button
                    className="btn btn-primary"
                    onClick={() => navigate('/teams/rename-team')}
                    disabled={!hasRenameableTeams}
                >
                    Rename Team
                </button>

            </div>
            <div className="d-flex justify-content-end mt-4">

                <button
                    className="btn btn-outline-primary"
                    onClick={() => navigate('/user-main-menu')}
                >
                    Back to Main Menu
                </button>

            </div>

        </div>
    );
}

export default TeamsPage;