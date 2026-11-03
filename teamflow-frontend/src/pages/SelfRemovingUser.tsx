import api from '../api/axios';

export const selfRemoveUser = async (): Promise<void> => {
    await api.delete('/users/self-remove-user');

    localStorage.removeItem('token');

    window.dispatchEvent(
        new Event('authChanged')
    );
};