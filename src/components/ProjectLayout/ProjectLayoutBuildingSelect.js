import React, { Component, Fragment } from "react";
import { Link } from "react-router-dom";
import PopupSearchNoBuildings from "../PopupSearchNoBuildings";
import Scrollbar from "react-scrollbars-custom";
import SearchResultBuilding from "../SearchResultBuilding.js";
import PopupBuildingDetail from "../PopupBuildingDetail.js";
import {  LoadScript } from '@react-google-maps/api';

export default class ProjectLayoutBuildingSelect extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    } 
    updateBuildingHover(b, value) {

    }
    renderBuildings() {
        if(!this.props.buildings) return null;
        return this.props.buildings.sort((a, b) => a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1).map((b, i) => {
            return <SearchResultBuilding 
                        key={b.id}
                        building={b} 
                        selected={this.props.zone_building && b.id === this.props.zone_building.id}
                        toggleHover={(value)=>this.updateBuildingHover(b, value)}
                        openBuildingDetails={(building)=>this.setState({buildingDetails: building})}
                        updateBuildingHover={this.props.updateBuildingHover}
                        toggleBuilding={this.props.toggleBuilding} />;
        })
    }  
    render() {
        var project = this.props.project;
        if (!project || project === "loading") return null;
        
        return (
            <Fragment>
            <div className="heading-content">
                <div className="project-tool-info">
                    <h2 className="tool-name">Layout</h2>                
                    <h1 className="subtool-name">
                        Escoge tu edificio
                    </h1>
                </div>               
            </div>
            <div className="content">
            <div className="building-search-results-columns">
                    <div className="building-search-results-list width-100pct">
            		<Scrollbar style={{ width: "100%", flex:1}}>
            		{this.renderBuildings()}
	               
	                </Scrollbar>
                </div> 
            </div> 


               
            </div>
            <div className="page-btns-area flex space-between width-100pct">
                <Link
                      className="button is-transparent is-rounded is-dark-line"
                      to={"/proyecto/" + (project?project.id:"") + "/layout"}>
                      Volver
                  </Link>
                <div onClick={()=> this.props.doneSelectingBuilding()} className={"button is-rounded" + (this.state.zone_building?" is-green":"")}>
                    Continuar
                </div>
            </div>
            {this.state.searching === "not_found" ? (
                    <PopupSearchNoBuildings
                        onDismiss={() =>
                            this.setState({ searching: false })
                        }
                    />
                ) : null}
            {this.state.buildingDetails ? (
                    <PopupBuildingDetail
                      building={{...this.state.buildingDetails}}
                        onDismiss={() =>
                            this.setState({ buildingDetails: null })
                        }
                    />
                ) : null}
            <LoadScript
		      googleMapsApiKey="AIzaSyD0p2UYSQf5z10PtOD63wVs8gLbEhxP8FM"
		    />
            </Fragment>

              
        );
    }
}