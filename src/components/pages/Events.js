import axios from "axios";
import dateFormat from "dateformat";
import React, { Component } from "react";
import { confirmAlert } from "react-confirm-alert"; // Import
import "react-confirm-alert/src/react-confirm-alert.css"; // Import css
import { Route } from "react-router-dom";
import ReactTable from "react-table";
import "react-table/react-table.css";
import ReactTooltip from "react-tooltip";
import "../../App.css";
import curlink from "../../CurrentAPI";
import ViewRegisteredUsersPopup from "./EventComponents/ViewRegisteredUsersPopup";
import Profile from "../layout/Profile";
import CreateEventPopup from "./EventComponents/CreateEventPopup";
import CreateSessionsPopup from "./EventComponents/CreateSessionsPopup";
import EditEventPopup from "./EventComponents/EditEventPopup";
import EditSessionPopup from "./EventComponents/EditSessionsPopup";
import ManageCheckedInUsers from "./EventComponents/ManageCheckedInUsers";
import ManageSessionRegisteredUsers from "./EventComponents/ManageSessionRegisteredUsers";
import "./events.css";
import checkInStatusIcon from "./images/checkInStatusIcon.png";
import deleteIcon from "./images/deleteIcon.png";
import registerIcon from "./images/registerIcon.jpg";
import unregisterIcon from "./images/unregisterIcon.jpg";
import emailIcon from "./images/emailIcon.jpg";
import teamIcon from "./images/teamIcon.png";
import EmailTeamPopup from "./EventComponents/EmailTeamPopup";
import ManageTeamPopup from "./EventComponents/ManageTeamPopup";

// these are the API routes that are used in this mother-of-all component
const getAllEventsRoute = "/esapi/all-events/";
const getEventSessionsRoute = "/esapi/event-sessions/";
const putEventRoute = "/esapi/event/";
const putSessionRoute = "/esapi/session/";
const deleteEventRoute = "/esapi/delete-event/";
const deleteSessionRoute = "/esapi/delete-session/";
const registerUserRoute = "/esapi/register-user/";
const unregisterUserRoute = "/esapi/unregister-user/";
const checkInRoute = "/esapi/check-in-user/";
const getRegisteredUsersRoute = "/esapi/session-users/";

const moment = require("moment");

var eventTypeBtn = "My Events";
const putEventURL = "https://localhost:44382/esapi/event/";
const putSessionsURL = "https://localhost:44382/esapi/session/";
var allEventsClicked = { borderBottomColor: "#05c839" };
var myEventsClicked = { borderBottomColor: "transparent" };

const defaultEventName = "Click on event to view details";

// Component Summary: This is essentially the main application,
//        for admins: create/edit/delete events, sessions, and teams
//        for users:  view and register for sessions, check into a session,
//                    and contact the team that you are on via email
// Props: function: onSignOut, data: user
// Other info: anything a user can do, an admin can do. Admins are just super users
class Events extends Component {
  state = {
    events: [], // all available events
    myEvents: [], // all events that the signed in user is registered for
    event: {
      // the currently selected event
      event_name: defaultEventName
    },
    eventSessions: [], // the currently selected event's sessions
    creatingSession: false, // unused (i think)
    showEventDetails: false, // used to show the event details on the right panel
    isAllEvents: true, // true is allEvents. used to toggle between my and all events
    eventSelectedIndex: -1, // the currently selected event's index. used for reacttable highlighting
    sessionSelectedIndex: -1, // currently selected session. used for reacttable highlighting
    selectedSession: {} // the currently selected session
  };

  constructor(props) {
    super(props);
    // default style for the all/my events label
    allEventsClicked = { borderBottomColor: "#05c839" };
    myEventsClicked = { borderBottomColor: "transparent" };
  }

  // ************* CREATE EVENT FUNCTIONS ********************
  // this function calls the API to create a new event.
  //     it is passed in an event and then if successefully
  //     posted it will refresh the event list, if failed, it displays
  //     an error message
  onCreateEvent = event => {
    fetch(curlink + putEventRoute, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        address: event.address,
        start_date: event.start_date,
        end_date: event.end_date,
        event_name: event.name,
        description: event.description
      })
    }).then(response => {
      console.log(response.status);
      this.refreshEventList();
      if (response.status > 201) {
        alert("Event failed to create. Error: " + response.status);
      } else {
        alert("Event successfully created.");
      }
    });
  };

  aConfirm = () => {
    return {
      width: "100%",
      fontSize: "12px",
      paddingLeft: "0px",
      overflowWrap: "break-word"
    };
  };

  // this is used to send an email to all users who are
  //    currently registered to a specific session notifying them
  //    that the session has been updated.
  contactRegisteredUsers = () => {
    var service_id = "default_service";
    var template_id = "eventscheduler";

    axios
      .get(
        curlink +
          getRegisteredUsersRoute +
          this.state.selectedSession.session_id
      )
      .then(res => {
        res.data.forEach(user => {
          var template_params = {
            to_email: user.email,
            event_name: this.state.event.event_name,
            session_name: this.state.selectedSession.session_name
          };
          window.emailjs
            .send(service_id, template_id, template_params)
            .then(res => {
              console.log(res);
            })
            .catch(err => {
              console.log(err);
            });
        });
        console.log(res);
      });
  };

  // called when the ALL button is pressed,
  //   this essentially resets the events page
  //   to its initial load.
  allEventsSelected = () => {
    this.setState({
      isAllEvents: true,
      eventSelectedIndex: 0,
      event: this.state.events[0]
    });
    this.refreshSessionList(this.state.events[0].event_id);
    allEventsClicked = { borderBottomColor: "#05c839" };
    myEventsClicked = { borderBottomColor: "transparent" };
  };

  // called when the MY button is pressed,
  //   this will set the states data to display
  //   the myEvent data.
  myEventsSelected = () => {
    this.setState({
      isAllEvents: false,
      eventSelectedIndex: 0,
      event: this.state.myEvents[0]
    });
    this.refreshSessionList(this.state.myEvents[0].event_id);

    allEventsClicked = { borderBottomColor: "transparent" };
    myEventsClicked = { borderBottomColor: "#05c839" };
  };

  // called when a new session is to be added.
  //   calls the API to post the passed data to
  //   create a new session. Then notifies the
  //   user that it was either created or it failed.
  addNewSession = session => {
    console.log(this.state.event.event_id);
    console.log(session);
    fetch(curlink + putSessionRoute, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        session_name: session.name,
        capacity: session.capacity,
        start_date_time: session.start_date_time,
        end_date_time: session.end_date_time,
        event_id: this.state.event.event_id
      })
    })
      .then(e => {
        console.log(e);
        if (e.status > 201) {
          alert("Session failed to create.");
        } else {
          alert("Session successfully created.");
        }
        this.refreshSessionList(this.state.event.event_id);
      })
      .catch(err => {
        console.log(err.message);
      });
  };

  // shows a confirmation popup displaying information
  //    about the event the admin is about to delete.
  confirmDelete = () => {
    confirmAlert({
      title: "Delete " + this.state.event.event_name + "?",

      childrenElement: () => (
        <div style={this.aConfirm()}>
          <br />
          <strong>Start Date:</strong> {this.state.event.start_date}
          &nbsp; &nbsp;
          <strong>End Date:</strong> {this.state.event.end_date}
          <br />
          <br />
          <strong>Description:</strong> {this.state.event.description}
          <br />
          <br />
        </div>
      ),
      buttons: [
        {
          label: "Yes",
          onClick: () => {
            axios
              .delete(curlink + deleteEventRoute + this.state.event.event_id)
              .then(res => {
                axios.get(curlink + getAllEventsRoute).then(res =>
                  this.setState({
                    events: res.data.map(event => {
                      event.start_date = dateFormat(
                        event.start_date,
                        "mm/dd/yyyy"
                      );
                      event.end_date = dateFormat(event.end_date, "mm/dd/yyyy");
                      return event;
                    })
                  })
                );
              })
              .catch(error => {
                console.log(error);
              });
            this.setState({
              event: {
                event_name: defaultEventName
              }
            });
          }
        },
        {
          label: "No",
          onClick: () => {
            console.log("no");
          }
        }
      ]
    });
  };

  // essentially the same as deleting an event, but the
  //    data being displayed is related to the session instead
  //    of the event.
  confirmDeleteSession = () => {
    confirmAlert({
      title: "Delete " + this.state.selectedSession.session_name + "?",
      childrenElement: () => (
        <div style={this.aConfirm()}>
          <strong> Event Name: </strong> {this.state.event.event_name}
          <br />
          <br />
          <strong> Session Details: </strong>
          <br />
          <strong>Start Date:</strong> {this.state.selectedSession.start_date}
          &nbsp; &nbsp;
          <strong>Start Time:</strong> {this.state.selectedSession.start_time}
          <br />
          <strong>End Date:</strong> {this.state.selectedSession.end_date}
          &nbsp; &nbsp; &nbsp;
          <strong>End Time:</strong> {this.state.selectedSession.end_time}
          <br />
          <br />
        </div>
      ),
      buttons: [
        {
          label: "Yes",
          onClick: () => {
            axios
              .delete(
                curlink +
                  deleteSessionRoute +
                  this.state.selectedSession.session_id
              )
              .then(res => {
                this.setState({ selectedSession: {}, sessionSelectedIndex: 0 });
                this.refreshSessionList(this.state.event.event_id);
              })
              .catch(error => {
                console.log(error);
              });
          }
        },
        {
          label: "No",
          onClick: () => {
            console.log("no");
          }
        }
      ]
    });
  };

  // ================================================================================ ANDREW COMMENT HERE PLZZZZ =====================================
  confirmRegisterSession = () => {
    var curTime = moment();
    var startTime = moment(this.state.selectedSession.start_date_time);
    var endTime = moment(this.state.selectedSession.end_date_time);

    if (curTime > startTime && curTime < endTime) {
      confirmAlert({
        title: "Session In Progress",
        message: "Please contact an administrator to register.",
        buttons: [
          {
            label: "Close",
            onClick: () => {}
          }
        ]
      });
    } else if (curTime > endTime) {
      confirmAlert({
        title: "Session Ended",
        message: "Session Closed.",
        buttons: [
          {
            label: "Close",
            onClick: () => {}
          }
        ]
      });
    } else {
      confirmAlert({
        title: "Register",
        message: `Register for ${this.state.selectedSession.session_name}?`,
        buttons: [
          {
            label: "Confirm",
            onClick: () => {
              axios
                .post(
                  curlink +
                    registerUserRoute +
                    this.state.selectedSession.session_id +
                    "/" +
                    this.props.user.user_id
                )
                .then(res => {
                  this.refreshSessionList(this.state.event.event_id);
                  alert("Registration successful.");
                })
                .catch(error => {
                  alert("Registration failed. Please try again!");
                });
            }
          },
          {
            label: "Cancel",
            onClick: () => {}
          }
        ]
      });
    }
  };

  // ================================================================================ ANDREW COMMENT HERE PLZZZZ =====================================
  confirmUnregisterSession = () => {
    confirmAlert({
      title: "Unregister from " + this.state.selectedSession.session_name + "?",

      childrenElement: () => (
        <div style={this.aConfirm()}>
          <strong> Event Name: </strong> {this.state.event.event_name}
          <br />
          <br />
          <strong> Session Details: </strong>
          <br />
          <strong>Start Date:</strong> {this.state.selectedSession.start_date}
          &nbsp; &nbsp;
          <strong>Start Time:</strong> {this.state.selectedSession.start_time}
          <br />
          <strong>End Date:</strong> {this.state.selectedSession.end_date}
          &nbsp; &nbsp; &nbsp;
          <strong>End Time:</strong> {this.state.selectedSession.end_time}
          <br />
          <br />
        </div>
      ),
      buttons: [
        {
          label: "Confirm",
          onClick: () => {
            axios
              .delete(
                curlink +
                  unregisterUserRoute +
                  this.state.selectedSession.session_id +
                  "/" +
                  this.props.user.user_id
              )
              .then(function(response) {
                alert("Unregistration successful.");
              })
              .then(res => {
                this.refreshSessionList(this.state.event.event_id);
              })
              .catch(function(error) {
                alert("Unregistration failed. Please try again!");
              });
          }
        },
        {
          label: "Cancel",
          onClick: () => {}
        }
      ]
    });
  };

  // ================================================================================ ANDREW COMMENT HERE PLZZZZ =====================================
  confirmCheckIn = () => {
    var curTime = moment();
    var startTime = moment(this.state.selectedSession.start_date_time).subtract(
      30,
      "minutes"
    );
    var endTime = moment(this.state.selectedSession.end_date_time).add(
      30,
      "minutes"
    );

    if (curTime < startTime) {
      confirmAlert({
        title: "Check-In Unavailable ",
        childrenElement: () => (
          <div style={this.aConfirm()}>
            <strong>Session: </strong> {this.state.selectedSession.session_name}{" "}
            <br />
            <strong>Date: </strong>{" "}
            {dateFormat(this.state.selectedSession.start_date, "mm/dd/yyyy")}
            <br />
            <strong>Check-In Window: </strong>{" "}
            {dateFormat(startTime, "hh:MM TT")} -{" "}
            {dateFormat(
              moment(this.state.selectedSession.start_date_time).add(
                30,
                "minutes"
              ),
              "hh:MM TT"
            )}
            <br />
          </div>
        ),
        buttons: [
          {
            label: "Close",
            onClick: () => {}
          }
        ]
      });
    } else if (
      curTime > endTime &&
      curTime < moment(this.state.selectedSession.end_date_time)
    ) {
      confirmAlert({
        title: "Check-In Closed",
        message: "Please see an Administrator to check-in",
        buttons: [
          {
            label: "Close",
            onClick: () => {}
          }
        ]
      });
    } else if (curTime > moment(this.state.selectedSession.end_date_time)) {
      confirmAlert({
        title: "Session Ended",
        message: "Session closed.",
        buttons: [
          {
            label: "Close",
            onClick: () => {}
          }
        ]
      });
    } else if (curTime >= startTime && curTime <= endTime) {
      confirmAlert({
        title: "Check-In to " + this.state.selectedSession.session_name + "?",
        childrenElement: () => (
          <div style={this.aConfirm()}>
            <strong> Event Name: </strong> {this.state.event.event_name}
            <br />
            <br />
            <strong> Session Details: </strong>
            <br />
            <strong>Start Date:</strong> {this.state.selectedSession.start_date}
            &nbsp; &nbsp;
            <strong>Start Time:</strong> {this.state.selectedSession.start_time}
            <br />
            <strong>End Date:</strong> {this.state.selectedSession.end_date}
            &nbsp; &nbsp; &nbsp;
            <strong>End Time:</strong> {this.state.selectedSession.end_time}
            <br />
            <br />
          </div>
        ),
        buttons: [
          {
            label: "Confirm",
            onClick: () => {
              axios
                .put(
                  curlink +
                    checkInRoute +
                    this.state.selectedSession.session_id +
                    "/" +
                    this.props.user.user_id
                )
                .then(function(response) {
                  console.log(`Check-In successful: ${response}`);
                  alert("Check-In successful.");
                })
                .catch(function(error) {
                  console.log(`Check-In failed: ${error}`);
                  alert("Check-In failed. Please try again!");
                });
            }
          },
          {
            label: "Cancel",
            onClick: () => {}
          }
        ]
      });
    }
  };

  // called whenever a new event was created and when the component
  //   mounts. This will call the API to get all the events and
  //   sets the state data to the result, then it handles the auto-selection
  //   by setting the selected index back to 0 and the currently selected event
  //   back to the first event in the list.
  //   meanwhile, it is also fetching the API to get the my events data as well.
  refreshEventList = () => {
    var url = curlink + getAllEventsRoute;

    axios
      .get(url)
      .then(res =>
        this.setState({
          events: res.data.map(event => {
            event.start_date = dateFormat(event.start_date, "mm/dd/yyyy");
            event.end_date = dateFormat(event.end_date, "mm/dd/yyyy");
            return event;
          })
        })
      )
      .then(result => {
        if (this.state.event.event_name === defaultEventName) {
          console.log(this.state.events[0]);
          this.setState({
            showEventDetails: true,
            eventSelectedIndex: 0,
            sessionSelectedIndex: 0,
            event: this.state.events[0]
          });
          this.refreshSessionList(this.state.event.event_id);
        }
      })
      .catch(error => {
        console.log(error);
      });

    url += this.props.user.user_id;
    axios
      .get(url)
      .then(res =>
        this.setState({
          myEvents: res.data.map(event => {
            event.start_date = dateFormat(event.start_date, "mm/dd/yyyy");
            event.end_date = dateFormat(event.end_date, "mm/dd/yyyy");
            return event;
          })
        })
      )
      .then(() => {
        this.setState({
          showEventDetails: true
        });
      })
      .catch(error => {
        console.log(error);
      });
  };

  // runs right after the component mounts - want to use for requests
  componentDidMount() {
    this.refreshEventList();
  }

  // ================================================================================ ANDREW COMMENT HERE PLZZZZ =====================================
  checkRegistrationStatus = () => {
    // console.log(this.state.eventSessions);

    var tempSessions = this.state.eventSessions;

    tempSessions.map(session => {
      var url = curlink + `/esapi/session-users/${session.session_id}`;

      axios
        .get(url)
        .then(res => {
          session.isRegistered = "Not Registered";
          res.data.forEach(attendee => {
            if (attendee.user_id == this.props.user.user_id) {
              session.isRegistered = "Registered";
              return session;
            }
          });
        })
        .then(() => {
          this.setState({ eventSessions: tempSessions });
        })
        .catch(error => {
          console.log(error);
        });
    });
  };

  // this probably needs to be optimized, but this function is called
  //    everytime the user selects an event from the list of events and
  //    populates the session data with the result. Then it handles the auto
  //    selection of the session by defaulting to the first session (if one exitsts)
  refreshSessionList = eventID => {
    // fetch session data
    axios
      .get(curlink + getEventSessionsRoute + eventID)
      .then(res => {
        console.log(res);
        this.setState({
          eventSessions: res.data.map(session => {
            session.start_date = dateFormat(
              session.start_date_time,
              "mm/dd/yyyy"
            );
            session.start_time = dateFormat(session.start_date_time, "h:MM TT");
            session.end_date = dateFormat(session.end_date_time, "mm/dd/yyyy");
            session.end_time = dateFormat(session.end_date_time, "h:MM TT");
            session.isRegistered = "...";
            return session;
          })
        });
      })
      .then(result => {
        // set the selected session to the first one by default
        if (this.state.eventSessions.length > 0) {
          this.setState({
            selectedSession: this.state.eventSessions[0],
            sessionSelectedIndex: 0
          });
        } else {
          this.setState({ selectedSession: {} });
        }
      })
      .then(res => {
        this.checkRegistrationStatus();
      })
      .catch(error => {
        console.log(error);
      });
  };

  // set the currently selected event to the event being passed.
  setSelectedEvent = e => {
    this.setState({ event: e });
  };

  manageTeams() {
    console.log("Manage teams pressed");
  }

  render() {
    const eventColumns = [
      {
        Header: "Event Name",
        accessor: "event_name",
        width: 180
      },
      {
        Header: "Start Date",
        accessor: "start_date"
      },
      {
        Header: "End Date",
        accessor: "end_date"
      }
      // },
      // {
      //   Header: "Status",
      //   accessor: "s"
      // }
    ];

    const sessionColumns = [
      {
        Header: "Name",
        accessor: "session_name"
      },
      {
        Header: "Start Date",
        accessor: "start_date"
      },
      {
        Header: "Start Time",
        accessor: "start_time"
      },
      {
        Header: "Open Slots",
        accessor: "open_slots"
      },
      {
        Header: "Status",
        accessor: "isRegistered"
      }
    ];

    return (
      <Route
        exact
        path="/Events"
        render={props => (
          <React.Fragment>
            <div className="container">
              {/* left panel */}
              <div className="column leftBlock">
                <div className="leftContent">
                  {/* this table is used to render all the events
                      either the all or my events. and handles the 
                      selection of each row in the table */}
                  <ReactTable
                    className="-highlight eventTable"
                    data={
                      this.state.isAllEvents
                        ? this.state.events
                        : this.state.myEvents
                    }
                    columns={eventColumns}
                    defaultPageSize={10}
                    getTrProps={(state, rowInfo, column, instance) => {
                      const index = rowInfo ? rowInfo.index : -1;
                      if (this.state.events.length === 0) {
                        return {
                          style: {
                            background: null
                          }
                        };
                      } else {
                        return {
                          onClick: () => {
                            this.setState({ eventSelectedIndex: index });
                          },
                          style: {
                            background:
                              this.state.eventSelectedIndex === index
                                ? "lightgrey"
                                : null
                          }
                        };
                      }
                    }}
                    getTdProps={(state, rowInfo) => {
                      return {
                        // handle clicked event
                        onClick: (e, handleOriginal) => {
                          if (handleOriginal == null) return;
                          this.refreshSessionList(rowInfo.original.event_id);
                          this.setState({
                            event: rowInfo.original,
                            showEventDetails: true,
                            sessionSelectedIndex: 0
                          });

                          if (handleOriginal) {
                            handleOriginal();
                          }
                        }
                      };
                    }}
                  />
                  {/* ******************************* Event Table Icons (Bottom WIth CSS) ************************************************/}
                  {this.props.user.is_admin ? (
                    <div className="eventIconDiv">
                      <img
                        className="deleteIcon allEventIcons allIcons"
                        data-tip="Delete Event"
                        src={deleteIcon}
                        alt="Delete Event"
                        onClick={this.confirmDelete}
                      />
                      <ReactTooltip place="bottom" type="dark" effect="solid" />
                      {/************** Edit EVENT POPUP **************/}
                      <EditEventPopup
                        resetEvent={this.setSelectedEvent}
                        refreshList={this.refreshEventList}
                        selectedEvent={this.state.event}
                      />
                      {/************** CREATE EVENT POPUP **************/}
                      <CreateEventPopup onCreateEvent={this.onCreateEvent} />
                    </div>
                  ) : (
                    ""
                  )}
                </div>
                {/* ******************************* Event Table Toggles ************************************************/}
                <div className="articleLeft">
                  <button
                    style={allEventsClicked}
                    data-tip="View All Events"
                    onClick={this.allEventsSelected}
                    className="allEvents"
                  >
                    {" "}
                    All{" "}
                  </button>
                  <ReactTooltip place="bottom" type="dark" effect="solid" />
                  <h1 className="pipe"> | </h1>
                  <button
                    style={myEventsClicked}
                    data-tip="View My Events"
                    onClick={this.myEventsSelected}
                    className="myEvents"
                  >
                    My
                  </button>
                  <ReactTooltip place="bottom" type="dark" effect="solid" />
                  <p
                    style={allEventsClicked}
                    className="allEvents eventAnnouncement"
                  >
                    Events
                  </p>
                </div>
                {/* ******************************* Profile ************************************************/}
                <div className="profile">
                  <Profile
                    onSignOut={this.props.onSignOut}
                    username={
                      this.props.user.first_name +
                      " " +
                      this.props.user.last_name
                    }
                  />
                </div>
              </div>

              {/******* right panel ***********/}
              <div className="column rightBlock">
                {/* ******************************* Event Details ************************************************/}
                <div>
                  <ViewRegisteredUsersPopup event={this.state.event} />

                  <EmailTeamPopup user={this.props.user} />
                  {/* <img
                    className="emailIcon"
                    data-tip="Email Team"
                    src={emailIcon}
                  /> */}
                  <ManageTeamPopup
                    user={this.props.user}
                    event={this.state.event}
                  />
                </div>
                <h1 className="eventDetailsTitle homepageTitle">
                  Event Details
                </h1>
                {this.state.showEventDetails ? null : (
                  <p style={{ fontStyle: "italic" }}>
                    Click event to view details
                  </p>
                )}
                {/* replace all this with one <Event></Event> component return */}
                {this.state.showEventDetails ? (
                  <h2>{this.state.event.event_name}</h2>
                ) : (
                  <br />
                )}
                {this.state.showEventDetails ? (
                  <p>
                    Start Date:{" "}
                    {dateFormat(this.state.event.start_date, "mmmm d, yyyy")}
                  </p>
                ) : (
                  <br />
                )}
                {this.state.showEventDetails ? (
                  <p>
                    End Date:{" "}
                    {dateFormat(this.state.event.end_date, "mmmm d, yyyy")}
                  </p>
                ) : (
                  <br />
                )}
                {this.state.showEventDetails ? (
                  <p>Description: {this.state.event.description}</p>
                ) : (
                  <br />
                )}
                {this.state.showEventDetails ? (
                  <p>Address: {this.state.event.address}</p>
                ) : (
                  <br />
                )}
                <hr />
                {/* ******************************* Session Icons ************************************************/}
                <div>
                  <ManageSessionRegisteredUsers
                    selectedSession={this.state.selectedSession}
                  />
                  <img
                    className="checkInIcon sessionIcon allIcons"
                    data-tip="Check-In to Session"
                    src={checkInStatusIcon}
                    onClick={this.confirmCheckIn}
                  />
                  <ReactTooltip place="bottom" type="dark" effect="solid" />
                  {this.state.selectedSession.isRegistered === "Registered" ? (
                    <img
                      className="sessionIcon allIcons registerIcon"
                      data-tip="Unregister from Session"
                      src={unregisterIcon}
                      onClick={this.confirmUnregisterSession}
                    />
                  ) : (
                    <img
                      className="sessionIcon allIcons registerIcon"
                      data-tip="Register for Session"
                      src={registerIcon}
                      onClick={this.confirmRegisterSession}
                    />
                  )}
                  <ReactTooltip place="bottom" type="dark" effect="solid" />

                  {/* <ManageCheckedInUsers
                    selectedSession={this.state.selectedSession}
                  /> */}

                  {this.props.user.is_admin ? (
                    <React.Fragment>
                      <img
                        className="deleteIcon allIcons sessionIcon"
                        data-tip="Delete Session"
                        src={deleteIcon}
                        onClick={this.confirmDeleteSession}
                      />
                      <ReactTooltip place="bottom" type="dark" effect="solid" />
                      <EditSessionPopup
                        refreshList={this.refreshSessionList}
                        selectedSession={this.state.selectedSession}
                        selectedEvent={this.state.event}
                        contactRegisteredUsers={this.contactRegisteredUsers}
                      />

                      <CreateSessionsPopup
                        selectedEvent={this.state.event}
                        addNewSession={this.addNewSession}
                      />
                    </React.Fragment>
                  ) : (
                    ""
                  )}
                </div>

                {/* ******************************* Session Details ************************************************ */}
                <div>
                  <h1 className="sessionsTitle homepageTitle">Sessions</h1>
                  <br />
                  <br />
                  {this.state.showEventDetails ? (
                    <ReactTable
                      className="-highlight sessionTable"
                      data={this.state.eventSessions}
                      columns={sessionColumns}
                      defaultPageSize={5}
                      getTrProps={(state, rowInfo, column, instance) => {
                        const index = rowInfo ? rowInfo.index : -1;
                        if (this.state.eventSessions.length === 0) {
                          return {
                            style: {
                              background: null
                            }
                          };
                        } else {
                          return {
                            onClick: () => {
                              this.setState({
                                selectedSession: rowInfo.original
                              });
                              this.setState({ sessionSelectedIndex: index });
                              console.log(
                                this.state.selectedSession.isRegistered
                              );
                            },
                            style: {
                              background:
                                this.state.sessionSelectedIndex === index
                                  ? "lightgrey"
                                  : null
                            }
                          };
                        }
                      }}
                    />
                  ) : null}
                </div>
              </div>
            </div>
          </React.Fragment>
        )}
      />
    );
  }
  //}
}

export default Events;
