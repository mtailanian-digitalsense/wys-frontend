import React, {Component} from 'react';
import TooltipIcon from "./TooltipIcon";
const factor = 10; 

export default class CompareTableControls extends Component {
    render() {
        return (
            <div className="compare-controls">
                <div className="compare-controls-buttons">
                    <div className={"compare-controls-button" + (this.props.criteria===(1/factor)?" selected":"")}
                        onClick={()=>this.props.onChange(1/factor)}>-</div> 
                    <div className={"compare-controls-button" + (this.props.criteria===(1)?" selected":"")}
                        onClick={()=>this.props.onChange(1)}>o</div> 
                    <div className={"compare-controls-button" + (this.props.criteria===factor?" selected":"")}
                        onClick={()=>this.props.onChange(factor)}>+</div> 
                </div>
                {/* <div className="compare-controls-button help">?</div> */}
                {this.props.explanation ? <TooltipIcon label={this.props.explanation} changeClass="compare-controls-button help"/> : null}
            </div>
        );
    }
}
