import React, { Component, Fragment } from "react";
import { Switch, Route } from "react-router-dom";
import Odometer from 'react-odometerjs';
import LoadingFull from "../LoadingFull";
import {calculateM2, saveGeneratedWorkspaces, getProjectM2Data} from "../../api.js";
import ProjectM2Area from './ProjectM2Area.js';
import ProjectM2SpacesSet from './ProjectM2SpacesSet.js';
import SectionHeaderSlider from '../SectionHeaderSlider';
export default class ProjectM2 extends Component {
    constructor(props) {
        super(props);
        this.state = {
            params: {
              num_of_workers: 1,
              hotdesking_level: 85,
              collaboration_level: 40,
              area: 0,
            },
            medition_type: 'mt2',
            medition_value: 0,
            medition_origin: 0,            
            spaces_area: 0,
            m2_data: null
        };
    }    
    componentDidMount() {
      getProjectM2Data(this.props.project_id, (error, result)=> {
          if(result) {
            console.log("resss-> ", result)
            this.setState({m2_data: result, params: {
              area: 0, 
              num_of_workers: result.m2_generated_data.workers_number,
              hotdesking_level: result.m2_generated_data.hot_desking_level,
              collaboration_level: result.m2_generated_data.collaboration_level,
              }}, () => {
              this.calculateM2();
            });

          } else {
              this.calculateM2();
          }
        });
    }
    componentDidUpdate(prevProps, prevState) {
      if ((this.state.spaces_area || this.state.spaces_area === 0) && prevState.spaces_area !== this.state.spaces_area) {
        console.log("wtf", this.state.spaces_area)
        this.conversion(this.state.medition_type, this.state.medition_origin, "set")
        //console.log("conv ", this.state.medition_origin)
      }
    }
       
    calculateM2() {
        //this.setState({area: "loading"});
        calculateM2({
            "collaboration_level": parseInt(this.state.params.collaboration_level),
            "hotdesking_level": parseInt(this.state.params.hotdesking_level),
            "num_of_workers": parseInt(this.state.params.num_of_workers)
        }, (error, result) => {
          console.log("set area-> ", result)
            if(error) return this.setState({area: "error"});
            this.setParameter("area", result.area );
            this.setState({medition_origin: result.area})
            this.conversion(this.state.medition_type, result.area, "set")
        });
    }
    setParameter(parameter, value) {
      var params = {...this.state.params};
      params[parameter] = value;
      this.setState({params}, () => {
        if(parameter !== "area") this.calculateM2();
      });
    }
    saveM2(workspaces) {
      var data = {
        "project_id": this.props.project.id,
        "area": this.state.params.area + this.state.spaces_area,
        "collaboration_level": this.state.params.collaboration_level,
        "hotdesking_level": this.state.params.hotdesking_level,
        "num_of_workers": parseInt(this.state.params.num_of_workers),
        workspaces
      };
      saveGeneratedWorkspaces(data, (error, result) => {
        this.props.redirect("/proyecto/"+this.props.project.id+"/calculo_de_area/done");
      });
    }
    setSpacesArea(area) {
      this.setState({spaces_area: area});
    }

      conversion = (type, value, setOrChange) => {
        let finalVal;
        
        if (setOrChange === "change") {
          if (type === "mt2") {
              let ft_val = value * 10.764;
              if(this.props.location.pathname === ("/proyecto/"+this.props.project.id+"/calculo_de_area")) {
                finalVal = Math.round(ft_val);
              } else {
                finalVal = Math.round(ft_val + (this.state.spaces_area * 10.764));
              }
              this.setState({medition_value: finalVal, medition_type: 'ft2'});
          } else if (type === "ft2") {
              if(this.props.location.pathname === ("/proyecto/"+this.props.project.id+"/calculo_de_area")) {
                finalVal = Math.round(value);
              } else {
                finalVal = Math.round(value + this.state.spaces_area);
              }
              this.setState({medition_value: finalVal, medition_type: 'mt2'});
          }
        } else if (setOrChange === "set") {
            if (type === "ft2") {
                let ft_val = value * 10.764;
                if(this.props.location.pathname === ("/proyecto/"+this.props.project.id+"/calculo_de_area")) {
                  finalVal = Math.round(ft_val);
                } else {
                  finalVal = Math.round(ft_val + (this.state.spaces_area * 10.764));
                }
                this.setState({medition_value: finalVal});
            } else if (type === "mt2") {
                if(this.props.location.pathname === ("/proyecto/"+this.props.project.id+"/calculo_de_area")) {
                  finalVal = Math.round(value);
                } else {
                  finalVal = Math.round(value + this.state.spaces_area);
                }
                this.setState({medition_value: finalVal});
            }
        }
        //console.log("wut ->", finalVal)
    } 
   
    render() {
        var project = this.props.project;
        if (!project || project === "loading") return <LoadingFull />;
        return (
          <Fragment>
            <SectionHeaderSlider section="m2" options={["/proyecto/"+project.id+"/calculo_de_area","/proyecto/"+project.id+"/calculo_de_area/set_de_espacios"]}
              selectedOption={this.props.location.pathname} />
            <div className="main-content-logged m2">

                <div className="heading-content">
                    <div className="project-tool-info">
                        <h2 className="tool-name">Cálculo de area</h2>
                        <Switch>
                        <Route exact path="/proyecto/:id/calculo_de_area/">
                        <h1 className="subtool-name">Area estimada</h1>
                        </Route>
                        <Route exact path="/proyecto/:id/calculo_de_area/set_de_espacios">
                        <h1 className="subtool-name">Set de espacios Sugeridos</h1>
                        <h2 className="tool-name">En los cuadros de abajo puedes modificar el tipo de espacio y la cantidad</h2>

                        </Route>
                        </Switch>

                    </div>
                    <div className="m2-heading-area">
                      <div className="inline-block float-right margin-right-50">
                          <p className="uppercase align-text">Area estimada</p>
                          <Odometer value={this.state.medition_value} format="(.ddd),dd" /> 
                          <p className={"mts"}>({this.state.medition_type === "ft2" ? 'ft' : 'm'}<sup>2</sup>)</p>
                          <p className="fts-modify-legend" onClick={() => this.conversion(this.state.medition_type, this.state.medition_origin, "change")}>
                              Cambiar a {this.state.medition_type === "ft2" ? 'm2' : 'ft2'}
                          </p>
                      </div>
                    </div>
                </div>                                                                           
                <div className="content">
                <Switch>
                    <Route exact path="/proyecto/:id/calculo_de_area/"
                      render={(data)=> {                
                          return(
                            <ProjectM2Area
                              params={this.state.params}
                              setParameter={this.setParameter.bind(this)} 
                              project={project} />);
                      }
                    }/>
                    <Route exact path="/proyecto/:id/calculo_de_area/set_de_espacios"
                      render={(data)=> {                
                          return(
                            <ProjectM2SpacesSet 
                              params={this.state.params}                            
                              project={project}
                              m2_data={this.state.m2_data}
                              setSpacesArea={this.setSpacesArea.bind(this)}
                              saveM2={this.saveM2.bind(this)} />);
                      }
                    }/>   
                </Switch>
               
                </div>
                
            </div>
            </Fragment>
        );
    }
}
