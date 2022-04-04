import React, { Component } from "react";
import { FaSpinner } from "react-icons/fa";

export default class LoadingFull extends Component {
    render() {
        return (
            <div className="loading-screen">
                <div className="loading-full-content">
                    <div className="loading-full-image">
                        <FaSpinner className="icon-spin" />
                    </div>
                    <div className="loading-full-text">
                        <p>Cargando...</p>
                    </div>
                </div>
            </div>
        );
    }
}
