import React, { Component } from "react";
import axios from "axios";

export default class Register extends Component {
  constructor(props) {
    super(props);

    this.onChangeUsername = this.onChangeUsername.bind(this);
    this.onChangePassword = this.onChangePassword.bind(this);
    this.onChangeConfirmPassword = this.onChangeConfirmPassword.bind(this);
    this.onSubmit = this.onSubmit.bind(this);

    this.state = {
      username: "",
      password: "",
      confirmPassword: "",
      registrationError: "",
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

  onChangeConfirmPassword(e) {
    this.setState({
      confirmPassword: e.target.value,
    });
  }

  onSubmit(e) {
    e.preventDefault();

    const user = {
      username: this.state.username,
      password: this.state.password,
      events: [],
    };

    if (user.password !== this.state.confirmPassword) {
      this.setState({
        registrationError: "Hasła muszą być takie same",
      });
    } else {
      
      axios
        .post("http://localhost:5000/users/add", user)
        .then((res) => {
          if(res.data){
            this.setState({
              username: "",
              password: "",
              confirmPassword: "",
              registrationError: "",
            });
      
            this.props.history.push("/login");
          } else {
            this.setState({
              registrationError: "Podany login istnieje",
            });
          }
        });
    }
  }

  render() {
    return (
      <div>
        <h3>Zarejestruj się</h3>
        <p style={{ color: "red" }}>{this.state.registrationError}</p>

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

            <input
              type="password"
              required
              className="form-control"
              value={this.state.confirmPassword}
              onChange={this.onChangeConfirmPassword}
            />
          </div>
          <div className="form-group">
            <input
              type="submit"
              value="Zarejestruj"
              className="btn btn-primary"
            />
          </div>
        </form>
      </div>
    );
  }
}
