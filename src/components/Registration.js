import React from "react";
import {Link} from "react-router-dom";
import {isAuth} from "../Service";
import {ADDRESS_AUTHORIZATION, ADDRESS_NEWS_FEED, API_REGISTRATION} from "../Properties";

export default function Registration() {
    const [err, serErr] = React.useState(0);

    React.useEffect(() => {
        isAuth().then(r => {
            if(!r) { window.location.assign(ADDRESS_NEWS_FEED) }
        })
    }, []);

    function reg(form) {
        let data = {};
        for (const input of form) {
            if(!input.id) { continue }
            data[input.id] = input.value;
        }
        fetch(API_REGISTRATION, {
            method: "POST",
            credentials: "include",
            headers: {
                'Content-Type': "application/json"
            },
            body: JSON.stringify(data)
        }).then(r => r.json())
            .then(r => {
                if(r.err === 0) { window.location.assign("/") } //OK
                if(r.err === 1) { serErr(1) } //WRONG REPEAT PASSWORD
                if(r.err === 2) { serErr(2) } //USER IS ALREADY REGISTERED
                if(r.err === 3) { serErr(3) } //WRONG EMAIL SYNTAX
                if(r.err === 4) { serErr(4) } //EMPTY FIELD IS EXIST
            });
    }

    return (
        <div className="reg_auth">
            <form className="reg_window">
                <h1>Регистрация</h1>
                    {err === 4 ? <span className="error_notification">Есть незаполненные поля</span> : ""}
                <input id="name" placeholder="Имя..." className={err === 4 ? "error" : ""}/>
                <input id="lastName" placeholder="Фамилия..." className={err === 4 ? "error" : ""}/>
                <input id="email" placeholder="Почта..." className={err === 2 || err === 4 || err === 3 ? "error" : ""}/>
                    {err === 2 ? <span className="error_notification">Такой пользователь уже есть</span> : ""}
                    {err === 3 ? <span className="error_notification">Некорректный email</span> : ""}
                <input id="password" type="password" placeholder="Пароль..." className={err === 4 ? "error" : ""}/>
                <input id="repeatPassword" type="password" placeholder="Повторите пароль..." className={err === 1 || err === 4 ? "error" : ""}/>
                    {err === 1 ? <span className="error_notification">Неправильно введен пароль</span> : ""}
                <button className="button" onClick={ e => {
                    e.preventDefault();
                    e.persist();
                    reg(e.target.form.elements)
                }}>Зарегистрироваться</button>
                <Link to={ADDRESS_AUTHORIZATION}>Войти</Link>
            </form>
        </div>
    );
}