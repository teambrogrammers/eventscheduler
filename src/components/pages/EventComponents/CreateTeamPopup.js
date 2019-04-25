import React, {Component} from "react";

import { BrowserRouter as Router, Route } from "react-router-dom";
import "../../../App.css";
import "../events.css";
import "react-table/react-table.css";
import addSessionIcon from "../images/addIcon.png";
import { confirmAlert } from "react-confirm-alert"; // Import
import "react-confirm-alert/src/react-confirm-alert.css"; // Import css
import saveCloseIcon from "./saveCloseIcon.png";
import saveAddIcon from "./saveAddIcon.png";
import "./createSessionsPopup.css";
import EventRightSideButtons from "../../layout/EventRightSideButtons";
import SessionRightSideButtons from "../../layout/SessionRightSideButtons";
import Popup from "reactjs-popup";
import ReactTooltip from "react-tooltip";

export class CreateTeamPopup extends Component {
    state = {
        team_id: "",
        team_name: "",
        event_id: "",
        session_id: "",
        user: []
                // first_name,
                // last_name,
                // role: "",
                // email: "",
                // phone: ""
    };

    constructor(props)  {
        super(props);
    }

    render()    {
        const state = [
            
        ];
        return 0;
    }


}

export default CreateTeamPopup; 