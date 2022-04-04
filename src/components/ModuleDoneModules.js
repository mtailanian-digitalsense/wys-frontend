import React, { Component } from 'react';
import iconM2 from "../img/icon-tape-measure.svg";
import iconSearch from "../img/icon-home-search.svg";
import iconBlueprint from "../img/icon-blueprint.svg";
import iconCost from "../img/icon-cost.svg";
import iconTime from "../img/icon-time.svg";
import { Link } from "react-router-dom";

export default class ModuleDoneModules extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
   
	render() {
        var project = this.props.project;
        if(!project) return null;
		return (
			<div className="modules-area">
                <div className="content flex-row">
              	  {this.props.ignore==="m2"?null:<div className="module-box gradient-green-vert">
                        <div className="module-content">
                            <div className="top-info">
                                <div className="icon-box">
                                    <img
                                        src={iconM2}
                                        className="icon green-filter"
                                        alt="Búsqueda de Edificio"
                                    />
                                </div>
                            </div>
                            <div className="bot-info">
                                <span className="module-name">
                                    Cálculo de area
                                </span>
                                <h3 className="module-title">
                                    {project.m2!==""?project.m2 + " mts":"¿Cuánto medirá?"}
                                </h3>
                                <div className="module-link">
                                    <Link
                                        to={"/proyecto/" + 
                                            (project ? project.id : "") +
                                            "/calculo_de_area" + (project.m2!==""?"/done":"")
                                        }
                                        className="button is-white is-rounded size-m"
                                    >
                                        {project.m2!==""?"Editar":"Comenzar"}
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>}
                    {this.props.ignore==="search"?null:<div className="module-box gradient-orange-vert">
                        <div className="module-content">
                            <div className="top-info">
                                <div className="icon-box">
                                    <img
                                        src={iconSearch}
                                        className="icon orange-filter"
                                        alt="Búsqueda de Edificio"
                                    />
                                </div>
                            </div>
                            <div className="bot-info">
                                <span className="module-name">
                                    Búsqueda de Edificio
                                </span>
                                <h3 className="module-title">
                                    {project.location!==""?project.location:"¿Dónde estará ubicado?"}
                                </h3>
                                <div className="module-link">
                                    <Link
                                        to={"/proyecto/" + 
                                            (project ? project.id : "") +
                                            "/busqueda_de_edificio" +
                                            (project.location!==""?"/done":"")
                                        }
                                        className="button is-white is-rounded size-m"
                                    >
                                        {project.location!==""?"Editar":"Comenzar"}
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>}
                    {this.props.ignore==="layout"?null:<div className="module-box gradient-purple-vert">
                        <div className="module-content">
                            <div className="top-info">
                                <div className="icon-box">
                                    <img
                                        src={iconBlueprint}
                                        className="icon purple-filter"
                                        alt="Layout"
                                    />
                                </div>
                            </div>
                            <div className="bot-info">
                                <span className="module-name">Layout</span>
                                <h3 className="module-title">                                    
                                    {project.layout!==""?"COMPLETADO":"¿Cómo estará dispuesta?"}
                                </h3>
                                <div className="module-link">
                                    <Link
                                        to={"/proyecto/"+
                                            (project ? project.id : "") +
                                            "/layout"
                                        }
                                        className="button is-white is-rounded size-m"
                                    >
                                        {project.layout!==""?"Editar":"Comenzar"}
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>}
                    {this.props.ignore==="cost"?null:<div className="module-box gradient-aqua-vert">
                        <div className="module-content">
                            <div className="top-info">
                                <div className="icon-box">
                                    <img
                                        src={iconCost}
                                        className="icon lightblue-filter"
                                        alt="Estimador de Costos"
                                    />
                                </div>
                            </div>
                            <div className="bot-info">
                                <span className="module-name">
                                    Estimador de Costos
                                </span>
                                <h3 className="module-title">
                                    {project.price!==""?project.price + " USD":"¿Cuánto Costará?"}
                                </h3>
                                <div className="module-link">
                                    <Link
                                        to={
                                            "/proyecto/"+(project ? project.id : "") +
                                            "/estimador_de_costos"
                                            + (project.price!==""?"/done":"")

                                        }
                                        className="button is-white is-rounded size-m"
                                    >
                                        {project.price!==""?"Editar":"Comenzar"}
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>}
                    {this.props.ignore==="time"?null:<div className="module-box gradient-pink-vert">
                        <div className="module-content">
                            <div className="top-info">
                                <div className="icon-box">
                                    <img
                                        src={iconTime}
                                        className="icon yellow-filter"
                                        alt="Estimador de Plazos"
                                    />
                                </div>
                            </div>
                            <div className="bot-info">
                                <span className="module-name">
                                    Estimador de Plazos
                                </span>
                                <h3 className="module-title">
                                    {project.time!==""?project.time + " semanas":"¿Cuánto tiempo Tomará?"}
                                </h3>
                                <div className="module-link">
                                    <Link
                                        to={"/proyecto/"+
                                            (project ? project.id : "") +
                                            "/estimador_de_plazos"
                                            + (project.time!==""?"/done":"")

                                        }
                                        className="button is-white is-rounded size-m"
                                    >
                                         {project.time!==""?"Editar":"Comenzar"}
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>}
                </div>
            </div>
		);
	}
}
