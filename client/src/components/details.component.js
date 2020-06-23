import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import axios from "axios";
import moment from "moment";
import "moment/locale/pl";

export default class EventDetail extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: this.props.username,
      loggedInStatus: this.props.loggedInStatus,
      id: this.props.match.params.id,
      loading: true,
      event: [],
    };
  }

  componentDidMount() {
    this.getUserEvent();
  }

  getUserEvent() {
    axios
      .get("" + process.env.REACT_APP_API + "/events/event", {
        params: {
          username: this.state.username,
          id: this.state.id,
        },
      })
      .then((res) => {
        if (res.data) {
          this.setState({
            loading: false,
            event: res.data,
          });
        }
      });
  }

  render() {
    if (this.state.loading) {
      var content = (
        <div className="message">
          <i className="fa fa-spinner fa-spin"></i> Ładowanie..
        </div>
      );
    } else {
      var content = (
        <table className="table">
          <tr>
            <td>{this.state.event.title}</td>
          </tr>
          <tr>
            <td>{this.state.event.description}</td>
          </tr>
          <tr>
            <td>{moment(this.state.event.date).locale("pl").format("HH:mm DD.MM.YYYY")}</td>
          </tr>
          <tr>
            <td>{this.state.event.type.name}</td>
          </tr>
        </table>
      );
    }

    return <React.Fragment>{content}</React.Fragment>;
  }
}
