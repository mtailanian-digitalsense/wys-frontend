import React, { Component, Fragment } from "react";
import { Link } from "react-router-dom";
import Scrollbar from "react-scrollbars-custom";
import {set_average, find_best_building} from "../../libs/best_building_lib.js";
import CompareTableControls from "../CompareTableControls";
import building_placeholder from "../../img/img_edificio.jpg";
export default class ProjectSearchCompare extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedBuilding: null,
            criteria: [1, 1, 1, 1, 1, 1, 1, 1],
            real_values: []
        }
    }
    componentDidMount() {
        //this.calculateBestOption();
        this.processBuildingsData();
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.real_values && prevState.real_values !== this.state.real_values) {
            console.log("render table!")
        }
    }
    sortedBuildings(arr) {
        return arr.sort((b1,b2)=>{
            var avg1 = b1.average;
            var avg2 = b2.average;
            if(avg1 < avg2) return 1;
            if(avg1 > avg2) return -1;
            return 0; // ===
        })
    }
    renderBuildings() {
        if(!this.props.buildings) return null;
        var buildings = this.props.buildings.map((b, i)=>{
            return {...b};
        });
        /* return buildings.sort((b1,b2)=>{
            var avg1 = b1.calculatedAvg;
            var avg2 = b2.calculatedAvg;
            if(avg1 < avg2) return 1;
            if(avg1 > avg2) return -1;
            return 0; // ===


        }) */
        return buildings.map((b, i) => {
            //todo: Average from state
            /* var average = parseInt(this.calculateAverage(b)*10)/10; */
            var average = this.state.real_values.findIndex(x => x.id === b.building_id)
            return <CompareBuildingItem 
                        key={i}
                        building={b} 
                        average={this.state.real_values[average].average}
                        selectBuilding={(building)=> this.setState({selectedBuilding: building})}
                        selected={(this.state.selectedBuilding && b.id === this.state.selectedBuilding.id)}
                        />;
        })
    }    
    calculateAverage(b) {
        var building = null;
        if(b.security_lvl !== undefined) building = b;
        else if(b.building && b.building.security_lvl !== undefined) building = b.building;
        var average = (
            building.security_lvl +
            building.public_transport_lvl +
            building.parking_lvl +
            building.services_lvl +
            building.sustainability_lvl +
            building.infrastructure_lvl +
            building.view_lvl
            //añadir mt_value con escala 1-10 (min-max)
            )/7;
        return average;
    }
    updateCriteria(i, new_criteria) {
        var criteria = [...this.state.criteria];
        criteria[i] = new_criteria;
        this.setState({criteria}, () => {
            //this.calculateBestOption();
            this.processBuildingsData();
        });
    }
    generateBuildingData(b) {
        console.log("->buildinggg ", b)
        var building = null;
        if(b.security_lvl !== undefined) building = b;
        else if(b.building && b.building.security_lvl !== undefined) building = b.building;
        var values = [
            parseInt(b.rent_value/b.m2),
            building.security_lvl, 
            building.public_transport_lvl,
            building.parking_lvl, 
            building.services_lvl, 
            building.sustainability_lvl,
            building.infrastructure_lvl, 
            building.view_lvl];    
        const data = {
            data: values,
            id: building.id
        }
        console.log("hmm-> ", data)
        return data;
    }
    processBuildingsData() {
        let criteria = this.state.criteria;        
        let buildings_data = this.props.buildings.map((b)=>{
            return this.generateBuildingData(b);
        });
        let allData = set_average(buildings_data, criteria);
        this.setState({real_values: allData.result, selectedBuilding: this.props.buildings[allData.bestOption]})
    }
    calculateBestOption() {
        if(!this.props.buildings) return;
        var best_building_index = this.processBuildingsData(); //eliminar de esta función
        this.setState({selectedBuilding: this.props.buildings[best_building_index[0]]});
    }
    save() {
        if(!this.state.selectedBuilding) return alert("debes seleccionar un edificio");
        this.props.saveBuilding(this.state.selectedBuilding);
    }
    render() {
        var project = this.props.project;  
        if (!project || project === "loading") return null;
        return (
            <Fragment>
            <div className="heading-content" style={{flex: "unset"}}>
                <div className="project-tool-info">
                    <h2 className="tool-name">Búsqueda de edificio</h2>
                    <h1 className="subtool-name">
                        Tabla de comparación
                    </h1>
                    <p className="subtitle">
                        Califica los edificios según tus intereses usando los botones (
                            <div className={"compare-controls-button"}>-</div>  Baja importancia / 
                            <div className={"compare-controls-button"}>o</div> Neutro / 
                            <div className={"compare-controls-button"}>+</div> Alta) para ranquearlos.</p>
                </div>
            </div>
            <div className="content building-search-compare">
                
                    <div className="building-search-compare-list">
                        <div className={"item"} style={{flex: 0}}>
                            <div className="item-row-header header">              
                                Ordena los proyectos<br /> según tus preferencias
                              
                            </div>
                            <div className="item-row-values header">              
                                <div className="item-row-value">
                                    <CompareTableControls 
                                        criteria={this.state.criteria[0]} 
                                        onChange={(value)=>this.updateCriteria(0, value)}
                                        explanation='Selecciona "-" si el valor de la renta no es muy relevante o "+" si el valor es un tema relevante en la selección del inmueble.'  />
                                    <p><br/>Valor renta</p>
                                </div>
                                <div className="item-row-value">
                                    <CompareTableControls 
                                        criteria={this.state.criteria[1]} 
                                        explanation='Selecciona "-" si la seguridad del barrio no es muy relevante o "+" si la seguridad es un tema relevante en la selección del inmueble.'
                                        onChange={(value)=>this.updateCriteria(1, value)}  />
                                    <p><br/>Seguridad</p>
                                </div>
                                <div className="item-row-value">
                                    <CompareTableControls 
                                        criteria={this.state.criteria[2]} 
                                        explanation='Selecciona "-" si el acceso a través de transporte público no es muy relevante o "+" si es un tema relevante en la selección del inmueble.'
                                        onChange={(value)=>this.updateCriteria(2, value)}/>
                                    <p>Transporte Público</p>
                                </div>
                                <div className="item-row-value">
                                    <CompareTableControls 
                                        criteria={this.state.criteria[3]} 
                                        explanation='Selecciona "-" si el valor de la renta no es muy relevante o "+" si el valor es un tema relevante en la selección del inmueble.'
                                        onChange={(value)=>this.updateCriteria(3, value)}/>
                                    <p><br/>Estacionamiento</p>
                                </div>
                                <div className="item-row-value">
                                    <CompareTableControls 
                                        criteria={this.state.criteria[4]} 
                                        explanation='Selecciona "-" si la cercanía del edificio con servicios (restaurantes, cafés, bares, farmacias, centros comerciales, mercados) no es muy relevante o "+" si es un tema relevante en la selección del inmueble.'
                                        onChange={(value)=>this.updateCriteria(4, value)}/>
                                    <p>Servicio<br/> en el área</p>
                                </div>
                                <div className="item-row-value">
                                    <CompareTableControls 
                                        criteria={this.state.criteria[5]} 
                                        explanation='Selecciona "-" si la sustentabilidad del edificio no es muy relevante o "+" si es un tema relevante en la selección del inmueble.'
                                        onChange={(value)=>this.updateCriteria(5, value)}/>
                                    <p>Sustentabilidad del edificio</p>                                    
                                </div>
                                <div className="item-row-value">
                                    <CompareTableControls 
                                        criteria={this.state.criteria[6]} 
                                        explanation='Selecciona "-" si la infraestructura del edificio (gimnasio, restaurante, café) no es muy relevante o "+" si es un tema relevante en la selección del inmueble.'
                                        onChange={(value)=>this.updateCriteria(6, value)}/>
                                    <p>Infraestructura del edificio</p>
                                </div>
                                <div className="item-row-value">
                                    <CompareTableControls
                                        criteria={this.state.criteria[7]} 
                                        explanation='Selecciona "-" si la apariencia del edificio no es muy relevante o "+" si la imagen es un tema relevante en la selección del inmueble.'
                                        onChange={(value)=>this.updateCriteria(7, value)} />
                                    <p><br/>Imagen del edificio</p>
                                </div>
                                <div className="item-row-value">
                                    {/* <CompareTableControls 
                                        criteria={this.state.criteria[8]} 
                                        explanation='Ordena el listado de edificios de acuerdo al promedio de las variables.'
                                        onChange={(value)=>this.updateCriteria(8, value)}/> */}
                                    <div style={{marginTop: '26px'}}><p>Promedio</p></div>
                                </div>

                            </div>  
                             <div className="item-row-option header">
                            </div>    
                            <div className="scroll-space" />                                     
                        </div>
                        <Scrollbar style={{ width: "100%", flex:1}} permanentTrackY={true}>
                            {this.state.real_values && this.state.real_values.length > 0 ? /* this.renderBuildings() */
                                this.sortedBuildings(this.state.real_values).map((building, i) => {
                                    let thisBuildingIndex = this.props.buildings.findIndex(x => x.building_id === building.id)
                                    let thisBuilding = this.props.buildings[thisBuildingIndex];
                                    return <CompareBuildingItem 
                                            key={i}
                                            building={thisBuilding} 
                                            average={building.average}
                                            selectBuilding={(building)=> this.setState({selectedBuilding: building})}
                                            selected={(this.state.selectedBuilding && thisBuilding.id === this.state.selectedBuilding.id)}
                                            />;
                                }) : null
                            }

                        </Scrollbar>
                    </div>                 
               
                    <div className="page-btns-area flex space-between">
                        <Link
                            className="button is-transparent is-rounded is-dark-line"
                            to={"/proyecto/" + (project?project.id:"") + "/busqueda_de_edificio"}>
                            Volver
                        </Link>
                        <div
                            className="button is-green is-rounded"
                            onClick={()=> {this.save()}}>
                            Finalizar
                        </div>
                    </div>
            </div>
            </Fragment>
        );
    }
}

export class CompareBuildingItem extends Component {
    render() {
        var b = this.props.building;
        var building = null;
        if(b.security_lvl !== undefined) building = b;
        else if(b.building && b.building.security_lvl !== undefined) building = b.building;
            //añadir mt_value con escala 1-10 (min-max)
        var floor = (building.floors&&building.floors.length)?building.floors[0]:b;
        var mt_value = floor?parseInt(floor.rent_value/floor.m2): "-";
        var building_image = building.building_images[0]?building.building_images[0].link:null;
        if(!building_image || building_image === "") building_image = building_placeholder;
        return (
            <div className={"item "+ (this.props.selected?" selected":"")}>
                <div className="item-row-header">              

                    <img className="building-image" src={building_image} alt="" />  
                    <div className="item-row-value">
                        {building.name}
                    </div>
                </div>
                <div className="item-row-values">              
                    <div className="item-row-value">
                    {mt_value}
                        <p className="item-row-value-legend"> USD/MT<sup>2</sup></p>
                    </div>
                    <div className="item-row-value">
                        {building.security_lvl}
                    </div>
                    <div className="item-row-value">
                        {building.public_transport_lvl}
                    </div>
                    <div className="item-row-value">
                        {building.parking_lvl}
                    </div>
                    <div className="item-row-value">
                        {building.services_lvl}
                    </div>
                    <div className="item-row-value">
                        {building.sustainability_lvl}
                    </div>
                    <div className="item-row-value">
                        {building.infrastructure_lvl}
                    </div>
                    <div className="item-row-value">
                        {building.view_lvl}
                    </div>
                    <div className="item-row-value">
                        <strong>{this.props.average}</strong>
                    </div>

                </div>
                <div className="item-row-option">
                    {!this.props.selected?
                        <div className="item-row-select-button" onClick={()=>this.props.selectBuilding(b)}>Seleccionar</div>:
                        <div className="item-row-select-button-selected">
                            <p>Seleccionado</p>
                            <div 
                                className={"toggle-circle check"} />
                        </div>}
                </div>               
            </div>
        );
    }
}

