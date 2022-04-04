import React, { Component, Fragment } from 'react';
import Popup from "../Popup.js";
import iconForgot from "../../img/icon-forgot.svg";
import iconCheck from "../../img/icon-check.svg";
import {requestPasswordRecover} from '../../api.js';
import Tooltip from 'rc-tooltip';    
export default class PopupRequestPasswordRecover extends Component {
	constructor(props) {
		super(props);
		this.state = {email: ""};
	}
    sendForm() {
        this.props.toggleMainLoading(true);

        this.setState({ loading: true, failedMessage: null, form_errors: null});        
        requestPasswordRecover(
            this.state.email,
            (error, result) => {
            this.props.toggleMainLoading(false);
                this.setState({ loading: false });
                if (error) {     
                    return this.setState({failedMessage: "Error inesperado, vuelva a intentar más tarde" });
                }                
                if(result.status_code === 1001) {
                    return this.setState({failedMessage: "El correo electrónico es requerido"});                    
                }
                if(result.status_code === 1004) {
                    return this.setState({failedMessage: "El correo electrónico no está registrado"});                    
                }
                if(result.status_code === 2000) {
                    return this.setState({step: "done"});;                    
                }
                this.setState({loginFailed: "Error inesperado, vuelva a intentar más tarde"});  
                
            }           
            
        );
    }
    renderForm() {
        return(
            <Fragment>
            <div className="modal-icon">
                    <img src={iconForgot} alt="" />
                </div>
                <h3 className="modal-title">¿Has olvidado tu contraseña?</h3>
            <p className="modal-desc">
                Escribe tu correo electrónico y te enviaremos instrucciones para la recuperación
            </p>
            <div className="modal-input">                
                <input
                    type="email"
                    value={this.state.email}
                    className="input-field"
                    onChange={(e) => this.setState({ email: e.target.value, failedMessage: null })}
                />
                
            </div>
            <Tooltip
                    placement="right"
                    visible={this.state.failedMessage?true:false}
                    overlay={
                        <span>
                            {this.state.failedMessage}                                            
                        </span>
                    }
                >
            <div className="button is-rounded is-green" onClick={() => this.sendForm()}>
                Enviar
            </div>
            </Tooltip>
            </Fragment>
        );
    }
    renderOk() {
        return(
            <Fragment>
            <div className="modal-icon">
                    <img src={iconCheck} alt="" />
                </div>
                <h3 className="modal-title">Correo electrónico enviado con éxito</h3>
            
            
            <div className="button is-rounded is-green" onClick={this.props.onDismiss}>
                Aceptar
            </div>
            </Fragment>
        );
    }
	render() {
		return (
			<Popup
                onDismiss={this.props.onDismiss}
            >                
                {this.state.step === "done"?this.renderOk():this.renderForm()}
            </Popup>
		);
	}
}
