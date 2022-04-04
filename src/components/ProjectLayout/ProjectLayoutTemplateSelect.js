import React, { Component, Fragment } from "react";
import { Link } from "react-router-dom";
import PopupSearchNoBuildings from "../PopupSearchNoBuildings";
import Scrollbar from "react-scrollbars-custom";

export default class ProjectLayoutTemplateSelect extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    } 
    render() {
        var project = this.props.project;
        if (!project || project === "loading") return null;
        var floors = this.props.floors;
        
        return (
            <Fragment>
            <div className="heading-content">
                <div className="project-tool-info">
                    <h2 className="tool-name">Layout</h2>                
                    <h1 className="subtool-name">
                        Escoge una planta
                    </h1>
                </div>               
            </div>
            <div className="content">
            		<Scrollbar style={{ width: "100%", flex:1}}>
            	<div className="layout-template-type-boxes">
	                {!floors?null:floors.map((floor)=>{
	                	return(
	                		<div className="layout-template-type-box" key={floor.id}>
	                			<div>

		                			<div className="layout-template-type-box-image-container">
		                				<img alt="" className="layout-template-type-box-image" src={floor.image_link} />
	                				</div>
		                			<div className="layout-template-type-box-data">

		                				<div className="layout-template-type-box-name">{floor.wys_id}</div>
		                				<div className="layout-template-type-box-mts">{floor.m2} m2</div>

		                			</div>	
			                		<div 	
			                			onClick={()=>{this.setState({selected_floor: floor}); }} 
			                			className={"toggle-circle no-unselect"+(this.state.selected_floor&&this.state.selected_floor.id === floor.id?" check":"")} />
	                			</div>
                			</div>
	                		);

	                })}
                </div> 
	                </Scrollbar>

               
            </div>
            <div className="page-btns-area flex space-between width-100pct">
                <Link
                      className="button is-transparent is-rounded is-dark-line"
                      to={"/proyecto/" + (project?project.id:"") + "/layout"}>
                      Volver
                  </Link>
                <div onClick={()=> this.props.selectFloor(this.state.selected_floor)} className={"button is-rounded" + (this.state.selected_floor?" is-green":"")}>
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
            </Fragment>

              
        );
    }
}