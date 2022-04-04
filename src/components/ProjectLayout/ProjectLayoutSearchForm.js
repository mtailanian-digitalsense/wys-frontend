import React, { Component, Fragment } from "react";
import { Link } from "react-router-dom";
import PopupSearchNoBuildings from "../PopupSearchNoBuildings";
import PredictiveCitySearch from "../PredictiveCitySearch";
import buildingSearchImg from "../../img/building-search.png";
export default class ProjectLayoutSearchForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            searching: false
        };
    }
    setParameter(parameter, value) {
        var params = { ...this.state.params };
        params[parameter] = value;
        this.setState({ params }, () => {
            if (parameter !== "area") this.calculateM2();
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
    setPredictiveBuilding(building) {
        this.setState({predictive_building: building});
    }
    continue() {
        this.props.goToFloorSelect(this.state.predictive_building);
    }
    render() {
        var project = this.props.project;
        if (!project || project === "loading") return null;
        if(this.state.searching === true) {
            return <LoadingBuildingSearch region_name={this.prpos.params.region_id} />;
        }
        return (
            <Fragment>
            <div className="heading-content">
                <div className="project-tool-info">
                    <h2 className="tool-name">Layout</h2>                
                    <h1 className="subtool-name">
                        Armar layout
                    </h1>
                </div>
            </div>
            <div className="content">
                <div className="search-area">
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
                            <h3 className="title">Zona</h3>                            
                            <div className="select-area">
                                <div className="input-box">
                                    <select className="select-input" value={""+this.props.params.zone_id} 
                                    onChange={(e) => {this.props.setParameter("zone_id", e.target.value!==""?parseInt(e.target.value):"")}}>
                                        {this.renderZones()}   
                                    </select>
                                </div>
                            </div>
                            <div className="search-box-or">
                                <div className="search-box-or-line" />
                                <div className="search-box-or-character">ó</div>
                                <div className="search-box-or-line" />                            
                            </div>
                            <h3 className="title">Nombre del edificio</h3>                            
                            <div className="input-area">
                                <div className="input-box">
                                    <PredictiveCitySearch 
                                        predictive_building={this.state.predictive_building}                                     
                                        setPredictiveBuilding={this.setPredictiveBuilding.bind(this)} 
                                        city_name={this.props.params.region_id} />
                                </div>
                            </div>                            
                        </div>
                    </div>                    
                </div>
                <div className="actions-area flex space-between">
                    <Link to={"/proyecto/" + (project?project.id:"") + "/layout"} className="button is-dark-line is-transparent is-rounded">
                        Volver
                    </Link>
                    <div onClick={() => this.continue()} className="button is-green is-rounded">
                        Continuar
                    </div>
                </div>
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

export class LoadingBuildingSearch extends Component {
    constructor(props) {
      super(props);    
      this.state = {
          done: false
      };
    }
    componentDidMount() {
        setTimeout(()=> this.setState({done: true}), 0);

    }
    render() {
        return (
            <div className={"loading-building-search" + (this.state.done?" done":"")}>
                <img alt="" className="loading-building-search-image" src={buildingSearchImg} />
                <div className="loading-building-search-progress-container">
                    <div className="loading-building-search-progress"></div>

                </div>
                <div className="loading-building-search-text">Buscando...</div>
            </div>
        );
    }
}
