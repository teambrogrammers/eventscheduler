import React, { Component } from "react";
import Popup from "reactjs-popup";
import ReactTooltip from "react-tooltip";

import addIcon from "../images/addIcon.png";
import deleteIcon from "../images/deleteIcon.png";
import saveCloseIcon from "../images/saveCloseIcon.png";
import saveAddIcon from "../images/saveAddIcon.png";
import { confirmAlert } from "react-confirm-alert"; // Import
import ReactTable from "react-table";
import axios from "axios";
import curlink from "../../../CurrentAPI";

import "./popups.css";
import "../events.css";
import "../../../App.css";
import "react-table/react-table.css";
import "react-confirm-alert/src/react-confirm-alert.css";
import "react-datepicker/dist/react-datepicker.css";
import { updateLocale } from "moment";

// var tempLink = "https://localhost:44382/esapi/teamless-users/";

export class CreateEventPopup extends Component {
  state = {
    team_name: "",
    teamlessMembers: [],
    //teamMemberSelectedIndex: null,
    selectedMembers: [],
    selectedIndex: [],
  };

  onTeamNameChange = e => {
    this.setState({ team_name: e.target.value });
  };

  onOpen = () => {
    var url = curlink + "/esapi/teamless-users/" + this.props.event.event_id;
    // var url = tempLink + this.props.event.event_id;
    axios
      .get(url)
      .then(result => {
        this.setState({
          teamlessMembers: result.data
        });
      })
      .catch(error => {
        console.log(error);
      });
  };

  addNewTeam = team => {
    fetch(curlink + "/esapi/team/", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        team_name: this.state.team_name,
        event_id: this.props.event.event_id,
        members: this.state.selectedMembers
      })
    })
      .then(e => {
        this.props.onOpen();
        alert("Team successfully created.");
      })
      .catch(err => {
        console.log(err.message);
      });
  };

  render() {
    const teamColumns = [
      {
        Header: "First Name",
        accessor: "first_name"
      },
      {
        Header: "Last Name",
        accessor: "last_name"
      }
    ];

    return (
      <Popup
        className="teamPUp"
        trigger={
          <a>
            <React.Fragment>
              <img
                className="addIcon allEventIcons allIcons"
                data-tip="Create New Team"
                src={addIcon}
              />

              <ReactTooltip place="bottom" type="dark" effect="solid" />
            </React.Fragment>
          </a>
        }
        modal
        position="top center"
        onOpen={this.onOpen}
      >
        {close => (
          <div className="createTeamForm">
            <div>
              <h1 className="pageTitle pUpTitle">Create Team</h1>
            </div>

            <div className="teamTitle">
              Team Name:
              <br />
              <input
                type="text"
                name="team_name"
                value={this.state.name}
                onChange={e => this.onTeamNameChange(e)}
                placeholder="Team Name..."
              />
              <br />
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

            <div className="rightCol">
              <ReactTable
                className="-highlight createTeamTable"
                data={
                  this.state.teamlessMembers ? this.state.teamlessMembers : null
                }

                columns={teamColumns}
                defaultPageSize={10}
                getTrProps={(state, rowInfo, column, instance) => {
                  const index = rowInfo ? rowInfo.index : -1;
                  if (this.state.teamlessMembers.length === 0) {
                    return {
                      style: {
                        background: null
                      }
                    };
                  } else {
                    return {
                      onClick: () => {
                        this.setState({
                          selectedIndex: this.state.selectedIndex.concat(index),
                          selectedMembers: this.state.selectedMembers.concat(rowInfo.original.user_id) 
                        });  
                      },
                      style: {
                        background:
                          this.state.selectedIndex.indexOf(index) != -1
                            ? "lightgrey"
                            : null
                            
                      }
                    };
                  }
                }}
              />
            </div>
            <div className="pUpBtns">
              <React.Fragment>
                <img
                  className="SC scTeam"
                  data-tip="Save and Close"
                  src={saveCloseIcon}
                  onClick={() => {
                    this.addNewTeam();
                    close();
                  }}
                />
                <ReactTooltip place="bottom" type="dark" effect="solid" />
              </React.Fragment>

              <React.Fragment>
                <img
                  data-tip="Save and Create Another"
                  src={saveAddIcon}
                  onClick={() => {
                    this.onSubmitEvent();
                  }}
                />
                <ReactTooltip place="bottom" type="dark" effect="solid" />
              </React.Fragment>
            </div>
          </div>
        )}
      </Popup>
    );
  }
}

export default CreateEventPopup;
