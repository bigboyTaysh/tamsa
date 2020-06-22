import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import EventList from "./eventList.component";
import moment from "moment";
import "moment/locale/pl";


export default class SearchEvents extends Component {
  constructor(props) {
    super(props);

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleStartDateChange = this.handleStartDateChange.bind(this);
    this.handleEndDateChange = this.handleEndDateChange.bind(this);

    var startDate = moment().startOf('day').format("YYYY-MM-DDTHH:mm");
    var endDate = moment().endOf('day').format("YYYY-MM-DDTHH:mm");

    this.state = {
      username: this.props.username,
      loggedInStatus: this.props.loggedInStatus,
      loading: true,
      events: [],
      title: "",
      description: "",
      type: [],
      typename: "",
      start: startDate,
      end: endDate,
      startLocale: moment().startOf('day').format(),
      endLocale: moment().endOf('day').format(),
    };
  }

  checkLoginStatus() {
    this.setState({
      loggedInStatus: Cookies.get("loggedInStatus"),
      username: Cookies.get("username"),
    });
  }

  handleInputChange(event) {
    this.setState(
      {
        [event.target.name]: event.target.value,
      },
      function () {
        this.getUserEventsList();
      }
    );
  }

  handleStartDateChange(event) {
    this.setState({
      start: moment(event.target.value).format('YYYY-MM-DDTHH:mm'),
      startLocale: moment(event.target.value).format(),
    }, () => {
      console.log(this.state.startLocale);
      this.getUserEventsList();
    });
  }

  handleEndDateChange(event) {
    this.setState({
      end: moment(event.target.value).format('YYYY-MM-DDTHH:mm'),
      endLocale: moment(event.target.value).format(),
    }, () => {
      console.log(moment(this.state.endLocale));
      this.getUserEventsList();
    });
  }

  getUserEventsList() {
    const event = {
      username: this.state.username,
      title: this.state.title,
      description: this.state.description,
      completed: false,
      start: this.state.startLocale,
      end: this.state.endLocale,
      typename: this.state.typename,
    };

    axios
      .get("" + process.env.REACT_APP_API + "/events/search", {
        params: event,
      })
      .then((res) => {
        if (res.data) {
          this.setState({
            loading: false,
            events: res.data,
          });
        } else {
          this.setState({
            events: [],
          });
        }
      });
  }

  componentDidMount() {
    this.checkLoginStatus();

    axios
      .get("" + process.env.REACT_APP_API + "/typeOfEvents")
      .then((res) => {
        if (res.data) {
          this.setState(
            {
              type: res.data,
              typename: "",
            },
            function () {
              this.getUserEventsList();
            }
          );
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
        <React.Fragment>
          <div>
            <div className="message">{this.state.addStatus}</div>
            <form>
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
                <label>Zakres: </label>
                <div>
                  <input
                    type="datetime-local"
                    required
                    className="form-control"
                    name="start"
                    value={this.state.start}
                    onChange={this.handleStartDateChange}
                  />
                </div>
                <div>
                  <input
                    type="datetime-local"
                    required
                    className="form-control"
                    name="end"
                    value={this.state.end}
                    onChange={this.handleEndDateChange}
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
                  <option value={""}>{"wszystkie"}</option>
                  {this.state.type.map((type) => {
                    return (
                      <option key={type._id} value={type.name}>
                        {type.name}
                      </option>
                    );
                  })}
                </select>
              </div>
            </form>
          </div>
          {this.state.loading ? (
            <div className="message">
              <i className="fa fa-spinner fa-spin"></i> Ładowanie..
            </div>
          ) : (
            <EventList
              username={this.state.username}
              events={this.state.events}
              format={"HH:mm DD.MM.YYYY"}
            />
          )}
        </React.Fragment>
      );
    } else {
      return <Redirect to="/login" />;
    }
  }
}
