import React, {useReducer} from 'react';
import Header from "./components/Header";
import NewsFeed from "./components/NewsFeed";
import Authorization from "./components/Authorization";
import Registration from "./components/Registration";
import UsersPage from "./components/UsersPage";
import CreatePost from "./components/CreatePost";
import Notifications from "./components/Notifications";
import {Switch, Route, Redirect} from "react-router-dom";
import Reducer from "./reducer";
import {FilterSet} from "./context";


function App() {
  const [filter, dispatch] = useReducer(Reducer, {});

  return (
      <FilterSet.Provider value={{dispatch, filter}}>
        <div className="App">

            {window.location.pathname === "/Registration" || window.location.pathname === "/Authorization" ? "" : <Header />}

          <Switch>
              <Route path="/NewsFeed" component={NewsFeed}/>
              <Route path="/CreatePost" component={CreatePost}/>
              <Route path="/Notifications" component={Notifications}/>
              <Route path="/UsersPage" component={UsersPage}/>
              <Route path="/Registration" component={Registration}/>
              <Route path="/Authorization" component={Authorization}/>
              <Redirect from="/" to="/NewsFeed"/>
          </Switch>
        </div>
      </FilterSet.Provider>
  );
}

export default App;
