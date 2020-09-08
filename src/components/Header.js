import React from "react";
import {Link} from "react-router-dom";
import {
    ADDRESS_AUTHORIZATION,
    ADDRESS_CREATE_POST, ADDRESS_LIKED, ADDRESS_MY_POST,
    ADDRESS_MY_PROFILE,
    ADDRESS_NEWS_FEED,
    ADDRESS_NOTIFICATIONS, ADDRESS_USER_PAGE, API_EXIT
} from "../Properties";
import {FilterSet} from "../context";
import Cookies from 'universal-cookie';


export default function Header() {
    const [burgerMenu, setBurgerMenu] = React.useState(false);
    const [accMenu, setAccMenu] = React.useState(false);
    const {dispatch} = React.useContext(FilterSet);
    const cookies = new Cookies();

    React.useEffect(() => {
        const closeMenu = e => {
            for (const element of e.composedPath()) {
                if(element === document || element === window) { return }
                if(element.classList.contains("burger_menu_icon")) {
                    setAccMenu(false);
                    break;
                }
                if(element.classList.contains("acc-icon")) {
                    setBurgerMenu(false);
                    break;
                }
                else {
                    setBurgerMenu(false);
                    setAccMenu(false);
                }
            }
        }
        window.addEventListener("click", closeMenu);

        return () => {
            window.removeEventListener("click", closeMenu);
        }
    }, [])

    return (
        <>
            <div className="header">
                <div className={"burger_menu_icon" + (burgerMenu ? " burger_to_close" : " burger_to_open")}
                     onClick={() => setBurgerMenu(!burgerMenu)}
                />
                <div className="Logo-container">
                    <div className="Logo-icon"/>
                    <div className="Logo-title">Moon</div>
                </div>

                <div className="acc-icon" onClick={() => setAccMenu(oldState => !oldState)}/>
            </div>

            <nav className={ "navigation" + (burgerMenu ? " nav_open" : " nav_close") }>
                <Link className="a" to={ADDRESS_CREATE_POST}>Создать запись<div /></Link>
                <hr />
                <Link className="a" to={ADDRESS_NEWS_FEED} onClick={ () => dispatch({type: "filterSet", payload: {}}) }>Новости<div /></Link>
                <hr />
                <Link className="a" to={ADDRESS_MY_POST} onClick={ () => dispatch({type: "filterSet", payload: {id: cookies.get("myId")}}) }>Мои записи<div /></Link>
                <hr />
                <Link className="a" to={ADDRESS_USER_PAGE} onClick={ () => dispatch({type: "filterSet", payload: {}})}>Пользователи<div /></Link>
                <hr />
                <Link className="a" to={ADDRESS_LIKED} onClick={ () => dispatch({type: "filterSet", payload: {liked: cookies.get("myId")}}) }>Понравившееся<div /></Link>
            </nav>

            <nav className={"acc_menu" + (accMenu ? " acc_open" : " acc_close")}>
                <Link className="a" to={ADDRESS_MY_PROFILE}>Мой профиль</Link>
                <Link className="a" to={ADDRESS_NOTIFICATIONS}>Уведомления</Link>
                <Link className="a" to={ADDRESS_AUTHORIZATION} onClick={() => {
                    fetch(API_EXIT, {
                        method: "POST",
                        credentials: "include"
                    }).then();
                }}>Выйти</Link>
            </nav>
        </>
    );
}

