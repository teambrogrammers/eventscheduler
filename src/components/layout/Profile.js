import React, { Component } from "react";
import { Link } from "react-router-dom";

import trent from "./ProfileImages/TrentBradburry.jpg";
import isaac from "./ProfileImages/IsaacPeterson.jpg";
import adam from "./ProfileImages/AdamLibby.jpg";
import zac from "./ProfileImages/ZacCobb.jpg";
import anthony from "./ProfileImages/AnthonyWittenberg.jpg";

var curImage;

export class Profile extends Component {
  constructor(props) {
    super(props);
    this.getProfileImage();
  }
  getProfileImage = () => {
    switch (this.props.username) {
      case "Trent Bradburry":
        curImage = trent;
        break;
      case "Isaac Peterson":
        curImage = isaac;
        break;
      case "Adam Libby":
        curImage = adam;
        break;
      default:
        break;
    }
  };

  getStyle = () => {
    return {
      width: "200px",
      float: "left",
      padding: "10px",
      borderRight: "4px lightgray solid",
      height: "600px",
      textAlign: "left"
    };
  };

  render() {
    return (
      <div style={this.getStyle()}>
        <a href="/MyAccount">
          {" "}
          <img style={imageStyle} src={curImage} alt="My Account" />{" "}
        </a>

        <h3>{this.props.username ? this.props.username : "User name"}</h3>

        <Link style={linkStyle} to="/MyAccount">
          My Account
        </Link>
        <br />
        {/* <Link style={linkStyle} to="/">
          Create Announcement
        <br />
        </Link> */}
        <Link style={linkStyle} to="/Events">
          Manage Events
        </Link>
        <br />
        {/* <Link style={linkStyle} to="/">
          Manage Teams
        <br />
        </Link> */}
        <Link style={linkStyle} onClick={this.props.onSignOut} to="/">
          Sign Out
        </Link>
      </div>
    );
  }
}
export default Profile;

const imageStyle = {
  float: "center",
  padding: "5px",
  width: "175px",
  height: "175px",
  resizeMode: "contain"
};

const linkStyle = {
  color: "#000000",
  paddingLeft: "10px",
  textDecoration: "underline"
};
