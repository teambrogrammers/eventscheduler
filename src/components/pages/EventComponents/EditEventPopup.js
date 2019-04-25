import Popup from "reactjs-popup";
import ReactTooltip from "react-tooltip";
import React, { Component } from "react";
import parseAddress from "parse-address";
import DatePicker from "react-datepicker";
import { confirmAlert } from "react-confirm-alert";

import curlink from "../../../CurrentAPI";

import editIcon from "../images/editIcon.png";
import saveCloseIcon from "../images/saveCloseIcon.png";

import "react-confirm-alert/src/react-confirm-alert.css";
import "react-datepicker/dist/react-datepicker.css";
import "react-table/react-table.css";
import "../../../App.css";
import "../events.css";
import "./popups.css";

const putEventURL = "https://localhost:44382/esapi/event/";
const updateEventRoute = "/esapi/event/";

var errorValidateName = "inputError";

// Component Summary: a popup that handles the edit process for an event
// props: data: selectedEvent
// other info: this should be called EditEventPopup, but I am afraid to change it this late in the game
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
      new Date().getDate();
    this.state.start_date = today;
    this.state.end_date = today;
  }

  noEventSelected = () => {
    confirmAlert({
      // show an alert so the admin knows that they need to add sessions so users can sign up =====================================
      title: "Error",
      message: "Please select an event in order to edit it!",
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
  //#region OnChange Functions
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

  // function that combines the data into an event object
  //   and then posts to the database.
  onEditEvent = event => {
    var e = {
      event_id: this.props.selectedEvent.event_id,
      address: event.address,
      start_date: event.start_date,
      end_date: event.end_date,
      event_name: event.name,
      description: event.description
    };
    fetch(curlink + updateEventRoute, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(e)
    }).then(response => {
      console.log(response.status);
      if (response.status > 201) {
        alert("Event failed to save. Error: " + response.status);
      } else {
        alert("Event successfully changed.");
      }
      this.props.refreshList();
      this.props.resetEvent(e);
    });
  };

  // handles the combining of data to pass to the above function
  //   then resets the state to empty
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
    this.onEditEvent(event);
    this.setState({
      name: "",
      description: "",
      start_date:
        new Date().getFullYear() +
        "-" +
        (new Date().getMonth() + 1) +
        "-" +
        new Date().getDate(),
      end_date:
        new Date().getFullYear() +
        "-" +
        (new Date().getMonth() + 1) +
        "-" +
        new Date().getDate(),
      address: "",
      city: "",
      event_state: "",
      zip: ""
    });
  };

  // fill in the fields with the passed event data.
  populateFields = () => {
    var addr = this.props.selectedEvent.address;

    var loc = parseAddress.parseLocation(addr);

    var num = "";
    if (loc.number !== undefined) {
      num = loc.number + " ";
    }
    var prefix = "";
    if (loc.prefix !== undefined) {
      prefix = loc.prefix + " ";
    }
    var street = "";
    if (loc.street !== undefined) {
      street = loc.street + " ";
    }
    var suffix = "";
    if (loc.suffix !== undefined) {
      suffix = loc.suffix + " ";
    }
    var type = "";
    if (loc.type !== undefined) {
      type = loc.type;
    }

    var address = num + prefix + street + suffix + type;
    console.log(address);

    this.setState({
      name: this.props.selectedEvent.event_name,
      description: this.props.selectedEvent.description,
      start_date: new Date(this.props.selectedEvent.start_date),
      end_date: new Date(this.props.selectedEvent.end_date),
      address: address,
      city: loc.city,
      event_state: loc.state,
      zip: loc.zip
    });
  };

  render() {
    return (
      <Popup
        className="pUp"
        trigger={
          this.props.selectedEvent.event_name !==
          "Click on event to view details" ? (
            <a>
              <React.Fragment>
                <img
                  className="editIcon allEventIcons allIcons"
                  data-tip="Edit Event"
                  src={editIcon}
                  alt="Edit Event"
                />{" "}
                <ReactTooltip place="bottom" type="dark" effect="solid" />
              </React.Fragment>
            </a>
          ) : (
            <React.Fragment>
              <img
                className="editIcon allEventIcons allIcons"
                data-tip="Edit Event"
                src={editIcon}
                alt="Edit Event"
                onClick={this.noEventSelected}
              />{" "}
              <ReactTooltip place="bottom" type="dark" effect="solid" />
            </React.Fragment>
          )
        }
        onOpen={this.populateFields}
        modal
        position="top center"
      >
        {close => (
          <div className="pUpForm">
            <div>
              <h1 className="pageTitle pUpTitle">Edit Event</h1>
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
                popperPlacement="right"
                dateFormat="yyyy-MM-dd"
                minDate={new Date()}
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
              <br />
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
                        close();
                      }
                    }}
                  />
                  <ReactTooltip place="bottom" type="dark" effect="solid" />
                </React.Fragment>
              </div>
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

export default CreateEventPopup;
