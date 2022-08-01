import { connect } from './client.js';
import { createRenderer } from './engine.js';


const ACCELERATION = 600;
const MAX_SPEED = 300;
const TURN_RATE = 3;
const FRICTION = 1000;

export async function start(username, gameId) {
    const tanks = {};
    const controls = {};

    const player = {
        x: 100,
        y: 100,
        direction: 0,
        speed: 0
    };

    const engine = await createRenderer();
    engine.onKey = (key, pressed) => {
        controls[key] = pressed;
    };

    const connection = await connect(username, gameId, player);
    connection.onPlayerJoined = ({ username, player: playerData }) => {
        console.log('Player connected', username, player);
        tanks[username] = playerData;
    };
    connection.onPlayerLeft = (username) => {
        console.log('Player left', username);
        delete tanks[username];
    };
    connection.onPlayers = (playerData) => {
        Object.assign(tanks, playerData);
    };
    connection.onUpdate = (data) => {
        for (let user in data.players) {
            if (user != username && tanks[user]) {
                Object.assign(tanks[user], data.players[user]);
            }
        }
    };

    engine.registerMain(render, tick);

    function tick() {
        // Movement
        if (controls['ArrowUp']) {
            player.speed += ACCELERATION * engine.STEP_SIZE_S;
        } else if (controls['ArrowDown']) {
            player.speed -= ACCELERATION * engine.STEP_SIZE_S;
        } else if (player.speed > 0) {
            player.speed = Math.max(player.speed - FRICTION * engine.STEP_SIZE_S, 0);
        } else if (player.speed < 0) {
            player.speed = Math.min(player.speed + FRICTION * engine.STEP_SIZE_S, 0);
        }

        if (Math.abs(player.speed) > MAX_SPEED) {
            player.speed = MAX_SPEED * Math.sign(player.speed);
        }

        // Turning
        if (controls['ArrowLeft']) {
            player.direction -= TURN_RATE * engine.STEP_SIZE_S;
        } else if (controls['ArrowRight']) {
            player.direction += TURN_RATE * engine.STEP_SIZE_S;
        }

        if (player.speed != 0) {
            player.x += Math.cos(player.direction) * player.speed * engine.STEP_SIZE_S;
            player.y += Math.sin(player.direction) * player.speed * engine.STEP_SIZE_S;
        }

        connection.position(player);
    }

    function render() {
        engine.clear();
        engine.drawGrid();

        const enemies = Object.keys(tanks);
        engine.drawText(`${1 + enemies.length} player${enemies.length > 0 ? 's' : ''}`, 10, 50);
        engine.drawText(username, 10, 70, 'green');

        for (let i = 0; i < enemies.length; i++) {
            const user = enemies[i];
            const tank = tanks[user];
            engine.drawImage('tracks0.png', tank.x, tank.y, 2, tank.direction);
            engine.drawImage('tank-body.png', tank.x, tank.y, 2, tank.direction);

            engine.drawText(user, 10, 90 + (20 * i), 'red');
        }

        engine.drawImage('tracks0.png', player.x, player.y, 2, player.direction);
        engine.drawImage('tank-body.png', player.x, player.y, 2, player.direction);

        engine.drawText(player.speed, 10, 30);
    }
}