import React, { Component } from "react";
import UpcomingSession from "./UpcomingSession";
import axios from "axios";
import RecentAnnouncment from "./RecentAnnouncement";

import curlink from "../../../CurrentAPI";

// routes that will be called to better manage what is happening
const getUpcomingSessions = "/esapi/upcoming-sessions/";

export class UpcomingSA extends Component {
  state = {
    sessions: [],
    announcements: []
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
      .get(curlink + getUpcomingSessions + this.props.user.user_id)
      .then(res => this.setState({ sessions: res.data }))
      .catch(error => {
        console.log(error);
      });
  }

  render() {
    return (
      <div>
        <div>
          <ul style={this.sessionStyle()}>
            <li style={this.listItem1()}>
              <p>Event</p>
            </li>

            <li style={this.listItem()}>
              <p>Date</p>
            </li>

            <li style={this.listItem()}>
              <p>Time</p>
            </li>
          </ul>
        </div>
        <div style={this.sessionStyle()} />

        {/* upcoming sessions */}
        <div>
          {this.state.sessions.map(session => (
            <UpcomingSession session={session} />
          ))}
        </div>

        {/* recent Announcements */}
        <h1 className="homepageTitle">Recent Announcements</h1>
        <div>
          {this.state.sessions.map(ra => (
            <RecentAnnouncment ra={ra} />
          ))}
        </div>
      </div>
    );
  }
}

export default UpcomingSA;
