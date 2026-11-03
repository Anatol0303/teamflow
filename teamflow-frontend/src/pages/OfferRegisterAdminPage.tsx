import { useNavigate } from 'react-router-dom';


function OfferRegisterAdminPage() {
    const navigate = useNavigate();

    return (
        <div className="row justify-content-center">

            <div className="alert alert-warning text-center">
                There are not ADMINs in the application.
            </div>

            <div className="alert alert-warning text-center">
                You can register only as an ADMIN.
            </div>

            <div className="alert alert-warning text-center">
                Do you agree to become the first ADMIN in application?
            </div>

            <div className="d-flex justify-content-center gap-3">
                <button
                    type="button"
                    className="btn btn-success"
                    onClick={() => navigate('/registerAdmin')}
                >
                    Yes
                </button>
                <button
                    type="button"
                    className="btn btn-danger"
                    onClick={() => navigate('/')}
                >
                    No
                </button>
            </div>
        </div>
    )
}

export default OfferRegisterAdminPage;