import { useNavigate } from 'react-router-dom';

type AdminNavigationButtonsProps = {
    parentPath: string;
    parentLabel: string;
};

export default function AdminNavigationButtons({
                                                   parentPath,
                                                   parentLabel,
                                               }: AdminNavigationButtonsProps) {

    const navigate = useNavigate();

    return (
        <div className="d-flex justify-content-end gap-2 mt-3 mb-4">

        <button
            className="btn btn-outline-secondary"
    onClick={() => navigate(parentPath)}
>
← {parentLabel}
    </button>

    <button
    className="btn btn-outline-primary"
    onClick={() => navigate('/admin-main-menu')}
>
← Back to Admin Main Menu
    </button>

    </div>
);
}