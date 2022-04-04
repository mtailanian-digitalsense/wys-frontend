import React, { Component } from 'react';
import arrow from "../img/arrow-down-black.png";
export default class SimpleSelect extends Component {
	constructor(props) {
	  super(props);
	
	  this.state = {
	  	opened: false
	  };
	}
	render() {
		return (
			<div className={"multiple-select" + (this.state.opened?" opened":"") + (this.props.className?" " + this.props.className:"")}>
				<div className="multiple-select-selected" onClick={()=> this.setState({opened: !this.state.opened})}>
					<p>{this.props.label}</p>
					<img src={arrow} alt="" className="multiple-select-arrow" />
				</div>
				<div className={"multiple-select-list"}>
					{!this.props.options?null:this.props.options.map((option)=> {
						return(
							<div key={option[this.props.labelAttr]} className="multiple-select-list-option" onClick={() => this.props.toggleOption(option)}>
								<div className={"multiple-select-list-option-check" + 
								(this.props.selected && this.props.selected.singular === option.singular? " checked": "")} />
								<p>{option[this.props.labelAttr]}</p>
							</div>
						);
					})}					

				</div>

			</div>
		);
	}
}
