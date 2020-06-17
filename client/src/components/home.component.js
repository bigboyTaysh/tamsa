import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";

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
    loggedInStatus: Cookies.get('loggedInStatus'),
    username: Cookies.get('username'),
  });
  }

  componentWillMount() {
    this.checkLoginStatus();
  }

  render() {
    if (this.state.loggedInStatus) {
      return <h1>ELOO {this.state.username}</h1>;
    } else {
      return <Redirect to="/login" />;
    }
  }
}
