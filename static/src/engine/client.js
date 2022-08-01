/* globals io */


let socket = null;

export function closeSocket() {
    if (socket != null) {
        socket.disconnect();
    }
}

export async function connect(username, roomId, player) {
    return new Promise((resolve, reject) => {
        closeSocket();
        socket = io.connect();

        const client = {
            position(player) {
                socket.emit('position', player);
            },
            fire(shot) {
                socket.emit('fire', shot);
            },
            onPlayerJoined() { },
            onPlayerLeft() { },
            onPlayers() { },
            onUpdate() { }
        };

        socket.on('connect', () => {
            console.log('connected');
            resolve(client);

            socket.emit('join', {
                username,
                roomId,
                player
            });
        });

        socket.on('playerJoined', data => client.onPlayerJoined(data));
        socket.on('playerLeft', data => client.onPlayerLeft(data));
        socket.on('players', data => client.onPlayers(Object.fromEntries(data)));
        socket.on('update', data => {
            data.players = Object.fromEntries(data.players);
            client.onUpdate(data);
        });
    });
}