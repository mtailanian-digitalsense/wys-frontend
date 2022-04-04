import React, { Component, Fragment } from "react";
import { Link } from "react-router-dom";
import Odometer from 'react-odometerjs';
import TooltipIcon from "../TooltipIcon";


export default class ProjectTimeParams extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selected: null,
        };
    }   
    
    render() {
        var project = this.props.project;
        if (!project || project === "loading") return null;
        
        return (
            <Fragment>
            <div className="heading-content">
                <div className="project-tool-info">
                    <h2 className="tool-name">Estimador de plazos</h2>                
                    <h1 className="subtool-name">
                        Estimador de plazos
                    </h1>
                </div>   
                <div className="m2-heading-area">
                      <div className="inline-block float-right margin-right-50 pointer" onClick={()=>{this.props.openAreaPopup()}}>
                          <p className="uppercase">Area estimada</p>
                          <Odometer value={this.props.m2} format="(.ddd),dd" /> 
                          <p className={"mts"}>(m<sup>2</sup>)</p>
                          <p className="mts-modify-legend">Click para modificar</p>
                      </div>
                    </div>            
            </div>
            <div className="heading-content">
                <div className="project-tool-info">
                        {/*<div
                        onClick={() => this.props.continue(this.state.selected)}                        
                        className={"button is-rounded is-white is-small"}>
                        Ver proyecto elegido
                   </div>  */}
                </div>               
                <div className="m2-heading-area">
                      <div className="inline-block float-right margin-right-50">
                          <p className="uppercase">Plazo del proyecto</p>
                          <Odometer value={this.props.weeks} format="(.ddd),d" /> 
                          <p className={"mts uppercase"}>Semanas</p>
                      </div>
                    </div>
            </div>
            <div className="content">
            	<div className="time-params-grid margin-side-A">
                    {!this.props.params?null:this.props.params.map((param, i) => {
                        return(
                            <div key={param.name} className={"time-params-box " + (i<4?"item-half":"item-third")}>
                                {param.title} 
                                <TooltipIcon label={param.comment} />
                                <div className={"time-param-options"}>
                                {!param.options?null:param.options.map((option)=> {
                                    return(<div key={option.value}
                                        onClick={()=> !param.readOnly?this.props.setTimeParameter(param.name, option.value):null}
                                        className={"time-param-option"+(option.value===param.selected?" selected":"")
                                        +(param.readOnly?" readOnly":" hover")}>{option.name}</div>);
                                })}
                                </div>
                            </div>
                        );
                    })}

                  
               </div>
               
           </div>
                <div className="actions-area">                  
                    <Link
                        to={"/proyecto/" + (project?project.id:"") + "/estimador_de_plazos/timeline"}
                        className={"button is-rounded is-green"}>
                        Continuar
                   </Link>
               </div>
               
            
            </Fragment>

              
        );
    }
}