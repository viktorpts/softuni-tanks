import { getUserData } from '../util.js';


export function addSession() {
    return (ctx, next) => {
        ctx.user = getUserData();
        next();
    };
}