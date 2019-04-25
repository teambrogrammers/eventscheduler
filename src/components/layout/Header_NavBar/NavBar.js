import React from "react";
import { NavLink } from "react-router-dom";

import "./navBar.css";

const navBarStyle = {
  background: "#FDFEFE",
  textAlign: "center",
  padding: "10px"
};

const linkStyle = {
  color: "#000000",
  padding: "10px"
};

class NavBar extends React.Component {
  render() {
    return (
      <div style={navBarStyle}>
        <NavLink style={linkStyle} to="/" exact activeClassName="activeLink">
          Home
        </NavLink>{" "}
        |
        <NavLink style={linkStyle} to="/Events" activeClassName="activeLink">
          Events
        </NavLink>{" "}
        |
        <NavLink
          style={linkStyle}
          to="/Announcements"
          activeClassName="activeLink"
        >
          Announcements
        </NavLink>
      </div>
    );
  }
}

export default NavBar;
