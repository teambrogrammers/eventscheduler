import React, { Component } from "react";

import axios from "axios";

import curlink from "../../../CurrentAPI";

// routes that will be called to better manage what is happening
const getEventRoute = "/esapi/event/";

class RecentAnnouncement extends Component {
  state = {
    event: [],
    announcement: []
  };

  aTitle = () => {
    return {
      marginTop: "5px",
      marginBottom: "0px",
      display: "inline-block",
      fontSize: "12px",
      width: "100%"
    };
  };

  aText = () => {
    return {
      marginTop: "2px",
      marginBottom: "0px",
      width: "100%",
      fontSize: "12px",
      overflowWrap: "break-word"
    };
  };

  aEvent = () => {
    return {
      marginTop: "10px",
      marginBottom: "0px",
      width: "100%",
      fontSize: "16px",
      overflowWrap: "break-word",
      borderBottom: "1px #17202A solid"
    };
  };
  componentDidMount() {
    axios
      .get(curlink + getEventRoute + this.props.ra.event_id)
      .then(res => this.setState({ event: res.data }));
    // .then(
    //   axios
    //     .get(
    //       "https://localhost:44382/esapi/recent-announcement/" + this.props.ra.event_id)
    //     .then(res => this.setState({ announcement: res.data }))
    // );
  }

  render() {
    return (
      <div>
        <p style={this.aEvent()}>
          <strong>Event: </strong>
          {this.state.event.event_name}
        </p>
        <p style={this.aTitle()}>
          <strong>Title: </strong> {this.props.ra.title}
        </p>
        <p style={this.aText()}>
          <strong>Message:</strong>
          {this.props.ra.message}
        </p>
      </div>
    );
  }
}
export default RecentAnnouncement;
