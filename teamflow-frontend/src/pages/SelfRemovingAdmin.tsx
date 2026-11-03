import api from '../api/axios';

export const selfRemoveAdmin = async (): Promise<void> => {
    await api.delete('/users/self-remove-admin');

    localStorage.removeItem('token');

    window.dispatchEvent(
        new Event('authChanged')
    );
};