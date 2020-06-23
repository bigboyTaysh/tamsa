import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import UpcomingEvents from "./upcomingEvents.component";

export default class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: this.props.username,
      loggedInStatus: this.props.loggedInStatus,
    };
  }

  checkLoginStatus() {
    this.setState({
      loggedInStatus: Cookies.get("loggedInStatus"),
      username: Cookies.get("username"),
    });
  }

  componentDidMount() {
    this.checkLoginStatus();
  }

  render() {
    if (this.state.loggedInStatus) {
      return (
        <React.Fragment>
          <UpcomingEvents
            username={this.state.username}
            history={this.state.history}
            history={this.props.history}
          />
        </React.Fragment>
      );
    } else {
      return <Redirect to="/login" />;
    }
  }
}
