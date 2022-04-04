import React, { Component } from "react";
import Popup from "./Popup.js";
import iconHelp from "../img/icon-help.svg";
import {Link} from "react-router-dom";
export default class PopupCustomArea extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: props.currentValue,
            medition_type: props.meditionType
        };
    }

    handleChangeMedition = (type) => {
        let finalValue = this.state.value;
        if (type === "mt2") {
            this.setState({medition_type: "ft2"})
            finalValue = Math.round(finalValue * 10.764);
        }
        if (type === "ft2") {
            this.setState({medition_type: "mt2"})
            finalValue = Math.round(finalValue / 10.764);
        }
        this.setState({value: finalValue})
    }
    render() {
        return (
            <Popup onDismiss={this.props.onDismiss} size="small" >
                <div className="modal-icon">
                    <img src={iconHelp} alt="" />
                </div>
                <p className="margin-bottom-20">¿Cuántos {this.state.medition_type === "ft2" ? 'ft' : 'm'}² tendrá tu nuevo espacio de trabajo?</p>

                <input type="number" className="custom-number-input big digits-3" value={this.state.value} onChange={(e)=>{this.setState({value: Math.round(e.target.value)})}} />            
                <span className="label-select">
                    {this.state.medition_type === "ft2" ? 'ft' : 'm'}<sup>2</sup>
                </span>
                <p className="fts-modify-legend" onClick={() => this.handleChangeMedition(this.state.medition_type)}>
                    Cambiar a {this.state.medition_type === "ft2" ? 'm2' : 'ft2'}
                </p>
                <p className="popup-category-text"></p>  
                <div className="button is-rounded is-green margin-bottom-20" onClick={()=>{this.props.onDismiss(this.state.value); this.props.onChangeMedition(this.state.medition_type);}}>
                    Confirmar
                </div><br className="" />
                ¿No lo sabes? Calcula <Link to={"/proyecto/"+ this.props.project_id + "/calculo_de_area"}>aquí</Link> la superficie que necesitas.
            </Popup>
        );
    }
}