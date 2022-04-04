import React, { Component, Fragment } from "react";
import { Switch, Route } from "react-router-dom";
import SectionHeaderSlider from "../SectionHeaderSlider";

import ProjectTimeParams from './ProjectTimeParams.js';
import ProjectTimeTimeline from './ProjectTimeTimeline.js';
import LoadingFull from '../LoadingFull';

import {  getProjectM2Data, 
getProjectEstimatedTime, getProjectEstimatedTimeDetailed, saveEstimatedTime, getSavedEstimatedTime} from "../../api.js";
import PopupCustomArea from '../PopupCustomArea';
var params = [
    {
        title: "Agilidad validación administración",
        name: "adm_agility",
        selected: "normal",
        comment: "Se refiere a la rapidez con que la administración del edificio entrega su aprobación para el inicio de la obra.",
        readOnly: true,
        options: [
            {name: "Lento", value: "low"},
            {name: "Normal", value: "normal"},
            {name: "Rápido", value: "high"}
        ]
    },
    {
        title: "Agilidad en aprobación de los permisos municipales",
        name: "mun_agility",
        comment: "Se refiere a la rapidez con que la municipalidad correspondiente otorga el permiso para el inicio de la obra.",
        readOnly: true,
        selected: "normal",
        options: [
            {name: "Lento", value: "low"},
            {name: "Normal", value: "normal"},
            {name: "Rápido", value: "high"}
        ]
    },
    {
        title: "Agilidad aprobación del cliente",
        name: "client_agility",
        selected: "normal",
        comment: "Se refiere al tiempo necesario para aprobar internamente la ejecución del proyecto",
        options: [
            {name: "Lento", value: "low"},
            {name: "Normal", value: "normal"},
            {name: "Rápido", value: "high"}
        ]
    },
    
    {
        title: "Modalidad de construcción",
        name: "construction_mod",
        selected: "turnkey",
        comment: (<React.Fragment>- Llave en mano: En esta modalidad, un único proveedor concentra toda la responsabilidad del desarrollo de la obra, asegurando el cumplimiento del plazo, precio y calidad acordados con el cliente.<br />- Administración de Construcción: En esta modalidad, el cliente firma contratos directamente con cada uno de los distintos proveedores, definidos con el apoyo del Administrador. Eso permite que el cliente realice una licitación para cada subcontrato de forma separada.<br />- General Constructor: En esta modalidad, el contratista principal es el único responsable por la obra. Sin embargo, el cliente participa en la selección de los subcontratos.</React.Fragment>),
        options: [
            {name: "Administración construcción", value: "const_adm"},
            {name: "Llave en mano", value: "turnkey"},
            {name: "General constructor", value: "general_contractor"}
        ]
    },
    {
        title: "Horario de obra",
        name: "constructions_times",
        selected: "daytime",
        comment: "Se refiere a la rapidez con que la municipalidad correspondiente otorga el permiso para el inicio de la obra.",
        options: [
            {name: "Libre", value: "free"},
            {name: "Día", value: "daytime"},
            {name: "Nocturno", value: "nightime"}
        ]
   },
    {
        title: "Proceso de compra",
        name: "procurement_process",
        selected: "bidding",
        comment: "Se refiere a la forma en que será adjudicada la ejecución de la obra.",
        options: [
            {name: "Licitación", value: "bidding"},
            {name: "Directa", value: "direct"}
        ]
   },
    {
        title: "Requiere demoliciones",
        name: "demolitions",
        selected: "yes",
        comment: 'Si el inmueble que será usado para las futuras oficinas necesitará demoliciones internas (de tabiques, paredes, baños, etc), marque "sí".',
        options: [
            {name: "Sí", value: "yes"},
            {name: "No", value: "no"}
        ]
   }
   ];
export default class ProjectTime extends Component {
    constructor(props) {
        super(props);
        this.state = {     
          weeks: 0,      
          time_parameters: [...params],
          params: {m2: 0}
        };
    }
    componentDidMount() {
        if(this.props.project && typeof this.props.project !== "string") {
          this.loadData();
        }
    }
    componentDidUpdate(prevProps) {
      if((!prevProps.project ||typeof prevProps.project === "string") && this.props.project && this.props.project.id) {
        this.loadData();   
      }
    }
    loadData() {     
        getSavedEstimatedTime(this.props.project_id, (error, result)=> {
          var current = [...this.state.time_parameters];
          current.forEach((param, i) => {
              for (const property in result) {
                if(property === param.name) param.selected = result[property];
              }
          });
          this.setState({time_parameters: current});
          this.loadM2Data();

        });
    } 
    
    loadM2Data() {
        this.setState({loading: true});

        getProjectM2Data(this.props.project.id, (error, result)=> {
            this.setState({loading: false});          
            if(error) { 
                  this.setState({areaPopup: true});
                  return this.setParameter("m2", null);
                }
            else if(result) {              
              return this.setParameter("m2", Math.round(result.m2_generated_data.area), () => {

                this.calculateTime();
              });
            }
            alert("error inesperado");

        });
    } 
    calculateTime() {

          var data = {};
          this.state.time_parameters.forEach((param)=> {
            data[param.name] = param.selected;
          });
          data.m2 = this.state.params.m2?this.state.params.m2:1000;
          getProjectEstimatedTime(data, (error, data)=> {
            this.setState({weeks: data.weeks});
          });     
    }
    calculateTimeDetailed() {

          var data = {};
          this.state.time_parameters.forEach((param)=> {
            data[param.name] = param.selected;
          });
          data.m2 = this.state.params.m2?this.state.params.m2:1000;          
          var current_day = 0;
          getProjectEstimatedTimeDetailed(data, (error, data)=> {
            var details = data.map((detail, i) => {
              var subtasks = [];
              if(detail.subcategories) subtasks = detail.subcategories.map((subtask, j) => {
                var start_day = current_day;
                var end_day = start_day + (subtask.weeks);
                current_day = end_day;
                return {
                  id: subtask.id,
                  name: subtask.name,
                  is_milestone: subtask.is_milestone,
                  start_day,
                  end_day
                };
              });
              return({
                id: detail.id,
                name: detail.name,
                subtasks

              });

            });
            this.setState({detail: details});
          });     
    }
    setParameter(parameter, value, cb) {
        var params = { ...this.state.params };
        params[parameter] = value;
        this.setState({ params }, cb);
    }    
    setTimeParameter(parameter, value, cb) {
        var time_parameters = [...this.state.time_parameters];
        var param_i = null;
        time_parameters.forEach((param, i)=> {
          if(param_i) return;
          if(param.name === parameter) param_i = i;
        });
        var param = {...time_parameters[param_i]};
        param.selected = value;
        time_parameters[param_i] = param;

        this.setState({ time_parameters }, () => this.calculateTime());
    }
    toggleExpandedTask(task) {
      var detail = [...this.state.detail];
      this.state.detail.forEach((d, i) => {
        if(d.id === task.id) detail[i].expanded = !detail[i].expanded;
      });
      this.setState({detail});
    }
    finish() {
      var data = {};
      this.state.time_parameters.forEach((param)=> {
        data[param.name] = param.selected;
      });
      data.m2 = this.state.params.m2?this.state.params.m2:1000;
      data.project_id = this.props.project.id;
      data.weeks = this.state.weeks;
      saveEstimatedTime(data, (error, result) => {
        console.log(error, result);
        this.props.redirect("/proyecto/"+this.props.project.id+"/estimador_de_plazos/done");
      });
    }
    render() {
        var project = this.props.project;
        if (!project || project === "loading") return <LoadingFull />;
        
        return (
            <Fragment>
                {this.state.loading?<LoadingFull />:null}
                <SectionHeaderSlider
                    section="time"
                    options={[
                        "/proyecto/" + project.id + "/estimador_de_plazos",
                        "/proyecto/" +
                            project.id +
                            "/estimador_de_plazos/timeline"                        
                    ]}
                    selectedOption={this.props.location.pathname}
                />
                <div className="main-content-logged time">                    
                        <Switch>
                            <Route exact path="/proyecto/:id/estimador_de_plazos"
                              render={(data)=> {                
                                  return(
                                      <ProjectTimeParams     
                                          m2={this.state.params.m2}
                                          params={this.state.time_parameters}
                                          setTimeParameter={this.setTimeParameter.bind(this)}
                                          setParameter={this.setParameter.bind(this)}
                                          weeks={this.state.weeks}
                                          calculateTime={this.calculateTime.bind(this)}
                                          openAreaPopup={()=> {this.setState({areaPopup: true})}}
                                          project={project} />
                                      );
                              }
                            }/>  
                            <Route exact path="/proyecto/:id/estimador_de_plazos/timeline"
                              render={(data)=> {                
                                  return(
                                      <ProjectTimeTimeline     
                                          weeks={this.state.weeks}
                                          tasks={this.state.detail}
                                          toggleExpandedTask={this.toggleExpandedTask.bind(this)}
                                          calculateTimeDetailed={this.calculateTimeDetailed.bind(this)}
                                          finish={this.finish.bind(this)}
                                          project={project} />
                                      );
                              }
                            }/>  
                        </Switch>
                </div>                
                {this.state.areaPopup ? (
                    <PopupCustomArea
                        project_id={project.id}
                        currentValue={this.state.params.m2}
                        onDismiss={(value) => {
                            if(value) this.setParameter("m2", parseInt(value), ()=>this.calculateTime());
                            this.setState({ areaPopup: false });
                        }
                        }
                    />
                ) : null} 
            </Fragment>
        );
    }
}
