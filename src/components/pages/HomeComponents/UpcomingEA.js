import React, { Component } from "react";
import UpcomingEvent from "./UpcomingEvent";
import axios from "axios";
import RecentAnnouncment from "./RecentAnnouncement";
import curlink from "../../../CurrentAPI";

import "../../../App.css";

// routes that will be called to better manage what is happening
const getRecentEventRoute = "/esapi/recent-events/";
const getRecentAnnouncementsRoute = "/esapi/recent-announcement/";

export class UpcomingEA extends Component {
  state = {
    events: [],
    announcements: []
  };

  eventsStyle = () => {
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

  componentDidMount() {
    axios
      .get(curlink + getRecentEventRoute + this.props.user.user_id)
      .then(res => this.setState({ events: res.data }))
      .then(
        axios
          .get(curlink + getRecentAnnouncementsRoute + this.props.user.user_id)
          .then(res => this.setState({ announcements: res.data }))
      )
      .catch(error => {
        console.log(error);
      });
  }

  render() {
    return (
      <div>
        <div>
          <ul style={this.eventsStyle()}>
            <li style={this.listItem1()}>
              <p className="upcomingTable">Event</p>
            </li>

            <li style={this.listItem()}>
              <p className="upcomingTable upcomingTableDate">Date</p>
            </li>
          </ul>
        </div>
        <div style={this.eventsStyle()} />

        {/* upcoming events */}
        <div>
          {this.state.events.map(event => (
            <UpcomingEvent event={event} />
          ))}
        </div>

        {/* recent Announcements */}
        <h1 className="homepageTitle recentAnn">Recent Announcements</h1>
        <div>
          {this.state.announcements.map(ra => (
            <RecentAnnouncment ra={ra} />
          ))}
        </div>
      </div>
    );
  }
}

export default UpcomingEA;
