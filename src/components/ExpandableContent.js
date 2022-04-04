import React, { Component } from "react";
import { FaChevronDown } from "react-icons/fa";

export default class ExpandableContent extends Component {
    constructor(props) {
        super(props);

        this.state = {
            expanded: false,
        };
    }
    toggle() {
        this.setState({ expanded: !this.state.expanded }, () =>
            this.props.onChanged(this.state.expanded)
        );
    }
    render() {
        return (
            <div className="expandable-content">
                <div
                    className="expandable-content-header"
                    onClick={() => this.toggle()}
                >
                    <h5 className="expandable-btn">
                        {this.props.title}{" "}
                        <span
                            className={
                                "icon" +
                                (this.state.expanded ? " expanded" : "")
                            }
                        >
                            <FaChevronDown />
                        </span>
                    </h5>
                </div>
                <div
                    className={
                        "expandable-content-content" +
                        (this.state.expanded ? " expanded" : "")
                    }
                >
                    {this.props.children}
                </div>
            </div>
        );
    }
}
