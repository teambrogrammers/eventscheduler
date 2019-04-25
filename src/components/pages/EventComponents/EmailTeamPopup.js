import React, { Component } from "react";
import Popup from "reactjs-popup";
import DatePicker from "react-datepicker";
import ReactTooltip from "react-tooltip";
import { confirmAlert } from "react-confirm-alert";
import emailIcon from "../images/emailIcon.jpg";
import curlink from "../../../CurrentAPI";
import axios from "axios";

import addIcon from "../images/addIcon.png";
import saveCloseIcon from "../images/saveCloseIcon.png";
import saveAddIcon from "../images/saveAddIcon.png";

import "../EventComponents/popups.css";
import "../../../App.css";
import "../events.css";
import "../announcements.css";
import "react-table/react-table.css";
import "react-confirm-alert/src/react-confirm-alert.css";

var errorValidateName = "inputError";
var emailRoute = "/esapi/team-users/"; // /teamid
var getTeamId = "/esapi/user-team/"; // eventid/userid

export class EmailTeamPopup extends Component {
  state = {
    title: "",
    titleValidate: "",
    message: "",
    messageValidate: "",
    msgLength: 0
  };

  constructor(props) {
    super(props);
  }

  onSubjectChange = e => {
    this.setState({ title: e.target.value, titleValidate: "" });
  };

  onMessageChange = e => {
    this.setState({
      message: e.target.value,
      msgLength: e.target.value.length,
      messageValidate: ""
    });
  };

  validateForm = () => {
    var validated = true;

    var isValid = {
      title: true,
      message: true
    };

    if (this.state.title === "") {
      isValid.title = false;
      validated = false;
    }

    if (this.state.message === "") {
      isValid.message = false;
      validated = false;
    }

    this.setState({
      titleValidate: isValid.title ? "" : errorValidateName,
      messageValidate: isValid.message ? "" : errorValidateName
    });

    return validated;
  };

  onSubmitEmail = () => {
    var email = {
      title: this.state.title,
      message: this.state.message
    };

    console.log(email);

    this.setState({
      title: "",
      message: "",
      msgLength: 0
    });
  };

  // sendEmail = () => {
  //   var service_id = "default_service";
  //   var template_id = "eventscheduler";

  //   axios
  //     .get(
  //       curlink + getTeamId + "/" + this.props.event.event_id + "/" + this.props.user.user_id
  //     )
  //     .then(result => {
  //       axios.get(curlink + emailRoute)
  //       .then(res => {

  //       })
  //     })
  //     .then(res => {
  //       res.data.forEach(user => {
  //         var template_params = {
  //           to_email: user.email,
  //           event_name: this.state.event.event_name,
  //           session_name: this.state.selectedSession.session_name
  //         };
  //         window.emailjs
  //           .send(service_id, template_id, template_params)
  //           .then(res => {
  //             console.log(res);
  //           })
  //           .catch(err => {
  //             console.log(err);
  //           });
  //       });
  //       console.log(res);
  //     });
  // };

  render() {
    return (
      <Popup
        className="pUpAnn"
        trigger={
          <a>
            <React.Fragment>
              <img
                className="emailIcon"
                data-tip="Email Team"
                src={emailIcon}
              />
              <ReactTooltip place="bottom" type="dark" effect="solid" />
            </React.Fragment>
          </a>
        }
        modal
        position="top center"
      >
        {close => (
          <div className="annForm">
            <div>
              <h1 className="pageTitle pUpTitle">Email Team</h1>
            </div>
            <div className="announceDiv">
              Subject:
              <br />
              <input
                type="text"
                name="title"
                className={this.state.titleValidate}
                value={this.state.title}
                onChange={e => this.onSubjectChange(e)}
                placeholder="Title"
              />
              <br />
              Message:
              <br />
              <textarea
                maxLength="300"
                name="message"
                multiline={true}
                numberOfLines={5}
                className={this.state.messageValidate}
                value={this.state.message}
                onChange={e => this.onMessageChange(e)}
                style={{
                  height: 200,
                  width: 200
                }}
                placeholder="Message (Limit 300 Characters)"
              />
              <br />
              <div id="charNum">
                Characters Remaining: {300 - this.state.msgLength}
              </div>
              <div className="annpUpBtns">
                <React.Fragment>
                  <img
                    className="SC"
                    data-tip="Send"
                    src={saveCloseIcon}
                    onClick={() => {
                      if (this.validateForm()) {
                        this.onSubmitEmail();
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

export default EmailTeamPopup;
