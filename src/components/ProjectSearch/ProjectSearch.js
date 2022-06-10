import React, { Component, Fragment } from "react";
import { Switch, Route } from "react-router-dom";
import { findBuildingsParameters, saveProjectFloor, getProjectM2Data, } from "../../api.js";
import SectionHeaderSlider from "../SectionHeaderSlider";
import ProjectSearchForm from './ProjectSearchForm.js';
import ProjectSearchCompare from './ProjectSearchCompare.js';
import ProjectSearchResults from './ProjectSearchResults.js';

export default class ProjectSearch extends Component {
    constructor(props) {
        super(props);
        this.state = {
            params: {
              m2: 0,
              country_id: "",
              region_id: "",
              zone_id: "",
              //country_id: "Chile",
              //region_id: "Santiago",
              //zone_id: 3
            },
            buildings: null,
            countries: null,
            resultsFilter: {
              step: 1,
              min: 1,
              max: 1000000,
              value: 15
            },
            selectedResultsFilter: {
              step: 1,
              min: 1,
              max: 1000000,
              value: 15
            },
            classFilterOptions: ["Clase A","Clase B", "Clase C"],
            selectedClassFilterOptions: ["Clase A","Clase B", "Clase C"],


        };
    }
    componentDidMount() {
        this.props.redirect("/proyecto/" + this.props.project_id + "/busqueda_de_edificio");
        findBuildingsParameters((error, result) => {
            if(error) { return console.log("error cargando parametros ProjectSearch: componentDidMount")}
            this.setState({countries: result}, () => {
              getProjectM2Data(this.props.project_id, (error, result)=> {
                if(error) { 
                  return this.setParameter("m2", 600);
                }
                else if(result) {
                  return this.setParameter("m2", Math.round(result.m2_generated_data.area));
                }
                alert("error inesperado");


              });
            });

        });
    }    
    toggleBuilding(building) {
        var buildings = this.state.buildings.map((b) => {          
            if(building.id === b.id) {
                if(b.selected) b.selected = false;
                else b.selected = true;
            }
            return b;
        });
        this.setState({buildings});

    }
    updateBuildingHover(building, value) {
        var buildings = this.state.buildings.map((b) => {
            b = {...b};
            if(building.id === b.id) {
                b.hover=value;
            }
            return b;
        });
        this.setState({buildings});

    }
    saveBuilding(building) {
        var building_id = building.building_id;
        var floor_id = building.floors?building.floors[0].id:building.id;
      saveProjectFloor(this.props.project_id, building_id, floor_id, (error, result) => {
        this.props.redirect("/proyecto/"+this.props.project.id+"/busqueda_de_edificio/done");
      });

    }
    setParameter(parameter, value, cb) {
        var params = { ...this.state.params };
        params[parameter] = value;
        this.setState({ params }, cb);
    }
    setFilterParameter(parameter, value, cb) {
        var resultsFilter = { ...this.state.resultsFilter };
        resultsFilter[parameter] = value;
        this.setState({resultsFilter }, cb);
    }
    applySelectedFilter() {
      var filters = {...this.state.resultsFilter};
      var buildings = this.state.buildings.map((b)=> {return {...b}} );
      buildings.forEach(building=>{
        console.log(building);
        var mt_value = parseInt(building.rent_value/building.m2);                    
        if(mt_value > this.state.selectedResultsFilter.value ) building.selected = false;
        if(this.state.classFilterOptions.indexOf(building.building.category) === -1) building.selected = false;
      });
      this.setState({selectedResultsFilter: filters,selectedClassFilterOptions: [...this.state.classFilterOptions], buildings});
    }
    toggleClassFilterOption(option) {
      if(this.state.classFilterOptions.length === 1 && option === this.state.classFilterOptions[0]) return;
      var classFilterOptions = [...this.state.classFilterOptions];
      var index = classFilterOptions.indexOf(option);
      if(index === -1) classFilterOptions.push(option);
      else {
        classFilterOptions.splice(index, 1);
      }
      this.setState({classFilterOptions});
    }
    setSearchBuilding(building) {
        var floor = (building.floors&&building.floors.length)?building.floors[0]:{};
        //var mt_value = floor?parseInt(floor.rent_value/floor.m2): "-";
        console.log(floor);
      this.setState({buildings:[{...building, building_id:building.id, selected: true, m2:floor.m2, rent_value:floor.rent_value }]});
    }
    render() {
        var project = this.props.project;
        if (!project || project === "loading"|| !this.state.countries) return null;
        
        return (
            <Fragment>
                <SectionHeaderSlider
                    section="search"
                    options={[
                        "/proyecto/" + project.id + "/busqueda_de_edificio",
                        "/proyecto/" +
                            project.id +
                            "/busqueda_de_edificio/resultados",
                        "/proyecto/" +
                            project.id +
                            "/busqueda_de_edificio/comparar",
                    ]}
                    selectedOption={this.props.location.pathname}
                />
                <div className="main-content-logged search">
                    
                        <Switch>
                            <Route exact path="/proyecto/:id/busqueda_de_edificio/"
                              render={(data)=> {                
                                  return(
                                    <ProjectSearchForm
                                      params={this.state.params}
                                      setParameter={this.setParameter.bind(this)}
                                      setBuildings={(buildings, cb) => {this.setState({buildings}, cb)}}
                                      redirect={this.props.redirect}  
                                      countries={this.state.countries}
                                      setSearchBuilding={this.setSearchBuilding.bind(this)}
                                      setFilterParameter={this.setFilterParameter.bind(this)}
                                      project={project} />);
                              }
                            }/>
                            <Route exact path="/proyecto/:id/busqueda_de_edificio/resultados"
                              render={(data)=> {                
                                  return(
                                    <ProjectSearchResults 
                                        resultsFilter={this.state.resultsFilter}
                                        buildings={this.state.buildings.filter(building=> {
                                          var mt_value = parseInt(building.rent_value/building.m2);
                                          if(mt_value > this.state.selectedResultsFilter.value) return false;
                                          if(this.state.selectedClassFilterOptions.indexOf(building.building.category) === -1) return false;
                                          return true;
                                        })}
                                        classFilterOptions={this.state.classFilterOptions}
                                        toggleClassFilterOption={this.toggleClassFilterOption.bind(this)}
                                        toggleBuilding={this.toggleBuilding.bind(this)}
                                        updateBuildingHover={this.updateBuildingHover.bind(this)}
                                        params={this.state.params}   
                                        setFilterParameter={this.setFilterParameter.bind(this)}                         
                                        project={project}     
                                        applySelectedFilter={this.applySelectedFilter.bind(this)}                                 
                                       />);
                              }
                            }/>   
                            <Route exact path="/proyecto/:id/busqueda_de_edificio/comparar"
                              render={(data)=> {                
                                  return(
                                    <ProjectSearchCompare 
                                      saveBuilding={this.saveBuilding.bind(this)}
                                      params={this.state.params}    
                                      buildings={this.state.buildings?this.state.buildings.filter(b=>b.selected):null}

                                      project={project}                                      
                                       />);
                              }
                            }/>   
                        </Switch>
                </div>
                 
            </Fragment>
        );
    }
}
