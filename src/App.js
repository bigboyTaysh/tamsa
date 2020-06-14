import React from 'react';
import {BrowserRouter as Router, Route} from "react-router-dom";

import "bootstrap/dist/css/bootstrap.min.css"

import Navbar from "./components/navbar.component";
import UsersList from "./components/users-list.component";

function App() {
  return (
    <Router>
      <div className="container">
        <Navbar/>
        <br/>

        <Route path="/" exact component={UsersList}/>
      </div>
    </Router>
  );
}

export default App;
