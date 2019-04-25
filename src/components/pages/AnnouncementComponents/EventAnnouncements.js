import React, { Component } from "react";
import dateFormat from "dateformat";
import { confirmAlert } from "react-confirm-alert";
import ReactTooltip from "react-tooltip";
import axios from "axios";
import curlink from "../../../CurrentAPI";
import EditAnnouncementPopup from "./EditAnnouncementPopup";
import deleteIcon from "../images/deleteIcon.png";

import "../../pages/events.css";
import "react-confirm-alert/src/react-confirm-alert.css";

// routes that will be called to better manage what is happening
const deleteAnnouncementRoute = "/esapi/delete-announcement/";

//event announcements is what renders the announcements on the left side of the announcements page
class EventAnnouncements extends Component {
  constructor(props) {
    super(props);
  }
  state = {
    selectedIndex: -1,          //index of currently selected announcement
    selectedAnnouncement: null  //currently selected announcement
  };

  //styles for each announcement

  aTitle = () => {
    return {
      color: "#000000",
      fontSize: "20px",
      marginTop: "20px",
      marginBottom: "0px",
      display: "inline-block",
      width: "100%"
    };
  };

  aDateTime = () => {
    return {
      color: "#000000",
      fontSize: "15px",
      marginBottom: "0px",
      display: "inline-block",
      float: "left",
      width: "100%"
    };
  };

  aText = () => {
    return {
      marginTop: "2px",
      marginBottom: "20px",
      width: "100%",
      fontSize: "14px",
      paddingLeft: "0px",
      overflowWrap: "break-word"
    };
  };

  aDelete = () => {
    return {
      width: "100%",
      fontSize: "12px",
      paddingLeft: "0px",
      overflowWrap: "break-word"
    };
  };

  aDiv = () => {
    return {
      borderBottom: "1px #17202A solid",
      borderLeft: "5px rgba(0, 143, 72, 0) solid",
      cursor: "pointer"
    };
  };

  aDivHighlighted = () => {
    return {
      borderBottom: "1px #17202A solid",
      borderLeft: "5px rgba(0, 143, 72, 0) solid",
      cursor: "pointer",
      backgroundColor: "#EAECEE"
    };
  };

  delete = () => {
    return {
      float: "right"
    };
  };

  //when announcement is clicked 
  //set the state of selected index and announcement
  clicked(args) {
    this.setState({
      selectedIndex: args.announcement_id,
      selectedAnnouncement: args
    });
  }

  confirmDeleteAnnouncement = a => {
    confirmAlert({
      title: "Delete " + a.title + "?",
      childrenElement: () => (
        <div style={this.aDelete()}>
          <strong>Time Created:</strong> {dateFormat(a.date_time, "h:MM TT")}
          <br />
          <strong>Date Created:</strong> {dateFormat(a.date_time, "mm/dd/yyyy")}
          <br />
          <br />
          <strong> Message:</strong> {a.message}
        </div>
      ),
      buttons: [
        {
          label: "Yes",
          onClick: () => {
            axios
              .delete(
                curlink + deleteAnnouncementRoute + this.state.selectedIndex
              )
              .then(res => {
                this.setState({ selectedIndex: 0 });
                this.props.refreshAnnouncementList(this.props.event_id);
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

  render() {
    return (
      <div>
        {this.props.eventAnnouncements.map(a => (
          <div>
            <div
              key={a.announcement_id}
              style={
                a.announcement_id == this.state.selectedIndex
                  ? this.aDivHighlighted()
                  : this.aDiv()
              }
              onClick={() => this.clicked(a)}
            >
              <div style={this.aTitle()} key={a.announcement_id}>
                {a.announcement_id == this.state.selectedIndex ? (
                  this.props.user.is_admin ? (
                    <div>
                      <a>
                        <img
                          className="deleteIcon allEventIcons allIcons announcmentIcon annListIcons"
                          style={this.delete()}
                          data-tip="Delete Announcement"
                          src={deleteIcon}
                          alt="Delete Announcement"
                          onClick={() => this.confirmDeleteAnnouncement(a)}
                        />
                        <ReactTooltip
                          place="bottom"
                          type="dark"
                          effect="solid"
                        />
                      </a>
                      <EditAnnouncementPopup
                        selectedAnnouncement={this.state.selectedAnnouncement}
                        refreshAnnouncementList={
                          this.props.refreshAnnouncementList
                        }
                      />
                    </div>
                  ) : null
                ) : null}
                <div className="indivAnnTitle">{a.title}</div>
              </div>
              <div style={this.aDateTime()} key={a.announcement_id}>
                Date: {dateFormat(a.date_time, "mm/dd/yyyy")} Time:{" "}
                {dateFormat(a.date_time, "h:MM TT")}
              </div>
              <div style={this.aText()} key={a.announcement_id}>
                {a.message}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }
}
export default EventAnnouncements;
