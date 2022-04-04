import React, { Component } from 'react';
import Tooltip from "rc-tooltip";
import {sendPasswordRecover, checkPasswordRecoverToken} from '../../api.js';
export default class PasswordRecover extends Component {	
    constructor(props) {
      super(props);
    
      this.state = {step:null};
    }
	componentDidMount() {
		this.props.toggleMainLoading(true);
		checkPasswordRecoverToken(this.props.token, (error, result)=> {
			this.props.toggleMainLoading(false);			
            if (error) {                 
                this.props.redirect("/login");                
                return this.props.setPopupPasswordRecoverForm({/*step: "error",*/ failedMessage: "Error inesperado, vuelva a intentar más tarde"});
            }
            if(result.status_code === 1005) {
                this.props.redirect("/login");                
                return this.props.setPopupPasswordRecoverForm({step: "error", failedMessage: "El código de verificación es invalido"});        
            }
            if(result["status:code"] === 1006) {
                this.props.redirect("/login");                
                return this.props.setPopupPasswordRecoverForm({step: "error", failedMessage: "El código de verificación ha expirado"});
            }
            if(result.token) {
                return this.setState({step: "form"});
                //return this.props.setPopupPasswordRecoverForm({step: "form", token: this.props.token});
            }
            this.props.redirect("/login");
            this.props.setPopupPasswordRecoverForm({/*step: "error",*/ failedMessage: "Error inesperado, vuelva a intentar más tarde"});            
		});
		
	}		
    sendForm() {
        this.props.toggleMainLoading(true);
        sendPasswordRecover(this.props.token, this.state.password, this.state.password2, (error, result)=> {
            this.props.toggleMainLoading(false);
            if (error) {                     
                if(result && result.status_code === 1005) {
                this.props.redirect("/login");
                    return this.props.setPopupPasswordRecoverForm({step: "error", failedMessage: "El token de recuperación es inválido"});
                }
                return this.props.setPopupPasswordRecoverForm({failedMessage: "Error inesperado, vuelva a intentar más tarde"});
            }
            
            /*if(result["status_code"] === 1006) {
                return this.setState({step: "error", failedMessage: "El código de verificación ha expirado"});                    
            }
            if(result_status) {
                return this.setState({step: "form"});
            }
            this.setState({ failedMessage: "Error inesperado, vuelva a intentar más tarde" });            
            */
            if(result["status_code"] === 1001) {
                return this.setState({failedMessage: result.message.password[0]});                    
            }
            this.props.redirect("/login");
            this.props.setPopupPasswordRecoverForm({step: "ok", failedMessage: null});

        });
    }
    
    renderForm() {
        return(
            <div className="form-fields-area">
                <div className="login-field-container form-field">
                    <label>Nueva Contraseña</label>
                    <input
                        type="password"
                        value={this.state.password}
                        className="input-field"
                        onChange={(e) =>
                            this.setState({ password: e.target.value, failedMessage: null })
                        }
                    />
                </div>
                <div className="login-field-container form-field">
                    <label>Confirma la contraseña</label>
                    <input
                        type="password"
                        value={this.state.password2}
                        className="input-field"
                        onChange={(e) =>
                            this.setState({
                                password2: e.target.value, failedMessage: null
                            })
                        }
                    />
                </div>                       
                <div className="login-button-error-container">
                    <Tooltip
                        placement="bottom"
                        visible={this.state.failedMessage}
                        overlay={
                            <span>{this.state.failedMessage}</span>
                        }
                    >
                        <div className="login-submit-button-container">
                            <button
                                className="login-submit-button button is-rounded is-green"
                                onClick={() => this.sendForm()}
                            >
                                Confirmar
                            </button>
                        </div>
                    </Tooltip>
                </div>
            </div>);
    }

    render() {
        return (
            !this.state.step?null:
            <div className="main-content">
                <div className="form-box">
                    <div className="form-headname gradient-purple">
                        <h2>Recuperar Contraseña</h2>
                    </div>
                    {this.renderForm()} 
                </div>
            </div>
        );
    }

}
