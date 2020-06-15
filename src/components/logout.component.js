import React, { Component } from "react";
import { Link } from "react-router-dom";
import Cookies from 'js-cookie';

export default class Logout extends Component {
  constructor(props) {
    super(props);

    Cookies.remove('loggedInStatus');
    Cookies.remove('username', '');
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
