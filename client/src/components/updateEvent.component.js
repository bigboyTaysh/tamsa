import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import moment from "moment";
import "moment/locale/pl";
import "moment/locale/en-gb";

export default class UpdateEvent extends Component {
  constructor(props) {
    super(props);
    moment.locale("pl");
    var dateWithTimezoneOffset = moment().format('YYYY-MM-DDTHH:mm');

    this.state = {
      username: this.props.username,
      loggedInStatus: this.props.loggedInStatus,
      title: "",
      description: "",
      date: dateWithTimezoneOffset,
      locale: dateWithTimezoneOffset,
      type: [],
      typename: "",
      addStatus: "",
      loading: true,
      id: this.props.match.params.id,
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleDateChange = this.handleDateChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  handleInputChange(event) {
    this.setState({
      [event.target.name]: event.target.value,
    });
  }

  timeOffset() {
    var offset;

    axios.get("" + process.env.REACT_APP_API + "/timeOffset").then((res) => {
      offset = res.data;
    });

    return moment.duration(moment(offset).diff(moment())).asHours();
  }

  handleDateChange(event) {
    this.setState({
      date: moment(event.target.value).format("YYYY-MM-DDTHH:mm"),
      locale: moment(event.target.value),
    });
  }

  checkLoginStatus() {
    this.setState({
      loggedInStatus: Cookies.get("loggedInStatus"),
      username: Cookies.get("username"),
    });
  }

  getValues(){
    axios
      .get("" + process.env.REACT_APP_API + "/typeOfEvents")
      .then((res) => {
        if (res.data) {
          this.setState({
            type: res.data,
            typename: res.data[0].name,
          });
        } else {
          this.setState({
            events: "Brak zdarzeń",
          });
        }
      })
      .catch((error) => {
        this.setState({
          addStatus: error.date,
        });
      });

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
            username: res.data.username,
            title: res.data.title,
            description: res.data.description,
            completed: res.data.completed,
            date: moment(res.data.date).format("YYYY-MM-DDTHH:mm"),
            locale: moment(res.data.date).format("YYYY-MM-DDTHH:mm"),
            typename: res.data.type.name,
            loading: false,
          });
        }
      });
  }

  componentDidMount() {
    this.checkLoginStatus();
    this.getValues();
  }

  onSubmit(e) {
    e.preventDefault();

    const event = {
      id: this.state.id,
      username: this.state.username,
      title: this.state.title,
      description: this.state.description,
      completed: false,
      date: this.state.locale,
      type: this.state.typename,
    };

    this.setState({
      addStatus: "Pomyślnie edytowano " + this.state.typename,
    });

    axios
      .put("" + process.env.REACT_APP_API + "/events/update", event, (res) => {
        if (res.data) {
          this.setState({
            loading: false,
            username: res.data.username,
            title: res.data.title,
            description: res.data.description,
            completed: res.data.completed,
            date: moment(res.data.date).format("YYYY-MM-DDTHH:mm"),
            locale: moment(res.data.date).format("YYYY-MM-DDTHH:mm"),
            typename: res.data.type.name,
            loading: false,
          });
        }
      })
      .catch((error) => {
        this.setState({
          addStatus: error.data,
        });
      });
  }

  render() {
    if (this.state.loading) {
      var content = (
        <table className="table">
          <tbody>
            <tr>
              <td>
                <div className="message">
                  <i className="fa fa-spinner fa-spin"></i> Ładowanie..
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      );
    } else {
      var content = (
        <div>
          <div className="message">{this.state.addStatus}</div>
          <form onSubmit={this.onSubmit}>
            <div className="form-group">
              <label>Tytuł: </label>
              <input
                type="text"
                required
                className="form-control"
                name="title"
                value={this.state.title}
                onChange={this.handleInputChange}
              />
            </div>
            <div className="form-group">
              <label>Opis: </label>
              <input
                type="text"
                className="form-control"
                name="description"
                value={this.state.description}
                onChange={this.handleInputChange}
              />
            </div>
            <div className="form-group">
              <label>Data: </label>
              <div>
                <input
                  type="datetime-local"
                  required
                  className="form-control"
                  name="date"
                  value={this.state.date}
                  onChange={this.handleDateChange}
                />
              </div>
            </div>
            <div className="form-group">
              <label>Typ zdarzenia: </label>
              <select
                required
                className="form-control"
                name="typename"
                value={this.state.typename}
                onChange={this.handleInputChange}
              >
                {this.state.type.map((type) => {
                  return (
                    <option key={type._id} value={type.name}>
                      {type.name}
                    </option>
                  );
                })}
              </select>
            </div>
            <div className="form-group">
              <input type="submit" value="Dodaj" className="btn btn-primary" />
            </div>
          </form>
        </div>
      );
    }

    console.log(content);

    if (this.state.loggedInStatus) {
      return <React.Fragment>{ content }</React.Fragment>
    } else {
      return <Redirect to="/login" />;
    }
  }
}
