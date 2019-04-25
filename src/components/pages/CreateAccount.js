import React from "react";
import ReactTooltip from "react-tooltip";

import saveIcon from "./images/saveIcon.png";
import closeIcon from "./images/closeIcon.png";

import "./myAccount.css";

var errorValidateName = "inputError";

//Import and Add routing to app.js upon add/merge
//import CreateAccount from "./components/pages/CreateAccount";
class CreateAccount extends React.Component {
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
    confirm_password_Validate: ""
  };

  handleSignUp(user) {
    //user.preventDefault();
    let first_name = this.refs.first_name.value;
    let last_name = this.refs.last_name.value;
    let email = this.refs.email.value;
    let password = this.refs.password.value;
    let phone = this.refs.phone.value;
    this.create(first_name, last_name, email, password, phone);
  }

  create(first_name, last_name, email, password, phone) {
    //const url = "https://localhost:44382/esapi/user/";
    const url = "https://paycomeventsystem.azurewebsites.net/esapi/user/";
    // this.alertUser("Creating account...");
    fetch(url, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        first_name: first_name,
        last_name: last_name,
        email: email,
        password: password,
        phone: phone,
        is_admin: false
      })
    }).then(response => {
      console.log(response.status);
      if (response.status == 400 || response.status == 500) {
        alert("Failed to create account: " + response.status + " error");
      } else {
        alert("Create Account Success!");
        this.props.createAccountComplete();
      }
    });
  }

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

  isPasswordMatch = () => {
    console.log("In Passwords Match");
    console.log(this.state.password);
    return this.state.password === this.state.confirm_password;
  };

  render() {
    return (
      <div className="acctFormDiv">
        <form className="acctForm" onSubmit={this.handleSignUp.bind(this)}>
          <h1 className="acctTitle">Create Account</h1>
          <div className="leftCol leftColMyAcct">
            <br />
            <strong>First Name:</strong>
            <br />
            <input
              //className={this.state.first_name_Validate}
              type="text"
              value={this.state.first_name}
              ref="first_name"
              className={this.state.first_name_Validate}
              placeholder="Enter your First Name"
              onChange={e => {
                this.setState({
                  first_name: e.target.value,
                  first_name_Validate: ""
                });
              }}
            />
            <br />
            <strong>E-mail:</strong>
            <br />
            <input
              //className={this.state.email_Validate}
              type="text"
              ref="email"
              className={this.state.email_Validate}
              value={this.state.email}
              placeholder="Enter your Email"
              onChange={e => {
                this.setState({ email: e.target.value, email_Validate: "" });
              }}
            />
            <br />
            <strong>Password:</strong>
            <br />
            <input
              //className={this.state.password_Validate}
              type="password"
              ref="password"
              className={this.state.password_Validate}
              value={this.state.password}
              placeholder="Enter your Password"
              onChange={e => {
                this.setState({
                  password: e.target.value,
                  password_Validate: ""
                });
              }}
            />
          </div>
          <div className="rightCol">
            <br />
            <strong>Last Name:</strong>
            <br />
            <input
              //className={this.state.last_name_Validate}
              type="text"
              ref="last_name"
              className={this.state.last_name_Validate}
              value={this.state.last_name}
              placeholder="Enter your Last Name"
              onChange={e => {
                this.setState({
                  last_name: e.target.value,
                  last_name_Validate: ""
                });
              }}
            />
            <br />
            <strong>Phone:</strong>
            <br />
            <input
              //className={this.state.password_Validate}
              type="text"
              pattern="[0..9]*"
              ref="phone"
              pattern="[0..9]*"
              value={this.state.phone}
              className={this.state.phone_Validate}
              placeholder="Enter your Phone Number"
              onChange={e => {
                this.setState({
                  phone: e.target.value.replace(/\D/, ""),
                  phone_Validate: ""
                });
              }}
            />
            <br />
            <strong>Confirm Password:</strong>
            <br />
            <input
              //className={this.state.confirm_password_Validate}
              type="password"
              className={this.state.confirm_password_Validate}
              ref="confirm_password"
              placeholder="Confirm Password"
              value={this.state.confirm_password}
              onChange={e => {
                this.setState({
                  confirm_password: e.target.value,
                  confirm_password_Validate: ""
                });
              }}
            />
          </div>
          <div className="pUpBtns">
            <React.Fragment>
              <img
                className="save"
                data-tip="Save"
                src={saveIcon}
                // onClick={() => {
                //   this.handleSignUp();
                // }}
                onClick={() => {
                  if (this.validateForm()) {
                    if (this.isPasswordMatch()) {
                      this.handleSignUp();
                    } else {
                      this.setState({
                        password: "",
                        confirm_password: "",
                        password_Validate: errorValidateName,
                        confirm_password_Validate: errorValidateName
                      });
                    }
                  }
                }}
              />
              <ReactTooltip place="bottom" type="dark" effect="solid" />
            </React.Fragment>

            <React.Fragment>
              <a>
                {/**href="/Login"*/}
                <img
                  className="save"
                  data-tip="Return to Sign In"
                  src={closeIcon}
                  onClick={() => this.props.createAccountComplete()}
                  // onClick={() => {
                  //   if (this.validateForm()) {
                  //     if (this.isPasswordMatch) {
                  //       console.log("Passwords Match");
                  //     } else {
                  //       this.state.confirm_password = "";
                  //       this.state.password = "";
                  //       console.log("Password's Dont' Match");
                  //     }
                  //     //this.onSubmitAcctInfo();
                  //     //this.displayConfirmPopup();
                  //     //close();
                  //   }
                  // }}
                />
                <ReactTooltip place="bottom" type="dark" effect="solid" />
              </a>
            </React.Fragment>
          </div>
          {/* <input type="submit" value="Create Account" /> */}
        </form>
      </div>
    );
  }
}
export default CreateAccount;
