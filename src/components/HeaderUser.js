import React, { Component } from "react";
//import { Link } from "react-router-dom";
//import iconHand from "../img/icon-hand-mobile.svg";
import profileImg from "../img/default-avatar.png";
import { FaChevronDown } from "react-icons/fa";
import UserHeaderExpanded from "./HeaderUserExpanded";
export default class HeaderUser extends Component {
    constructor(props) {
      super(props);    
      this.state = {expanded: false};
    }
    render() {
        return (
            <div className="user-header-area">
                {/*<Link
                    to={"/recover"}
                    className="login-options-link button is-rounded is-green size-l"
                >
                    <img src={iconHand} className="icon-btn"  alt="" />
                    <span>Contactar con un especialista</span>
                </Link>*/}
                <div className="user-area">
                    <div className="profile-pic">
                        <img src={profileImg} alt="" />
                    </div>
                    <div className="user-info">
                        <span className="user-name">{this.props.user.name} {this.props.user.last_name}</span>
                        <FaChevronDown className={"user-open-expanded" + (this.state.expanded?" expanded":"")} onClick={()=>{this.setState({expanded: !this.state.expanded});}} />
                        <UserHeaderExpanded doLogout={this.props.doLogout} user_expanded={this.state.expanded} user={this.props.user} />
                    </div>
                </div>
            </div>
        );
    }
}
