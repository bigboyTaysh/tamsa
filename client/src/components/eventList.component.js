import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";

export default class EventList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: this.props.username,
      events: this.props.events,
    };
  }

  render() {
    return (
      <table>
        <tbody>
          {this.props.events.map((item, id) => (
            <tr key={id}>
              <td>{item.title}</td>
              <td>{item.description}</td>
              <td>{new Date(item.date).toLocaleDateString([], {
                hour: '2-digit',
                minute:'2-digit',
                weekday: "long",
                year: "numeric",
                month: "2-digit",
                day: "numeric",
                formatMatcher: "best fit"
                })}</td>
              <td>{item.type.name}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }
}
