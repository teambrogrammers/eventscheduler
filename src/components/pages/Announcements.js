import React from "react";
import Profile from "../layout/Profile";
import { BrowserRouter as Router, Route } from "react-router-dom";
import "../../App.css";
import "../pages/events.css";
import "./announcements.css";
import ReactTooltip from "react-tooltip";
import ReactTable from "react-table";
import axios from "axios";
import dateFormat from "dateformat";
import EventAnnouncements from "./AnnouncementComponents/EventAnnouncements";
import CreateAnnouncementPopup from "./AnnouncementComponents/CreateAnnouncementPopup";
import curlink from "../../CurrentAPI";

// api routes
const putAnnouncementRoute = "/esapi/announcement/";
const getAllEventsRoute = "/esapi/all-events/";
const getEventAnnouncementsRoute = "/esapi/event-announcements/";

var allEventsClicked = { borderBottomColor: "#04b407" };
var myEventsClicked = { borderBottomColor: "transparent" };

class Announcements extends React.Component {
  constructor() {
    super();

    // setting the state for the announcement component 
    // event_name defaults to "Click on event..." for when user hasn't clicked an event yet

    this.state = {
      event: {
        event_name: "Click on event to view Announcements"
      },
      allEvents: [],                  //all events the system has
      myEvents: [],                   //events where the user is registered for at least one session
      eventAnnouncements: null,       //announcements for an event
      creatingAnnouncement: false,    //bool for if we are currently creating a new annoucement 
      isAllAnnouncements: true,       //bool for if All or My annoucements is currently selected
      showEventAnnouncements: false,  //bool to show announcements or not
      eventSelectedIndex: 0,          //index of currently selected announcement
      aHighlighted: false,            //if an announcement is highlighted or not
      announcementSelectedIndex: 0    //currently selected announcement index
    };
    allEventsClicked = { borderBottomColor: "#05c839" };
    myEventsClicked = { borderBottomColor: "transparent" };
    this.clicked = this.clicked.bind(this);
  }


  // takes in a passed in announcement and makes a post-
  // request to make a new annoucement in the database

  addNewAnnouncement = announcement => {
    console.log(this.state.event.event_id);
    console.log(announcement);
    fetch(curlink + putAnnouncementRoute, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        date_time: announcement.date,
        title: announcement.title,
        message: announcement.message,
        event_id: this.state.event.event_id
      })
    })
      .then(e => {
        console.log(e);
        this.setState({ eventAnnouncements: [] });
        this.refreshAnnouncementList(this.state.event.event_id);
      })
      .catch(err => {
        console.log(err.message);
      });
  };

  //when all events toggle is clicked
  //sets the state of the events accordingly
  //changes style of the toggle to reflect which is selected

  allEventsSelected = () => {
    console.log("yes");
    this.setState({
      event: this.state.allEvents[0],
      eventSelectedIndex: 0,
      isAllAnnouncements: true
    });
    this.refreshAnnouncementList(this.state.allEvents[0].event_id);
    allEventsClicked = { borderBottomColor: "#05c839" };
    myEventsClicked = { borderBottomColor: "transparent" };
  };

  //when my events toggle is clicked
  //sets the state of the events accordingly
  //changes style of the toggle to reflect which is selected

  myEventsSelected = () => {
    console.log("yes");
    this.setState({
      event: this.state.myEvents[0],
      eventSelectedIndex: 0,
      isAllAnnouncements: false
    });
    this.refreshAnnouncementList(this.state.myEvents[0].event_id);
    allEventsClicked = { borderBottomColor: "transparent" };
    myEventsClicked = { borderBottomColor: "#05c839" };
  };

  //when this component mounts it makes a get request to get-
  //all AND my events for quick toggling b/n the two

  componentDidMount() {
    axios
      .get(curlink + getAllEventsRoute)
      .then(res =>
        this.setState({
          allEvents: res.data.map(event => {
            //map over events and format the date
            event.start_date = dateFormat(event.start_date, "mm/dd/yyyy");
            event.end_date = dateFormat(event.end_date, "mm/dd/yyyy");
            return event;
          })
        })
      )
      .then(result => {
        this.refreshAnnouncementList(this.state.allEvents[0].event_id);
      })
      .catch(error => {
        console.log(error);
      });
    axios
      .get(curlink + getAllEventsRoute + this.props.user.user_id)
      .then(res =>
        this.setState({
          myEvents: res.data.map(event => {
            //map over events and format the date
            event.start_date = dateFormat(event.start_date, "mm/dd/yyyy");
            event.end_date = dateFormat(event.end_date, "mm/dd/yyyy");
            return event;
          })
        })
      )
      .catch(error => {
        console.log(error);
      });
  }

  // fetch and set announcement data

  refreshAnnouncementList = eventID => {
    axios
      .get(curlink + getEventAnnouncementsRoute + eventID)
      .then(res =>
        this.setState({
          eventAnnouncements: res.data,
          showEventAnnouncements: true,

          //test for all or my events and set data accordingly
          event: this.state.isAllAnnouncements
            ? this.state.allEvents[this.state.eventSelectedIndex]
            : this.state.myEvents[this.state.eventSelectedIndex]
        })
      )
      .catch(error => {
        console.log(error);
      });
  };

  clicked = () => {
    //this.setState({ aHighlighted: !this.state.aHighlighted });
    console.log("clicked");
  };

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
    ];

    return (
      <Route
        exact
        path="/Announcements"
        render={props => (
          <React.Fragment>
            <div className="container">
              {/* left page */}
              <div className="column leftBlock">
                {/* My | All Announcements toggle */}
                <div className="articleLeft">
                  <button
                    style={allEventsClicked}
                    data-tip="View All Announcements"
                    onClick={this.allEventsSelected}
                    className="allEvents"
                  >
                    All
                  </button>
                  <ReactTooltip place="bottom" type="dark" effect="solid" />
                  <h1 className="pipe"> | </h1>
                  <button
                    style={myEventsClicked}
                    data-tip="View My Announcements"
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
                    Announcements
                  </p>
                </div>

                <div className="leftContent">
                  <ReactTable
                    className="-highlight eventTable"
                    data={
                      this.state.isAllAnnouncements
                        ? this.state.allEvents
                        : this.state.myEvents
                    }
                    columns={eventColumns}
                    defaultPageSize={10}
                    getTrProps={(state, rowInfo, column, instance) => {
                      const index = rowInfo ? rowInfo.index : -1;
                      return {
                        onClick: () => {
                          this.setState({
                            eventSelectedIndex: index,
                            showEventAnnouncements: true
                          });
                        },
                        style: {
                          background:
                            this.state.eventSelectedIndex === index
                              ? "lightgrey"
                              : null
                        }
                      };
                    }}
                    getTdProps={(state, rowInfo) => {
                      return {
                        // handle clicked event
                        onClick: (e, handleOriginal) => {
                          if (handleOriginal == null) return;
                          this.setState({ eventAnnouncements: null });
                          this.refreshAnnouncementList(
                            rowInfo.original.event_id
                          );

                          if (handleOriginal) {
                            handleOriginal();
                          }
                        }
                      };
                    }}
                  />
                </div>

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

              {/* right page */}
              <div className="column rightBlock">
                {this.state.showEventAnnouncements ? (
                  <div className="announcementHeader">
                    <h1 className="homepageTitle annListTitle">
                      {this.state.event.event_name}
                    </h1>
                    {this.props.user.is_admin ? (
                      <CreateAnnouncementPopup
                        selectedEvent={this.state.event}
                        addNewAnnouncement={this.addNewAnnouncement}
                      />
                    ) : (
                      ""
                    )}
                  </div>
                ) : (
                  <p style={{ fontStyle: "italic" }}>
                    Click event to view announcements
                  </p>
                )}
                {/* ANNOUNCEMENTS */}

                {this.state.eventAnnouncements ? (
                  <div>
                    <EventAnnouncements
                      user={this.props.user}
                      eventAnnouncements={this.state.eventAnnouncements}
                      refreshAnnouncementList={this.refreshAnnouncementList}
                      event_id={this.state.event.event_id}
                    />
                  </div>
                ) : null}
              </div>
            </div>
          </React.Fragment>
        )}
      />
    );
  }
}
export default Announcements;
