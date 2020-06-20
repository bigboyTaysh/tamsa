import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import EventList from "./eventList.component";
import moment from 'moment';

export default class UpcomingEvents extends Component {
  constructor(props) {
    super(props);

    var newDate = new Date() + (new Date().getTimezoneOffset() / 600);
    var dateWithTimezoneOffset = moment(newDate).second(0).millisecond(0);
    var dateISO = dateWithTimezoneOffset.toISOString().slice(0, -1);

    this.state = {
      username: this.props.username,
      loggedInStatus: this.props.loggedInStatus,
      loading: true,
      events: [],
      start: dateISO,
      end: dateISO,
    };
  }

  checkLoginStatus() {
    this.setState({
      loggedInStatus: Cookies.get("loggedInStatus"),
      username: Cookies.get("username"),
    });
  }

  getUserEventsList() {
    axios
      .get("http://localhost:5000/events/upcomingEvents", {
        params: {
          username: this.state.username,
          start: this.state.start,
          end: this.state.end,
        },
      })
      .then((res) => {
        if (res.data && res.data !== []) {
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
  }

  componentWillMount() {
    this.getUserEventsList();
  }

  render() {
    if (this.state.loggedInStatus) {
        return (
          <React.Fragment>
            <h1>Cześć {this.state.username}</h1>
            {this.state.loading ? (
              <div className="message">
                
                <i className="fa fa-spinner fa-spin"></i>
                {" "}
                Ładowanie..
              </div>
            ) : (
              <EventList username={this.state.username} events={this.state.events}/>
            )}
          </React.Fragment>
        );
      } else {
        return <Redirect to="/login" />;
      }
  }
}
