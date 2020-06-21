import React, { Component } from "react";
import { Link } from "react-router-dom";
import Cookies from "js-cookie";
import axios from "axios";

export default class Logout extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: this.props.username,
      loggedInStatus: this.props.loggedInStatus,
    };

    Cookies.remove("loggedInStatus");
    Cookies.remove("username");
  }

  logout() {
    axios
      .post(""+ process.env.REACT_APP_API + "/users/logout", this.state.username)
      .then((res) => {
        if(!res.data){
          this.setState({
            loggedInStatus: false,
          });
        }
      });
  }

  componentWillMount() {
    this.logout();
  }

  render() {
    localStorage.setItem("loggedInStatus", false);
    return (
      <div>
        <h3>Wylogowano</h3>

        <Link to="/login" className="navbar-brand">
          Zaloguj się ponownie
        </Link>
      </div>
    );
  }
}
