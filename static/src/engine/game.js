import { createRenderer } from './engine.js';

export async function start(username, gameId) {
    const engine = await createRenderer();

    engine.clear();
    engine.drawGrid();
    engine.drawImage('tracks0.png', 200, 200, 2, Math.PI / 4);
    engine.drawImage('tank-body.png', 200, 200, 2, Math.PI / 4);

    engine.drawCircle(100, 100, 10, 'black');
    engine.drawText('Hello there', 10, 30, 'blue');
}