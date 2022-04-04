import React, { Component } from 'react';
import Tooltip from "rc-tooltip";

export default class RangeSteps extends Component {
	render() {
		var steps = [];
		for(var i = 0; i < this.props.steps; i++) {	
			var label = null;
			if(this.props.labels)
				this.props.labels.forEach((_label)=> {
					if(_label.i === i) 
					if(_label.tooltip) {
						label = <Tooltip
                    placement="bottom"
                    visible={true}
                    overlay={
                        <span>
                            {_label.tooltip}                                            
                        </span>
                    }>
                    <p>{_label.text}</p>
                </Tooltip>;

					}else if(_label.upperText) {
						label = <div>
						<p>{_label.text}</p>
						<p style={{position: "relative", top: -60}}>{_label.upperText}</p>
						</div>;						
					} else {
						label = <p>{_label.text}</p>;
					}

				});
			steps.push(
				<div className="range-steps-step">
					{label}
				</div>
			);
		}
		return (
			<div className="range-steps">
			{steps}
			</div>
		);
	}
}
