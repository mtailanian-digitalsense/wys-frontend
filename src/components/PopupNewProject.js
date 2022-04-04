import React, { Component, Fragment } from 'react';
import Popup from "./Popup.js";
import iconForgot from "../img/icon-forgot.svg";
import {createProject} from '../api.js';
import Tooltip from 'rc-tooltip';    
export default class PopupNewProject extends Component {
	constructor(props) {
		super(props);
		this.state = {name: ""};
	}
    sendForm() {
        this.props.toggleMainLoading(true);
        this.setState({failedMessage: null, form_errors: null});        
        createProject(
            {
                name: this.state.name,
                m2_gen_id: null,
                location_gen_id: null,
                layout_gen_id: null
            },
            (error, result) => {
            this.props.toggleMainLoading(false);
                if (error) {     
                    return this.setState({failedMessage: "Error inesperado, vuelva a intentar más tarde" });
                }        
                this.props.onCreate(result);
                
            }           
            
        );
    }
    renderForm() {
        return(
            <Fragment>
            <div className="modal-icon">
                    <img src={iconForgot} alt="" />
                </div>
                <h3 className="modal-title">Comenzar nuevo proyecto</h3>
            
            <div className="modal-input">                
                <input
                    type="text"
                    value={this.state.name}
                    className="input-field"
                    placeholder="Nombra Tu Proyecto"
                    onChange={(e) => this.setState({ name: e.target.value, failedMessage: null })}
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
                Crear
            </div>
            </Tooltip>
            </Fragment>
        );
    }    
	render() {
		return (
			<Popup
                onDismiss={this.props.onDismiss}
                colorPalette="green"
                size="small"

            >                
                {this.state.step === "done"?this.renderOk():this.renderForm()}
            </Popup>
		);
	}
}
