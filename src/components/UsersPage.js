import React from "react";
import {ADDRESS_AUTHORIZATION, ADDRESS_USER_POSTS, API_GET_USERS} from "../Properties";
import {FilterSet} from "../context";
import {Redirect} from "react-router-dom";

export default function UsersPage() {
    const [usersList, setUserList] = React.useState([]);
    const {filter, dispatch} = React.useContext(FilterSet);

    function getUserPosts(id) {
        dispatch({type: "filterSet", payload: {id}})
    }

    React.useEffect(() => {
        fetch(API_GET_USERS, {
            credentials: "include"
        }).then(r => r.json()).then(r => {
            if(r.err) { window.location.assign(ADDRESS_AUTHORIZATION) }
            setUserList(r);
        })
    }, []);
    return (
        <div className="users_page">
            {usersList.map(({id, name, lastName, avatar}) =>
                <div key={id} className="user_card">
                    {filter.id === id ? <Redirect to={ADDRESS_USER_POSTS}/> : ""}

                    <img src={`http://localhost:3001/getImage?type=avatar&id=${avatar}`}/>
                    <span>{lastName}</span>
                    <span>{name}</span>
                    <button className="button" onClick={() => getUserPosts(id)}>Показать посты</button>
                    <button className="button">Перейти в профиль</button>
                </div>
            )}
        </div>
    );
}