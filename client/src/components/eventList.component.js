import React, { Component } from "react";
import axios from "axios";
import moment from "moment";
import "moment/locale/pl";

export default class EventList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: this.props.username,
      events: this.props.events,
      removestatus: "",
      format: this.props.format,
      completed: this.props.completed,
    };
  }

  handleChangeState(id, completed) {
    var array = this.state.events;

    axios
      .put("" + process.env.REACT_APP_API + "/events/changeState", {
        id: id,
        completed: !completed,
      })
      .then((res) => {
        array
          .filter((x) => x._id === id)
          .map((x) => {
            if (x._id === id) {
              x.completed = !completed;
            }
          });

        if(this.state.completed || this.state.completed === undefined){
          this.setState({
            events: array,
          });
        } else {
          this.setState({
            events: array.filter(x=> x.completed === this.state.completed),
          });
        }

      })
      .catch((error) => {
        this.setState({
          removestatus: error.date,
        });
      });
  }

  componentWillReceiveProps(props) {
    this.setState({
       events: props.events,
       completed: props.completed
      });
  }

  handleDelete(id) {
    axios
      .delete("" + process.env.REACT_APP_API + "/events/delete", {
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
          <div>Brak zadań</div>
        ) : (
          <table>
            <tbody>
              {this.state.events.map((item) => (
                <tr key={item._id}>
                  <td>
                    {item.completed ? (
                      <button
                        className="none"
                        onClick={() => {
                          this.handleChangeState(item._id, item.completed);
                        }}
                      >
                        <i className="fa fa-check"></i>
                      </button>
                    ) : (
                      <button
                        className="none"
                        onClick={() => {
                          this.handleChangeState(item._id, item.completed);
                        }}
                      >
                        <i className="fa fa-times"></i>
                      </button>
                    )}
                  </td>
                  <td>{item.title}</td>
                  <td>{item.description}</td>
                  <td>
                    {moment(item.date).locale("pl").format(this.state.format)}
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
