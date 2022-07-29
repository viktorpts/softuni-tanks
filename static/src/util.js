export function getUserData() {
    return JSON.parse(sessionStorage.getItem('userData'));
}

export function setUserData(data) {
    return sessionStorage.setItem('userData', JSON.stringify(data));
}

export function clearUserData() {
    return sessionStorage.removeItem('userData');
}

export function bindForm(callback) {
    return async function (event) {
        event.preventDefault();
        const formData = new FormData(event.target);
        const asObject = Object.fromEntries([...formData.entries()].map(([k, v]) => [k, v.trim()]));

        const inputs = [...event.target.querySelectorAll('input, button, textarea, select')];
        inputs.forEach(i => i.disabled = true);
        try {
            await callback(asObject, event.target);
        } catch (err) {
            console.log(err.message);
        } finally {
            inputs.forEach(i => i.disabled = false);
        }
    };
}