import React, { Component } from "react";
import Popup from "reactjs-popup";
import DatePicker from "react-datepicker";
import ReactTooltip from "react-tooltip";
import { confirmAlert } from "react-confirm-alert";

import addSessionIcon from "../images/addIcon.png";
import saveCloseIcon from "../images/saveCloseIcon.png";
import saveAddIcon from "../images/saveAddIcon.png";

import "./popups.css";
import "../../../App.css";
import "../events.css";
import "react-table/react-table.css";
import "react-confirm-alert/src/react-confirm-alert.css";
import "react-datepicker/dist/react-datepicker.css";

var errorValidateName = "inputError";
// Component Summary: handles the creation process for sessions.
// Props: data: selectedEvent. function: addNewSession
// Other info: admin only
export class CreateSessionsPopup extends Component {
  state = {
    name: "",
    nameValidate: "",
    start_date: new Date(),
    start_time: new Date(),
    end_date: new Date(),
    end_time: new Date(),
    capacity: "",
    capacityValidate: ""
  };

  constructor(props) {
    super(props);
  }

  //#region OnChange Functions
  onSessionNameChange = e => {
    this.setState({ name: e.target.value, nameValidate: "" });
  };
  onSessionStartDateChanged = e => {
    this.setState({
      start_date: e,
      end_date: +e > this.state.end_date ? e : this.state.end_date
    });
  };
  onSessionStartTimeChanged = e => {
    this.setState({ start_time: e });
  };
  onSessionEndDateChanged = e => {
    this.setState({ end_date: e });
  };
  onSessionEndTimeChanged = e => {
    this.setState({ end_time: e });
  };
  onSessionCapacityChanged = e => {
    this.setState({
      capacity: e.target.value.replace(/\D/, ""),
      capacityValidate: ""
    });
  };
  //#endregion
  createSessionClicked = () => {
    confirmAlert({
      // show an alert so the admin knows that they need to add sessions so users can sign up =====================================
      title: "Error",
      message: "Please select an event in order to add a session!",
      buttons: [
        {
          label: "Okay",
          onClick: () => {
            //this.setState({event: })
            console.log("okay");
          }
        }
      ]
    });
  };

  // This checks to see if the fields are not blank.
  //    if you want to add more validation stuff here, then this is where
  //    you would do it.
  validateForm = () => {
    var validated = true;

    var isValid = {
      name: true,
      capacity: true
    };

    if (this.state.name === "") {
      isValid.name = false;
      validated = false;
    }

    if (this.state.capacity === "") {
      isValid.capacity = false;
      validated = false;
    }

    this.setState({
      nameValidate: isValid.name ? "" : errorValidateName,
      capacityValidate: isValid.capacity ? "" : errorValidateName
    });

    return validated;
  };

  // combines the dates into a readable format, then creates
  //    a session object with the data from the fields and
  //    then passes it up to the events.js to handle API call
  onSubmitSession = () => {
    var startDate = this.state.start_date;
    var startTime = this.state.start_time;
    var endDate = this.state.end_date;
    var endTime = this.state.end_time;

    var start =
      startDate.getFullYear() +
      "-" +
      (startDate.getMonth() + 1) +
      "-" +
      startDate.getDate() +
      " " +
      startTime.getHours() +
      ":" +
      startTime.getMinutes();
    var end =
      endDate.getFullYear() +
      "-" +
      (endDate.getMonth() + 1) +
      "-" +
      endDate.getDate() +
      " " +
      endTime.getHours() +
      ":" +
      endTime.getMinutes();

    var session = {
      name: this.state.name,
      capacity: this.state.capacity,
      start_date_time: start,
      end_date_time: end
    };

    this.props.addNewSession(session);
    this.setState({
      name: "",
      start_date: new Date(),
      start_time: new Date(),
      end_date: new Date(),
      end_time: new Date(),
      capacity: ""
    });
  };

  // helper function to make sure that we can only select days that
  //    are valid.
  setDates = () => {
    var today = new Date();
    var selected;
    if (+today >= this.props.selectedEvent.start_date) {
      console.log("today");
      selected = new Date();
    } else {
      console.log("using selected events");
      selected = new Date(this.props.selectedEvent.start_date);
    }

    this.setState({ start_date: selected, end_date: selected });
  };

  render() {
    return (
      <Popup
        className="pUp"
        trigger={
          this.props.selectedEvent.event_name ===
          "Click on event to see details" ? (
            <React.Fragment>
              <img
                className="addIcon sessionIcon allIcons"
                data-tip="Create Session"
                src={addSessionIcon}
                onClick={this.createSessionClicked}
              />
              <ReactTooltip place="bottom" type="dark" effect="solid" />
            </React.Fragment>
          ) : (
            <a>
              <React.Fragment>
                <img
                  className="addIcon sessionIcon allIcons"
                  data-tip="Create Session"
                  src={addSessionIcon}
                />
                <ReactTooltip place="bottom" type="dark" effect="solid" />
              </React.Fragment>
            </a>
          )
        }
        modal
        position="top center"
        onOpen={this.setDates}
      >
        {close => (
          <div className="pUpForm">
            <div>
              <h1 className="pageTitle pUpTitle">Create Session</h1>
            </div>
            <div>
              <div className="leftCol">
                Session Name:
                <br />
                <input
                  type="text"
                  name="session_name"
                  className={this.state.nameValidate}
                  value={this.state.name}
                  onChange={e => this.onSessionNameChange(e)}
                  placeholder="Session name..."
                />
                <br />
                Start Date:
                <br />
                <DatePicker
                  selected={this.state.start_date}
                  onChange={e => this.onSessionStartDateChanged(e)}
                  popperPlacement="right"
                  dateFormat="yyyy-MM-dd"
                  minDate={new Date(this.props.selectedEvent.start_date)}
                  maxDate={new Date(this.props.selectedEvent.end_date)}
                  showDisabledMonthNavigation
                />
                <br />
                Start Time:
                <br />
                <DatePicker
                  selected={new Date(this.state.start_time)}
                  onChange={e => this.onSessionStartTimeChanged(e)}
                  showTimeSelect
                  showTimeSelectOnly
                  popperPlacement="right"
                  timeIntervals={5}
                  dateFormat="h:mm aa"
                  timeCaption="Time"
                />
                <br />
              </div>
              <div className="rightCol">
                Capacity:
                <br />
                <input
                  type="text"
                  name="capacity"
                  className={this.state.capacityValidate}
                  value={this.state.capacity}
                  onChange={e => this.onSessionCapacityChanged(e)}
                  placeholder="Capacity"
                />
                <br />
                End Date:
                <br />
                <DatePicker
                  selected={new Date(this.state.end_date)}
                  onChange={e => this.onSessionEndDateChanged(e)}
                  popperPlacement="auto-left"
                  dateFormat="yyyy-MM-dd"
                  minDate={this.state.start_date}
                  maxDate={new Date(this.props.selectedEvent.end_date)}
                  showDisabledMonthNavigation
                />
                <br />
                End Time:
                <br />
                <DatePicker
                  selected={new Date(this.state.end_time)}
                  onChange={e => this.onSessionEndTimeChanged(e)}
                  showTimeSelect
                  showTimeSelectOnly
                  timeIntervals={5}
                  popperPlacement="left"
                  dateFormat="h:mm aa"
                  timeCaption="Time"
                />
              </div>
              <br />
              <br />
              <br />
              <div className="pUpBtns">
                <React.Fragment>
                  <img
                    className="SC scSession"
                    data-tip="Save and Close"
                    src={saveCloseIcon}
                    onClick={() => {
                      if (this.validateForm()) {
                        this.onSubmitSession();
                        close();
                      }
                    }}
                  />
                  <ReactTooltip place="bottom" type="dark" effect="solid" />
                </React.Fragment>

                <React.Fragment>
                  <img
                    data-tip="Save and Add Another"
                    src={saveAddIcon}
                    onClick={() => {
                      if (this.validateForm()) {
                        this.onSubmitSession();
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

export default CreateSessionsPopup;
