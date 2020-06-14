import React, { Component } from "react";
import { Link } from "react-router-dom";

export default class NavbarForUnauthenticated extends Component {
  render() {
    return (
      <nav className="navbar navbar-dark bg-dark navbar-expand-lg">
        <Link to="/" className="navbar-brand">
          Terminarz
        </Link>
        <div className="collpase navbar-collapse">
          <ul className="navbar-nav mr-auto">
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
