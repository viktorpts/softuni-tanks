import { html } from '../lib/lit-html.js';
import { until } from '../lib/directives/until.js';
import { getGameById } from '../api/games.js';


const detailsTemplate = (gamePromise) => html`
<section>
    ${until(gamePromise, html`
    <h1>Lobby</h1>
    <p>Loading details ...</p>`)}
</section>`;


export function detailsView(ctx) {
    ctx.render(detailsTemplate(loadGame(ctx)));
}

async function loadGame(ctx) {
    const gameId = ctx.params.id;
    const game = await getGameById(gameId);

    return html`
        <h1>${game.name}</h1>
        <p>Mode: ${game.mode}</p>`;
}