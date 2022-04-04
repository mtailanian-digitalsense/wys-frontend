import React, { Component, Fragment } from "react";
import { Link } from "react-router-dom";
export default class ProjectLayoutSet extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }
   
   save() {
       alert("save");
   }

    render() {
        var project = this.props.project;
        if (!project || project === "loading") return null;
        
        return (
            <Fragment>
            
            <div className="content">
                <div className="page-btns-area flex space-between">
                    <Link
                        className="button is-transparent is-rounded is-dark-line"
                        to={"/proyecto/" + (project?project.id:"") + "/layout"}>
                        Volver
                    </Link>
                    <Link
                        onClick={() => {this.save()}}
                        className="button is-green is-rounded"
                        to={"#"}>
                        Finalizar
                    </Link>
                </div>
            </div>
          
            </Fragment>

              
        );
    }
}
