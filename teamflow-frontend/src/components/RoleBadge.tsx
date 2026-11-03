type RoleBadgeProps = {
    role: 'OWNER' | 'MANAGER' | 'MEMBER';
};

function RoleBadge({
                       role,
                   }: RoleBadgeProps) {
    return (
        <span
            className={`badge ${
                role === 'OWNER'
                    ? 'bg-danger'
                    : role === 'MANAGER'
                        ? 'bg-warning text-dark'
                        : 'bg-success'
            }`}
        >
            {role}
        </span>
    );
}

export default RoleBadge;