import React, { Component } from "react";
import { Link } from "react-router-dom";
import PopupNewProject from "./PopupNewProject.js";
import LoadingFull from "./LoadingFull";
import {getProjectsInfo, deleteProject} from '../api.js';
import trashImg from "../img/trashcan.png";

export default class Home extends Component {
    constructor(props) {
      super(props);
    
      this.state = {
          popupNewProject: null,
          selectedProject: null,
          projects: "loading"
      };
    }
    componentDidMount() {     
        this.loadProjects();
        

    }
    loadProjects() {
        getProjectsInfo((error, result) => {
            if(error) {
                console.log("error loading projectinfo", error);
                return this.setState({projects: []});
            }
            this.setState({projects: result, selectedProject: result[0]});
        });   
    }
  
    calculateProgress(project) {
        var pctg = 0;
        if(project.m2 !== null && project.m2 !== "") pctg += 20;
        if(project.location !== null && project.location !== "") pctg += 20;
        if(project.layout !== null && project.layout !== "") pctg += 20;
        if(project.price !== null && project.price !== "") pctg += 20;
        if(project.time !== null && project.time !== "") pctg += 20;


        return pctg;        
    }
    deleteProject(project_id) {
        deleteProject(project_id, () => {
            this.loadProjects();
        });
    }
    renderProjects() {
        if(!this.state.projects) return null;        
        if(this.state.projects === "loading") return null;
        if(this.state.projects === "error") return "Error cargando proyectos";
        if(this.state.projects.length === 0) return "Aún no has creado proyectos";
        var loading_m2 = false;
        this.state.projects.forEach((p)=> { if(p.m2_gen_id === "loading") loading_m2 = true;

        });
        if(loading_m2) return null;
        return this.state.projects.map((project, i) => {
            var selected = this.state.selectedProject && project.id === this.state.selectedProject.id?" selected":"";
            var pctg = this.calculateProgress(project);
            return(
                <div key={project.id} style={{flexDirection: "row", display: "flex", marginBottom: 10}}>
                <div key={project.id} className={"panel-project" + selected} style={!selected?{width: "calc(100% - 50px)"}:null}
                    onClick={() =>this.setState({selectedProject: project})}>
                    <span className="project-name">
                        {project.name}
                    </span>
                    <div className="project-progress">
                        <span className="percentaje">
                        {pctg}%
                        </span>
                        <span className={"progress-bar a-" + pctg}></span>
                    </div>
                </div>
                {selected?<div style={{cursor: "pointer", backgroundColor: "#DDDDDD", width: 38, height: 38, borderRadius: "50%", marginLeft: 20}} onClick={()=>{if(window.confirm("¿Seguro que desea eliminar este proyecto?")) {
                    this.deleteProject(project.id);
                }}}>
                    <img alt="Eliminar" src={trashImg} style={{marginLeft: 10, marginTop: 8, height: 18}} />
                </div>:null}

                </div>);
        });
    }
    render() {
        return (
            <div className="main-content">
                <div className="panels-area">
                    <div className="panel-box orange-theme">
                        <div className="panel-content">
                            <div className="panel-title">
                                <h2>
                                    Nuevo
                                    <br />
                                    Proyecto
                                </h2>
                            </div>
                            <div className="panel-inner-content">
                                <p>
                                    Podrás: Calcular los m<sup>2</sup> que necesitas, encontrar un inmueble disponible, crear el layout y estimar los costos y los plazos de ejecución.
                                </p>
                            </div>
                            <div className="panel-actions">
                                <div
                                    onClick={()=> this.setState({popupNewProject: true})}
                                    className="button is-rounded is-green size-m"
                                >
                                    Comenzar
                                </div>
                            </div>
                        </div>
                    </div>
                    {this.state.projects&&this.state.projects.length && Array.isArray(this.state.projects)?
                    <div className="panel-box purple-theme">
                        <div className="panel-content">
                            <div className="panel-title">
                                <h2>
                                    Continuar
                                    <br />
                                    Proyecto
                                </h2>
                            </div>
                            <div className="panel-inner-content">
                                <div className="panel-projects">
                                    {this.renderProjects()}
                                </div>
                            </div>
                            <div className="panel-actions">
                                <Link
                                    to={"/inicio/comparar"}
                                    className="button is-rounded is-green size-m"
                                >
                                    Comparar
                                </Link>
                                <Link
                                    to={"/proyecto/" + (this.state.selectedProject?this.state.selectedProject.id:null)}
                                    className="button is-rounded is-green size-m"
                                >
                                    Continuar
                                </Link>
                            </div>
                        </div>
                    </div>:null}
                </div>
                {this.state.popupNewProject ? 
                    <PopupNewProject 
                        toggleMainLoading={this.props.toggleMainLoading}
                        onDismiss={()=> this.setState({popupNewProject: null})}
                        onCreate={(project) => {
                            this.props.redirect("/proyecto/" + project.id);
                            
                        }} 
                    /> : null}
                {this.state.projects === "loading"?<LoadingFull />:null}


            </div>
        );
    }
}