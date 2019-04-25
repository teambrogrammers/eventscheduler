import Popup from "reactjs-popup";
import ReactTooltip from "react-tooltip";
import React, { Component } from "react";
import parseAddress from "parse-address";
import DatePicker from "react-datepicker";
import { confirmAlert } from "react-confirm-alert";
import ReactTable from "react-table";

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

export class EditTeamPopup extends Component {
  state = {
    team_name: "",
    teamlessMembers: [],
    teamMemberSelectedIndex: null
  };

  render() {
    const teamColumns = [
      {
        Header: "Name",
        accessor: "team_name"
      }
    ];

    return (
      <Popup
        className="pUp"
        trigger={
          <a>
            <React.Fragment>
              <img
                className="editIcon allEventIcons allIcons"
                data-tip="Edit Team"
                src={editIcon}
                alt="Edit Team"
              />{" "}
              <ReactTooltip place="bottom" type="dark" effect="solid" />
            </React.Fragment>
          </a>
        }
        onOpen={() => {
          console.log("clicked");
        }}
        modal
        position="top center"
      >
        {close => (
          <div className="pUpForm">
            <div>
              <h1 className="pageTitle pUpTitle">Edit Team</h1>
            </div>

            {/* <div className="leftCol">
              Team Name:
              <br />
              <input
                type="text"
                name="team_name"
                value={this.props.selectedTeam.team_name}
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
                //  data={this.props.selectedTeam.members ? this.props.selectedTeam.members : null}
                data={null}
                columns={teamColumns}
                defaultPageSize={10}
                getTrProps={(state, rowInfo, column, instance) => {
                  const index = rowInfo ? rowInfo.index : -1;
                  if (0 === 0) {
                    return {
                      style: {
                        background: null
                      }
                    };
                  } else {
                    return {
                      onClick: () => {
                        this.setState({ teamMemberSelectedIndex: index });
                        this.teamClicked(rowInfo.original);
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
            </div>
            <div className="pUpBtns">
              <React.Fragment>
                <img
                  className="SC"
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
            </div> */}
          </div>
        )}
      </Popup>
    );
  }
}

export default EditTeamPopup;
