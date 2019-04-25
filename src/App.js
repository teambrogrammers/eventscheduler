import React, { Component } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import "./App.css";
// import "./components/pages/events.css";
import Header from "./components/layout/Header_NavBar/Header";
import HeaderLogin from "./components/layout/Header_NavBar/HeaderLogin";
import NavBar from "./components/layout/Header_NavBar/NavBar";
import Profile from "./components/layout/Profile";
import Events from "./components/pages/Events";
import Announcements from "./components/pages/Announcements";
import Login from "./components/pages/Login";
import CalendarComponent from "react-calendar";
import UpcomingSA from "./components/pages/HomeComponents/UpcomingSA";
import UpcomingEA from "./components/pages/HomeComponents/UpcomingEA";
import CreateAccount from "./components/pages/CreateAccount";
import MyAccount from "./components/pages/MyAccount";
import axios from "axios";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import listPlugin from "@fullcalendar/list";
//import interactionPlugin from "@fullcalendar/interaction";
import dateFormat from "dateformat";
import { confirmAlert } from "react-confirm-alert";

import curLink from "./CurrentAPI";

import "@fullcalendar/core/main.css";
import "@fullcalendar/daygrid/main.css";
import "@fullcalendar/list/main.css";
import "react-confirm-alert/src/react-confirm-alert.css";

// default user that is able to login
//     only use if the local or hosted api
//     is not working or setup
var isaac = {
  user_id: 3,
  first_name: "Isaac",
  last_name: "Peterson",
  email: "isaac.peterson@eagles.oc.edu",
  password: "Oklahoma2019",
  phone: "(405) 420-5566",
  is_admin: false
};
// this is used to set the user to null
//    if there is no user cached
const InitialState = {
  user: null
};

class App extends Component {
  state = {
    user: null, // the currently logged in user
    date: new Date(), // todays date
    mySessions: [], // list of sessions that the user is registered for
    creatingAccount: false // used to render the create account page
  };
  constructor(props) {
    super(props);
    this.state.creatingAccount = false; // default is false

    // get the user data from local storage (cache)
    //    if there is nothing cached, then user is null
    //    else we set the user to the cached user
    if (
      localStorage.getItem("userState") === "null" ||
      localStorage.getItem("userState") === "undefined" ||
      localStorage.getItem("userState") === null ||
      localStorage.getItem("userState") === undefined
    ) {
      console.log("We were null");
      this.state.user = null;
    } else {
      this.state.user = JSON.parse(localStorage.getItem("userState"));
    }
  }

  // When the app gets mounted we fetch the user's registered sessions
  //    this is used for the calender
  componentDidMount() {
    if (this.state.user != null) {
      axios
        .get(curLink + `/esapi/user-sessions/${this.state.user.user_id}`)
        .then(res => {
          var sessionData = [];
          res.data.map(session => {
            var tempSession = {
              title: session.session_name,
              start: session.start_date_time,
              end: session.end_date_time,
              id: session.session_id,
              color:
                dateFormat(session.start_date_time, "isoDateTime") <
                dateFormat(new Date(), "isoDateTime")
                  ? "gray"
                  : "green"
            };
            sessionData.push(tempSession);
          });
          this.setState({
            mySessions: sessionData
          });
        })
        .catch(error => {
          console.log(error);
        });
    }
    // this.setState({ creatingAccount: false });
  }

  // when the app component gets unmounted (this should never happen)
  //    we cache the signed in user
  componentWillUnmount() {
    localStorage.setItem("userState", JSON.stringify(this.state.user));
  }

  // called when we first sign in, this sets the state's user and caches it
  assignUser(data) {
    this.setState({ user: data });
    localStorage.setItem("userState", JSON.stringify(this.state.user));
  }

  // called when the user selects the sign out link
  //    deletes local storage and sets the user to null
  signOut() {
    localStorage.clear();
    this.setState({ user: null });
  }

  // called when the create account button is clicked
  //    when creatingAccount is true, it renderes the
  //    create account component
  onCreateAccount = () => {
    this.setState({ creatingAccount: true });
  };

  // this is called from the create account page when
  //     the user is done creating their account or
  //     the user clicks cancel
  doneCreateAccount = () => {
    this.setState({ creatingAccount: false });
  };

  // helper function to set the current date
  onChange = date => this.setState({ date });

  // ========================================================== ANDREW COMMENT HERE PLZZZZZ =========================================
  handleSessionClick = info => {
    confirmAlert({
      //   title: info.event.title,
      //   message: `Start Time: ${dateFormat(
      //     info.event.start,
      //     "dddd, mmmm dS, yyyy, h:MM:ss TT"
      //   )}
      //       ${
      //         info.event.end == null
      //           ? ""
      //           : `End Time: ${dateFormat(
      //               info.event.end,
      //               "dddd, mmmm dS, yyyy, h:MM:ss TT"
      //             )}`
      //       }`,
      //   buttons: [
      //     {
      //       label: "Close",
      //       onClick: () => {}
      //     }
      //   ]
      // });

      customUI: ({ onClose }) => {
        return (
          <div className="react-confirm-alert-overlay">
            <div className="react-confirm-alert">
              <div className="react-confirm-alert-body">
                <h1>{info.event.title}</h1>
                <p>
                  Start Time:{" "}
                  {dateFormat(
                    info.event.start,
                    "h:MM TT - dddd, mmmm dS, yyyy"
                  )}
                </p>
                <p>
                  End Time:{" "}
                  {info.event.end == null
                    ? "Not Specified"
                    : dateFormat(
                        info.event.end,
                        "h:MM TT - dddd, mmmm dS, yyyy"
                      )}
                </p>
                <div className="react-confirm-alert-button-group">
                  <button onClick={onClose}>Close</button>
                </div>
              </div>
            </div>
          </div>
        );
      }
    });
  };

  render() {
    // if we are creating an account, render the create account component
    if (this.state.creatingAccount === true) {
      console.log(this.state.creatingAccount);
      return (
        <CreateAccount
          createAccountComplete={this.doneCreateAccount}
          onSignOut={this.signOut.bind(this)}
          user={this.state.user}
        />
      );
      // else if the user is null or undefined (meaning we are not signed in)
      //    we render the login component
    } else if (this.state.user === null || this.state.user === undefined) {
      return (
        <div>
          {/* <HeaderLogin /> */}
          <Login
            createAccount={this.onCreateAccount}
            assignUser={this.assignUser.bind(this)}
          />
        </div>
      );
      // else we render the SPA (single page app)
    } else {
      return (
        <Router>
          <div>
            <div>
              {/* display the green header bar and the nav bar  */}
              <Header />
              <NavBar />
            </div>
            {/* App (Home) components */}
            <Route
              exact
              path="/"
              render={props => (
                <React.Fragment>
                  <div className="container">
                    {/* left side */}

                    <div className="column leftBlock">
                      <div className="leftContentHome">
                        {/* UpcomingEA = events and announcements |  UpcomingSA = sessions and announcements */}

                        <div>
                          <UpcomingEA user={this.state.user} />
                        </div>
                      </div>

                      <div className="articleLeft">
                        {/* only thing to change between sessions and events on home */}
                        <h1 className="homepageTitle myUPTitle">
                          My Upcoming Events
                        </h1>
                      </div>

                      <div className="profile">
                        {/* render the persistent profile column on the left side of the screen */}
                        <Profile
                          onSignOut={this.signOut.bind(this)}
                          username={
                            this.state.user.first_name +
                            " " +
                            this.state.user.last_name
                          }
                        />
                      </div>
                    </div>

                    {/* right side */}
                    {/* ======================================================ANDREW COMMENT HERE PLZZZZZ =============================== */}

                    <div className="column rightBlock calendar">
                      {/* <CalendarComponent
                        onChange={this.onChange}
                        value={this.state.date}
                      /> */}
                      <FullCalendar
                        defaultView="dayGridMonth"
                        plugins={[listPlugin, dayGridPlugin]}
                        header={{
                          left: "title",
                          center: "dayGridMonth listMonth",
                          right: "today prev,next"
                        }}
                        buttonText={{
                          today: "Today",
                          month: "Grid",
                          week: "Week",
                          day: "Day",
                          list: "List"
                        }}
                        noEventsMessage="No sessions to display"
                        events={this.state.mySessions}
                        eventClick={this.handleSessionClick}
                        // eventBackgroundColor="green"
                      />
                    </div>
                  </div>
                </React.Fragment>
              )}
            />
            {/* Other page components */}
            <Route
              path="/Events"
              component={() => (
                <Events
                  onSignOut={this.signOut.bind(this)}
                  user={this.state.user}
                />
              )}
            />
            <Route
              path="/Announcements"
              component={() => (
                <Announcements
                  onSignOut={this.signOut.bind(this)}
                  user={this.state.user}
                />
              )}
            />
            <Route
              path="/CreateAccount"
              component={() => (
                <CreateAccount
                  onSignOut={this.signOut.bind(this)}
                  user={this.state.user}
                />
              )}
            />
            <Route
              path="/MyAccount"
              component={() => (
                <MyAccount
                  onSignOut={this.signOut.bind(this)}
                  user={this.state.user}
                />
              )}
            />
          </div>
        </Router>
      );
    }
  }
}
export default App;
