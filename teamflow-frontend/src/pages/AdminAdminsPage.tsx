import { useNavigate } from 'react-router-dom';
import useAdminAdminsActionsAvailability
    from '../hooks/useAdminAdminsActionsAvailability';

export default function AdminAdminsPage() {

    const {
        canOpenAllAdmins,
        canMakeAdmin,
        canRemoveAdmin,
    } = useAdminAdminsActionsAvailability();

    const navigate = useNavigate();

    return (
        <div>

            <h2 className="mb-2">
                Admins
            </h2>

            <p className="text-muted mb-4">
                Manage system Admins.
            </p>

            <div className="d-grid gap-3">

                <button
                    className="btn btn-primary"
                    onClick={() =>
                        navigate('/admin/all-admins')
                    }
                    disabled={!canOpenAllAdmins}
                >
                    Get All Admins
                </button>

                <button
                    className="btn btn-primary"
                    onClick={() =>
                        navigate('/admin/make-admin')
                    }
                    disabled={!canMakeAdmin}
                >
                    Make Admin
                </button>

                <button
                    className="btn btn-primary"
                    onClick={() =>
                        navigate('/admin/remove-admin')
                    }
                    disabled={!canRemoveAdmin}
                >
                    Remove Admin
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