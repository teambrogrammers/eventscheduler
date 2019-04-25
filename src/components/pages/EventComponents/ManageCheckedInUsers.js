import React, { Component } from "react";
import Popup from "reactjs-popup";
import ReactTable from "react-table";
import axios from "axios";
import ReactTooltip from "react-tooltip";

import checkedInUsersIcon from "../../pages/images/checkedInUsersIcon.png";
import curlink from "../../../CurrentAPI";

import "../../../App.css";
import "react-table/react-table.css";
import "../../pages/EventComponents/popups.css";
import "react-confirm-alert/src/react-confirm-alert.css";

const getCheckedInRoute = "/esapi/checked-in-users/";
const getUserDataRoute = "/esapi/user/";

export class ManageCheckedInUsers extends Component {
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
      .get(curlink + getCheckedInRoute + this.props.selectedSession.session_id)
      .then(res => {
        res.data.forEach(id => {
          axios
            .get(curlink + getUserDataRoute + id)
            .then(res => {
              this.state.users.push(res.data);
              console.log(this.state.users);
            })
            .catch(error => {
              console.log(error);
            });
        });
      })
      .catch(error => {
        console.log(error);
      });
  };

  render() {
    const checkedInUsersColumn = [
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
      // Checked-In Users Button/Popup
      <Popup
        trigger={
          <a>
            <ReactTooltip place="bottom" type="dark" effect="solid" />
            <img
              className="allEventIcons farRight regUserIcon allIcons"
              data-tip="View Checked-In Users"
              src={checkedInUsersIcon}
            />
          </a>
        }
        modal
        onOpen={this.loadUserData}
      >
        {close => (
          <div>
            <a onClick={close}>&times;</a>
            <h1 className="pageTitle pUpTitle">Checked-In Users</h1>
            <ReactTable
              data={this.state.users}
              columns={checkedInUsersColumn}
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
export default ManageCheckedInUsers;
