import { useNavigate } from 'react-router-dom';
import useAdminUsersActionsAvailability
    from '../hooks/useAdminUsersActionsAvailability';
export default function AdminUsersPage() {

    const {
        canOpenAdminUsers,
    } = useAdminUsersActionsAvailability();

    const navigate = useNavigate();

    return (
        <div>

            <h2 className="mb-2">
                Users
            </h2>

            <p className="text-muted mb-4">
                Manage system users.
            </p>

            <div className="d-grid gap-3">

                <button
                    className="btn btn-primary"
                    onClick={() =>
                        navigate('/admin/all-users')
                    }
                    disabled={!canOpenAdminUsers}
                >
                    Get All Users
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