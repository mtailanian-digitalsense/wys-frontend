import React, { Component } from "react";
import Popup from "./Popup.js";
import iconHelp from "../img/icon-help.svg";

export default class PopupCategory extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    render() {       
        return (
            <Popup onDismiss={this.props.onDismiss} size="small" >
                <div className="modal-icon">
                    <img src={iconHelp} alt="" />
                </div>
                <p className="popup-category-text">
                Según la organización Building Owners and Managers Association International los edificios son organizados en tres categorías: A) los edificios más prestigiosos con alquileres superiores al promedio del área. Los edificios tienen acabados de alta calidad. Sistemas de vanguardia, accesibilidad excepcional y una presencia definitiva en el mercado; B) Edificios que compiten por una amplia gama de usuarios con alquileres en el rango promedio del área. Los acabados de construcción y los sistemas son buenos para el área pero el edificio con la Clase A al mismo precio; C) Edificio que compiten por inquilinos que requieren espacio funcional en alquileres por debajo del promedio del área. </p>              
                <div className="button is-rounded is-green" onClick={this.props.onDismiss}>
                    Entendido
                </div>
            </Popup>
        );
    }
}