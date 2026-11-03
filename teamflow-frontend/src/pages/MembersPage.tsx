import { useNavigate } from 'react-router-dom';
import useMemberActionsAvailability
    from '../hooks/useMemberActionsAvailability';

function MembersPage() {
    const navigate = useNavigate();
    const {
        canViewTeamMembers,
        canAddMember,
        canRemoveMember,
        canUpdateMemberRole
    } = useMemberActionsAvailability();

    return (
        <div>

            <h2 className="mb-2">
                Members
            </h2>

            <p className="text-muted mb-4">
                Manage team members.
            </p>

            <div className="d-grid gap-3">

                <button
                    className="btn btn-primary"
                    disabled={!canViewTeamMembers}
                    onClick={() => navigate('/teams/members')}
                >
                    View Team Members
                </button>

                <button
                    className="btn btn-primary"
                    disabled={!canAddMember}
                    onClick={() => navigate('/teams/add-member')}
                >
                    Add Member
                </button>

                <button
                    className="btn btn-primary"
                    disabled={!canRemoveMember}
                    onClick={() => navigate('/teams/remove-member')}
                >
                    Remove Member
                </button>

                <button
                    className="btn btn-primary"
                    disabled={!canUpdateMemberRole}
                    onClick={() => navigate('/teams/update-member-role')}
                >
                    Update Member Role
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

export default MembersPage;