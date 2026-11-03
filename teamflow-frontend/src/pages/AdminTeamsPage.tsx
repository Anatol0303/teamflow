import { useNavigate } from 'react-router-dom';
import useAdminTeamsActionsAvailability
    from '../hooks/useAdminTeamsActionsAvailability';
export default function AdminTeamsPage() {

    const navigate = useNavigate();

    const {
        canOpenAdminTeams,
    } = useAdminTeamsActionsAvailability();

    return (
        <div>

            <h2 className="mb-2">
                Teams
            </h2>

            <p className="text-muted mb-4">
                Manage system teams.
            </p>

            <div className="d-grid gap-3">

                <button
                    className="btn btn-primary"
                    onClick={() =>
                        navigate('/admin/all-teams')
                    }
                    disabled={!canOpenAdminTeams}
                >
                    Get All Teams
                </button>

            </div>

            <div className="d-flex justify-content-end mt-4">

                <button
                    className="btn btn-outline-primary"
                    onClick={() =>
                        navigate('/admin-main-menu')
                    }
                >
                    Back to Admin Main Menu
                </button>

            </div>

        </div>
    );
}