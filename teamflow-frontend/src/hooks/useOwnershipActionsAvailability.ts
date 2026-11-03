import { useEffect, useState } from 'react';
import api from '../api/axios';

export default function useOwnershipActionsAvailability() {
    const [canTransferOwnership, setCanTransferOwnership] =
        useState(false);

    useEffect(() => {
        const checkTransferOwnership = async () => {
            try {
                const response = await api.get(
                    '/teams/my-transferable-select-list'
                );

                setCanTransferOwnership(
                    response.data.length > 0
                );
            } catch (error) {
                console.error(error);
                setCanTransferOwnership(false);
            }
        };

        checkTransferOwnership();
    }, []);

    const hasAnyOwnershipAction =
        canTransferOwnership;

    return {
        canTransferOwnership,
        hasAnyOwnershipAction,
    };
}