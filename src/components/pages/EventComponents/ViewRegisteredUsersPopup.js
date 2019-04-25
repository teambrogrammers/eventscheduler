import React, { Component } from "react";
import Popup from "reactjs-popup";
import ReactTable from "react-table";
import axios from "axios";
import ReactTooltip from "react-tooltip";

import registeredUsersIcon from "../images/registeredUsersIcon.png";

import "../../../App.css";
import "../events.css";
import "react-table/react-table.css";
import "../../pages/EventComponents/popups.css";
import "react-confirm-alert/src/react-confirm-alert.css";

import curlink from "../../../CurrentAPI";

// routes that will be called to better manage what is happening
const getUserDataRoute = "/esapi/event-users/";

// Will Be Renamed to Registered Users Pop up Evnetually
export class ViewRegisteredUsersPopup extends Component {
  state = {
    users: []
  };

  getStyle = () => {
    return {
      width: "180px",
      float: "right",
      padding: "10px",
      marginLeft: "100px",
      height: "150px",
      textAlign: "center"
      // borderLeft: "4px lightgray solid",
    };
  };

  loadUserData = () => {
    axios
      .get(curlink + getUserDataRoute + this.props.event.event_id)
      .then(res => this.setState({ users: res.data }))
      .catch(error => {
        console.log(error);
      });
  };

  render() {
    const registeredUsersColumns = [
      {
        Header: "First Name",
        accessor: "first_name"
      },
      {
        Header: "Last Name",
        accessor: "last_name"
      },
      {
        Header: "Email",
        accessor: "email"
      },
      {
        Header: "Phone Number",
        accessor: "phone"
      }
    ];

    return (
      // Registered Users Button/Popup
      <Popup
        trigger={
          <a>
            <img
              className="farRight allIcons regUserIcon"
              data-tip="Event Registered Users"
              src={registeredUsersIcon}
            />
            <ReactTooltip place="bottom" type="dark" effect="solid" />
          </a>
        }
        modal
        onOpen={this.loadUserData}
      >
        {close => (
          <div>
            <a onClick={close}>&times;</a>
            <h1 className="pageTitle pUpTitle">
              {this.props.event.event_name}:&nbsp;Registered Users
            </h1>
            <ReactTable
              data={this.state.users}
              columns={registeredUsersColumns}
              defaultPageSize={5}
            />
            <div className="dialog">
              <a
                onClick={() => {
                  close();
                }}
                className="close-classic"
              />
            </div>
          </div>
        )}
      </Popup>
    );
  }
}
export default ViewRegisteredUsersPopup;
