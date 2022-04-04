import React, { Component, Fragment } from "react";
import { Link } from "react-router-dom";
import LoadingFull from "../LoadingFull";
import WorkspacesSelect from "../WorkspacesSelect";

export default class ProjectLayoutSpacesSet extends Component {   
    componentDidMount() {
       this.props.getMinBathrooms();

    } 
    getSpacesCount() {
       if(!this.props.workspaces) return 0;
        var count = 0;
        this.props.workspaces.forEach((w, i) => {
            if(w.subcategories) {
                w.subcategories.forEach((sc, j) => {
                    if(sc.spaces) {
                        sc.spaces.forEach((space)=> {
                            if(space.quantity > 0) count+=space.quantity;
                        });
                    }
                });
            }
        });
        return count;
    } 
    render() {
        var project = this.props.project;
        if (project === "loading" || this.props.workspaces === "loading") return <LoadingFull />;
        return (
              <Fragment>
                    <div className="heading-content">
                        <div className="project-tool-info">
                            <h2 className="tool-name">Layout</h2>                
                            <h1 className="subtool-name">
                                Escoge los espacios de tu oficina
                            </h1>
                        </div>
                        {/*<div className="m2-heading-area">
                      <div className="inline-block float-right margin-right-50">
                              <p className="uppercase">Espacios seleccionados</p>
                              <Odometer value={this.getSpacesCount()} format="(.ddd),dd" /> 
                          </div>
                        </div>               */}
                    </div>  
            <div className="content">

                    <WorkspacesSelect 
                        workspaces={this.props.workspaces}
                        toggleSubworkspace={this.props.toggleSubworkspace}
                        selectSpace={this.props.selectSpace} 
                        updateSpaceCount={this.props.updateSpaceCount}
                        spaces_images={this.props.spaces_images}
                        maxHeight={100}
                    />                    
                    <div className="page-btns-area flex space-between">
                        <Link
                            className="button is-transparent is-rounded is-dark-line"
                            to={"/proyecto/" + (project?project.id:"") + "/layout"}>
                            Volver
                        </Link>
                        <div
                            onClick={() => {this.props.generateLayout()}}
                            className="button is-green is-rounded"
                            >
                            Continuar
                        </div>
                    </div>
                    </div>
                </Fragment>
              
        );
    }
}
