import React from "react";
import Post from "./Post";
import {Switch, Route} from "react-router-dom";
import {isAuth} from "../Service";
import {ADDRESS_AUTHORIZATION, ADDRESS_NEWS_FEED, API_GET_NEWS_FEED} from "../Properties";
import {FilterSet} from "../context";

export default function NewsFeed() {
    const [postsList, setPostsList] = React.useState([]);
    const {filter} = React.useContext(FilterSet);

    function getNews() {
        let filterQuery = "";
        if(filter.id) { filterQuery += `?id=${filter.id}` }
        if(filter.liked) { filterQuery += `?liked=${filter.liked}` }

        fetch(API_GET_NEWS_FEED + filterQuery, {
            credentials: "include"
        })
            .then(r => r.json())
            .then(r => {
                if(r.err) { window.location.assign(ADDRESS_AUTHORIZATION) }
                setPostsList(r);
            });
    }

    React.useEffect(() => {
        isAuth().then(r => {
            if(!r) {
                getNews();
            }
            else {  window.location.assign(ADDRESS_AUTHORIZATION) }
        });

    }, [filter]);

    return (
        <div className="news-feed">
            <Switch>
                <Route path="/NewsFeed" component={ () => <Post postsList={postsList} setPostsList={setPostsList} getNews={getNews}/> }/>
            </Switch>

        </div>
    );
}