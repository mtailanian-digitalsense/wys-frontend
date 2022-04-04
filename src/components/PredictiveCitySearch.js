import React from 'react';
import {searchBuildingByName, searchBuildingByName2} from "../api.js";
import Scrollbar from "react-scrollbars-custom";

export default class PredictiveCitySearch extends React.Component {
	constructor(props) {
		super(props);
		this.state = {};
	}
	search(searchValue) {
		this.setState({searchValue}, () => {
			if(!this.props.type==="B")
			searchBuildingByName(this.props.city_name, this.state.searchValue, (error, result) => {
				this.setState({options: result});
			}); 
			else
			searchBuildingByName2("None", this.state.searchValue, (error, result) => {
			this.setState({options: result?result.map(r=>{return{...r}}):null});
			}); 

		});
	}
	renderOptions() {
		if(!this.state.options) return null;
		var options = this.state.options.map((option, i) => {
			return(
				<div onClick={()=>this.props.setPredictiveBuilding(option)}  className={"layout-building-predictive-search-option"}>{option.name}</div>
			);
		});
		return (<div className={"layout-building-predictive-search-options"}><Scrollbar style={{ width: "100%", flex:1, height: "120px"}}>{options}</Scrollbar></div>);
	}
	render() {
		return (
			
			<div className={"layout-building-predictive-search"}>				
				{this.props.predictive_building?<p className="layout-building-predictive-search-selected">{this.props.predictive_building.name}</p>:
				<div><input placeholder={this.props.placeholder} onChange={(e)=> {this.search(e.target.value)}} />
				{this.renderOptions()}</div>}
			</div>
		);
	}
}
