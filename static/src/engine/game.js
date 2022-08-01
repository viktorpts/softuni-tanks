import { closeSocket, connect } from './client.js';
import { closeEngine, createRenderer } from './engine.js';


const ACCELERATION = 600;
const MAX_SPEED = 300;
const TURN_RATE = 3;
const FRICTION = 1000;
const TANK_SIZE = 15;
const DASH_SPEED = 600;
const DASH_TIME = 0.25;
const DASH_COOLDOWN = 5;

export function closeGame() {
    closeSocket();
    closeEngine();
}

export async function start(username, gameId) {
    const controls = {};

    const player = {
        x: 100,
        y: 100,
        direction: 0,
        speed: 0,
        cooldown: 0,
        dash: 0
    };

    const tanks = {
        [username]: player
    };
    let hits = [];
    let shots = [];

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

        shots = data.projectiles;
        const newHits = data.hits
            .map(h => h[0])
            .map(h => tanks[h])
            .map(h => ({
                x: h.x,
                y: h.y,
                alive: true,
                frame: 0
            }));
        hits.push(...newHits);
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

        if (Math.abs(player.speed) > MAX_SPEED && player.dash < DASH_COOLDOWN - DASH_TIME) {
            player.speed = MAX_SPEED * Math.sign(player.speed);
        }

        // Turning
        if (controls['ArrowLeft']) {
            player.direction -= TURN_RATE * engine.STEP_SIZE_S;
        } else if (controls['ArrowRight']) {
            player.direction += TURN_RATE * engine.STEP_SIZE_S;
        }

        // Shooting
        if (controls['Space'] && player.cooldown == 0) {
            player.cooldown = 1;
            const shot = {
                origin: username,
                x: player.x,
                y: player.y,
                direction: player.direction,
                alive: true
            };
            connection.fire(shot);
        } else if (player.cooldown > 0) {
            player.cooldown = Math.max(player.cooldown - engine.STEP_SIZE_S, 0);
        }

        // Dashing
        if (controls['ShiftLeft'] && player.dash == 0) {
            player.dash = DASH_COOLDOWN;
            player.speed = DASH_SPEED;
        } else if (player.dash > 0) {
            player.dash = Math.max(player.dash - engine.STEP_SIZE_S, 0);
        }

        if (player.speed != 0) {
            player.x += Math.cos(player.direction) * player.speed * engine.STEP_SIZE_S;
            player.y += Math.sin(player.direction) * player.speed * engine.STEP_SIZE_S;
        }

        if (player.x < TANK_SIZE) {
            player.x = TANK_SIZE;
        } else if (player.x > engine.WIDTH - TANK_SIZE) {
            player.x = engine.WIDTH - TANK_SIZE;
        }
        if (player.y < TANK_SIZE) {
            player.y = TANK_SIZE;
        } else if (player.y > engine.HEIGHT - TANK_SIZE) {
            player.y = engine.HEIGHT - TANK_SIZE;
        }

        connection.position(player);
    }

    function render() {
        engine.clear();
        engine.drawGrid();

        const players = Object.keys(tanks);

        for (let i = 0; i < players.length; i++) {
            const user = players[i];
            const tank = tanks[user];
            engine.drawImage('tracks0.png', tank.x, tank.y, 2, tank.direction);
            engine.drawImage('tank-body.png', tank.x, tank.y, 2, tank.direction);

            engine.drawText(user, 10, 110 + (20 * i), 'red');
        }

        for (let shot of shots) {
            engine.drawCircle(shot.x, shot.y, 5, 'black');
        }

        for (let hit of hits) {
            engine.drawCircle(hit.x, hit.y, hit.frame * 2, 'red');
            engine.drawCircle(hit.x, hit.y, hit.frame * 1, 'orange');
            engine.drawCircle(hit.x, hit.y, hit.frame * 0.5, 'white');

            hit.frame++;
            if (hit.frame >= 15) {
                hit.alive = false;
            }
        }
        hits = hits.filter(h => h.alive);

        engine.drawText(`${players.length} player${players.length > 1 ? 's' : ''}`, 10, 90);
        for (let i = 0; i < players.length; i++) {
            const user = players[i];
            engine.drawText(user, 10, 110 + (20 * i), user == username ? 'green' : 'red');
        }

        engine.drawText('Speed: ' + player.speed, 10, 30);
        engine.drawText('Dash: ' + player.dash.toFixed(1), 10, 50);
    }
}