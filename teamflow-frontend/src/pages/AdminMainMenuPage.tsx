import { useNavigate } from "react-router-dom";
import useAdminUsersActionsAvailability
    from '../hooks/useAdminUsersActionsAvailability';
import useAdminTeamsActionsAvailability
    from '../hooks/useAdminTeamsActionsAvailability';
import useAdminAdminsActionsAvailability
    from '../hooks/useAdminAdminsActionsAvailability';

export default function AdminMainMenuPage() {

    const navigate = useNavigate();

    const {
        hasAnyAdminUsersAction,
    } = useAdminUsersActionsAvailability();

    const {
        hasAnyAdminTeamsAction,
    } = useAdminTeamsActionsAvailability();

    const {
        hasAnyAdminAdminsAction
    } = useAdminAdminsActionsAvailability();

    return (
        <div>
            <h1>Admin Main Menu</h1>
            <p>System administration.</p>

            <hr/>

            <div className="row">
                <div className="col-md-4 mb-4">
                    <div className="card h-100">
                        <div className="card-body">
                            <h4 className="card-title">👥 Users</h4>

                            <p className="card-text">
                                Manage system users
                            </p>

                            <button
                                className="btn btn-primary"
                                onClick={() => navigate('/admin/users')}
                                disabled={!hasAnyAdminUsersAction}
                            >
                                Open
                            </button>
                        </div>
                    </div>
                </div>
                <div className="col-md-4 mb-4">
                    <div className="card h-100">
                        <div className="card-body">
                            <h4 className="card-title">📁 Teams</h4>

                            <p className="card-text">
                                Manage system teams
                            </p>

                            <button
                                className="btn btn-primary"
                                onClick={() => navigate('/admin/teams')}
                                disabled={!hasAnyAdminTeamsAction}
                            >
                                Open
                            </button>
                        </div>
                    </div>
                </div>

                <div className="col-md-4 mb-4">
                    <div className="card h-100">
                        <div className="card-body">
                            <h4 className="card-title">👤 Admins</h4>

                            <p className="card-text">
                                Manage system Admins
                            </p>

                            <button
                                className="btn btn-primary"
                                onClick={() =>
                                    navigate('/admin/admins')
                                }
                                disabled={!hasAnyAdminAdminsAction}
                            >
                                Open
                            </button>
                        </div>
                    </div>
                </div>

            </div>
            <div
                className="d-flex justify-content-between"
                style={{ marginTop: '170px' }}
            >
                <div className="d-flex gap-2">

                    <button
                        className="btn btn-success"
                        onClick={() =>
                            navigate('/change-email')
                        }
                    >
                        Change Email
                    </button>

                    <button
                        className="btn"
                        style={{
                            backgroundColor: '#6f4e37',
                            color: 'white'
                        }}
                        onClick={() =>
                            navigate('/change-password')
                        }
                    >
                        Change Password
                    </button>

                </div>

                <button
                    className="btn btn-warning"
                    onClick={() =>
                        navigate('/admin/self-remove-admin')
                    }
                >
                    Remove own account
                </button>

            </div>
        </div>
    );
}