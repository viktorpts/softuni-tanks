import * as api from './api.js';
import { clearUserData, setUserData } from '../util.js';


export async function login(username, password) {
    const result = await api.post('/login', { username, password });

    const userData = {
        username: result.username,
        id: result.objectId,
        sessionToken: result.sessionToken
    };
    setUserData(userData);

    return result;
}

export async function register(username, password) {
    const result = await api.post('/users', { username, password });

    const userData = {
        username: username,
        id: result.objectId,
        sessionToken: result.sessionToken
    };
    setUserData(userData);

    return result;
}

export function logout() {
    api.post('/logout');
    clearUserData();
}