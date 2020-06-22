import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import moment from 'moment';
import "moment/locale/pl";
import "moment/locale/en-gb";

export default class AddEvent extends Component {
  constructor(props) {
    super(props);

    moment.locale("pl");
    var dateWithTimezoneOffset = moment().format('YYYY-MM-DDTHH:mm');

    this.state = {
      username: this.props.username,
      loggedInStatus: this.props.loggedInStatus,
      title: "",
      description: "",
      date: dateWithTimezoneOffset,
      locale: dateWithTimezoneOffset,
      type: [],
      typename: "",
      addStatus: "",
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleDateChange = this.handleDateChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  handleInputChange(event) {
    this.setState({
      [event.target.name]: event.target.value,
    });
  }

  timeOffset(){
    var offset; 

    axios
      .get(""+ process.env.REACT_APP_API + "/timeOffset")
      .then((res) => {
          offset = res.data;
      });

      return moment.duration(moment(offset).diff(moment())).asHours();
  }

  handleDateChange(event) {
    this.setState({
      date: moment(event.target.value).format('YYYY-MM-DDTHH:mm'),
      locale: moment(event.target.value),
    });
  }

  checkLoginStatus() {
    this.setState({
      loggedInStatus: Cookies.get("loggedInStatus"),
      username: Cookies.get("username"),
    });
  }

  componentDidMount() {
    this.checkLoginStatus();

    axios
      .get(""+ process.env.REACT_APP_API + "/typeOfEvents")
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

  onSubmit(e) {
    e.preventDefault();

    const event = {
      username: this.state.username,
      title: this.state.title,
      description: this.state.description,
      completed: false,
      date: this.state.locale,
      type: this.state.typename,
    };

    this.setState({
      addStatus: "Pomyślnie dodano " + this.state.typename,
      title: "",
      description: "",
    });

    axios.post(""+ process.env.REACT_APP_API + "/events/add", event).catch((error) => {
      this.setState({
        addStatus: error.data,
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
              <label>Data: </label>
              <div>
                <input
                  type="datetime-local"
                  required
                  className="form-control"
                  name="date"
                  value={this.state.date}
                  onChange={this.handleDateChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Typ zdarzenia: </label>
              <select
                required
                className="form-control"
                name="typename"
                onChange={this.handleInputChange}
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
