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
      typename: "",
      addStatus: "",
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSelectChange = this.handleSelectChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  handleInputChange(event) {
    this.setState({
      [event.target.name]: event.target.value,
    });
  }

  handleSelectChange(event) {
    this.setState({
      typename: event.target.value,
    });
  }

  checkLoginStatus() {
    this.setState({
      loggedInStatus: Cookies.get("loggedInStatus"),
      username: Cookies.get("username"),
    });
  }

  onSubmit(event) {
    event.preventDefault();

    this.setState({
      addStatus: "Dodano zdarzenie " + this.state.typename,
      title: "",
      description: "",
      date: new Date(),
    });
  }

  componentDidMount() {
    this.checkLoginStatus();

    axios.get("http://localhost:5000/typeOfEvents").then((res) => {
      if (res.data) {
        this.setState({
          type: res.data,
          typename: res.data[0].name
        });
      } else {
        this.setState({
          events: "Brak zdarzeń",
        });
      }
    });
  }

  render() {
    if (this.state.loggedInStatus) {
      return (
        <div>
          <h1>{this.state.addStatus}</h1>
          <form onSubmit={this.onSubmit}>
            <div className="form-group">
              <label>Tytuł: </label>
              <input
                type="text"
                required
                className="form-control"
                name="title"
                value={this.state.title}
                onChange={this.handleInputChange}
              />
            </div>

            <div className="form-group">
              <label>Opis: </label>
              <input
                type="text"
                className="form-control"
                name="description"
                value={this.state.description}
                onChange={this.handleInputChange}
              />
            </div>

            <div className="form-group">
              <label>Date: </label>
              <div>
                <input
                  type="datetime-local"
                  required
                  className="form-control"
                  name="date"
                  selected={this.state.date}
                  onChange={this.handleInputChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Typ zdarzenia: </label>
              <select
                ref="TypeOfEvent"
                required
                className="form-control"
                name="type"
                value={this.state.typename}
                onChange={this.handleSelectChange}
              >
                {this.state.type.map((type, id) => {
                  return (
                    <option key={id} value={type.name}>
                      {type.name}
                    </option>
                  );
                })}
              </select>
            </div>
            <div className="form-group">
              <input type="submit" value="Dodaj" className="btn btn-primary" />
            </div>
          </form>
        </div>
      );
    } else {
      return <Redirect to="/login" />;
    }
  }
}
