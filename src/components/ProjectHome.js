import React, { Component } from "react";
import { Link } from "react-router-dom";
import LoadingFull from "./LoadingFull";

import iconTape from "../img/icon-tape-measure.svg";
import iconSearch from "../img/icon-home-search.svg";
import iconBlueprint from "../img/icon-blueprint.svg";
import iconCost from "../img/icon-cost.svg";
import iconTime from "../img/icon-time.svg";
import bgArea from "../img/bg-area.jpg";
import bgSearch from "../img/bg-home-search.jpg";
import bgLayout from "../img/bg-blueprint.jpg";
import bgCost from "../img/bg-cost.jpg";
import bgTime from "../img/bg-time.jpg";
import {getProjectInfo} from "../api.js";
import PopupLayoutDetail from "./PopupLayoutDetail.js";

export default class ProjectHome extends Component {
    constructor(props) {
        super(props);
        this.state = {loading: true};
    }
    componentDidMount() {
        getProjectInfo(this.props.project.id, (error, result) => {
            if(error) {
                return console.log("error loading projectinfo", error);
            }
            this.setState({progress: result});
        });   
    }

    openLayoutPopup(project) {
        this.setState({layoutDetails: project});
    }
    
    render() {
        var project = this.props.project;
        var progress = this.state.progress;
        if(!progress) return <LoadingFull />;

        return (
            <div className="main-content-logged detail-finished">
                <div className="heading-content">
                    <div className="project-main-info">
                        <h2 className="page-title">Nuevo proyecto</h2>
                        <h1 className="project-name">{project?project.name:""}</h1>
                    </div>
                </div>
                <div className="content">
                    <div className="project-modules-area">
                        <div className={"module-box" + (progress.m2!==""?" done": "")}>
                            <div className="front-info">
                                <div
                                    className="bg-img cover"
                                    style={{
                                        backgroundImage: `url(${bgArea})`,
                                    }}
                                >
                                    <div className="veil veil-top"></div>
                                </div>
                                <div className="icon-box">
                                    <img src={iconTape} className="icon" alt="Cálculo de área" />
                                </div>
                                <div className="front-content">
                                    <span className="module-name">
                                        Calcula la superficie
                                    </span>
                                    <h3 className="module-title">
                                        ¿Cuántos m2 necesito?
                                    </h3>
                                </div>
                            </div>
                            <div className="back-info gradient-green">
                                    {progress.m2!==""?
                                        <div className="module-done-info">
                                            <div className="module-done-info-title">Módulo completado</div>
                                            <div className="module-done-info-value">{Math.round(progress.m2)} m<sup>2</sup></div>
                                            <div className="module-done-info-legend">Área estimada</div>
                                        </div>


                                        :null}
                                    {progress.m2!==""?
                                        <Link
                                    to={(project?project.id:"") + "/calculo_de_area/done"}
                                    className="button is-transparent is-white-line is-rounded size-m"
                                >
                                    Editar
                                </Link>
                                    : <Link
                                    to={(project?project.id:"") + "/calculo_de_area"}
                                    className="button is-white is-rounded size-m"
                                >
                                    Comenzar
                                </Link>}
                            </div>
                        </div>
                        <div className={"module-box" + (progress.location!==""?" done": "")}>
                            <div className="front-info">
                                <div
                                    className="bg-img cover"
                                    style={{
                                        backgroundImage: `url(${bgSearch})`,
                                    }}
                                >
                                    <div className="veil veil-top"></div>
                                </div>
                                <div className="icon-box">
                                    <img src={iconSearch} className="icon" alt="Búsqueda de Edificio" />
                                </div>
                                <div className="front-content">
                                    <span className="module-name">
                                        Encuentra tu oficina
                                    </span>
                                    <h3 className="module-title">
                                        ¿Dónde estará ubicada?
                                    </h3>
                                </div>
                            </div>
                            <div className="back-info gradient-orange-vert">
                                {progress.location!==""?
                                        <div className="module-done-info">
                                            <div className="module-done-info-title">Módulo completado</div>
                                            <div className="module-done-info-value">{progress.location}</div>
                                            <div className="module-done-info-legend">Edificio seleccionado</div>
                                        </div>


                                        :null}
                                {progress.location!==""?
                                        <Link
                                    to={(project?project.id:"") + "/busqueda_de_edificio/done"}
                                    className="button is-transparent is-white-line is-rounded size-m"
                                >
                                    Editar
                                </Link>
                                    : <Link
                                    to={(project?project.id:"") + "/busqueda_de_edificio"}
                                    className="button is-white is-rounded size-m"
                                >
                                    Comenzar
                                </Link>}
                            </div>
                        </div>
                        <div className={"module-box" + (progress.layout!==""?" done": "")}>
                            <div className="front-info">
                                <div
                                    className="bg-img cover"
                                    style={{
                                        backgroundImage: `url(${bgLayout})`,
                                    }}
                                >
                                    <div className="veil veil-top"></div>
                                </div>
                                <div className="icon-box">
                                    <img src={iconBlueprint} className="icon" alt="Layout" />
                                </div>
                                <div className="front-content">
                                    <span className="module-name">Diseñala</span>
                                    <h3 className="module-title">
                                        ¿Cómo estará dispuesta?
                                    </h3>
                                </div>
                            </div>
                            <div className="back-info gradient-purple-vert">
                                {progress.layout!==""?
                                        <div className="module-done-info">
                                            <div className="module-done-info-title">Módulo completado</div>
                                            <div onClick={() => this.openLayoutPopup(progress)} className="module-done-info-legend detail" style={{marginTop: 30, marginBottom: 20}}>VER DETALLE</div>
                                        </div>


                                        :null}
                                {progress.layout!==""?
                                        <Link
                                    to={(project?project.id:"") + "/layout/done"}
                                    className="button is-transparent is-white-line is-rounded size-m"
                                >
                                    Editar
                                </Link>
                                    :  <Link
                                    to={(project?project.id:"") + "/layout"}
                                    className="button is-white is-rounded size-m"
                                >
                                    Comenzar
                                </Link>}
                            </div>
                        </div>
                        <div className={"module-box" + (progress.price!==""?" done": "")}>
                            <div className="front-info">
                                <div
                                    className="bg-img cover"
                                    style={{
                                        backgroundImage: `url(${bgCost})`,
                                    }}
                                >
                                    <div className="veil veil-top"></div>
                                </div>
                                <div className="icon-box">
                                    <img src={iconCost} className="icon" alt="Estimador de Costos" />
                                </div>
                                <div className="front-content">
                                    <span className="module-name">
                                        Calcula los costos
                                    </span>
                                    <h3 className="module-title">
                                        ¿Cuánto Costará?
                                    </h3>
                                </div>
                            </div>
                            <div className="back-info gradient-aqua-vert">
                                {progress.price!==""?
                                        <div className="module-done-info">
                                            <div className="module-done-info-title">Módulo completado</div>
                                            <div className="module-done-info-value">{roundTwoDecimals(progress.price).toLocaleString("de")} USD</div>
                                            <div className="module-done-info-legend">Costo estimado</div>
                                        </div>


                                        :null}
                                {progress.price!==""?
                                        <Link
                                    to={(project?project.id:"") + "/estimador_de_costos/done"}
                                    className="button is-transparent is-white-line is-rounded size-m"
                                >
                                    Editar
                                </Link>
                                    :  <Link
                                    to={(project?project.id:"") + "/estimador_de_costos"}
                                    className="button is-white is-rounded size-m"
                                >
                                    Comenzar
                                </Link>}
                               
                            </div>
                        </div>
                        <div className={"module-box" + (progress.time!==""?" done": "")}>
                            <div className="front-info">
                                <div
                                    className="bg-img cover"
                                    style={{
                                        backgroundImage: `url(${bgTime})`,
                                    }}
                                >
                                    <div className="veil veil-top"></div>
                                </div>
                                <div className="icon-box">
                                    <img src={iconTime} className="icon" alt="Estimador de Plazos" />
                                </div>
                                <div className="front-content">
                                    <span className="module-name">
                                        Estima los plazos
                                    </span>
                                    <h3 className="module-title">
                                        ¿Cuánto tiempo Tomará?
                                    </h3>
                                </div>
                            </div>
                            <div className="back-info gradient-pink-vert">
                                {progress.time!==""?
                                        <div className="module-done-info">
                                            <div className="module-done-info-title">Módulo completado</div>
                                            <div className="module-done-info-value">{progress.time} semanas</div>
                                            <div className="module-done-info-legend">Tiempo estimado</div>
                                        </div>


                                        :null}
                                {progress.time!==""?
                                        <Link
                                    to={(project?project.id:"") + "/estimador_de_plazos/done"}
                                    className="button is-transparent is-white-line is-rounded size-m"
                                >
                                    Editar
                                </Link>
                                    :   <Link
                                    to={(project?project.id:"") + "/estimador_de_plazos"}
                                    className="button is-white is-rounded size-m"
                                >
                                    Comenzar
                                </Link>}
                               
                            </div>
                        </div>
                    </div>
                </div>
                <div className="page-btns-area">
                    <Link
                        className="button is-transparent is-rounded is-dark-line"
                        to={"/inicio"}
                    >
                        Volver a inicio
                    </Link>
                </div>
                {this.state.layoutDetails ? (
                    <div className="layoutDetails"><PopupLayoutDetail
                      project={this.state.layoutDetails}
                        onDismiss={() =>
                            this.setState({ layoutDetails: null })
                        }
                    /></div>
                ) : null}
            </div>
        );
    }
}
function roundTwoDecimals(num) {
    return Math.round((num + Number.EPSILON) * 100) / 100;
}
