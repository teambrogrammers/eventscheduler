import React, { Component } from "react";
import dateFormat from "dateformat";

export class UpcomingEvent extends Component {
  state = {};

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
      width: "60%"
    };
  };

  listItem = () => {
    return {
      display: "inline-block",
      width: "40%"
    };
  };

  dates = () => {
    return {
      display: "inline-block",
      width: "30%",
      format: "MM/DD/YY"
    };
  };

  render() {
    return (
      <ul style={this.sessionStyle()}>
        <li style={this.listItem1()}>
          <p>
            {this.props.event !== null ? this.props.event.event_name : "null"}
          </p>
        </li>

        <li style={this.dates()}>
          {this.props.event !== null
            ? dateFormat(this.props.event.start_date, "mm/dd")
            : "null"}
          &nbsp; - &nbsp;
          {this.props.event !== null
            ? dateFormat(this.props.event.end_date, "mm/dd")
            : "null"}
        </li>
      </ul>
    );
  }
}

export default UpcomingEvent;
