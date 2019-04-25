import React from "react";
import ReactTooltip from "react-tooltip";

import saveIcon from "./images/saveIcon.png";

import "./myAccount.css";

var errorValidateName = "inputError";

//Import and Add routing to app.js upon add/merge
//import MyAccount from "./components/pages/MyAccount";
class MyAccount extends React.Component {
  state = {
    first_name: "",
    first_name_Validate: "",
    last_name: "",
    last_name_Validate: "",
    email: "",
    email_Validate: "",
    password: "",
    password_Validate: "",
    confirm_password: "",
    confirm_password_Validate: "",
    phone: "",
    phone_Validate: "",
    is_admin: ""
  };

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.fillUser();
  }

  fillUser() {
    this.setState({
      first_name: this.props.user.first_name,
      last_name: this.props.user.last_name,
      email: this.props.user.email,
      password: this.props.user.password,
      confirm_password: "",
      phone: this.props.user.phone,
      is_admin: this.props.user.is_admin
    });
  }

  handleSignUp(user) {
    user.preventDefault();
    const url = "https://paycomeventsystem.azurewebsites.net/esapi/user/";
    fetch(url, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        first_name: this.state.first_name,
        last_name: this.state.last_name,
        email: this.state.email,
        password: this.state.password,
        phone: this.state.phone,
        is_admin: this.state.is_admin
      })
    }).then(response => {
      console.log(response.status);
    });
  }

  //const url = "https://localhost:44382/esapi/user/";
  onChangeFirstName = e => {
    this.setState({
      first_name: e.target.value,
      first_name_Validate: ""
    });
  };
  onChangeLastName = e => {
    this.setState({
      last_name: e.target.value,
      last_name_Validate: ""
    });
  };
  onChangeEmail = e => {
    this.setState({
      email: e.target.value,
      email_Validate: ""
    });
  };
  onChangePassword = e => {
    this.setState({
      password: e.target.value,
      password_Validate: ""
    });
  };
  onChangeConfirmPassword = e => {
    this.setState({
      confirm_password: e.target.value,
      confirm_password_Validate: ""
    });
  };
  onChangePhone = e => {
    this.setState({
      phone: e.target.value,
      password_Validate: ""
    });
  };

  validateForm = () => {
    var validated = true;

    var isValid = {
      fname: true,
      lname: true,
      email: true,
      pwd: true,
      confPwd: true,
      phone: true
    };

    if (this.state.first_name === "") {
      isValid.fname = false;
      validated = false;
    }
    if (this.state.last_name === "") {
      isValid.lname = false;
      validated = false;
    }

    if (this.state.email === "") {
      isValid.email = false;
      validated = false;
    }

    if (this.state.password === "") {
      isValid.pwd = false;
      validated = false;
    }

    if (this.state.confirm_password === "") {
      isValid.confPwd = false;
      validated = false;
    }

    if (this.state.phone === "") {
      isValid.phone = false;
      validated = false;
    }

    this.setState({
      first_name_Validate: isValid.fname ? "" : errorValidateName,
      last_name_Validate: isValid.lname ? "" : errorValidateName,
      email_Validate: isValid.email ? "" : errorValidateName,
      password_Validate: isValid.pwd ? "" : errorValidateName,
      confirm_password_Validate: isValid.confPwd ? "" : errorValidateName,
      phone_Validate: isValid.phone ? "" : errorValidateName
    });

    return validated;
  };

  isPasswordMatch() {
    console.log("In Passwords Match");
    console.log(this.state.password);
    return this.state.password === this.state.confirm_password;
  }

  render() {
    return (
      <div className="acctFormDiv">
        <form className="acctForm" onSubmit={this.handleSignUp.bind(this)}>
          <h1 className="acctTitle">My Account</h1>
          <div className="leftCol leftColMyAcct">
            <br />
            <strong>First Name:</strong>
            <br />
            <input
              className={this.state.first_name_Validate}
              type="text"
              ref="first_name"
              placeholder="Update First Name"
              value={this.state.first_name}
              onChange={e => this.onChangeFirstName(e)}
            />
            <br />
            <strong>E-mail:</strong>
            <br />
            <input
              className={this.state.email_Validate}
              type="text"
              ref="email"
              placeholder="Update Email"
              value={this.state.email}
              onChange={e => this.onChangeEmail(e)}
            />
            <br />
            <strong>Password:</strong>
            <br />
            <input
              className={this.state.password_Validate}
              type="password"
              ref="password"
              placeholder="Update Password"
              value={this.state.password}
              onChange={e => this.onChangePassword(e)}
            />
          </div>
          <div className="rightCol">
            <br />
            <strong>Last Name:</strong>
            <br />
            <input
              className={this.state.last_name_Validate}
              type="text"
              ref="last_name"
              placeholder="Update Last Name"
              value={this.state.last_name}
              onChange={e => this.onChangeLastName(e)}
            />
            <br />
            <strong>Phone:</strong>
            <br />
            <input
              className={this.state.password_Validate}
              type="text"
              ref="phone"
              placeholder="Update Phone Number"
              value={this.state.phone}
              onChange={e => this.onChangePhone(e)}
            />
            <br />
            <strong>Confirm Password:</strong>
            <br />
            <input
              className={this.state.confirm_password_Validate}
              type="password"
              ref="confirm_password"
              placeholder="Confirm Password"
              value={this.state.confirm_password}
              onChange={e => this.onChangeConfirmPassword(e)}
            />
          </div>
          <div className="pUpBtns">
            <React.Fragment>
              <img
                className="save"
                data-tip="Save"
                src={saveIcon}
                onClick={() => {
                  if (this.validateForm()) {
                    if (this.isPasswordMatch) {
                      console.log("Passwords Match");
                    } else {
                      this.state.confirm_password = "";
                      this.state.password = "";
                      console.log("Password's Dont' Match");
                    }
                    //this.onSubmitAcctInfo();
                    //this.displayConfirmPopup();
                    //close();
                  }
                }}
              />
              <ReactTooltip place="bottom" type="dark" effect="solid" />
            </React.Fragment>
          </div>
          {/* <input className="acctInput" type="submit" value="Save" /> */}
        </form>
      </div>
    );
  }
}
export default MyAccount;
