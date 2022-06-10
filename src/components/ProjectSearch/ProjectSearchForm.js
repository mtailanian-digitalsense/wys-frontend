import React, { Component, Fragment } from "react";
import { findBuildings} from "../../api.js";
import PopupSearchNoBuildings from "../PopupSearchNoBuildings";
import LoadingBuildingSearch from "../LoadingBuildingSearch";
import PredictiveCitySearch from "../PredictiveCitySearch";
import IconlayoutSelectedBuilding from "../../img/building-search-icon.png";
import IconlayoutSelectedBuilding2 from "../../img/building-search-icon2.png";
import { Link } from "react-router-dom";

export default class ProjectSearchForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            searching: false,
            option: null
        };
    }
    setParameter(parameter, value) {
        var params = { ...this.state.params };
        params[parameter] = value;
        this.setState({ params }, () => {
            if (parameter !== "area") this.calculateM2();
        });
    }
    search() {
        this.setState({searching: true}, () => {
            findBuildings(
                {
                    zone_id: this.props.params.zone_id, 
                    m2: this.props.params.m2
                }, (error, result) => {
                this.setState({searching: false});
                if(error) {
                    console.log("error");
                  return alert("error buscando edificios");
                }
                if(result.length){
                    let dmax = result.reduce((max, b) => {
                        let building = {};
                        if(b.security_lvl !== undefined)
                        {
                            building = b;
                        }else if(b.building && b.building.security_lvl !== undefined)
                        {
                            building = b.building;
                        }
                        let floor = (building.floors&&building.floors.length)?building.floors[0]:b;
                        let mt_value = floor?parseInt(floor.rent_value/floor.m2):0;
                        return max < mt_value ? mt_value : max;
                    }, 0);
                    dmax = Math.pow(10, Math.round(Math.log10(dmax)));
                    this.props.setFilterParameter("max", dmax);
                    this.props.setFilterParameter("value", dmax);
                    this.props.setBuildings(result, () => {
                        this.props.redirect("/proyecto/" + (this.props.project?this.props.project.id:"") + "/busqueda_de_edificio/resultados");
                    });
                }else{
                    return this.setState({searching: "not_found"});
                }

            });

        });
    }
    renderCountries() {
        var options = [<option value="" key="-">Selecciona el País</option>];
        if(!this.props.countries) return options;
        this.props.countries.forEach((country) => {
            options.push(<option key={country.name}>{country.name}</option>);
        });
        return options;
    }
    renderCities() {
        var options = [<option value="" key="-">Selecciona la Ciudad</option>];
        if(!this.props.countries) return options;
        if(!this.props.params || !this.props.params.country_id) return options;

        this.props.countries.forEach((country) => {
            if(country.name === this.props.params.country_id) {
                country.regions.forEach((region) => {
                    options.push(<option key={region.name}>{region.name}</option>);
                });
            }
        });
        return options;
    }
    renderZones() {
        var options = [<option value="" key="-">Selecciona el Sector</option>];
        if(!this.props.countries) return options;
        if(!this.props.params || !this.props.params.country_id || !this.props.params.region_id) return options;
        
        this.props.countries.forEach((country) => {
            if(country.name === this.props.params.country_id) {
                country.regions.forEach((region) => {
                    if(region.name === this.props.params.region_id) {
                        region.zones.forEach((zone) => {
                            options.push(<option key={zone.id} value={zone.id}>{zone.name}</option>);
                        });
                    }
                });
            }
        });
        
        return options;
    }
    renderBoxes() {
        if(!this.state.option) {
            return(
                <Fragment>
                <div className="search-box prevStep">
                <div className="box-content">

                    <h3 className="subtitle">Opción 1</h3>
                        <img alt="" className="layout-select-template-type-box-img regular" src={IconlayoutSelectedBuilding} />

                    <h3 className="title2">Búsqueda de edificio por nombre</h3>                            
                    <div className="input-area">
                        <div className="input-box">
                            <PredictiveCitySearch 
                                type="B"
                                predictive_building={this.state.predictive_building}                                     
                                placeholder="Escriba nombre del edificio"
                                setPredictiveBuilding={(building)=>{this.setState({predictive_building: {...building}}); this.props.setSearchBuilding({...building})}} 
                                city_name={this.props.params.region_id} />
                        </div>
                    </div>
                     {this.state.predictive_building?<Link
                        className="button is-green is-rounded"
                        to={"/proyecto/" + (this.props.project?this.props.project.id:"") + "/busqueda_de_edificio/comparar"}>  
                  
                        SELECCIONAR
                                         
                    </Link>:<div
                                             
                        className={"button is-rounded" + (this.state.selected?" is-green":"")}>
                        Seleccionar
                    </div>}
                </div>
            </div>
            <div className="search-box prevStep">
                <div className="box-content">
                    <h3 className="subtitle">Opción 2</h3>
                        <img alt="" className="layout-select-template-type-box-img medium" src={IconlayoutSelectedBuilding2} />

                    
                    <h3 className="title2">Búsqueda de edificio por ubicación</h3>        
                     <div onClick={() => this.setState({option: "location"})} className="button is-green is-rounded">
                        Seleccionar
                    </div>                    
                    
                </div>
            </div>
            </Fragment>
            ); 
        }
        return(
            <Fragment>
                <div className="search-box">
                        <div className="box-content">
                            <h3 className="title">Superficie</h3>
                            <p className="instructions">
                                Metros cuadrados
                                <br />
                                para personas:{" "}
                                <span>
                                    2m<sup>2</sup>
                                </span>
                            </p>
                            <div className="select-area has-label">
                                     <input  className="custom-number-input big digits-3" type={"number"} value={this.props.params.m2} 
                                      onChange={(e)=>{
                                          this.props.setParameter("m2", parseInt(e.target.value));
                                          
                                      }} />
                                <span className="label-select">
                                    m<sup>2</sup>
                                </span>
                            </div>
                        </div>
            </div>
            <div className="search-box">
                <div className="box-content">
                    <h3 className="title">País</h3>
                    <p className="instructions">
                        Seleciona el País
                        <br />
                        para facilitar tu búsqueda
                    </p>
                    <div className="select-area">
                        <div className="input-box">
                            <select className="select-input" value={this.props.params.country_id} 
                            onChange={(e) => {
                                this.props.setParameter("country_id", e.target.value, () => {
                                    this.props.setParameter("zone_id", "", () => {
                                        this.props.setParameter("region_id", "");
                                    });                                                                                    

                                });
                            }}>
                                {this.renderCountries()}
                            </select>
                        </div>
                    </div>
                </div>
            </div>
            <div className="search-box">
                <div className="box-content">
                    <h3 className="title">Ciudad</h3>
                    <p className="instructions">
                        Seleciona la Ciudad
                        <br />
                        para facilitar tu búsqueda
                    </p>
                    <div className="select-area">
                        <div className="input-box">
                            <select className="select-input" value={this.props.params.region_id} 
                            onChange={(e) => {
                                this.props.setParameter("region_id", e.target.value, ()=> {
                                    this.props.setParameter("zone_id", "");                                        
                                });
                            }}>
                                {this.renderCities()}                                        
                            </select>
                        </div>
                    </div>
                </div>
            </div>
            <div className="search-box">
                <div className="box-content">
                    <h3 className="title">Sector</h3>
                    <p className="instructions">
                        Seleciona el Sector
                        <br />
                        para facilitar tu búsqueda
                    </p>
                    <div className="select-area">
                        <div className="input-box">
                            <select className="select-input" value={""+this.props.params.zone_id} 
                            onChange={(e) => {this.props.setParameter("zone_id", e.target.value!==""?parseInt(e.target.value):"")}}>
                                {this.renderZones()}   
                            </select>
                        </div>
                    </div>
                </div>
            </div>
            
            </Fragment>
            );
    }

    render() {
        var project = this.props.project;
        if (!project || project === "loading") return null;
        if(this.state.searching === true) {
            return   <LoadingBuildingSearch />;
        }      
        return (
            <Fragment>
            <div className="heading-content">
                <div className="project-tool-info">
                    <h1 className="subtool-name">
                        Búsqueda de edificio
                    </h1>
                </div>
            </div>
            <div className="content">
                <div className="search-area">
                   {this.renderBoxes()}
                </div>
                {this.state.option==="location"?<div className="actions-area space-between flex">
                    <div
                        className="button is-transparent is-rounded is-dark-line"
                        onClick={()=>{this.setState({option: null})}}>
                        Volver
                    </div>
                    
                    <div onClick={() => this.search()} className="button is-green is-rounded">
                        Continuar
                    </div>
                </div>:null}
            </div>
            {this.state.searching === "not_found" ? (
                    <PopupSearchNoBuildings
                        onDismiss={() =>
                            this.setState({ searching: false })
                        }
                    />
                ) : null}
            </Fragment>

              
        );
    }
}