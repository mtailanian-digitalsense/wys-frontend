import React, { Component, Fragment } from "react";
import PopupSearchNoBuildings from "../PopupSearchNoBuildings";
import IconlayoutSelectedBuilding from "../../img/layout-building-icon.png";
import IconlayoutSelectedBuildingDisabled from "../../img/layout-building-disabled-icon.svg";

import IconlayoutSelectedBD from "../../img/layout-bd-icon.svg";
import IconlayoutSelectedUpload from "../../img/layout-upload-icon.svg";


export default class ProjectLayoutTemplateTypeSelect extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selected: null
        };
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
                        Crear Layout
                    </h1>
                </div>               
            </div>
            <div className="content">
            	<div className="layout-select-template-type-boxes">
                    <div className="layout-select-template-type-box">
	                 	<img alt="" className="layout-select-template-type-box-img small" src={this.props.building_data?IconlayoutSelectedBuilding:IconlayoutSelectedBuildingDisabled} />
	                 	<div className="layout-select-template-type-box-selected-building">{this.props.building_data?this.props.building_data.selected_building.name:"No se ha seleccionado edificio"}</div>

	                 	<div className="layout-select-template-type-box-title">En base a edificio<br /> seleccionado anteriormente</div>
	                 	<div onClick={()=> {this.setState({selected: 1})}}
                            className={"button is-gray is-rounded " + (this.state.selected===1?"is-green":"is-dark-line is-white")} >
                            {this.state.selected===1?"SELECCIONADO":"SELECCIONAR"}
	                        
	                    </div>
	                </div>
	                <div className="layout-select-template-type-box">
	                 	<img alt="" className="layout-select-template-type-box-img" src={IconlayoutSelectedBD} />	                
	                 	<div className="layout-select-template-type-box-title">Elegir desde la<br /> base de datos</div>
	                 	<div onClick={()=> {this.setState({selected: 2})}}
                            className={"button is-rounded " + (this.state.selected===2?"is-green":"is-dark-line is-white")}>
	                        {this.state.selected===2?"SELECCIONADO":"SELECCIONAR"}
	                    </div>
	                </div>
	                <div className="layout-select-template-type-box">
	                 	<img alt="" className="layout-select-template-type-box-img" src={IconlayoutSelectedUpload} />	                
	                 	<div className="layout-select-template-type-box-title">Cargar<br /> una planta</div>
	                 	<div onClick={()=> {this.setState({selected: 3})}}
                            className={"button is-rounded " + (this.state.selected===3?"is-green":"is-dark-line is-white")}>
                            {this.state.selected===3?"SELECCIONADO":"SELECCIONAR"}
	                        
	                    </div>
	                </div> 
                </div> 

               
                <div className="actions-area">
                    {/*<Link to={"/proyecto/" + (project?project.id:"") + "/busqueda_de_edificio/resultados"} className="button is-green is-rounded">
                        Continuar
                    </Link>*/}
                    <div
                        onClick={() => this.props.continue(this.state.selected)}                        
                        className={"button is-rounded" + (this.state.selected?" is-green":"")}>
                        Continuar
                    </div>
                </div>
            </div>
            {this.state.searching === "not_found" ? (
                    <PopupSearchNoBuildings
                        onDismiss={() =>
                            this.setState({ searching: false })
                        }
                    />
                ) : null}
            </Fragment>

              
        );
    }
}