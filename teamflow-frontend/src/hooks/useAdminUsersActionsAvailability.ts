function useAdminUsersActionsAvailability() {

    const canOpenAdminUsers = true;

    const hasAnyAdminUsersAction =
        canOpenAdminUsers;

    return {
        canOpenAdminUsers,
        hasAnyAdminUsersAction,
    };
}

export default useAdminUsersActionsAvailability;