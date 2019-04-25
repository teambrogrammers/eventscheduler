import React, { Component } from "react";
import Moment from "react-moment";
import axios from "axios";

import curlink from "../../../CurrentAPI";
// routes that will be called to better manage what is happening
const getSessionEvent = "/esapi/event/";

export class UpcomingSession extends Component {
  state = {
    eventName: null
  };

  sessionStyle = () => {
    return {
      borderBottom: "1px #17202A solid",
      marginTop: "0px",
      marginBottom: "0px"
    };
  };

  listItem1 = () => {
    return {
      display: "inline-block",
      width: "50%"
    };
  };

  listItem = () => {
    return {
      display: "inline-block",
      width: "25%"
    };
  };

  componentDidMount() {
    axios
      .get(curlink + getSessionEvent + this.props.session.event_id)
      .then(res => this.setState({ eventName: res.data.event_name }));
  }

  render() {
    return (
      <ul style={this.sessionStyle()}>
        <li style={this.listItem1()}>
          <p>{this.props.session !== null ? this.state.eventName : "null"}</p>
        </li>

        <li style={this.listItem()}>
          <Moment format="MM/DD/YYYY">
            {this.props.session !== null
              ? this.props.session.start_date_time
              : "null"}
          </Moment>
        </li>

        <li style={this.listItem()}>
          <Moment format="LT">
            {this.props.session !== null
              ? this.props.session.start_date_time
              : "null"}
          </Moment>
        </li>
      </ul>
    );
  }
}

export default UpcomingSession;
