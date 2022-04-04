import React, { Component, Fragment} from "react";
import { Link } from "react-router-dom";
import Scrollbar from "react-scrollbars-custom";
import {set_average} from "../libs/best_building_lib.js";
import {getProjectsInfo, searchBuildingByName2} from '../api.js';
import PopupBuildingDetail from "./PopupBuildingDetail.js";
import PopupLayoutDetail from "./PopupLayoutDetail.js";
import {  LoadScript } from '@react-google-maps/api';
import CompareProjectsControls from "./CompareProjectsControls";
import { filter } from "async";



export default class CompareProjects extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedBuilding: null,
            criteria: [1, 1, 1 , 1, 1, 1, 1, 1, 1],
            hiddenProjects: [],
            tableOrder: [],
            projects: [],
        }
    }
    componentDidMount() {
        this.loadProjects();
      
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.tableOrder !== this.state.tableOrder) {
            this.orderTable();
        }
        if ((prevState.projects !== this.state.projects) && (prevState.projects.length !== this.state.projects.length)) {
            this.orderTable();
        }
      }
    
    loadProjects() {
        getProjectsInfo((error, result) => {
            if(error) {
                console.log("error loading projectinfo", error);
                return this.setState({projects: []});
            }
            /* let projects = [];
            for (const proj of result) {
                let thisProj = {...proj}
                thisProj.comparable = true;
                projects.push(thisProj)
            } */
            this.setState({projects: result, selectedProject: result[0]});
        });   
    }
    renderBuildings() {
        if(!this.state.projects) return null;
        
        return this.state.projects.map((b, i) => {
            return <CompareBuildingItem 
                        key={i}
                        building={b} 
                        selectBuilding={(building)=> this.setState({selectedBuilding: building})}
                        selected={(this.state.selectedBuilding && b.id === this.state.selectedBuilding.id)}
                        openBuildingPopup={this.openBuildingPopup.bind(this)}
                        openLayoutPopup={this.openLayoutPopup.bind(this)}
                        handleProjectHide={this.handleProjectHide.bind(this)}

                        />;
        })
    }    
    renderHiddenBuildings() {
        if(!this.state.hiddenProjects) return null;
        
        return this.state.hiddenProjects.map((b, i) => {
            return <CompareHiddenBuildingItem 
                        key={i}
                        building={b}
                        handleProjectHide={this.handleProjectHide.bind(this)}
                        />;
        })
    }    
    openBuildingPopup(building_name) {
        searchBuildingByName2("None", building_name, (error, result) => {
            this.setState({buildingDetails: result.map(r=>{return{...r, building: r}})[0]});
        });
    }
    openLayoutPopup(project) {
            this.setState({layoutDetails: project});
    }
    handleProjectHide(id, action) {
        let projects = this.state.projects
        let hiddenProjects = this.state.hiddenProjects
        if (action === "hide") {
            const projIndex = this.state.projects.findIndex(proj => id === proj.id)
            const hideThis = this.state.projects[projIndex];
            projects.splice(projIndex, 1);
            this.setState({projects: projects, hiddenProjects: [...this.state.hiddenProjects, hideThis]})
        } else if (action === "show") {
            const projIndex = this.state.hiddenProjects.findIndex(proj => id === proj.id)
            const showThis = this.state.hiddenProjects[projIndex]
            hiddenProjects.splice(projIndex, 1);
            projects = [...projects, showThis];
            this.setState({projects: projects, hiddenProjects: hiddenProjects})
        }
        
    }
    calculateAverage(building) {
        return 1;        
    }
   
    generateBuildingData(b) {
        return [];        
    }  
    save() {
        if(!this.state.selectedBuilding) return alert("debes seleccionar un edificio");
        this.props.saveBuilding(this.state.selectedBuilding);
    }
    updateTableOrder(criteria, column) {
        let allOrder = this.state.tableOrder;
        const colIndex = this.findThisColumn(column);
        if (colIndex === -1) {
            if (criteria !== "neutro") allOrder = [...allOrder, {column, criteria}];
        } else {
            allOrder = allOrder.filter(x => x.column !== column);
            if (criteria !== "neutro") allOrder = [...allOrder, {column, criteria}];
        }
        this.setState({tableOrder: allOrder})
    }
    findThisColumn(column) {
        if (this.state.tableOrder && this.state.tableOrder.length > 0) {
            return this.state.tableOrder.findIndex(x=>x.column === column);
        } else {
            return -1;
        }
    }
    findThisCriteria(column) {
        const colIndex = this.findThisColumn(column);
        if (colIndex === -1) {
            return "neutro";
        } else {
            return this.state.tableOrder[colIndex].criteria;
        }
    }
    orderTable() {
        let projects = this.state.projects;
        for (const filter of this.state.tableOrder) {
            if (filter.column === "area") {
                if (filter.criteria === "mayor") {
                    projects.sort((a,b) => (a.m2 < b.m2) ? 1 : ((b.m2 < a.m2) ? -1 : 0))
                } else if (filter.criteria === "menor") {
                    projects.sort((a,b) => (a.m2 > b.m2) ? 1 : ((b.m2 > a.m2) ? -1 : 0))
                }
            }
            else if (filter.column === "edificio") {
                if (filter.criteria === "mayor") {
                    projects.sort((a,b) => (a.location > b.location) ? 1 : ((b.location > a.location) ? -1 : 0))
                } else if (filter.criteria === "menor") {
                    projects.sort((a,b) => (a.location < b.location) ? 1 : ((b.location < a.location) ? -1 : 0))
                }
            }
            else if (filter.column === "costo") {
                if (filter.criteria === "mayor") {
                    projects.sort((a,b) => (a.price < b.price) ? 1 : ((b.price < a.price) ? -1 : 0))
                } else if (filter.criteria === "menor") {
                    projects.sort((a,b) => (a.price > b.price) ? 1 : ((b.price > a.price) ? -1 : 0))
                }
            }
            else if (filter.column === "plazo") {
                if (filter.criteria === "mayor") {
                    projects.sort((a,b) => (a.time < b.time) ? 1 : ((b.time < a.time) ? -1 : 0))
                } else if (filter.criteria === "menor") {
                    projects.sort((a,b) => (a.time > b.time) ? 1 : ((b.price > a.time) ? -1 : 0))
                }
            }
        }
        this.setState({projects})
    }
    render() {
      
        return (
            <div className="main-content-logged search compare-projects">
            <Fragment>
            <div className="heading-content layout" style={{flex: "unset"}}>
                <div className="project-tool-info">
                    <h2 className="tool-name">Proyectos</h2>
                    <h1 className="subtool-name">
                        Tabla de comparación
                    </h1>
            
                </div>
            </div>
            <div className="content building-search-compare">
                
                    <div className="building-search-compare-list" style={{minWidth: 0}}>
                        
                        <Scrollbar style={{ width: "100%", flex:1, minWidth: 0}} permanentTrackY={true} permanentTrackX={true}>
                        <div className={"item"} style={{flex: 0}}>
                            <div className="item-row-header header" style={{backgroundColor: "#AF4EE2", fontSize: '0.9em'}}>              
                                Ordena los proyectos<br /> según tus preferencias
                              
                            </div>
                            <div className="item-row-values header p-fix" style={{flex: 0}}>              
                                <div className="item-row-value">
                                    <CompareProjectsControls 
                                        criteria={this.findThisCriteria("area")} 
                                        column={"area"}
                                        explanation='Selecciona "+" para ordenar el área de mayor a menor o "-" de menor a mayor.'
                                        onChange={(criteria, column)=>this.updateTableOrder(criteria, column)}/>                               
                                    <p><br/>Cálculo de area</p>
                                </div>
                                <div className="item-row-value">
                                    <CompareProjectsControls 
                                        criteria={this.findThisCriteria("edificio")} 
                                        column={"edificio"}
                                        explanation='Selecciona "+" para ordenar el los edificios en orden alfabético ascendente o "-" en orden descendente.'
                                        onChange={(criteria, column)=>this.updateTableOrder(criteria, column)}/>     
                                    <p><br/>Búsqueda de edificio</p>
                                </div>
                                <div className="item-row-value">                                    
                                    <div style={{marginTop: '31px'}}><p><br/>Layout</p></div>
                                </div>
                                <div className="item-row-value">
                                    <CompareProjectsControls 
                                        criteria={this.findThisCriteria("costo")} 
                                        column={"costo"}
                                        explanation='Selecciona "+" para ordenar el los costos de mayor a menor o "-" de menor a mayor.'
                                        onChange={(criteria, column)=>this.updateTableOrder(criteria, column)}/>     
                                    <p><br/>Estimador de costos</p>
                                </div>
                                <div className="item-row-value">
                                    <CompareProjectsControls 
                                        criteria={this.findThisCriteria("plazo")} 
                                        column={"plazo"}
                                        explanation='Selecciona "+" para ordenar el plazo de mayor a menor o "-" de menor a mayor.'
                                        onChange={(criteria, column)=>this.updateTableOrder(criteria, column)}/>                                      
                                    <p><br/>Estimador de plazos</p>
                                </div>
                                <div className="item-row-value">                                   
                                    <p><br/></p>
                                </div>
                            </div>  
                              
                            {/*<div className="scroll-space" />                                     */}
                        </div>
                            {this.renderBuildings()}
                            </Scrollbar>

                    </div>     
            </div>
            {this.state.hiddenProjects.length > 0 ? 
            <div className="content building-search-compare" style={{marginTop: "30px", maxHeight: "100px"}}>
                
            <div className="building-search-compare-list" style={{minWidth: 0}}>
                
                <Scrollbar style={{ width: "100%", flex:1, minWidth: 0}} permanentTrackY={true} permanentTrackX={true}>
                <div className={"item"} style={{flex: 0}}>
                    <div className="item-row-header header" style={{backgroundColor: "#bfbfbf", fontSize: '0.9em', maxHeight: "40px"}}>              
                        Proyectos Ocultos
                    </div>
                    <div className="item-row-values header " style={{flex: 0}}>              
                        <div className="item-row-value" style={{backgroundColor: "#bfbfbf", maxHeight: "40px"}}>                               
                            
                        </div>
                    </div>  
                      
                    {/*<div className="scroll-space" />                                     */}
                </div>
                {this.renderHiddenBuildings()}
                </Scrollbar>

                </div>            
            </div>
            : null}
            <div className="page-btns-area flex space-between">
                        <Link
                            className="button is-transparent is-rounded is-dark-line"
                            to={"/inicio"}>
                            Volver
                        </Link>
                    
                    </div>
            {this.state.buildingDetails ? (
                    <LoadScript
                      googleMapsApiKey="AIzaSyD0p2UYSQf5z10PtOD63wVs8gLbEhxP8FM"
                    >
                    <PopupBuildingDetail
                      building={this.state.buildingDetails}
                        onDismiss={() =>
                            this.setState({ buildingDetails: null })
                        }
                    />

                    </LoadScript>
                ) : null}
            {this.state.layoutDetails ? (
                    <div className="layoutDetails"><PopupLayoutDetail
                      project={this.state.layoutDetails}
                        onDismiss={() =>
                            this.setState({ layoutDetails: null })
                        }
                    /></div>
                ) : null}
            </Fragment>
            </div>
        );
    }
}

export class CompareBuildingItem extends Component {
    render() {
        var building = this.props.building;
        return (
            <div className={"item "+ (this.props.selected?" selected":"")}>
                <div className="item-row-header">              

                    
                    <div className="item-row-value">
                        {building.name}
                    </div>
                </div>
                <div className="item-row-values" style={{flex: 0}}>              
                    
                    <div className="item-row-value">
                        {building.m2?<div>
                            {Math.round(building.m2)} <div className="detail">MTS<sup>2</sup></div></div>:"-"}
                    </div>
                    <div className="item-row-value">
                        {building.location?<div>{building.location}
                        <div
                            className="button is-rounded is-transparent is-dark-line size-xs"
                            onClick={()=> {this.props.openBuildingPopup(building.location)}}>
                            Ver Edificio
                        </div>
                        </div>:"-"}

                    </div>
                    <div className="item-row-value">
                        {building.layout? <div
                            className="button is-rounded is-transparent is-dark-line size-xs"
                            onClick={()=> {this.props.openLayoutPopup(building)}}>
                            Ver Layout
                        </div>:"-"}
                    </div>
                    <div className="item-row-value">
                        {building.price?
                            <div>{building.price} <div className="detail">CLP</div></div>:"-"}
                    </div>
                    <div className="item-row-value">
                        {building.time?building.time +  " semanas": "-"}
                    </div>
                    <div className="item-row-value">
                        <div
                            className="button is-rounded is-transparent is-dark-line size-xs"
                            onClick={()=> {this.props.handleProjectHide(building.id, "hide")}}>
                            Ocultar Proyecto
                        </div>
                    </div>

                </div>
                          
            </div>
        );
    }
}


export class CompareHiddenBuildingItem extends Component {
    render() {
        var building = this.props.building;
        return (
            <div className={"item "+ (this.props.selected?" selected":"")}>
                <div className="item-row-header">              

                    
                    <div className="item-row-value" style={{color: "#bfbfbf", maxHeight: "40px", paddingTop: "15px"}}>
                        {building.name}
                    </div>
                </div>
                <div className="item-row-values" style={{flex: 0}}>
                    <div className="item-row-value" style={{maxHeight: "40px", paddingTop: "9px"}}>
                        <div
                            className="button is-rounded is-transparent is-dark-line size-xs"
                            onClick={()=> {this.props.handleProjectHide(building.id, "show")}}>
                            Mostrar Proyecto
                        </div>
                    </div>

                </div>
                          
            </div>
        );
    }
}


