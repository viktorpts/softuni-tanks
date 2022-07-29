import { html, nothing } from '../lib/lit-html.js';
import { register } from '../api/users.js';
import { bindForm } from '../util.js';


const regsiterTemplate = (onSubmit, error) => html`
<section class="narrow">
    <h1>Register</h1>

    <form @submit=${onSubmit}>
        ${error ? html`<p class="error-msg">${error}</p>` : nothing}
        <div class="form-align">
            <label class="form-row"><span>Username</span><input type="text" name="username"></label>
            <label class="form-row"><span>Password</span><input type="password" name="password"></label>
            <label class="form-row"><span>Repeat</span><input type="password" name="repass"></label>
        </div>
        <button class="action">Register</button>
        <p>Already have and account? <a href="/login">Sign in</a> here!</p>
    </form>
</section>`;


export function regsiterView(ctx) {
    ctx.render(regsiterTemplate(bindForm(onSubmit)));

    async function onSubmit({ username, password, repass }, form) {
        try {
            if (password != repass) {
                throw new Error('Passwords don\'t match!');
            }

            await register(username, password);
            form.reset();
            ctx.page.redirect('/');
        } catch (err) {
            ctx.render(regsiterTemplate(bindForm(onSubmit), err.message));
        }
    }
}