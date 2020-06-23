import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import axios from "axios";
import EventList from "./eventList.component";
import moment from "moment";
import "moment/locale/pl";

export default class UpcomingEvents extends Component {
  constructor(props) {
    super(props);

    this.checkBox = this.checkBox.bind(this);
    this.updateEvents = this.updateEvents.bind(this);

    this.state = {
      username: this.props.username,
      loading: true,
      events: [],
      completed: false,
    };
  }

  updateEvents(events) {
    this.setState({
      events: events,
    });
  }

  checkBox(event) {
    this.setState({
      completed: event.target.checked,
    });
  }

  componentDidMount() {
    this.getUserEventsList();
  }

  getUserEventsList() {
    axios
      .get("" + process.env.REACT_APP_API + "/events/upcomingEvents", {
        params: {
          username: this.state.username,
          start: moment().format(),
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

    if (this.state.completed) {
      this.state.events.forEach((element) => {
        if (
          moment(element.date) >= startDate &&
          moment(element.date) <= stopDate
        ) {
          dateArray.push(element);
        }
      });
    } else {
      this.state.events.forEach((element) => {
        if (
          moment(element.date) >= startDate &&
          moment(element.date) <= stopDate &&
          !element.completed
        ) {
          dateArray.push(element);
        }
      });
    }
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
    var checkBox = (
      <div className="custom-control custom-checkbox">
        <input
          type="checkbox"
          className="custom-control-input"
          id="customCheck1"
          onChange={this.checkBox}
        />
        <label className="custom-control-label" htmlFor="customCheck1">
          Zakończone
        </label>
      </div>
    );

    if (this.state.loading) {
      var fragments = (
        <div className="message">
          <i className="fa fa-spinner fa-spin"></i> Ładowanie..
        </div>
      );
    } else {
      var fragments = [];
      var elements = [];

      for (let day = 0; day < 7; day++) {
        elements = this.getEventsByDay(day);
        var dayName = moment()
          .add(day, "days")
          .startOf("day")
          .locale("pl")
          .format("dddd, DD.MM");

        if (
          dayName.split(",")[0] ===
          moment().startOf("day").locale("pl").format("dddd")
        ) {
          dayName = "dzisiaj - " + dayName;
        }

        if (elements.length > 0) {
          fragments.push(
            <div className="message">
              <h3>{dayName}</h3>
            </div>,
            <EventList
              username={this.state.username}
              events={elements}
              format={"HH:mm"}
              completed={this.state.completed}
            />
          );
        }
      }
    }

    return (
      <React.Fragment>
        {checkBox}
        {fragments.length > 0 ? fragments : <div>Brak nadchodzących zadań</div>}
      </React.Fragment>
    );
  }
}
