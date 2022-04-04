import React, { Component } from "react";
import { Link } from "react-router-dom";
import LoadingFull from "../LoadingFull";


import {getProjectInfo} from "../../api.js";
import ModuleDoneModules from "../ModuleDoneModules";
export default class ProjectCostDone extends Component {
    constructor(props) {
      super(props);
    
      this.state = {unit: "USD", loading: true};
    }
    componentDidMount() {
        getProjectInfo(this.props.project.id, (error, result) => {
            if(error) {
                return console.log("error loading projectinfo", error);
            }
            this.setState({progress: result});
        });   
    }
    render() {
        if (!this.state.progress) return <LoadingFull />;

        var project = this.state.progress;
        return (
            <div className="results-screen m2 cost">
                <div className="results">
                    <div className="content">
                        <div className="alert-message">
                            <h1 className="area">Estimador de costos</h1>
                            <h2 className="message">Finalizado con éxito</h2>
                        </div>
                        <div className="result-area">
                            <div className="button-area item">
                                <Link
                                    to={"/proyecto/" + this.props.project_id + "/estimador_de_costos"}
                                    className="button is-white is-rounded"
                                >
                                    Editar
                                </Link>
                            </div>
                            <div className="result-data item">
                                <div className="result-box">
                                    <h3 className="title">Costo estimado</h3>
                                    <h4 className="data cost-result-name uppercase">
                                        {roundTwoDecimals(project.price).toLocaleString("de")} {this.state.unit}
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
                <ModuleDoneModules project={project} ignore="cost" />
            </div>
        );
    }
}
function roundTwoDecimals(num) {
    return Math.round((num + Number.EPSILON) * 100) / 100;
}