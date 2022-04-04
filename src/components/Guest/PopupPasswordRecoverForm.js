import React, { Component, Fragment } from 'react';
import Popup from "../Popup.js";
import iconCheck from "../../img/icon-check.svg";


export default class PopupPasswordRecoverForm extends Component {	    
    renderOk() {
        return(
            <Fragment>
                <div className="modal-icon">
                        <img src={iconCheck} alt="" />
                    </div>
                    <h3 className="modal-title">La contraseña se ha reestablecido correctamente</h3>               
                
                <div className="button is-rounded is-green" onClick={this.props.onDismiss}>
                    Aceptar
                </div>
            </Fragment>
        );
        
    }
    renderError() {
        return(
            <Fragment>            
                    <h3 className="modal-title">{this.props.params.failedMessage}</h3>
                    <button className="button is-rounded is-green" onClick={this.props.onDismiss}>
                        Aceptar
                    </button>
            </Fragment>
           );
    }
    
	render() {
		return (
			<Popup
                onDismiss={this.props.onDismiss}
                hideClose={true}
            >                
                {this.props.params.step!=="ok"?null:this.renderOk()}
                {this.props.params.step!=="error"?null:this.renderError()}
            </Popup>
		);
	}
}
