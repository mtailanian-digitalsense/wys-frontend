import React, { Component, Fragment } from "react";
import { Link } from "react-router-dom";
import Tooltip from "rc-tooltip";
import PopupRegisterOk from "./PopupRegisterOk.js";
import {register, getCountries} from '../../api.js';

export default class Register extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            email: "",
            password: "",
            errors: [],
            registerFailed: null,
            country_id: null, 
            terms: false
        };
    }    
    componentDidMount() {
        this.props.toggleMainLoading(true);        
        getCountries((error, result) => {
            this.props.toggleMainLoading(false);
            this.setState({countries: result.countries, country_id: 49});
        });
    }
    deleteFormError(field_name) {
        var form_errors = {...this.state.form_errors};
        delete form_errors[field_name];
        this.setState({form_errors})
    }
    sendForm() {
        if(!this.state.terms) return this.setState({form_errors: {terms: ["Debes aceptar los términos y condiciones"]}});
        this.props.toggleMainLoading(true);
        this.setState({ loading: true, failedMessage: null, form_errors: null});
        var user = {
            email: this.state.email,
            password: this.state.password,
            password_confirmation: this.state.password2,
            name: this.state.name,
            last_name: this.state.last_name,
            country_id: this.state.country_id
        };
        register(
            user,
            (error, result) => {
                this.props.toggleMainLoading(false);

                console.log("error", error, "result", result, "status_code");
                this.setState({ loading: false });
                if (error) {     
                    console.log("entró acá");           
                    return this.setState({failedMessage: "Error inesperado, vuelva a intentar más tarde" });
                }                
                if(result.status_code === 1001) {
                    console.log("acá llegó con esto", result.message);
                    return this.setState({form_errors: result.message});                    
                }
                if(result.status_code === 2001) {
                    console.log("se creo ok");
                    return this.setState({registerOkOpened: true});;                    
                }
                this.setState({loginFailed: "Error inesperado, vuelva a intentar más tarde"});         
                
            }           
            
        );
    }
    renderTooltipError(field) {
        if(!this.state.form_errors) return null;
        if(!this.state.form_errors[field]) return null;
        return this.state.form_errors[field][0];
    }
    render() {
        return (
            <Fragment>
                <div className="main-content">
                    <div className="form-box">
                        <div className="form-headname gradient-purple">
                            <h2>Crear Cuenta</h2>
                        </div>
                        <div className="form-fields-area">
                            <div className="login-field-container form-field">
                                <label>Nombre</label>
                                <Tooltip
                                    placement="right"
                                    visible={this.state.form_errors && this.state.form_errors["name"]?true:false}
                                    overlay={
                                        <span>
                                            {this.renderTooltipError("name")}
                                        </span>
                                    }
                                >
                                <input
                                    type="text"
                                    value={this.state.name}
                                    className="input-field"
                                    onChange={(e) => {
                                        this.setState({ name: e.target.value }); this.deleteFormError("name");
                                    }
                                    }
                                />
                                </Tooltip>
                            </div>
                            <div className="login-field-container form-field">
                                <label>Apellido</label>
                                <Tooltip
                                    placement="right"
                                    visible={this.state.form_errors && this.state.form_errors["last_name"]?true:false}
                                    overlay={
                                        <span>
                                            {this.renderTooltipError("last_name")}                                            
                                        </span>
                                    }
                                >
                                <input
                                    type="text"
                                    value={this.state.last_name}
                                    className="input-field"
                                    onChange={(e) => {
                                        this.setState({ last_name: e.target.value }); this.deleteFormError("last_name");
                                    }
                                    }
                                />
                                </Tooltip>
                            </div>
                            <div className="login-field-container form-field">
                                <label>Correo electrónico</label>
                                <Tooltip
                                    placement="right"
                                    visible={this.state.form_errors && this.state.form_errors["email"]?true:false}
                                    overlay={
                                        <span>
                                            {this.renderTooltipError("email")}                                            
                                        </span>
                                    }
                                >
                                <input
                                    type="email"
                                    value={this.state.email}
                                    className="input-field"
                                    onChange={(e) =>{
                                        this.setState({ email: e.target.value });
                                        this.deleteFormError("email");
                                    }
                                    }
                                />
                                </Tooltip>
                            </div>
                            <div className="login-field-container form-field">
                                <label>País</label>
                                <Tooltip
                                    placement="right"
                                    visible={this.state.form_errors && this.state.form_errors["country_id"]?true:false}
                                    overlay={
                                        <span>
                                            {this.renderTooltipError("country_id")}                                            
                                        </span>
                                    }
                                >
                                <select                                    
                                    value={this.state.country_id+""}
                                    className="input-field"
                                    onChange={(e) => {
                                        this.setState({ country_id: parseInt(e.target.value) });
                                        this.deleteFormError("country_id");
                                    }
                                    }>
                                    {!this.state.countries?null:this.state.countries.map((country) => {
                                        return <option key={country.id} value={country.id}>{country.name}</option>
                                    })}
                                </select>
                                </Tooltip>
                            </div>
                            <div className="login-field-container form-field">
                                <label>Contraseña</label>
                                <Tooltip
                                    placement="right"
                                    visible={this.state.form_errors && this.state.form_errors["password"]?true:false}
                                    overlay={
                                        <span>
                                            {this.renderTooltipError("password")}                                            
                                        </span>
                                    }
                                >
                                    <input
                                        type="password"
                                        value={this.state.password}
                                        className="input-field"
                                        onChange={(e) => {
                                            this.setState({
                                                password: e.target.value,
                                            });
                                            this.deleteFormError("password");;
                                        }
                                        }
                                    />
                                </Tooltip>
                            </div>
                            <div className="login-field-container form-field">
                                <label>Repetir Contraseña</label>
                                <Tooltip
                                    placement="right"
                                    visible={this.state.form_errors && this.state.form_errors["password_confirmation"]?true:false}
                                    overlay={
                                        <span>
                                            {this.renderTooltipError("password_confirmation")}                                            
                                        </span>
                                    }
                                >
                                    <input
                                        type="password"
                                        value={this.state.password2}
                                        className="input-field"
                                        onChange={(e) => {
                                            this.setState({
                                                password2: e.target.value,
                                            });
                                            this.deleteFormError("password2");
                                        }}
                                    />
                                </Tooltip>
                            </div>
                            <div className="login-options">
                            <Tooltip
                                    placement="right"
                                    visible={this.state.form_errors && this.state.form_errors["terms"]?true:false}
                                    overlay={
                                        <span>
                                            {this.renderTooltipError("terms")}                                            
                                        </span>
                                    }
                                >
                                <div className="remember-me">
                                    <label className="is-checkbox">
                                        <input
                                            type="checkbox"
                                            className="input-checkbox"
                                            value={this.state.terms}
                                            onChange={(e)=>{
                                                console.log(e.target.checked);
                                                this.setState({terms: e.target.checked});
                                            }}
                                        />
                                        <span>
                                            Acepto{" "}
                                            <Link
                                                to={"/register"}
                                                className="login-options-link text-link"
                                            >
                                                Términos y Condiciones
                                            </Link>
                                        </span>
                                    </label>
                                </div>
                                </Tooltip>
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
                                            Registrarme
                                        </button>
                                    </div>
                                </Tooltip>
                            </div>
                        </div>
                    </div>
                </div>
                {this.state.registerOkOpened ? <PopupRegisterOk onConfirm={() => this.props.redirect("/login")} /> : null}
            </Fragment>
        );
    }
}
