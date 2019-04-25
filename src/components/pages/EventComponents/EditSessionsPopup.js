import React, { Component } from "react";
import Popup from "reactjs-popup";
import DatePicker from "react-datepicker";
import ReactTooltip from "react-tooltip";
import { confirmAlert } from "react-confirm-alert";
import editIcon from "../images/editIcon.png";
import dateFormat from "dateformat";

import addSessionIcon from "../images/addIcon.png";
import saveCloseIcon from "../images/saveCloseIcon.png";
import saveAddIcon from "../images/saveAddIcon.png";

import curlink from "../../../CurrentAPI";

import "./popups.css";
import "../../../App.css";
import "../events.css";
import "react-table/react-table.css";
import "react-confirm-alert/src/react-confirm-alert.css";
import "react-datepicker/dist/react-datepicker.css";

const putSessionURL = "https://localhost:44382/esapi/session";
const updateSessionRoute = "/esapi/session/";

var errorValidateName = "inputError";

export class EditSessionsPopup extends Component {
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
    var session = this.props.selectedSession;
  }

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
      session_name: this.state.name,
      capacity: this.state.capacity,
      start_date_time: start,
      end_date_time: end,
      session_id: this.props.selectedSession.session_id
    };
    console.log(session);

    fetch(curlink + updateSessionRoute, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(session)
    }).then(response => {
      console.log(response.status);
      if (response.status > 201) {
        alert("Session failed to post. Error: " + response.status);
      } else {
        alert("Session successfully changed.");
      }
      this.props.refreshList(this.props.selectedEvent.event_id);

      // DO NOT DELETE THIS COMMENT!!! THIS IS FOR CONTACTING REGISTERED USERS, BUT WE HAVE AN EMAIL LIMIT OF 200 A MONTH ============================================================================================
      this.props.contactRegisteredUsers();
      this.setState({
        name: "",
        start_date: new Date(),
        start_time: new Date(),
        end_date: new Date(),
        end_time: new Date(),
        capacity: ""
      });
    });
  };

  populateFields = () => {
    // {dateFormat(a.date_time, "mm/dd/yy")} Time:{" "}
    // {dateFormat(a.date_time, "h:MM:ss TT")}
    var session = this.props.selectedSession;
    this.setState({
      name: session.session_name,
      start_date: new Date(session.start_date_time),
      start_time: new Date(session.start_date_time),
      end_date: new Date(session.end_date_time),
      end_time: new Date(session.end_date_time),
      capacity: session.capacity
    });
  };

  render() {
    return (
      <Popup
        className="pUp"
        trigger={
          <a>
            <React.Fragment>
              <img
                className="editIcon sessionIcon allIcons"
                data-tip="Edit Session"
                src={editIcon}
                alt="Edit Event"
              />{" "}
              <ReactTooltip place="bottom" type="dark" effect="solid" />
            </React.Fragment>
          </a>
        }
        onOpen={this.populateFields}
        modal
        position="top center"
        closeOnDocumentClick
      >
        {close => (
          <div className="pUpForm">
            <div>
              <h1 className="pageTitle pUpTitle">Edit Session</h1>
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
                  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                  //Adam, what I want to do is if today's date is before the event start date, then the autoselected start date needs to be
                  //The event start date, but if todays date is after the event start date, and before the event end date, then today's date
                  //should be the selected..... Additionally we may want to think of a way not to allow the editing of an event or session that
                  //has already happened.
                  // selected = {() =>{if (this.state.start_date < this.props.selectedEvent.start_date){
                  //   return{ selected = new Date(this.state.start_date)};}
                  //   else{ return selected = new Date(this.props.selectedEvent.start_date)};}}
                  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
                  popperPlacement="left"
                  dateFormat="yyyy-MM-dd"
                  minDate={new Date(this.state.start_date)}
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

export default EditSessionsPopup;
