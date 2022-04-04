import React, { Component } from 'react';
import Popup from "../Popup.js";
import iconCheck from "../../img/icon-check.svg";

export default class PopupRegisterOk extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}
	render() {
		return (
			<Popup
                onDismiss={this.props.onConfirm}
            >
                <div className="modal-icon">
                    <img src={iconCheck} alt="" />
                </div>
                <h3 className="modal-title">Tu cuenta ha sido creada exitosamente</h3>
                <p className="modal-desc">
                    Enviaremos a tu correo las indicaciones para que puedas comenzar a utilizar nuestra plataforma
                </p>                
                <div className="button is-rounded is-green" onClick={()=>{this.props.onConfirm()}}>
                    Continuar
                </div>
            </Popup>
		);
	}
}
