import React, { Component } from "react";
import IconlayoutSelectedUpload from "../img/layout-upload-icon.svg";


export default class LoadingLayoutGeneration extends Component {
    constructor(props) {
      super(props);    
      this.state = {
          done: false
      };
    }
    componentDidMount() {
        //setTimeout(()=> this.setState({done: true}), 0);

    }
    render() {
        var status = this.props.generation_progress;
        var text = status.job_status;
        if(status.job_status === "started") text = parseInt(status.progress)+"%";
        if(status.job_status === "failed") text = "La generación de LAYAOUT falló";
        if(status.job_status === "queued") text = "En cola de espera ...";
        if(status.job_status === "finished") text = "Terminado";



        return (
            <div className={"loading-building-search" + (this.state.done?" done":"")}>
                <img alt="" className="loading-building-search-image" src={IconlayoutSelectedUpload} style={{opacity: status.progress*0.01}} />
                <div className="loading-building-search-progress-container">
                    <div className="loading-building-search-progress layout" style={{width: "calc("+status.progress+"% - 4px)"}}></div>

                </div>
                <div className="loading-building-search-text">{text}</div>
            </div>
        );
    }
}