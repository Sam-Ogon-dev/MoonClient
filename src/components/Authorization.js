import React from "react";
import {Link} from "react-router-dom";
import {ADDRESS_NEWS_FEED, ADDRESS_REGISTRATION, API_AUTHORIZATION} from "../Properties";
import {isAuth} from "../Service";

export default function Authorization() {
    const [err, serErr] = React.useState(0);

    React.useEffect( () => {
        isAuth().then(r => {
            if(!r) { window.location.assign(ADDRESS_NEWS_FEED) }
        });
    }, []);

    function auth(form) {
        let data = {};
        for (const input of form) {
            if(!input.id) { continue }
            data[input.id] = input.value;
        }
        fetch(API_AUTHORIZATION, {
            method: "POST",
            credentials: 'include',
            headers: {
                'Content-Type': "application/json"
            },
            body: JSON.stringify(data)
        }).then(r => r.json())
            .then(r => {
                if(r.err === 0) { window.location.assign("/") } //OK
                if(r.err === 3) { serErr(3) } //WRONG EMAIL SYNTAX
                if(r.err === 4) { serErr(4) } //EMPTY FIELD IS EXIST
                if(r.err === 5) { serErr(5) } //ERR AUTH
            });
    }

    return (
        <div className="reg_auth">
            <form className="reg_window">
                <h1>Авторизация</h1>
                    {err === 5 ? <span className="error_notification">Ошибка входа! Проверьте правильность логина/пароля</span> : ""}
                    {err === 4 ? <span className="error_notification">Заполните все поля!</span> : ""}
                <input id="email" placeholder="Логин..." className={err === 5 || err === 4 || err === 3 ? "error" : ""}/>
                    {err === 3 ? <span className="error_notification">Некорректный email</span> : ""}
                <input id="password" type="password" placeholder="Повторите пароль..." className={err === 5 || err === 4 ? "error" : ""}/>
                <button className="button" onClick={ e => {
                    e.preventDefault();
                    e.persist();
                    auth(e.target.form.elements)
                }}>Войти</button>
                <Link to={ADDRESS_REGISTRATION}>Регистрация</Link>
            </form>
        </div>
    );
}