import React, {Component} from 'react';
import TooltipIcon from "./TooltipIcon";

export default class CompareTableControls extends Component {
    render() {
        return (
            <div className="compare-controls" style={{marginTop: '5px'}}>
                <div className="compare-controls-buttons">
                    <div className={"compare-controls-button" + (this.props.criteria==="menor"?" selected":"")}
                        onClick={()=>this.props.onChange("menor", this.props.column)}>-</div> 
                    <div className={"compare-controls-button" + (this.props.criteria==="neutro"?" selected":"")}
                        onClick={()=>this.props.onChange("neutro", this.props.column)}>o</div> 
                    <div className={"compare-controls-button" + (this.props.criteria==="mayor"?" selected":"")}
                        onClick={()=>this.props.onChange("mayor", this.props.column)}>+</div> 
                </div>
                {/* <div className="compare-controls-button help">?</div> */}
                {this.props.explanation ? <TooltipIcon label={this.props.explanation} changeClass="compare-controls-button help"/> : null}
            </div>
        );
    }
}
