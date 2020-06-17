import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import axios from "axios";
import Cookies from 'js-cookie';

export default class Login extends Component {
  constructor(props) {
    super(props);

    this.onChangeUsername = this.onChangeUsername.bind(this);
    this.onChangePassword = this.onChangePassword.bind(this);
    this.onSubmit = this.onSubmit.bind(this);

    this.state = {
      username: "",
      password: "",
      loginError: "",
      loggedInStatus: this.props.loggedInStatus,
    };
  }

  onChangeUsername(e) {
    this.setState({
      username: e.target.value,
    });
  }

  onChangePassword(e) {
    this.setState({
      password: e.target.value,
    });
  }

  componentWillReceiveProps(props) {
    this.setState({ 
      loggedInStatus: props.loggedInStatus,
      usename: props.username
     })
  }

  onSubmit(e) {
    e.preventDefault();

    const user = {
      username: this.state.username,
      password: this.state.password
    };

    axios
      .post("https://tam-sheduler.herokuapp.com/users/login", user)
      .then((res) => {
        if (res.data) {
            this.setState({
              username: user.username,
              password: "",
              loginError: "",
              loggedInStatus: true,
            });

            Cookies.set('loggedInStatus', true);
            Cookies.set('username', user.username);

            
            this.props.updateHandler(true, this.state.username);
            this.props.history.push("/");
        } else {
            this.setState({
                loginError: "Niewłaściy login lub hasło",
              });
        }
      })
      .catch((error) => {
        this.setState({
          loginError: "Błąd logowania" + error,
        });
      });
  }

  render() {
    if (this.state.loggedInStatus) {
      return <Redirect to={{pathname: '/', state: {loggedInStatus: true, username: this.state.username}}}  />;
    } else {
      return (
        <div>
          <h3>Zaloguj się</h3>
          <p style={{ color: "red" }}>{this.state.loginError}</p>

          <form onSubmit={this.onSubmit}>
            <div className="form-group">
              <label>Nazwa użytkownika: </label>
              <input
                type="text"
                required
                className="form-control"
                value={this.state.username}
                onChange={this.onChangeUsername}
              />
              <input
                type="password"
                required
                className="form-control"
                value={this.state.password}
                onChange={this.onChangePassword}
              />
            </div>
            <div className="form-group">
              <input
                type="submit"
                value="Zaloguj"
                className="btn btn-primary"
              />
            </div>
          </form>
        </div>
      );
    }
  }
}
