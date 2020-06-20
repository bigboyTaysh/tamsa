import React, { Component } from "react";
import axios from "axios";

export default class EventList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: this.props.username,
      events: this.props.events,
      removestatus: "",
    };
  }

  componentWillReceiveProps(props) {
    this.setState({ events: props.events });  
  }

  handleDelete(id) {
    axios
      .delete("http://localhost:5000/events/delete", {
        data: {
          id: id,
        },
      })
      .then((res) => {
        var array = this.state.events;
        array.splice(
          array.findIndex((x) => x._id === id),
          1
        );
        this.setState({ events: array });
      })
      .catch((error) => {
        this.setState({
          removestatus: error.date,
        });
      });
  }

  render() {
    return (
      <React.Fragment>
        {this.state.events.length === 0 ? (
          <h1>Brak wydarzeń</h1>
        ) : (
          <table>
            <tbody>
              {this.state.events.map((item) => (
                <tr key={item._id}>
                  <td>{item.title}</td>
                  <td>{item.description}</td>
                  <td>
                    {new Date(item.date).toLocaleDateString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                      weekday: "long",
                      year: "numeric",
                      month: "2-digit",
                      day: "numeric",
                      formatMatcher: "best fit",
                    })}
                  </td>
                  <td>{item.type.name}</td>
                  <td>
                    <button
                      className="none"
                      onClick={() => {
                        this.handleDelete(item._id);
                      }}
                    >
                      <i className="fa fa-trash"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </React.Fragment>
    );
  }
}
