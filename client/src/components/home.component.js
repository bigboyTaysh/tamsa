import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import EventList from "./eventList.component";


export default class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: this.props.username,
      loggedInStatus: this.props.loggedInStatus,
      events: []
    };
  }

  checkLoginStatus() { 
    this.setState({
      loggedInStatus: Cookies.get('loggedInStatus'),
      username: Cookies.get('username'),
    });
  }

  getUserEventsList(){
    axios
      .post("http://localhost:5000/events", {username: this.state.username})
      .then((res) => {
        if (res.data) {
            this.setState({
              events: res.data
            });
        } else {
            this.setState({
                events: "Brak zdarzeń",
              });
        }
      });
  }

  componentDidMount() {
    this.checkLoginStatus();
  }

  componentWillMount(){
    this.getUserEventsList();
  }

  render() {
    if (this.state.loggedInStatus) {
      return (
        <React.Fragment>
          <h1>ELOO {this.state.username}</h1>
          <EventList username={this.state.username} events={this.state.events}/>
        </React.Fragment>
      );
    } else {
      return <Redirect to="/login" />;
    }
  }
}
