import React, { Component } from "react";
import { Link } from "react-router-dom";

export default class Navbar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loggedInStatus: this.props.loggedInStatus,
      username: this.props.username,
    };
  }

  componentWillReceiveProps(props) {
    this.setState({
      loggedInStatus: props.loggedInStatus,
      username: props.username,
    });
  }

  render() {
    if (this.state.loggedInStatus) {
      return (
        <nav className="navbar navbar-dark bg-dark navbar-expand-lg">
          <Link to="/" className="navbar-brand">
            TAMSA
          </Link>
          <div className="collpase navbar-collapse">
            <ul className="navbar-nav mr-auto">
              <li className="navbar-item">
                <Link to="/addEvent" className="nav-link">
                  Dodaj
                </Link>
              </li>
              <li className="navbar-item right">
                <Link to="/searchEvents" className="nav-link">
                  Szukaj
                </Link>
              </li>
            </ul>
            <ul className="navbar-nav navbar-right">
              <li className="navbar-item">
                <Link
                  to="/logout"
                  className="nav-link"
                  onClick={() =>
                    this.props.updateHandler(false, this.state.username)
                  }
                >
                  Logout
                </Link>
              </li>
            </ul>
          </div>
        </nav>
      );
    } else {
      return (
        <nav className="navbar navbar-dark bg-dark navbar-expand-lg">
          <div className="collpase navbar-collapse">
            <ul className="navbar-nav mr-auto">
              <li>
                <Link to="/" className="navbar-brand">
                  Terminarz
                </Link>
              </li>
            </ul>
            <ul className="navbar-nav navbar-right">
              <li className="navbar-item">
                <Link to="/login" className="nav-link">
                  Login
                </Link>
              </li>
              <li className="navbar-item">
                <Link to="/register" className="nav-link">
                  Rejestracja
                </Link>
              </li>
            </ul>
          </div>
        </nav>
      );
    }
  }
}
