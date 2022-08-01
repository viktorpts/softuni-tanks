import { html } from '../lib/lit-html.js';
import { getGameById } from '../api/games.js';
import { start } from '../engine/game.js';


const canvasTemplate = (game) => html`
<section>
    <h1>${game.name}</h1>
    <canvas width="800" height="600"></canvas>
</section>`;


export async function canvasView(ctx) {
    const gameId = ctx.params.id;
    // const game = await getGameById(gameId);
    const game = { name: 'test' };
    ctx.render(canvasTemplate(game));

    start(ctx.user.username, game.objectId);
}