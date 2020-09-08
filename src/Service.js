import {API_IS_AUTH} from "./Properties";

export async function isAuth() {
    return fetch(API_IS_AUTH, {
        credentials: "include"
    })
        .then(r => r.json())
        .then(r => {
            return r.err;
        })
}