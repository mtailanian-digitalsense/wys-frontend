import React, { Component } from "react";
import { Link } from "react-router-dom";
import LoadingFull from "../LoadingFull";


import {getProjectBuildingData, getProjectInfo} from "../../api.js";
import ModuleDoneModules from "../ModuleDoneModules";


export default class ProjectSearchDone extends Component {
    constructor(props) {
      super(props);
    
      this.state = {};
    }
    componentDidMount() {
        //this.loadBuildingData();
         getProjectInfo(this.props.project.id, (error, result) => {
            if(error) {
                return console.log("error loading projectinfo", error);
            }
            this.setState({progress: result});
        }); 
    }
    loadBuildingData() {
        getProjectBuildingData(this.props.project_id, (error, result)=> {
            this.setState({building_data: result});

        });
    }    
    render() {
        if (!this.state.progress) return <LoadingFull />;

        var project = this.state.progress;
        return (
            <div className="results-screen m2 search">
                <div className="results">
                    <div className="content">
                        <div className="alert-message">
                            <h1 className="area">Búsqueda de edificio</h1>
                            <h2 className="message">Finalizado con éxito</h2>
                        </div>
                        <div className="result-area">
                            <div className="button-area item">
                                <Link
                                    to={"/proyecto/" + this.props.project_id + "/busqueda_de_edificio"}
                                    className="button is-white is-rounded"
                                >
                                    Editar
                                </Link>
                            </div>
                            <div className="result-data item">
                                <div className="result-box">
                                    <h3 className="title">Edificio seleccionado</h3>
                                    <h4 className="data building-search-result-name">
                                        {project.location}
                                    </h4>
                                </div>
                            </div>
                            <div className="button-area item">
                                <Link
                                    to={"/proyecto/" + this.props.project_id}
                                    className="button is-green is-rounded"
                                >
                                    Volver a inicio
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
                <ModuleDoneModules project={project} ignore="search" />
            </div>
        );
    }
}
