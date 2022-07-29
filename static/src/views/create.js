import { createGame } from '../api/games.js';
import { html, nothing } from '../lib/lit-html.js';
import { bindForm } from '../util.js';


const createTemplate = (onSubmit, error) => html`
<section class="narrow">
    <h1>Create Game Lobby</h1>
    <form @submit=${onSubmit}>
        ${error ? html`<p class="error-msg">${error}</p>` : nothing}
        <div class="form-align">
            <label class="form-row"><span>Lobby name</span><input type="text" name="name"></label>
            <label class="form-row"><span>Game mode</span><select name="mode">
                    <option value="deathmatch">Deathmatch</option>
                    <option value="team">Team Deathmatch</option>
                    <option value="last-man">Last Man Standing</option>
                </select></label>
        </div>
        <button class="action">Host Game</button>
    </form>
</section>`;

export function createView(ctx) {
    ctx.render(createTemplate(bindForm(onSubmit)));

    async function onSubmit({ name, mode }, form) {
        try {
            const result = await createGame({ name, mode });
            form.reset();
            ctx.page.redirect('/games/' + result.objectId);
        } catch (err) {
            ctx.render(createTemplate(bindForm(onSubmit), err.message));
        }
    }
}