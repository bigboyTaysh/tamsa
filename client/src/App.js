import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Cookies from 'js-cookie';

import "bootstrap/dist/css/bootstrap.min.css";

import Register from "./components/register.component";
import Login from "./components/login.component";
import Home from "./components/home.component";
import Logout from "./components/logout.component";
import Navbar from "./components/navbar.component";

export default class App extends Component {
  constructor(props) {
    super(props);

    this.updateHandler = this.updateHandler.bind(this);

    if(Cookies.get('username') !== undefined || Cookies.get('username') !== ''){
      this.state = {
        loggedInStatus: Cookies.get('loggedInStatus'),
        username: Cookies.get('username'),
      };  
    } else {
      this.state = {
        loggedInStatus: false,
        username: '',
      };  
    }
    
    this.updateHandler();
  }
  
  updateHandler = (status, username) => {
    this.setState({
      loggedInStatus: status,
      username: username
    })
  }

  render() {
    return (
      <Router>
        <div className="container">
          <Navbar 
            loggedInStatus={this.state.loggedInStatus}
            updateHandler={this.updateHandler}
          />
          <Switch>
            <Route
              path="/login" 
              render={(props) => <Login updateHandler={this.updateHandler} {...props}/>}
            />
            <Route path="/register" component={Register} />
            <Route
              path="/logout"
              component={Logout}
            />
            <Route path="/"
              render={(props) => <Home username={this.state.username} loggedInStatus={this.state.loggedInStatus} {...props}/>}
            />
          </Switch>
          <br />
        </div>
      </Router>
    );
  }
}