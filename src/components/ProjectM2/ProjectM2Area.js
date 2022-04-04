import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Range } from 'react-range';
import LoadingFull from "../LoadingFull";
import TooltipIcon from "../TooltipIcon";
import RangeSteps from "../RangeSteps.js";
import PeopleIcon from "../../img/icon-people.png";

export default class ProjectM2 extends Component {    
      
    render() {
        var project = this.props.project;
        if (project === "loading") return <LoadingFull />;
        var asignado_level = 50;
        var compartido_level = 50;
        var hotdesking_level = "";
       
          asignado_level = (this.props.params.hotdesking_level-70)*100/30;
          compartido_level = 100 - asignado_level;

        return (
           
                <div className="content">
                <div style={{width: "700px", margin: "auto auto"}}>
                  <div className="m2-white-box">
                    <div className="m2-white-box-label">
                    Cantidad de usuarios
                     <TooltipIcon label="Se refiere al número de colaboradores que van a trabajar en la oficina." />
                    </div>
                    <div className="m2-white-box-field padding-right-10">
                      <div className="inline-block float-right">
                      <img alt="" className="m2-white-box-field-icon" src={PeopleIcon} />
                      <input  className="custom-number-input big" type={"number"} value={this.props.params.num_of_workers} 
                          onChange={(e)=>{
                              this.props.setParameter("num_of_workers", e.target.value);
                          }} />
                      </div>    
                    </div>
                  </div>
                  <div className="m2-white-box">
                    <div className="m2-white-box-label">
                    Puesto de trabajo 
                     <TooltipIcon label={<p>El extremo derecho significa que cada colaborador tendrá asignado un puesto de trabajo fijo. <br />El extremo izquierdo significa que no hay puestos asignados y todos se comparten.</p>} />
                    </div>
                    <div className="m2-white-box-field">
                      <Range                       
                        step={3} min={70} max={100}
                        values={[this.props.params.hotdesking_level]}
                        onChange={values => {this.props.setParameter("hotdesking_level", values[0])}}
                        renderTrack={({ props, children }) => (
                          <div
                            {...props}
                            style={{...props.style}}
                            className="range-track"
                          >
                            {children}
                          </div>
                        )}
                        renderThumb={({ props, isDragged }) => (
                          <div
                            {...props}
                            style={{...props.style}}
                            className={"range-thumb"+(isDragged?' dragged':'')}
                          >
                          {true?null:<div className="range-label">
                        {hotdesking_level}
                        </div>}
                      </div>
                        )}
                      />
                      <RangeSteps 
                        steps={11}
                        labels={[{i: 0, text: "Compartido", upperText: compartido_level +"%"}, {i: 10, text: "Asignado", upperText: asignado_level+"%"}]} />
                    </div>

                   </div>
                  <div className="m2-white-box">
                    <div className="m2-white-box-label">
                    Grado de colaboración 
                     <TooltipIcon label={<p>Mientras más alto, más posiciones colaborativas formales (salas<br /> de reunión) e informales (coffee, meeting, tables, lounges, etc).</p>} />

                    </div>
                    <div className="m2-white-box-field">
                      <Range
                        step={/*4*/5}
                        min={30}
                        max={50}
                        values={[this.props.params.collaboration_level]}
                        onChange={values => {this.props.setParameter("collaboration_level", values[0] ); }}
                        renderTrack={({ props, children }) => (
                          <div
                            {...props}
                            style={{...props.style}}
                            className="range-track"
                          >
                            {children}
                          </div>
                        )}
                        renderThumb={({ props, isDragged }) => (
                          <div
                            {...props}
                            style={{...props.style}}
                            className={"range-thumb"+(isDragged?' dragged':'')}
                          >                          
                       </div>
                        )}
                      />
                      <RangeSteps 
                        steps={5} 
                        labels={[{i: 0, text: "Bajo"}, {i: 2, text: "Medio"}, {i: 4, text: "Alto"}]} />

                      </div>           
                    </div>
                    
                      </div>
                      <div className="page-btns-area text-align-center">
                  
                    <Link
                        className="button is-green is-rounded"
                        to={"/proyecto/" + (project?project.id:"") + "/calculo_de_area/set_de_espacios"}>
                        Continuar
                    </Link>
                </div>
                </div>
              
        );
    }
}
