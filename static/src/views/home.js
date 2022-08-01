import { html } from '../lib/lit-html.js';


const homeTemplate = () => html`
<section>
    <h1>Home page</h1>
    <main>
        <p>Welcome to our site!</p>
        <h2>Recent changes:</h2>
        <ul>
            <li>Fixed ghosting issue on reconnect</li>
            <li>Improved layout</li>
        </ul>
    </main>
</section>`;


export function homeView(ctx) {
    ctx.render(homeTemplate());
}