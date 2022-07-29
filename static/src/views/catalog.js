import { html } from '../lib/lit-html.js';
import { repeat } from '../lib/directives/repeat.js';
import { until } from '../lib/directives/until.js';
import { getAllGames } from '../api/games.js';


const catalogTemplate = (gamesPromise) => html`
<section>
    <h1>Game Lobbies</h1>
    ${until(gamesPromise, 'Loading games...')}
</section>`;

const lobbyCard = game => html`
<li>${game.name}</li>`;

const gamesList = (games) => games.length == 0
    ? html`<p>No lobbies hosted yet. <a href="/create">Be the first!</a></p>`
    : html`
<ul>
    ${repeat(games, g => g.objectId, lobbyCard)}
</ul>`;

export async function catalogView(ctx) {
    ctx.render(catalogTemplate(loadGames()));
}

async function loadGames() {
    const games = await getAllGames();
    return gamesList(games.results);
}