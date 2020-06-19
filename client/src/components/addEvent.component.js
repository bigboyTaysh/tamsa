import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";

export default class AddEvent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: this.props.username,
      loggedInStatus: this.props.loggedInStatus,
      title: "",
      description: "",
      date: new Date(),
      type: [],
    };

    this.handleChange = this.handleInputChange.bind(this);
  }

  handleInputChange(event) {
    this.setState({
        [event.target.name]: event.target.value
    });

    this.setState({ [this.state]: event.target.value });
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
        <form onSubmit={this.onSubmit}>
          <div className="form-group">
            <label>Tytuł: </label>
            <input
              type="text"
              required
              className="form-control"
              value={this.state.title}
              onChange={this.handleInputChange}
            />

            <label>Opis: </label>
            <input
              type="text"
              required
              className="form-control"
              value={this.state.description}
              onChange={this.handleInputChange}
            />
          </div>
          <div className="form-group">
            <input type="submit" value="Zaloguj" className="btn btn-primary" />
          </div>
        </form>
      );
    } else {
      return <Redirect to="/login" />;
    }
  }
}
