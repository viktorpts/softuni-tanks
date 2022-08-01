const socketIO = require('socket.io');


const STEP_SIZE_S = 1 / 50;
const SHOT_SPEED = 600;
const WIDTH = 800;
const HEIGHT = 600;

const TANK_SIZE = 15;


function init(server) {
    /** @type {Object.<string, Room>} */
    const rooms = {};

    const io = socketIO(server);

    io.on('connection', socket => {
        let roomId = null;
        let username = null;

        console.log('New user connected');

        socket.on('join', ({ username: newUsername, roomId: newRoomId, player }) => {
            username = newUsername;
            roomId = newRoomId;
            // Leave all prior rooms
            if (socket.rooms.size > 1) {
                [...socket.rooms.values()].slice(1).forEach(r => {
                    socket.leave(r);
                    io.to(roomId).emit('playerLeft', username);
                    rooms[r].players.delete(username);
                });
            }
            console.log(`Player ${username} joined room ${roomId}`);

            socket.join(roomId);
            if (rooms[roomId] == undefined) {
                rooms[roomId] = {
                    projectiles: [],
                    players: new Map()
                };
            }
            socket.emit('players', [...rooms[roomId].players.entries()]);
            socket.to(roomId).emit('playerJoined', { username, player });
            rooms[roomId].players.set(username, player);
        });

        socket.on('position', playerData => {
            if (rooms[roomId]) {
                const player = rooms[roomId].players.get(username);
                if (player) {
                    Object.assign(player, playerData);
                }
            }
        });

        socket.on('fire', shot => {
            if (rooms[roomId]) {
                rooms[roomId].projectiles.push(shot);
            }
        });

        socket.on('disconnect', () => {
            console.log('Player leaving');
            if (username != null && roomId != null) {
                io.to(roomId).emit('playerLeft', username);
                rooms[roomId].players.delete(username);
            }
        });
    });

    setInterval(update, 20);

    function update() {
        Object.entries(rooms).forEach(([roomId, room]) => {
            const hits = [];

            for (let shot of room.projectiles) {
                shot.x += SHOT_SPEED * Math.cos(shot.direction) * STEP_SIZE_S;
                shot.y += SHOT_SPEED * Math.sin(shot.direction) * STEP_SIZE_S;
                if (shot.x > WIDTH || shot.x < 0 || shot.y > HEIGHT || shot.y < 0) {
                    shot.alive = false;
                }

                // Hit detection
                for (let [username, player] of [...room.players.entries()]) {
                    if (shot.origin != username
                        && shot.x >= player.x - TANK_SIZE && shot.x <= player.x + TANK_SIZE
                        && shot.y >= player.y - TANK_SIZE && shot.y <= player.y + TANK_SIZE) {
                        console.log(username, 'was hit by', shot.origin);
                        shot.alive = false;
                        hits.push([username, shot.origin]);
                    }
                }
            }
            room.projectiles = room.projectiles.filter(p => p.alive);

            io.to(roomId).emit('update', {
                projectiles: room.projectiles,
                players: [...room.players.entries()],
                hits
            });
        });
    }
}

module.exports = init;

/**
 * @typedef {Object} Room
 * @property {Array<Object>} projectiles
 * @property {Map<username, playerData>} players
 */