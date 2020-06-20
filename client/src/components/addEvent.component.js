import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import moment from 'moment';

export default class AddEvent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: this.props.username,
      loggedInStatus: this.props.loggedInStatus,
      title: "",
      description: "",
      date: moment().seconds(0).milliseconds(0).toISOString().slice(0, -1),
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

  onSubmit(e) {
    e.preventDefault();

    const event = {
      username: this.state.username,
      title: this.state.title,
      description: this.state.description,
      completed: false,
      date: this.state.date,
      type: this.state.typename,
    };

    this.setState({
      addStatus: "Pomyślnie dodano " + this.state.typename,
      title: "",
      description: "",
    });

    axios.post("http://localhost:5000/events/add", event).catch((error) => {
      this.setState({
        addStatus: error.data,
      });
    });
  }

  componentDidMount() {
    this.checkLoginStatus();

    axios
      .get("http://localhost:5000/typeOfEvents")
      .then((res) => {
        if (res.data) {
          this.setState({
            type: res.data,
            typename: res.data[0].name,
          });
        } else {
          this.setState({
            events: "Brak zdarzeń",
          });
        }
      })
      .catch((error) => {
        this.setState({
          addStatus: error.date,
        });
      });
  }

  render() {
    if (this.state.loggedInStatus) {
      return (
        <div>
          <div className="message">{this.state.addStatus}</div>
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
                  value={this.state.date}
                  onChange={this.handleInputChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Typ zdarzenia: </label>
              <select
                required
                className="form-control"
                name="type"
                onChange={this.handleSelectChange}
              >
                {this.state.type.map((type) => {
                  return (
                    <option key={type._id} value={type.name}>
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
