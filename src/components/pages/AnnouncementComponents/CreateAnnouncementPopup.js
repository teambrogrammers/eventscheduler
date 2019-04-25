import React, { Component } from "react";
import Popup from "reactjs-popup";
import DatePicker from "react-datepicker";
import ReactTooltip from "react-tooltip";
import { confirmAlert } from "react-confirm-alert";

import addIcon from "../images/addIcon.png";
import saveCloseIcon from "../images/saveCloseIcon.png";
import saveAddIcon from "../images/saveAddIcon.png";

import "../EventComponents/popups.css";
import "../../../App.css";
import "../events.css";
import "../announcements.css";
import "react-table/react-table.css";
import "react-confirm-alert/src/react-confirm-alert.css";

var errorValidateName = "inputError";

export class CreateAnnouncementPopup extends Component {
  state = {
    title: "",
    titleValidate: "",
    message: "",
    messageValidate: "",
    date: new Date(),
    time: new Date(),
    msgLength: 0
  };

  constructor(props) {
    super(props);
  }

  onAnnouncementTitleChange = e => {
    this.setState({ title: e.target.value, titleValidate: "" });
  };
  onAnnouncementDateChanged = e => {
    this.setState({ date: e });
  };
  onAnnouncementTimeChanged = e => {
    this.setState({ time: e });
  };
  onAnnouncementMessageChange = e => {
    this.setState({
      message: e.target.value,
      msgLength: e.target.value.length,
      messageValidate: ""
    });
  };

  createAnnouncementClicked = () => {
    confirmAlert({
      // show an alert so the admin knows that they need to add Announcements so users can sign up =====================================
      title: "Error",
      message: "Please select an event in order to add an Announcement!",
      buttons: [
        {
          label: "Okay",
          onClick: () => {
            console.log("okay");
          }
        }
      ]
    });
  };

  validateForm = () => {
    var validated = true;

    var isValid = {
      title: true,
      message: true
    };

    if (this.state.title === "") {
      isValid.title = false;
      validated = false;
    }

    if (this.state.message === "") {
      isValid.message = false;
      validated = false;
    }

    this.setState({
      titleValidate: isValid.title ? "" : errorValidateName,
      messageValidate: isValid.message ? "" : errorValidateName
    });

    return validated;
  };

  onSubmitAnnouncement = () => {
    var date = this.state.date;
    var time = this.state.time;

    // transform the date into a readable format
    var date =
      date.getFullYear() +
      "-" +
      (date.getMonth() + 1) +
      "-" +
      date.getDate() +
      " " +
      time.getHours() +
      ":" +
      time.getMinutes();

    var announcement = {
      title: this.state.title,
      message: this.state.message,
      date: this.state.date,
      time: this.state.time
    };

    this.props.addNewAnnouncement(announcement);
    this.setState({
      title: "",
      message: "",
      date: new Date(),
      time: new Date(),
      msgLength: 0
    });
  };

  render() {
    return (
      <Popup
        className="pUpAnn"
        trigger={
          <a>
            <React.Fragment>
              <img
                className="addIcon allIcons createIconPlacement"
                data-tip="Create Announcement"
                src={addIcon}
              />
              <ReactTooltip place="bottom" type="dark" effect="solid" />
            </React.Fragment>
          </a>
        }
        modal
        position="top center"
      >
        {close => (
          <div className="annForm">
            <div>
              <h1 className="pageTitle pUpTitle">Create Announcement</h1>
            </div>
            <div className="announceDiv">
              Title:
              <br />
              <input
                type="text"
                name="title"
                className={this.state.titleValidate}
                value={this.state.title}
                onChange={e => this.onAnnouncementTitleChange(e)}
                placeholder="Title"
              />
              <br />
              Message:
              <br />
              <textarea
                maxLength="300"
                name="message"
                multiline={true}
                numberOfLines={5}
                className={this.state.messageValidate}
                value={this.state.message}
                onChange={e => this.onAnnouncementMessageChange(e)}
                style={{
                  height: 200,
                  width: 200
                }}
                placeholder="Message (Limit 300 Characters)"
              />
              <br />
              <div id="charNum">
                Characters Remaining: {300 - this.state.msgLength}
              </div>
              <div className="annpUpBtns">
                <React.Fragment>
                  <img
                    className="SC"
                    data-tip="Save and Close"
                    src={saveCloseIcon}
                    onClick={() => {
                      if (this.validateForm()) {
                        this.onSubmitAnnouncement();
                        close();
                      }
                    }}
                  />
                  <ReactTooltip place="bottom" type="dark" effect="solid" />
                </React.Fragment>
                <React.Fragment>
                  <img
                    className="SA"
                    data-tip="Save and Add Another"
                    src={saveAddIcon}
                    onClick={() => {
                      if (this.validateForm()) {
                        this.onSubmitAnnouncement();
                      }
                    }}
                  />
                  <ReactTooltip place="bottom" type="dark" effect="solid" />
                </React.Fragment>
              </div>
              <br />
              <div className="dialog">
                <a
                  onClick={() => {
                    close();
                  }}
                  className="close-classic"
                />
              </div>
            </div>
          </div>
        )}
      </Popup>
    );
  }
}

export default CreateAnnouncementPopup;
