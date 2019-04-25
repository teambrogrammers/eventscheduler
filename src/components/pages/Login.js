import React from "react";
import curlink from "../../CurrentAPI";

import "./login.css";

const getLoginRoute = "/esapi/userlogin/";

// Component Summary: this handles the login system
// Props: function: createAccount, function: assignUser
// Other info: na
class LoginPage extends React.Component {
  handleSignIn(e) {
    e.preventDefault();
    let username = this.refs.username.value;
    let password = this.refs.password.value;
    this.login(username, password);
  }

  // call the api and pass in the username and password
  //    if the api does not return a valid user,
  //    it throws an error, either server related or incorrect credentials
  login(uname, pword) {
    const url = curlink + getLoginRoute + uname + "/" + pword;
    fetch(url)
      .then(results => {
        if (results.status === 200) return results.json();
        else {
          var error = new Error();
          if (results.status === 500) {
            error.message = "Server Currently Unavailable";
            throw error;
          } else {
            error.message = "Incorrect Username or Password";
            throw error;
          }
        }
      })
      .then(data => {
        const userData = {
          user_id: data.user_id,
          first_name: data.first_name,
          last_name: data.last_name,
          email: data.email,
          password: data.password,
          phone: data.phone,
          is_admin: data.is_admin
        };
        //this.setState({user: userData});
        // not sure why this is being called here and in the assignUser function
        //   but it works so I'm not changing it right now
        localStorage.setItem("userState", JSON.stringify(userData));
        this.props.assignUser(userData);
      })
      .catch(function(err) {
        alert(err.message);
      });
  }

  render() {
    return (
      <React.Fragment>
        <div className="TopBar">
          <h1 className="Welcome"> Event Scheduler </h1>
        </div>
        <div className="loginFormDiv">
          <form onSubmit={this.handleSignIn.bind(this)}>
            <div className="title">
              <h1 className="signIn">Sign in</h1>
            </div>
            <input type="text" ref="username" placeholder="Email" />
            <br />
            <input type="password" ref="password" placeholder="Password" />
            <br />
            <br />
            <br />
            <input type="submit" value="Login" />
            <a onClick={() => this.props.createAccount()}>
              <h3 className="newAcct">Create Account</h3>
            </a>
          </form>
        </div>
      </React.Fragment>
    );
  }
}
export default LoginPage;
