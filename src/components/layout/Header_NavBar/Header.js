import React from "react";
import accountImage from "./accountIcon.png";
import homeImage from "./homeIcon.png";
console.log(accountImage);
console.log(homeImage);

export default function Header() {
  return (
    <header style={headerStyle}>
      <a href="MyAccount">
        {" "}
        <img
          style={accountImageStyle}
          src={accountImage}
          alt="My Account"
        />{" "}
      </a>
      <a href="/">
        {" "}
        <img style={homeImageStyle} src={homeImage} alt="Home" />{" "}
      </a>
    </header>
  );
}

const accountImageStyle = {
  float: "right",
  padding: "7px",
  paddingLeft: "0px",
  width: "50px",
  height: "50px",
  resizeMode: "contain"
};

const homeImageStyle = {
  float: "left",
  padding: "7px",
  width: "55px",
  height: "50px",
  resizeMode: "contain"
};

const headerStyle = {
  background: "#008f48",
  height: "50px"
};
