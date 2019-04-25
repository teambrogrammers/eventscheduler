import React, { Component } from "react";
import Popup from "reactjs-popup";
import DatePicker from "react-datepicker";
import ReactTooltip from "react-tooltip";
import { confirmAlert } from "react-confirm-alert"; // Import

import addIcon from "../images/addIcon.png";
import saveCloseIcon from "../images/saveCloseIcon.png";
import saveAddIcon from "../images/saveAddIcon.png";

import "./popups.css";
import "../events.css";
import "../../../App.css";
import "react-table/react-table.css";
import "react-confirm-alert/src/react-confirm-alert.css";
import "react-datepicker/dist/react-datepicker.css";

var errorValidateName = "inputError";
// Component Summary: when the icon is clicked a popup shows up that
// Props: function: onCreateEvent
// Other info: na
export class CreateEventPopup extends Component {
  state = {
    hasSubmited: false,
    name: "",
    nameValidate: "",
    description: "",
    descValidate: "",
    start_date: "",
    end_date: "",
    address: "",
    addressValidate: "",
    city: "",
    cityValidate: "",
    event_state: "",
    stateValidate: "",
    zip: "",
    zipValidate: ""
  };

  constructor(props) {
    super(props);
    var today =
      new Date().getFullYear() +
      "-" +
      (new Date().getMonth() + 1) +
      "-" +
      (new Date().getDate() + 1);
    this.state.start_date = today;
    this.state.end_date = today;
  }
  //#region OnChangeFunctions
  onEventNameChange = e => {
    this.setState({ name: e.target.value, nameValidate: "" });
  };
  onEventAddressChange = e => {
    this.setState({ address: e.target.value, addressValidate: "" });
  };
  onEventCityChange = e => {
    this.setState({ city: e.target.value, cityValidate: "" });
  };
  onEventStateChange = e => {
    this.setState({ event_state: e.target.value, stateValidate: "" });
  };
  onEventZipChange = e => {
    this.setState({ zip: e.target.value.replace(/\D/, ""), zipValidate: "" });
  };
  onEventDescriptionChange = e => {
    this.setState({ description: e.target.value, descValidate: "" });
  };
  onEventStartDateChange = e => {
    this.setState({ start_date: e });
  };
  onEventEndDateChange = e => {
    this.setState({ end_date: e });
  };
  //#endregion

  displayConfirmPopup = () => {
    confirmAlert({
      // show an alert so the admin knows that they need to add sessions so users can sign up =====================================
      title: "Add Sessions",
      message:
        "Please add a session in order for people to view and sign up for your event!",
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
      desc: true,
      addr: true,
      city: true,
      state: true,
      zip: true
    };

    if (this.state.name === "") {
      isValid.name = false;
      validated = false;
    }

    if (this.state.description === "") {
      isValid.desc = false;
      validated = false;
    }

    if (this.state.address === "") {
      isValid.addr = false;
      validated = false;
    }

    if (this.state.city === "") {
      isValid.city = false;
      validated = false;
    }

    if (this.state.event_state === "") {
      isValid.state = false;
      validated = false;
    }

    if (this.state.zip === "") {
      isValid.zip = false;
      validated = false;
    }

    this.setState({
      nameValidate: isValid.name ? "" : errorValidateName,
      descValidate: isValid.desc ? "" : errorValidateName,
      addressValidate: isValid.addr ? "" : errorValidateName,
      cityValidate: isValid.city ? "" : errorValidateName,
      stateValidate: isValid.state ? "" : errorValidateName,
      zipValidate: isValid.zip ? "" : errorValidateName
    });

    return validated;
  };

  // when the user presses the submit button, it combines the address
  //   into one variable and creates an event object  to pass back to the
  //   events.js page to handle the api call.
  onSubmitEvent = () => {
    var addr =
      this.state.address +
      " " +
      this.state.city +
      ", " +
      this.state.event_state +
      " " +
      this.state.zip;
    var event = {
      address: addr,
      start_date: this.state.start_date,
      end_date: this.state.end_date,
      name: this.state.name,
      description: this.state.description
    };
    this.props.onCreateEvent(event);
    this.setState({
      hasSubmited: true,
      name: "",
      description: "",
      start_date:
        new Date().getFullYear() +
        "-" +
        (new Date().getMonth() + 1) +
        "-" +
        (new Date().getDate() + 1),
      end_date:
        new Date().getFullYear() +
        "-" +
        (new Date().getMonth() + 1) +
        "-" +
        (new Date().getDate() + 1),
      address: "",
      city: "",
      event_state: "",
      zip: ""
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
                className="addIcon allEventIcons allIcons"
                data-tip="Create Event"
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
          <div className="pUpForm">
            <div>
              <h1 className="pageTitle pUpTitle">Create Event</h1>
            </div>
            <div className="leftCol">
              Event Name:
              <br />
              <input
                type="text"
                name="event_name"
                className={this.state.nameValidate}
                value={this.state.name}
                onChange={e => this.onEventNameChange(e)}
                placeholder="Event Name..."
              />
              <br />
              Description:
              <br />
              <input
                type="text"
                name="description"
                className={this.state.descValidate}
                value={this.state.description}
                onChange={e => this.onEventDescriptionChange(e)}
                placeholder="Description..."
              />
              <br />
              Start Date:
              <br />
              <DatePicker
                selected={new Date(this.state.start_date)}
                onChange={e => this.onEventStartDateChange(e)}
                minDate={new Date()}
                popperPlacement="right"
                dateFormat="yyyy-MM-dd"
                showDisabledMonthNavigation
              />
              <br />
              End Date:
              <br />
              <DatePicker
                selected={new Date(this.state.end_date)}
                onChange={e => this.onEventEndDateChange(e)}
                popperPlacement="top-right"
                dateFormat="yyyy-MM-dd"
                minDate={new Date()}
                showDisabledMonthNavigation
              />
            </div>
            <div className="rightCol">
              Address:
              <br />
              <input
                type="text"
                name="address"
                className={this.state.addressValidate}
                value={this.state.address}
                onChange={e => this.onEventAddressChange(e)}
                placeholder="Address"
              />
              <br />
              City:
              <br />
              <input
                type="text"
                name="city"
                className={this.state.cityValidate}
                value={this.state.city}
                onChange={e => this.onEventCityChange(e)}
                placeholder="City"
              />
              <br />
              State:
              <br />
              <input
                type="text"
                name="state"
                className={this.state.stateValidate}
                value={this.state.event_state}
                onChange={e => this.onEventStateChange(e)}
                placeholder="State"
              />
              <br />
              Zip:
              <br />
              <input
                type="text"
                name="zip"
                className={this.state.zipValidate}
                value={this.state.zip}
                onChange={e => this.onEventZipChange(e)}
                placeholder="Zip"
              />
              <br />
              <div className="pUpBtns">
                <React.Fragment>
                  <img
                    className="SC"
                    data-tip="Save and Close"
                    src={saveCloseIcon}
                    onClick={() => {
                      if (this.validateForm()) {
                        this.onSubmitEvent();
                        this.displayConfirmPopup();
                        close();
                      }
                    }}
                  />
                  <ReactTooltip place="bottom" type="dark" effect="solid" />
                </React.Fragment>

                <React.Fragment>
                  <img
                    data-tip="Save and Create Another"
                    src={saveAddIcon}
                    onClick={() => {
                      if (this.validateForm()) {
                        this.onSubmitEvent();
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
                    if (this.state.hasSubmited) {
                      this.displayConfirmPopup();
                    }
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

export default CreateEventPopup;
