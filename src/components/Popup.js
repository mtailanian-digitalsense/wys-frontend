import React, { Component } from "react";
import { FaTimes } from "react-icons/fa";

export default class Popup extends Component {   
    
    render() {       
        return (
            <div className={"modal-area" 
                + (this.props.colorPalette?" "+this.props.colorPalette:"")
                + (this.props.size?" "+this.props.size:"")}>
                <div className="overlay" onClick={()=>this.props.onDismiss()}></div>
                <div className="modal-box">
                    {this.props.hideClose?null:<span className="close-modal" onClick={()=>this.props.onDismiss()}>
                        <FaTimes />
                    </span>}
                    <div className="modal-content">
                        {this.props.children}
                    </div>
                </div>
            </div>
        );
    }
}