import React from 'react';
import {BrowserRouter as Router, Route} from "react-router-dom";

import "bootstrap/dist/css/bootstrap.min.css"

import NavbarForUnauthenticated from "./components/navbar.component";
import Register from "./components/register.component";

function App() {
  return (
    <Router>
      <div className="container">
        <NavbarForUnauthenticated/>
        <br/>

        <Route path="/register" exact component={Register}/>
      </div>
    </Router>
  );
}

export default App;
