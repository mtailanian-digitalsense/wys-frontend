import React, { Component } from 'react';
import Tooltip from "rc-tooltip";
export default class TooltipIcon extends Component {
	render() {
        var icon = <div className={this.props.changeClass ? this.props.changeClass : "question-icon black"} onClick={this.props.onClick}>?</div>;
        if(this.props.label)
    		return (
    			<Tooltip
                    placement="top"
                    trigger={"hover"}
                    overlayStyle={{ maxWidth: '250px' }}
                    multiline={true}
                    overlay={
                        <span>
                            {this.props.label}                                            
                        </span>
                    }>
                    {icon}
                </Tooltip>		
    		);
        else return icon;
	}
}
