import { useEffect, useState } from 'react';
import api from '../api/axios';
import NavigationButtons from '../components/NavigationButtons';

type Team = {
    teamId: number;
    name: string;
};

type Member = {
    userId: number;
    email: string;
    role: string;
};

function GetTeamMembersPage() {

    const [teams, setTeams] =
        useState<Team[]>([]);

    const [members, setMembers] =
        useState<Member[]>([]);

    const [selectedTeamId,
        setSelectedTeamId] =
        useState('');

    const handleGetTeams = async () => {

        try {

            const response = await api.get(
                '/teams/my-select-list'
            );

            setTeams(response.data);

        } catch (error) {

            console.error(error);
        }
    };

    const handleGetMembers = async (
        teamId: string
    ) => {

        try {

            const response = await api.get(
                `/teams/${teamId}/members`
            );

            setMembers(response.data);

        } catch (error) {

            console.error(error);
        }
    };

    useEffect(() => {

        const fetchTeams = async () => {

            await handleGetTeams();
        };

        fetchTeams();

    }, []);

    return (

        <div>

            <h2 className="mb-4">

                Team Members

            </h2>

            {teams.length === 0 ? (

                <div className="alert alert-info">

                    You are not in any team yet

                </div>

                ) : (
                <>

            <div className="mb-3">

                <label className="form-label">
                    Select Team
                </label>

                <select
                    className="form-select"
                    value={selectedTeamId}
                    onChange={async (e) => {

                        const teamId =
                            e.target.value;

                        if (
                            teamId !==
                            selectedTeamId
                        ) {

                            setSelectedTeamId(
                                teamId
                            );

                            if (teamId) {

                                await handleGetMembers(
                                    teamId
                                );

                            } else {

                                setMembers([]);
                            }
                        }
                    }}
                >

                    <option value="">
                        Choose team
                    </option>

                    {teams.map((team: Team) => (

                        <option
                            key={team.teamId}
                            value={team.teamId}
                        >

                            {team.name}
                            {' '}
                            (ID: {team.teamId})

                        </option>

                    ))}

                </select>

            </div>

            {selectedTeamId &&
                members.length > 0 && (
                    <>

                    <h4 className="mt-4">

                        Members: {members.length}

                    </h4>

                <table className="table table-striped table-bordered mt-3">

                    <thead>

                    <tr>

                        <th>ID</th>

                        <th>Email</th>

                        <th>Role</th>

                    </tr>

                    </thead>

                    <tbody>

                    {members.map((member: Member) => (

                        <tr key={member.userId}>

                            <td>

                                {member.userId}

                            </td>

                            <td>

                                {member.email}

                            </td>

                            <td>

                                {member.role}

                            </td>

                        </tr>

                    ))}

                    </tbody>

                </table>
                    </>

            )}
                </>
)}
                <NavigationButtons
                    parentPath="/members"
                    parentLabel="Back to Members"
                />

        </div>

    );
}

export default GetTeamMembersPage;