import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import EventList from "./eventList.component";
import moment from "moment";
import "moment/locale/pl";

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
          start: this.state.start,
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

  getEventsByDates(startDate, stopDate) {
    var dateArray = [];

    this.state.events.forEach((element) => {
      if (
        moment(element.date) >= startDate &&
        moment(element.date) <= stopDate
      ) {
        dateArray.push(element);
      }
    });

    return dateArray;
  }

  getEventsByDay(day) {
    if (day === 0) {
      return this.getEventsByDates(
        moment().add(day, "days"),
        moment().add(day, "days").endOf("day")
      );
    } else {
      return this.getEventsByDates(
        moment().add(day, "days").startOf("day"),
        moment().add(day, "days").endOf("day")
      );
    }
  }

  render() {
    if (this.state.loading) {
      var fragments = (
        <div className="message">
          <i className="fa fa-spinner fa-spin"></i> Ładowanie..
        </div>
      );
    } else {
      var fragments = [];

      for (let day = 0; day < 7; day++) {
        var elements = this.getEventsByDay(day);
        var dayName = moment()
          .add(day, "days")
          .startOf("day")
          .locale("pl")
          .format("dddd, DD.MM");

        if (dayName === "poniedziałek") {
          dayName = "dzisiaj";
        }

        if (elements.length > 0) {
          fragments.push(
            <div className="message">
              <h3>{dayName}</h3>
            </div>,
            <EventList
              username={this.state.username}
              events={elements}
              format={"HH:MM"}
            />
          );
        }
      }
    }

    return (
      <React.Fragment>
        {fragments.length > 0 ? fragments : <div>Brak danych</div>}
      </React.Fragment>
    );
  }
}
