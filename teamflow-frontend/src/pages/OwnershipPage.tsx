import { useNavigate } from 'react-router-dom';
import useOwnershipActionsAvailability
    from '../hooks/useOwnershipActionsAvailability.ts';

function OwnershipPage() {
    const navigate = useNavigate();

    const {
        canTransferOwnership,
    } = useOwnershipActionsAvailability();

    return (
        <div>

            <h2 className="mb-2">
                Ownership
            </h2>

            <p className="text-muted mb-4">
                Manage team ownership.
            </p>

            <div className="d-grid gap-3">

                <button
                    className="btn btn-primary"
                    disabled={!canTransferOwnership}
                    onClick={() =>
                        navigate('/teams/transfer-ownership')
                    }
                >
                    Transfer Ownership
                </button>

                <button
                    className="btn btn-primary"
                    disabled={!canTransferOwnership}
                    onClick={() =>
                        navigate('/teams/transfer-ownership-and-leave')
                    }
                >
                    Transfer Ownership & Leave
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

export default OwnershipPage;