import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import EventList from "./eventList.component";
import moment from "moment";

export default class UpcomingEvents extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: this.props.username,
      loading: true,
      events: [],
      start: ''
    };
  }

  checkLoginStatus() {
    this.setState({
      loggedInStatus: Cookies.get("loggedInStatus"),
      username: Cookies.get("username"),
    });
  }
  setDate(date, hours, minutes) {
    return moment(date)
      .hours(hours)
      .minutes(minutes)
      .seconds(minutes)
      .format("YYYY-MM-DDTHH:mm");
  }

  componentDidMount() {
    this.checkLoginStatus();
    this.getUserEventsList();
  }

  getUserEventsList() {
    axios
      .get("" + process.env.REACT_APP_API + "/upcomingEvents", {
        params: {
          username: this.state.username,
          start: moment(new Date()).format("YYYY-MM-DDTHH:mm"),
        },
      })
      .then((res) => {
        if (res.data) {
          this.setState({
            loading: false,
            events: res.data,
          });
        }
      });
  }

  render() {
    return (
      <React.Fragment>
        {this.state.loading ? (
          <div className="message">
              
          <i className="fa fa-spinner fa-spin"></i>
          {" "}
          Ładowanie..
        </div>
        ) : (
          <EventList
            username={this.state.username}
            events={this.state.events}
          />
        )}
      </React.Fragment>
    );
  }
}
