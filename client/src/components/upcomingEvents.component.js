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
      start: moment(new Date()).format("YYYY-MM-DDTHH:mm"),
    };
  }

  setDate(date, hours, minutes) {
    return moment(date)
      .hours(hours)
      .minutes(minutes)
      .seconds(minutes)
      .format("YYYY-MM-DDTHH:mm");
  }

  componentDidMount() {
    this.getUserEventsList();
  }

  getUserEventsList() {
    axios
      .get("" + process.env.REACT_APP_API + "/events/upcomingEvents", {
        params: {
          username: this.state.username,
          start: this.state.start
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
