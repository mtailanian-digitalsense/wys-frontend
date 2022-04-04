import React, { Component} from "react";
import Popup from "./Popup.js";

import iconForgot from "../img/icon-forgot.svg";

export default class PopupSearchNoBuildings extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    render() {
        return (
            <Popup onDismiss={this.props.onDismiss}>
                <div className="modal-icon">
                    <img src={iconForgot} alt="" />
                </div>
                <h3 className="modal-title">No se encontraron edificios</h3>
                <p className="modal-desc">
                    No se han encontrado edificios con los criterios de búsqueda elegidos. Por favor, elige otros criterios, y vuelve a intentar.
                </p>
             
                <div className="button is-rounded is-green" onClick={this.props.onDismiss}>
                    Entendido
                </div>
             
                
            </Popup>
        );
    }
}
