import React, { Component } from "react";
import Header from "./Header";

export default class Frame extends Component {
    render() {
        return (
            <div className="main">
                <Header location={this.props.location} user={this.props.user} doLogout={this.props.doLogout} />
                {this.props.children}
            </div>
        );
    }
}
