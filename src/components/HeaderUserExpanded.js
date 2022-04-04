import React, { Component } from "react";

export default class HeaderUserExpanded extends Component {
    render() {
        var defaultAvatar2 = null;
        var profilePicture = this.props.user.profile_picture
            ? this.props.user.profile_picture
            : defaultAvatar2;
        return (
            <div
                className={
                    "header-user-bar-expanded" +
                    (this.props.user_expanded ? " opened" : "")
                }
            >
                <div className="col-30 left">
                    <div
                        className="header-circle header-avatar"
                        style={{
                            backgroundImage: "url(" + profilePicture + ")",
                        }}
                    ></div>
                </div>
                <div className="left header-userbar-avatar">
                    <h3 className="user-name">
                        {this.props.user.name} {this.props.user.last_name}
                    </h3>
                    <p className="user-mail">{this.props.user.email}</p>
                    <div
                        className="button is-green size-s is-rounded logout"
                        onClick={() => {
                            this.props.doLogout();
                        }}
                    >
                        Cerrar Sesión
                    </div>
                </div>
            </div>
        );
    }
}
