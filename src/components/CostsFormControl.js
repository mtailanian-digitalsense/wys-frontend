import React, {Component} from 'react';

export default class CostsFormControl extends Component {
    render() {
        return (
            <div className="compare-controls">
                <div className="compare-controls-buttons">
                    <div className={"compare-controls-button" + (this.props.value==="low"?" selected":"")}
                        onClick={()=>this.props.onChange("low")}>-</div> 
                    <div className={"compare-controls-button" + (this.props.value==="normal"?" selected":"")}
                        onClick={()=>this.props.onChange("normal")} style={{fontSize: "10px", paddingTop: "3px"}}>o</div> 
                    <div className={"compare-controls-button" + (this.props.value==="high"?" selected":"")}
                        onClick={()=>this.props.onChange("high")}>+</div> 
                </div>
                {this.props.noHelp?null:<div className="compare-controls-button help">?</div>}
            </div>
        );
    }
}
