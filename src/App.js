import React from 'react';
import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";
import Home from "./components/home/Home";
import Room from "./components/room/Room";

function App(){
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" exact component={Home} />
        <Route path="/room/:roomID" component={Room} />
        <Route render={() => <Redirect to={{pathname: "/"}} />} />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
