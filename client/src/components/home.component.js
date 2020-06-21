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
      loading: true,
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
      .get(""+ process.env.REACT_APP_API + "/events", {params: {username: this.state.username}})
      .then((res) => {
        if (res.data) {
            this.setState({
              loading: false,
              events: res.data
            });
        }
      });
  }

  componentDidMount() {
    this.checkLoginStatus();
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
