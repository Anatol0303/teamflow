import { useNavigate } from 'react-router-dom';
type NavigationButtonsProps = {
    parentPath: string;
    parentLabel: string;
};

export default function NavigationButtons({
                                              parentPath,
                                              parentLabel,
                                          }: NavigationButtonsProps) {

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
                onClick={() => navigate('/user-main-menu')}
            >
                ← Back to Main Menu
            </button>
        </div>
    );
}