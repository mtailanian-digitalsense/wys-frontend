import React, { Component, Fragment } from "react";
import { Link } from "react-router-dom";
import CostsFormControl from "../CostsFormControl";
import TooltipIcon from "../TooltipIcon";

export default class ProjectCostParams extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selected: null,
            
        };
    }   
    
    render() {
        var project = this.props.project;
        if (!project || project === "loading") return null;
        return(
        <Fragment>            
            <div className="content">
                <div className="time-params-grid margin-side-A">
                    {!this.props.categories?null:this.props.categories.map((param, i) => {
                        if (param.type === "C") return;
                        return(
                            <div key={param.id} className={"time-params-box item-third flex space-between flex-align-items-center"} style={{paddingLeft: "5px", paddingRight: "20px"}}>
                                {param.comment ? <TooltipIcon label={param.comment} /> : <div style={{paddingLeft: "40px"}}/>}
                                <p style={{flex: 1}}>{param.name}</p>
                                <div className={"time-param-options"}>
                                {param.type === "B"?
                                    
                                    <Fragment>
                                        <div 
                                        onClick={(value)=>this.props.updateCategoryResp(param, "high")}
                                        className={"time-param-option"+(param.resp==="high"?" selected":"")}>SÍ</div>
                                        <div 
                                        onClick={(value)=>this.props.updateCategoryResp(param, "low")}                                        
                                        className={"time-param-option"+(param.resp==="low"?" selected":"")}>NO</div>
                                    </Fragment>

                                    :null
                                }
                                {param.type === "A"?                                    
                                    <CostsFormControl 
                                        noHelp={true}
                                        value={param.resp} 
                                        onChange={(value)=>this.props.updateCategoryResp(param, value)}/>
                                    :null}
                                </div>
                            </div>
                        );
                    })}

                  
               </div>
               
           </div>
                <div className="actions-area">                  
                    <Link
                        to={"/proyecto/" + (project?project.id:"") + "/estimador_de_costos/details"}
                        className={"button is-rounded is-green"}>
                        Continuar
                   </Link>
               </div>
            
            </Fragment>);
    }
}