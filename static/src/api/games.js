import * as api from './api.js';
import { addOwner } from './data.js';


export async function getAllGames() {
    return api.get('/Games');
}

export async function getGameById(id) {
    return api.get('/Games/' + id);
}

export async function createGame(game) {
    addOwner(game);
    return api.post('/Games', game);
}