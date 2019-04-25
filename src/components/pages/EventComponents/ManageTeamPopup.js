import React, { Component } from "react";
import Popup from "reactjs-popup";
import teamIcon from "../images/teamIcon.png";
import deleteIcon from "../images/deleteIcon.png";
import ReactTooltip from "react-tooltip";
import ReactTable from "react-table";
import "react-confirm-alert/src/react-confirm-alert.css";
import { confirmAlert } from "react-confirm-alert"; // Import
import axios from "axios";
import curlink from "../../../CurrentAPI";
import CreateAnnouncementPopup from "../AnnouncementComponents/CreateAnnouncementPopup";
import NewTeamPopup from "./NewTeamPopup";
import "./popups.css";
import EditTeamPopup from "./EditTeamPopup";
import CreateEventPopup from "./CreateEventPopup";
import addIcon from "../images/addIcon.png";

//mangae teams popup

//WORKING:
//create team name
//displaying teams and their members
//deleting a team

//NOT WORKING
//adding team members to team
//adding a single team member
//editing a team

export class ManageTeamPopup extends Component {
  state = {
    teams: [], //array of teams
    teamSelectedIndex: null, //currently selected team index
    teamMemberSelectedIndex: null, //currently selected team member
    teamMembers: [], //array of team members for selected team
    selectedTeam: null //currently selected team
  };

  constructor(props) {
    super(props);
  }

  //get the teams
  onOpen = () => {
    var url = curlink + "/esapi/event-teams/" + this.props.event.event_id;
    axios
      .get(url)
      .then(result => {
        this.setState({
          teams: result.data
        });
      })
      .then(result => {
        if (this.state.teamSelectedIndex == null) {
          this.setState({
            teamSelectedIndex: 0
          });
        }
        if (this.state.teams[0] == null) {
          this.setState({
            teamMembers: []
          });
        } else {
          this.teamClicked(this.state.teams[this.state.teamSelectedIndex]);
        }
      })
      .catch(error => {
        console.log(error);
      });
  };

  //get the team members for a selected team
  teamClicked = team => {
    this.setState({
      selectedTeam: team
    });
    var url = curlink + "/esapi/team-users/" + team.team_id;
    axios
      .get(url)
      .then(result => {
        this.setState({
          teamMembers: result.data
        });
        if (this.state.teamMembers[0] != null) {
          this.setState({
            teamMemberSelectedIndex: 0
          });
        }
      })
      .catch(error => {
        console.log(error);
      });
  };

  confirmDeleteTeam = () => {
    console.log("CONFIRM");
    var url =
      curlink +
      "/esapi/delete-team/" +
      this.state.teams[this.state.teamSelectedIndex].team_id;
    // var url =
    //   tempDelete + this.state.teams[this.state.teamSelectedIndex].team_id;
    axios
      .delete(url)
      .then(
        console.log(this.state.teams[this.state.teamSelectedIndex].team_id),
        this.onOpen()
      )
      .catch(error => {
        console.log(error);
      });
  };

  confirmDeleteUserFromTeam = () => {
    console.log("CONFIRM DEL USER");
    var url =
      curlink +
      "/esapi/delete-team-user/" +
      this.state.teams[this.state.teamSelectedIndex].team_id +
      "/" +
      this.state.teamMembers[this.state.teamMemberSelectedIndex].user_id;
    axios
      .delete(url)
      .then(
        console.log(this.state.teams[this.state.teamSelectedIndex].team_id),
        this.onOpen()
      )
      .catch(error => {
        console.log(error);
      });
  };

  render() {
    const teamColumns = [
      {
        Header: "Team Name",
        accessor: "team_name"
      },
      {
        Header: "Members",
        accessor: "team_count"
      }
    ];

    const teamMemberColumns = [
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
      }
    ];

    return (
      // popup
      <Popup
        className="teamPopUp"
        trigger={
          this.props.user.is_admin ? (
            <a>
              {/* image */}
              <React.Fragment>
                <img
                  className="teamIcon sessionIcon allIcons"
                  data-tip="Manage Event Teams"
                  src={teamIcon}
                  // onClick={this.onOpen}
                />
                <ReactTooltip place="bottom" type="dark" effect="solid" />
              </React.Fragment>
            </a>
          ) : (
            <a>
              {/* image */}
              <React.Fragment>
                <img
                  className="teamIcon sessionIcon allIcons"
                  data-tip="View Event Teams"
                  src={teamIcon}
                  // onClick={this.onOpen}
                />
                <ReactTooltip place="bottom" type="dark" effect="solid" />
              </React.Fragment>
            </a>
          )
        }
        onOpen={this.onOpen}
        modal
        position="top center"
      >
        {/* whats in the popup */}
        {close => (
          <div className="">
            {/* title */}
            <div className="centerPopupTitle">
              {/* <h1 className="pageTitle pUpTitle">
                {" "}
                {this.props.event.event_name} Teams
              </h1> */}
            </div>

            {/* container for both tables */}
            <div className="teamContainer">
              {/* left side (team names) */}
              <div className="teamLeft">
                <h1 className="pageTitle pUpTitle teamTitle homepageTitle">
                  Teams
                </h1>
                <br />

                {/* table */}
                <ReactTable
                  className="-highlight teamTableLeft"
                  data={this.state.teams ? this.state.teams : null}
                  columns={teamColumns}
                  defaultPageSize={10}
                  getTrProps={(state, rowInfo, column, instance) => {
                    const index = rowInfo ? rowInfo.index : -1;
                    if (this.state.teams.length === 0) {
                      return {
                        style: {
                          background: null
                        }
                      };
                    } else {
                      return {
                        onClick: () => {
                          this.setState({
                            teamSelectedIndex: index,
                            selectedTeam: rowInfo.original
                          });
                          this.teamClicked(rowInfo.original);
                        },
                        style: {
                          background:
                            this.state.teamSelectedIndex === index
                              ? "lightgrey"
                              : null
                        }
                      };
                    }
                  }}
                />
                {/* delete */}
                {this.props.user.is_admin ? (
                  <Popup
                    className="deleteTeamConfirm"
                    trigger={
                      <a>
                        <img
                          className="deleteIcon allEventIcons allIcons teamDelete"
                          data-tip="Delete Team"
                          src={deleteIcon}
                          alt="Delete Team"
                        />
                      </a>
                    }
                    modal
                    position="top center"
                    closeOnDocumentClick
                  >
                    {close => (
                      <div className="deleteTeamConfirm">
                        <h1>
                          Delete{" "}
                          {
                            this.state.teams[this.state.teamSelectedIndex]
                              .team_name
                          }
                          ?
                        </h1>
                        <p className="teamConfirmPupText">
                          Are you sure you want to delete this team from{" "}
                          <strong>{this.props.event.event_name}</strong>
                        </p>
                        <br />
                        <button
                          className="teamConfirmPup"
                          onClick={() => {
                            this.confirmDeleteTeam();
                            console.log("Confirm Delete");
                            close();
                          }}
                        >
                          Yes
                        </button>
                        <button
                          className="teamConfirmPup"
                          onClick={() => {
                            console.log("Cancel");
                            close();
                          }}
                        >
                          No
                        </button>
                      </div>
                    )}
                  </Popup>
                ) : null}
                {this.props.user.is_admin ? (
                  <React.Fragment>
                    {/* edit */}
                    <EditTeamPopup selectedTeam={this.state.selectedTeam} />

                    {/* add */}
                    <NewTeamPopup
                      event={this.props.event}
                      onOpen={this.onOpen}
                    />
                  </React.Fragment>
                ) : null}
              </div>

              {/* right side(team members) */}
              <div className="teamRight">
                <h1 className="pageTitle pUpTitle teamMemTitle homepageTitle">
                  Team Members
                </h1>
                <ReactTable
                  className="-highlight teamTableRight"
                  data={this.state.teamMembers ? this.state.teamMembers : null}
                  columns={teamMemberColumns}
                  defaultPageSize={10}
                  getTrProps={(state, rowInfo, column, instance) => {
                    const index = rowInfo ? rowInfo.index : -1;
                    if (this.state.teamMembers.length === 0) {
                      return {
                        style: {
                          background: null
                        }
                      };
                    } else {
                      return {
                        onClick: () => {
                          this.setState({ teamMemberSelectedIndex: index });
                        },
                        style: {
                          background:
                            this.state.teamMemberSelectedIndex === index
                              ? "lightgrey"
                              : null
                        }
                      };
                    }
                  }}
                />
                {/* buttons go here */}
                <div className="eventIconDiv">
                  {/*DELETE USER FROM TEAM */}
                  {this.props.user.is_admin ? (
                    <Popup
                      className="deleteTeamConfirm"
                      trigger={
                        <a>
                          <img
                            className="deleteIcon allEventIcons allIcons"
                            data-tip="Delete User From Team"
                            src={deleteIcon}
                            alt="Delete User From Team"
                          />
                          <ReactTooltip
                            place="bottom"
                            type="dark"
                            effect="solid"
                          />
                        </a>
                      }
                      modal
                      position="top center"
                      closeOnDocumentClick
                    >
                      {close => (
                        <div className="deleteTeamConfirm">
                          <h1>
                            Delete{" "}
                            {
                              this.state.teams[this.state.teamSelectedIndex]
                                .team_name
                            }
                            ?
                          </h1>
                          <p className="teamConfirmPupText">
                            Are you sure you want to delete{" "}
                            <strong>
                              {this.state.teamMembers[
                                this.state.teamMemberSelectedIndex
                              ].first_name +
                                " " +
                                this.state.teamMembers[
                                  this.state.teamMemberSelectedIndex
                                ].last_name}
                            </strong>
                            {" from "}
                            <strong>
                              {
                                this.state.teams[this.state.teamSelectedIndex]
                                  .team_name
                              }
                            </strong>
                          </p>
                          <br />
                          <button
                            className="teamConfirmPup"
                            onClick={() => {
                              this.confirmDeleteUserFromTeam();
                              console.log("Confirm Delete User from Team");
                              close();
                            }}
                          >
                            Yes
                          </button>
                          <button
                            className="teamConfirmPup"
                            onClick={() => {
                              console.log("Cancel");
                              close();
                            }}
                          >
                            No
                          </button>
                        </div>
                      )}
                    </Popup>
                  ) : null}
                  {this.props.user.is_admin ? (
                    <React.Fragment>
                      <img
                        className="addIcon allEventIcons allIcons"
                        data-tip="Add User"
                        src={addIcon}
                      />
                      <ReactTooltip place="bottom" type="dark" effect="solid" />
                    </React.Fragment>
                  ) : null}
                </div>
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

export default ManageTeamPopup;
