import React, { Component } from 'react';
import Scrollbar from "react-scrollbars-custom";
import WorkspaceSelect from "./WorkspaceSelect.js";

export default class WorkspacesSelect extends Component {
	constructor() {
    super();
    this.state = { height: 0 };
    this.updateHeight = this.updateHeight.bind(this);
  }

 componentDidMount() {
   this.updateHeight();
   window.addEventListener("resize", this.updateHeight);
 }

 componentWillUnmount() {
   window.removeEventListener("resize", this.updateHeight);
 }

 /*componentDidUpdate() {
   this.updateHeight();
 }*/

 updateHeight() {
 	this.setState({hide: true, height: 0}, () => {
	     this.setState({ height: this.div.clientHeight, hide:false });
 	});
 }
	
	renderWorkspaces() {
		if(this.state.hide) return null;
        if(!this.props.workspaces) return null;
        if(this.props.workspaces === "error") return "error cargando espacios";
        if(this.props.workspaces === "loading") return "cargando espacios"; 
        var workspaces = [];
        this.props.workspaces.forEach((workspace) => {
            workspace.subcategories.forEach((sub) => {
                if(sub.spaces.length > 0) workspaces.push({...sub, main_name: workspace.name, main_id: workspace.id});

            });
        });
        /*return workspaces.sort((w, w2)=> {
            if(!w.toggled && w2.toggled) return 1;
            else if(w.toggled && !w2.toggled) return -1;
            else {
                 if(w.main_id > w2.main_id)return 1;
                if(w.main_id < w2.main_id) return -1;
                return 0;
            }
        }
            )*/return this.props.workspaces.map(w=>
            <WorkspaceSelect 
                key={w.main_id+"_"+w.id} 
                workspace={w} 
                toggleSubworkspace={this.props.toggleSubworkspace}
                selectSpace={this.props.selectSpace} 
                updateSpacesCount={this.props.updateSpaceCount}
                spaces_images={this.props.spaces_images}
                maxHeight={this.state.height - 200+(this.state.height<300?120:0)}
                showPicture={this.state.height>=300} />

                );

    }    
	render() {
		return (
			<div style={{flex: 1}} ref={ div => { this.div = div; } }>
			<Scrollbar noScrollY={true} style={{ width: "100%", height: this.state.height, whiteSpace: "nowrap", overflow: "visible" , display: "flex"}}>
                {this.renderWorkspaces()}
            </Scrollbar>
            </div>
		);
	}
}
