import { login } from '../api/users.js';
import { html, nothing } from '../lib/lit-html.js';
import { bindForm } from '../util.js';


const loginTemplate = (onSubmit, error) => html`
<section class="narrow">
    <h1>Login</h1>
    <form @submit=${onSubmit}>
        ${error ? html`<p class="error-msg">${error}</p>` : nothing}
        <div class="form-align">
            <label class="form-row"><span>Username</span><input type="text" name="username"></label>
            <label class="form-row"><span>Password</span><input type="password" name="password"></label>
        </div>
        <button class="action">Login</button>
        <p>Don't have and account? <a href="/register">Sign up</a> now!</p>
    </form>
</section>`;


export function loginView(ctx) {
    ctx.render(loginTemplate(bindForm(onSubmit)));

    async function onSubmit({ username, password }, form) {
        try {
            await login(username, password);
            form.reset();
            ctx.page.redirect('/');
        } catch (err) {
            if (err.code == 101) {
                ctx.render(loginTemplate(bindForm(onSubmit), err.message));
            }
        }
    }
}