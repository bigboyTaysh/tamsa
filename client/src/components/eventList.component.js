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
          {this.props.events.map((item) => (
            <tr>
              <td key={item.title}>{item.title}</td>
              <td key={item.description}>{item.description}</td>
              <td key={item.completed}>{item.completed}</td>
              <td key={item.type.name}>{item.type.name}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }
}
