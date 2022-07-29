import { getUserData } from '../util.js';


export function createPointer(className, objectId) {
    return {
        __type: 'Pointer',
        className,
        objectId
    };
}

export function addOwner(item) {
    const userData = getUserData();
    item.owner = createPointer('_User', userData.id);
}

/*
"owner": {
    "__type": "Pointer",
    "className": "_User",
    "objectId": "QtJJgIl5F0"
}
*/