import Popup from "reactjs-popup";
import ReactTooltip from "react-tooltip";
import React, { Component } from "react";
import curlink from "../../../CurrentAPI";
import editIcon from "../images/editIcon.png";
import saveCloseIcon from "../images/saveCloseIcon.png";

import "../EventComponents/popups.css";
import "../../../App.css";
import "../events.css";
import "../announcements.css";

var updateAnnouncementRoute = "/esapi/announcement/";

export class EditAnnouncementPopup extends Component {
  state = {
    title: "",
    message: "",
    msgLength: 0
  };

  onTeamTitleChange = e => {
    this.setState({ title: e.target.value });
  };
  onTeamMessageChange = e => {
    this.setState({ message: e.target.value });
  };

  onEditAnnouncement = () => {
    var e = {
      announcement_id: this.props.selectedAnnouncement.announcement_id,
      date_time: this.props.selectedAnnouncement.date_time,
      title: this.state.title,
      message: this.state.message,
      event_id: this.props.selectedAnnouncement.event_id
    };
    fetch(curlink + updateAnnouncementRoute, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(e)
    }).then(response => {
      console.log(response.status);
      this.props.refreshAnnouncementList(this.props.selectedAnnouncement.event_id);
    });
  };

  onSubmitEvent = () => {
    var event = {
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

  populateFields = () => {
    this.setState({
      title: this.props.selectedAnnouncement.title,
      message: this.props.selectedAnnouncement.message
    });
  };

  render() {
    return (
      <Popup
        className="pUpAnn"
        trigger={
          // <React.Fragment>
          <div>
            <img
              className="deleteIcon allEventIcons allIcons announcmentIcon annListIcons"
              data-tip="Edit Announcement"
              src={editIcon}
              alt="Edit Announcement"
              onClick={() => console.log("clicked")}
            />
            <ReactTooltip place="bottom" type="dark" effect="solid" />
          </div>
          //</React.Fragment>
        }
        onOpen={this.populateFields}
        modal
        position="top center"
      >
        {close => (
          <div className="annForm">
            <div>
              <h1 className=" pUpTitle editA">Edit Announcement</h1>
            </div>
            <div className="announceDiv editAnnText">
              Title:
              <br />
              <input
                type="text"
                name="title"
                className={this.state.titleValidate}
                value={this.state.title}
                onChange={e => this.onTeamTitleChange(e)}
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
                onChange={e => this.onTeamMessageChange(e)}
                style={{
                  height: 200,
                  width: 200
                }}
                placeholder="Message (Limit 300 Characters)"
              />
              <br />
              <div className="editAnnText" id="charNum">
                Characters Remaining: {300 - this.state.message.length}
              </div>
              <div>
                <React.Fragment>
                  <img
                    className="SC"
                    data-tip="Save and Close"
                    src={saveCloseIcon}
                    onClick={() => {
                      this.onEditAnnouncement();
                      close();
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

export default EditAnnouncementPopup;
