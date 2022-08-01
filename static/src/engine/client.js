/* globals io */


export async function connect(username, roomId, player) {
    return new Promise((resolve, reject) => {
        const socket = io.connect();

        const client = {
            position(player) {
                socket.emit('position', player);
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