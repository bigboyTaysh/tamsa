import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Cookies from "js-cookie";

import "bootstrap/dist/css/bootstrap.min.css";
import "font-awesome/css/font-awesome.min.css";
import './App.css';

import Register from "./components/register.component";
import Login from "./components/login.component";
import Home from "./components/home.component";
import Logout from "./components/logout.component";
import Navbar from "./components/navbar.component";
import AddEvent from "./components/addEvent.component";
import UpcomingEvents from "./components/searchEvents.component";
import SearchEvents from "./components/searchEvents.component";
import EventDetail from "./components/eventDetails";
import UpdateEvent from "./components/updateEvent.component";

export default class App extends Component {
  constructor(props) {
    super(props);

    this.updateHandler = this.updateHandler.bind(this);

    if (
      Cookies.get("username") !== undefined ||
      Cookies.get("username") !== ""
    ) {
      this.state = {
        loggedInStatus: Cookies.get("loggedInStatus"),
        username: Cookies.get("username"),
        history: ''
      };
    } else {
      this.state = {
        loggedInStatus: false,
        username: "",
        history: ''
      };
    }

    this.updateHandler();
  }

  updateHandler = (status, username) => {
    this.setState({
      loggedInStatus: status,
      username: username,
    });
  };

  render() {
    return (
      <Router>
        <div className="container">
          <Navbar
            loggedInStatus={this.state.loggedInStatus}
            updateHandler={this.updateHandler}
          />
          <Route
            path="/login"
            render={(props) => (
              <Login updateHandler={this.updateHandler} {...props} />
            )}
          />
          <Route path="/register" component={Register} />
          <Route path="/logout" component={Logout} />
          <Route
            path="/"
            exact
            render={(props) => (
              <Home
                username={this.state.username}
                loggedInStatus={this.state.loggedInStatus}
                history={this.state.history}
                {...props}
              />
            )}
          />
          <Route
            path="/addEvent"
            render={(props) => (
              <AddEvent
                username={this.state.username}
                loggedInStatus={this.state.loggedInStatus}
                {...props}
              />
            )}
          />
          <Route
            path="/searchEvents"
            exact
            render={(props) => (
              <SearchEvents
                username={this.state.username}
                loggedInStatus={this.state.loggedInStatus}
                history={this.state.history}
                {...props}
              />
            )}
          />
          <Route
            path="/details/:id"
            exact
            render={(props) => (
              <EventDetail
                username={this.state.username}
                loggedInStatus={this.state.loggedInStatus}
                history={this.state.history}
                {...props}
              />
            )}
          />
          <Route
            path="/update/:id"
            exact
            render={(props) => (
              <UpdateEvent
                username={this.state.username}
                loggedInStatus={this.state.loggedInStatus}
                history={this.state.history}
                {...props}
              />
            )}
          />
          <br />
        </div>
      </Router>
    );
  }
}
