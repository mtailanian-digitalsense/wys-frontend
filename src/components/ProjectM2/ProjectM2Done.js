import React, { Component } from "react";
import { Link } from "react-router-dom";
import LoadingFull from "../LoadingFull";


import {getProjectInfo} from "../../api.js";

import ModuleDoneModules from "../ModuleDoneModules";


export default class ProjectM2Done extends Component {
    constructor(props) {
      super(props);
    
      this.state = {
        medition_type: '',
        medition_value: 0
      };
    }
    componentDidMount() {
        //this.loadM2Data();
        getProjectInfo(this.props.project.id, (error, result) => {
            if(error) {
                return console.log("error loading projectinfo", error);
            }
            this.setState({progress: result, medition_value: result.m2, medition_type: 'mt2'});
        });   
    }

    conversion = (type, value) => {
        if (type === "mt2") {
            let ft_val = value * 10.764;
            this.setState({medition_value: ft_val, medition_type: 'ft2'});
        } else if (type === "ft2") {
            this.setState({medition_value: value, medition_type: 'mt2'});
        }
    } 
   
    render() {
        if (!this.state.progress) return <LoadingFull />;

        var project = this.state.progress;
        return (
            <div className="results-screen m2">
                <div className="results">
                    <div className="content">
                        <div className="alert-message">
                            <h1 className="area">Calculo de Area</h1>
                            <h2 className="message">Finalizado con éxito</h2>
                        </div>
                        <div className="result-area">
                            <div className="button-area item">
                                <Link
                                    to={"/proyecto/" + this.props.project_id + "/calculo_de_area"}
                                    className="button is-white is-rounded"
                                >
                                    Editar
                                </Link>
                            </div>
                            <div className="result-data item">
                                <div className="result-box">
                                    <h3 className="title">Área Estimada</h3>
                                    <h4 className="data align-text">
                                        <span className="number">{Math.round(this.state.medition_value)}</span>{" "}
                                        <span className="label">
                                           {this.state.medition_type === "ft2" ? 'Ft' : 'M'}<sup>2</sup>
                                        </span>
                                    </h4>
                                    <p className="fts-modify-legend" onClick={() => this.conversion(this.state.medition_type, project.m2)}>
                                        Cambiar a {this.state.medition_type === "ft2" ? 'm2' : 'ft2'}
                                    </p>
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
                <ModuleDoneModules project={project} ignore="m2" />
            </div>
        );
    }
}
