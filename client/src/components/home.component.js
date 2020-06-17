import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import axios from "axios";

export default class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: this.props.username,
      loggedInStatus: this.props.loggedInStatus,
    };
  }

  checkLoginStatus() { 
    if (typeof(this.state.username) !== "undefined" && this.state.username !== undefined && this.state.username !== null ) {
      axios
        .post("https://tam-sheduler.herokuapp.com/users/login_status", this.state.username)
        .then((res) => {
          this.setState({
            loggedInStatus: res.data,
          });
        });
    }
  }

  componentDidMount() {
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
