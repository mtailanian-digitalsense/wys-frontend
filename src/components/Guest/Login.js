import React, { Component, Fragment } from "react";
import { Link } from "react-router-dom";
import Tooltip from "rc-tooltip";
import PopupRequestPasswordRecover from "./PopupRequestPasswordRecover.js";
import { login, loginSocial } from "../../api.js";
import facebookLogo from "../../img/facebook-logo.svg";
import googleLogo from "../../img/google-logo.svg";
import linkedinLogo from "../../img/linkedin-logo.svg";
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props';
import { GoogleLogin } from 'react-google-login';
import {params} from '../../config.js';
import { LinkedIn } from 'react-linkedin-login-oauth2';

export default class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            email: "",
            password: "",
            errors: [],
            failedMessage: null,
        };
    }
    linkedinLoginCallback(resultLi) {
        if(resultLi.status && resultLi.status === "unknown") return;
        this.props.toggleMainLoading(true);        
        loginSocial({provider: "linkedin", access_token: resultLi.accessToken}, (error, result) => {
            if (result.status_code === 2000) {
                return this.props.processLogin(
                    result.user,
                    result.access_token
                );
            }
            if (result.status_code === 1007) {
                return this.setState({
                    failedMessage:
                        "La cuenta aún no ha sido validada por un administrador",
                });
            }

        });
    }
    facebookLoginCallback(resultFB) {
        if(resultFB.status && resultFB.status === "unknown") return;
        this.props.toggleMainLoading(true);        
        loginSocial({provider: "facebook", access_token: resultFB.accessToken}, (error, result) => {
            if (result.status_code === 2000) {
                return this.props.processLogin(
                    result.user,
                    result.access_token
                );
            }
            if (result.status_code === 1007) {
                return this.setState({
                    failedMessage:
                        "La cuenta aún no ha sido validada por un administrador",
                });
            }

        });
    }
    googleLoginCallback(resultG) {
        this.props.toggleMainLoading(true);
        loginSocial({provider: "google", access_token: resultG.accessToken}, (error, result) => {
            if (result.status_code === 2000) {
                return this.props.processLogin(
                    result.user,
                    result.access_token
                );
            }
            if (result.status_code === 1007) {
                return this.setState({
                    failedMessage:
                        "La cuenta aún no ha sido validada por un administrador",
                });
            }

        });
    }
    googleLoginFail(error) {
        console.log("error", error);
    }
    sendForm() {
        this.props.toggleMainLoading(true);

        this.setState({ loading: true, failedMessage: null });
        login(
            { email: this.state.email, password: this.state.password },
            (error, result) => {
                this.props.toggleMainLoading(false);
                //return this.props.processLogin({fname: "Denisse", lname: "Soto"}, "test");

                this.setState({ loading: false });
                if (error) {
                    return this.setState({
                        failedMessage:
                            "Error inesperado, vuelva a intentar más tarde",
                    });
                }
                if (result.status_code === 1002) {
                    return this.setState({
                        failedMessage:
                            "Correo electrónico o contraseña incorrectos",
                    });
                }
                if (result.status_code === 1007) {
                    return this.setState({
                        failedMessage:
                            "La cuenta aún no ha sido validada por un administrador",
                    });
                }
                if (result.status_code === 2000) {
                    return this.props.processLogin(
                        result.user,
                        result.access_token
                    );
                }
                this.setState({
                    failedMessage:
                        "Error inesperado, vuelva a intentar más tarde",
                });
            }
        );
    }
    checkEnter(e) {
        if (e.key === "Enter") this.sendForm();
    }

    render() {
        return (
            <Fragment>
                <div className="main-content">
                    <div className="form-box">
                        <div className="form-headname gradient-purple">
                            <h2>Iniciar Sesión</h2>
                        </div>
                        <div className="form-fields-area">
                            <div className="login-field-container form-field">
                                <label>Correo electrónico</label>
                                <input
                                    type="email"
                                    value={this.state.email}
                                    className="input-field"
                                    onKeyPress={this.checkEnter.bind(this)}
                                    onChange={(e) =>
                                        this.setState({
                                            email: e.target.value,
                                            failedMessage: null,
                                        })
                                    }
                                />
                            </div>
                            <div className="login-field-container form-field">
                                <label>Contraseña</label>
                                <input
                                    type="password"
                                    value={this.state.password}
                                    className="input-field"
                                    onKeyPress={this.checkEnter.bind(this)}
                                    onChange={(e) =>
                                        this.setState({
                                            password: e.target.value,
                                            failedMessage: null,
                                        })
                                    }
                                />
                            </div>
                            <div className="login-options">
                                <p>
                                    ¿No tienes una cuenta?{" "}
                                    <Link
                                        to={"/register"}
                                        className="login-options-link"
                                    >
                                        Regístrate
                                    </Link>
                                </p>
                                <p>
                                    Haz olvidado tu contraseña?{" "}
                                    <div
                                        onClick={() => {
                                            this.setState({
                                                forgotPasswordOpened: true,
                                            });
                                        }}
                                        className="login-options-link text-link"
                                    >
                                        Recuperar
                                    </div>
                                </p>
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
                                            Iniciar Sesión
                                        </button>
                                    </div>
                                </Tooltip>
                            </div>
                            <div className="login-rrss-buttons-container">
                                <p className="rrss-instructions">
                                    o iniciar con
                                </p>
                                <div className="login-rrss-buttons-area">
                                <FacebookLogin
                                    appId={params.facebook_app_id}
                                    autoLoad={false}
                                    isMobile={false}
                                    fields="name,email,picture.type(large),first_name,last_name"
                                    onClick={() => {}}
                                    render={renderProps => (
                                         <button className="button is-transparent is-rounded has-icon size-m" onClick={renderProps.onClick}>
                                            <img
                                                src={facebookLogo}
                                                className="icon" alt=""
                                            />
                                        </button>

                                      )}
                                    callback={this.facebookLoginCallback.bind(this)} />
                               <GoogleLogin
                                    clientId={params.google_app_id}
                                    
                                   
                                    onSuccess={this.googleLoginCallback.bind(this)}
                                    onFailure={this.googleLoginFail.bind(this)}
                                    render={renderProps => (
                                      <button className="button is-transparent is-rounded has-icon size-m"
                                          onClick={renderProps.onClick}>
                                        <img
                                            src={googleLogo}
                                            className="icon" alt=""
                                        />
                                    </button>
                                    )}
                                    //cookiePolicy={'single_host_origin'}
                                    cookiePolicy={'none'} />
                                    <LinkedIn
                                    clientId="81lx5we2omq9xh"
                                      onFailure={this.linkedinLoginCallback}
                                      onSuccess={this.linkedinLoginCallback}
                                      redirectUri="http://localhost:3000/linkedin"
                                      renderElement={({ onClick, disabled }) => (
                                        <button onClick={onClick} className="button is-transparent is-rounded has-icon size-m">
                                        <img
                                            src={linkedinLogo}
                                            className="icon" alt=""
                                        />
                                    </button>
                                      )}
                                  />
                                    
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {this.state.forgotPasswordOpened ? (
                    <PopupRequestPasswordRecover
                        loginEmail={this.state.loginEmail}
                        toggleMainLoading={this.props.toggleMainLoading}
                        onDismiss={() =>
                            this.setState({ forgotPasswordOpened: false })
                        }
                    />
                ) : null}
            </Fragment>
        );
    }
}
