import React, { Component, Fragment } from "react";
import { Link } from "react-router-dom";
import PopupSearchNoBuildings from "../PopupSearchNoBuildings";
import IconlayoutSelectedUpload from "../../img/layout-upload-icon.svg";
import {uploadLayout} from "../../api.js";
export default class ProjectLayoutTemplateUpload extends Component {
    constructor(props) {
        super(props);
        this.state = {
            building_name: "", 
            address: "", 
            country: "", 
            city: "", 
            link: ""
        };
    } 
    upload() {
        const data = {
            user_id: 10, 
            building_name: this.state.building_name, 
            address: this.state.address, 
            country: this.state.country, 
            city: this.state.city, 
            link: this.state.link
        };
        uploadLayout(data, () => {

        });
    }
    async loadFile(e, d) {
        console.log(e, d);
        const file = e.target.files[0];
        var link = null;
        if(file) link = await toBase64(file);
        this.setState({link});
    }
    render() {
        var project = this.props.project;
        if (!project || project === "loading") return null;
        
        return (
            <Fragment>
            <div className="heading-content">
                <div className="project-tool-info">
                    <h2 className="tool-name">Layout</h2>                
                    <h1 className="subtool-name">
                        Carga tu planta
                    </h1>
                </div>               
            </div>
            <div className="content">
            	<div className="layout-select-template-type-boxes">
                    <div className="layout-select-template-type-box big">
	                 	
                        <div  onClick={()=> {document.getElementById('inputId').click()}}>
                        {this.state.link?
                            <div>
                            
                            <img alt="" class="layout-select-file-uploaded-img" src={this.state.link} /></div>
                            :<div>
                            <img alt="" className="layout-select-template-type-box-img big" src={IconlayoutSelectedUpload} />
                        <div className="layout-select-file-upload-label">Buscar un archivo en tu computador</div>
                            <div className={"button is-green is-rounded"} for="inputId">
                            Seleccionar Archivo
                        </div></div>}
                        </div>
	                 	<input 
                            id="inputId"
                            type="file"
                            style={{display: "none"}}
                            onChange={this.loadFile.bind(this)}
                            className={"button is-green is-rounded"} />
	                        
	                    
	                </div>
	                <div className="layout-select-template-type-box big">
	                 	<div className="flex form-row">
	                 		<div className="row-label">Nombre edificio</div>
	                 		<input className="row-input-text" onChange={(e)=> {this.setState({building_name: e.target.value})}} value={this.state.building_name} />
                 		</div>
                 		<div className="flex form-row">
	                 		<div className="row-label">Dirección</div>
	                 		<input className="row-input-text" onChange={(e)=> {this.setState({address: e.target.value})}} value={this.state.address} />
                 		</div>
                 		<div className="flex form-row">
	                 		<div className="row-label">Ciudad</div>
	                 		<input className="row-input-text" onChange={(e)=> {this.setState({city: e.target.value})}} value={this.state.city} />
                 		</div>
                 		<div className="flex form-row">
	                 		<div className="row-label">País</div>
	                 		<input className="row-input-text" onChange={(e)=> {this.setState({country: e.target.value})}} value={this.state.country} />
                 		</div>
	                 		
	                </div>	              
                </div> 
            	               
            </div>
            <div className="actions-area flex space-between">
                <Link to={"/proyecto/" + (project?project.id:"") + "/layout"} className="button is-dark-line is-transparent is-rounded">
                    Volver
                </Link>
                <div onClick={() => {
                    this.upload();
                }} className="button is-green is-rounded">
                    Enviar
                </div>
            </div>
            {this.state.searching === "not_found" ? (
                    <PopupSearchNoBuildings
                        onDismiss={() =>
                            this.setState({ searching: false })
                        }
                    />
                ) : null}
            </Fragment>

              
        );
    }
}
const toBase64 = file => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
});