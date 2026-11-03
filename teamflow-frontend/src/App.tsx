import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import LoginPage from './pages/LoginPage';
import RegisterUserPage from './pages/RegisterUserPage.tsx';
import RegisterAdminPage from './pages/RegisterAdminPage.tsx';
import OfferRegisterAdminPage from './pages/OfferRegisterAdminPage.tsx';
import RootRoute from './components/RootRoute';
import ProtectedRoute from './components/ProtectedRoute';
import UserProtectedRoute from './components/UserProtectedRoute.tsx';
import AdminProtectedRoute
    from './components/AdminProtectedRoute';
import AdminMainMenuPage
    from './pages/AdminMainMenuPage.tsx';
import UserMainMenuPage from "./pages/UserMainMenuPage.tsx";
import TeamsPage from './pages/TeamsPage.tsx';
import GetMyTeamsPage from './pages/GetMyTeamsPage';
import CreateTeamPage from "./pages/CreateTeamPage.tsx";
import GetOwnedTeamsPage from "./pages/GetOwnedTeamsPage.tsx";
import GetManageableTeamsPage from "./pages/GetManageableTeamsPage.tsx";
import AddMemberPage from "./pages/AddMemberPage.tsx";
import RemoveMemberPage from './pages/RemoveMemberPage.tsx';
import UpdateMemberRolePage from './pages/UpdateMemberRolePage.tsx';
import TransferOwnershipPage from './pages/TransferOwnershipPage';
import TransferOwnershipAndLeavePage
    from './pages/TransferOwnershipAndLeavePage';
import GetTeamMembersPage from './pages/GetTeamMembersPage';
import MembersPage from './pages/MembersPage';
import OwnershipPage from './pages/OwnershipPage.tsx';
import GetMemberTeamsPage from './pages/GetMemberTeamsPage';
import RemoveTeamPage from './pages/RemoveTeamPage';
import AdminUsersPage from "./pages/AdminUsersPage.tsx";
import AdminTeamsPage from "./pages/AdminTeamsPage.tsx";
import AdminAdminsPage from "./pages/AdminAdminsPage.tsx";
import GetAllUsersByAdminPage from "./pages/GetAllUsersByAdminPage.tsx";
import GetAllAdminsByAdminPage from './pages/GetAllAdminsByAdminPage';
import GetAllTeamsByAdminPage from "./pages/GetAllTeamsByAdminPage.tsx";
import MakeAdminByAdminPage from './pages/MakeAdminByAdminPage';
import RemoveAdminByAdminPage from './pages/RemoveAdminByAdminPage';
import SelfRemoveAdminPage from './pages/SelfRemoveAdminPage';
import SelfRemoveUserPage from './pages/SelfRemoveUserPage';
import ChangeEmailPage from './pages/ChangeEmailPage';
import ChangePasswordPage from './pages/ChangePasswordPage';
import RenameTeamPage from './pages/RenameTeamPage';
import NotFoundPage from "./pages/NotFoundPage.tsx";

function App() {
    return (
        <>
            <Navbar />

            <div className="container mt-5">
                <Routes>

                    <Route path="/" element={<RootRoute />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/registerUser" element={<RegisterUserPage />} />
                    <Route path="/registerAdmin" element={<RegisterAdminPage />} />
                    <Route path="/offerRegisterAdmin" element={<OfferRegisterAdminPage />} />
                    <Route
                        path="/change-email"
                        element={
                            <ProtectedRoute>
                                <ChangeEmailPage />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/change-password"
                        element={
                            <ProtectedRoute>
                                <ChangePasswordPage />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/admin-main-menu"
                        element={
                            <AdminProtectedRoute>
                                <AdminMainMenuPage />
                            </AdminProtectedRoute>
                        }
                    />

                    <Route
                        path="/admin/users"
                        element={
                            <AdminProtectedRoute>
                                <AdminUsersPage />
                            </AdminProtectedRoute>
                        }
                    />

                    <Route
                        path="/admin/all-admins"
                        element={
                            <AdminProtectedRoute>
                                <GetAllAdminsByAdminPage />
                            </AdminProtectedRoute>
                        }
                    />

                    <Route
                        path="/admin/all-users"
                        element={
                            <AdminProtectedRoute>
                                <GetAllUsersByAdminPage />
                            </AdminProtectedRoute>
                        }
                    />

                    <Route
                        path="/admin/teams"
                        element={
                            <AdminProtectedRoute>
                                <AdminTeamsPage />
                            </AdminProtectedRoute>
                        }
                    />

                    <Route
                        path="/admin/admins"
                        element={
                            <AdminProtectedRoute>
                                <AdminAdminsPage />
                            </AdminProtectedRoute>
                        }
                    />

                    <Route
                        path="/admin/make-admin"
                        element={<MakeAdminByAdminPage />}
                    />

                    <Route
                        path="/admin/remove-admin"
                        element={<RemoveAdminByAdminPage />}
                    />

                    <Route
                        path="/admin/all-teams"
                        element={
                            <AdminProtectedRoute>
                                <GetAllTeamsByAdminPage />
                            </AdminProtectedRoute>
                        }
                    />

                    <Route
                        path="/admin/self-remove-admin"
                        element={
                            <AdminProtectedRoute>
                                <SelfRemoveAdminPage />
                            </AdminProtectedRoute>
                        }
                    />

                    <Route
                        path="/user-main-menu"
                        element={
                            <UserProtectedRoute>
                                <UserMainMenuPage />
                            </UserProtectedRoute>
                        }
                    />

                    <Route
                        path="/user/self-remove-user"
                        element={
                            <UserProtectedRoute>
                                <SelfRemoveUserPage />
                            </UserProtectedRoute>
                        }
                    />

                    <Route
                        path="/teams"
                        element={
                            <UserProtectedRoute>
                                <TeamsPage />
                            </UserProtectedRoute>
                        }
                    />
                    <Route
                        path="/teams/my"
                        element={
                            <UserProtectedRoute>
                                <GetMyTeamsPage />
                            </UserProtectedRoute>
                        }
                    />
                    <Route
                        path="/teams/my-owned"
                        element={
                            <UserProtectedRoute>
                                <GetOwnedTeamsPage />
                            </UserProtectedRoute>
                        }
                    />


                    <Route
                        path="/teams/create"
                        element={
                            <UserProtectedRoute>
                                <CreateTeamPage/>
                            </UserProtectedRoute>
                        }
                    />

                    <Route
                        path="/teams/remove-team"
                        element={
                            <UserProtectedRoute>
                                <RemoveTeamPage />
                            </UserProtectedRoute>
                        }
                    />

                    <Route
                        path="/teams/rename-team"
                        element={
                            <UserProtectedRoute>
                                <RenameTeamPage />
                            </UserProtectedRoute>
                        }
                    />

                    <Route
                        path="/teams/my-manageable"
                        element={
                            <UserProtectedRoute>
                                <GetManageableTeamsPage />
                            </UserProtectedRoute>
                        }
                    />

                    <Route
                        path="/teams/my-member"
                        element={
                            <UserProtectedRoute>
                                <GetMemberTeamsPage />
                            </UserProtectedRoute>
                        }
                    />

                    <Route
                        path="/teams/members"
                        element={
                            <UserProtectedRoute>
                                <GetTeamMembersPage />
                            </UserProtectedRoute>
                        }
                    />
                    <Route
                        path="/members"
                        element={
                            <UserProtectedRoute>
                                <MembersPage />
                            </UserProtectedRoute>
                        }
                    />
                    <Route
                        path="/teams/add-member"
                        element={
                            <UserProtectedRoute>
                                <AddMemberPage />
                            </UserProtectedRoute>
                        }
                    />
                    <Route
                        path="/teams/remove-member"
                        element={
                            <UserProtectedRoute>
                                <RemoveMemberPage />
                            </UserProtectedRoute>
                        }
                    />
                    <Route
                        path="/teams/update-member-role"
                        element={
                            <UserProtectedRoute>
                                <UpdateMemberRolePage />
                            </UserProtectedRoute>
                        }
                    />
                    <Route
                        path="/ownership"
                        element={
                            <UserProtectedRoute>
                                <OwnershipPage />
                            </UserProtectedRoute>
                        }
                    />
                    <Route
                        path="/teams/transfer-ownership"
                        element={
                            <UserProtectedRoute>
                                <TransferOwnershipPage />
                            </UserProtectedRoute>
                        }
                    />
                    <Route
                        path="/teams/transfer-ownership-and-leave"
                        element={
                            <UserProtectedRoute>
                                <TransferOwnershipAndLeavePage />
                            </UserProtectedRoute>
                        }
                    />
                    <Route
                        path="*"
                        element={<NotFoundPage />}
                    />
                </Routes>
            </div>
        </>
    );
}

export default App;