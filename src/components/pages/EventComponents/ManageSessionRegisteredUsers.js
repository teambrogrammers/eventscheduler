import React, { Component } from "react";
import Popup from "reactjs-popup";
import ReactTable from "react-table";
import axios from "axios";
import ReactTooltip from "react-tooltip";

import registeredUsersIcon from "../../pages/images/registeredUsersIcon.png";

import "../../../App.css";
import "react-table/react-table.css";
import "../../pages/EventComponents/popups.css";
import "react-confirm-alert/src/react-confirm-alert.css";

import curlink from "../../../CurrentAPI";

const getCheckedInUsersRoute = "/esapi/checked-in-users/";
const getSessionUsersRoute = "/esapi/session-users/";

export class ManageSessionRegisteredUsers extends Component {
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
    var checkedInUsers = [];
    var tempUsers = [];

    // Get list of checked in user ID's
    axios
      .get(
        curlink + getCheckedInUsersRoute + this.props.selectedSession.session_id
      )
      .then(res => {
        checkedInUsers = res.data;
        console.log(res);
        console.log(checkedInUsers);

        // Get all registered users and see if they have checked-in
        axios
          .get(
            curlink +
              getSessionUsersRoute +
              this.props.selectedSession.session_id
          )
          .then(res => {
            res.data.forEach(user => {
              if (checkedInUsers.includes(user.user_id)) {
                user.checkedInStatus = "True";
              } else {
                user.checkedInStatus = "False";
              }
              tempUsers.push(user);
            });
            this.setState({ users: tempUsers });
          })
          .catch(error => {
            console.log(error);
          });
      })
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
      },
      {
        Header: "Checked-In Status",
        accessor: "checkedInStatus"
      }
    ];

    return (
      // Registered Users Button/Popup
      <Popup
        trigger={
          <a>
            <ReactTooltip place="bottom" type="dark" effect="solid" />
            <img
              className="farRight regUserIcon allIcons sessionViewRegUsers"
              data-tip="Session Registered Users"
              src={registeredUsersIcon}
            />
          </a>
        }
        modal
        onOpen={this.loadUserData}
      >
        {close => (
          <div>
            <a onClick={close}>&times;</a>
            <h1 className="pageTitle pUpTitle">
              {this.props.selectedSession.session_name}: &nbsp;Registered Users
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
export default ManageSessionRegisteredUsers;
