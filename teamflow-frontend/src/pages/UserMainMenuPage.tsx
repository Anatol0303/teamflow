import { useNavigate } from "react-router-dom";
import useTeamActionsAvailability
    from '../hooks/useTeamActionsAvailability';
import useMemberActionsAvailability
    from '../hooks/useMemberActionsAvailability';
import useOwnershipActionsAvailability
    from '../hooks/useOwnershipActionsAvailability.ts';

export default function UserMainMenuPage() {
    const navigate = useNavigate();

    const {
        hasAnyTeamAction,
    } = useTeamActionsAvailability();

    const {
        hasAnyMemberAction,
    } = useMemberActionsAvailability();

    const {
        hasAnyOwnershipAction,
    } = useOwnershipActionsAvailability();

    return (
        <div>
            <h1>Main Menu</h1>
            <p>Choose what you want to manage.</p>

            <hr/>

            <div className="row">
                <div className="col-md-4 mb-4">
                    <div className="card h-100">
                        <div className="card-body">
                            <h4 className="card-title">📁 Teams</h4>

                            <p className="card-text">
                                Manage your teams
                            </p>

                            <button
                                className="btn btn-primary"
                                onClick={() => navigate('/teams')}
                                disabled={!hasAnyTeamAction}
                            >
                                Open
                            </button>
                        </div>
                    </div>
                </div>
                <div className="col-md-4 mb-4">
                    <div className="card h-100">
                        <div className="card-body">
                            <h4 className="card-title">👥 Members</h4>

                            <p className="card-text">
                                Manage team members
                            </p>

                            <button
                                className="btn btn-primary"
                                onClick={() => navigate('/members')}
                                disabled={!hasAnyMemberAction}
                            >
                                Open
                            </button>
                        </div>
                    </div>
                </div>
                <div className="col-md-4 mb-4">
                    <div className="card h-100">
                        <div className="card-body">
                            <h4 className="card-title">🔑 Ownership</h4>

                            <p className="card-text">
                                Manage team ownership
                            </p>

                            <button
                                className="btn btn-primary"
                                onClick={() => navigate('/ownership')}
                                disabled={!hasAnyOwnershipAction}
                            >
                                Open
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div
                className="d-flex justify-content-between"
                style={{marginTop: '130px'}}
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
                        navigate('/user/self-remove-user')
                    }
                >
                    Remove own account
                </button>

            </div>
        </div>
    );
}