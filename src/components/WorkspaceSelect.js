import React, { Component } from 'react';
import Scrollbar from "react-scrollbars-custom";
import arrowDown from "../img/arrow-down-black.png";
import Loading from "../img/loading.gif";
import Tooltip from "rc-tooltip";
import ModalImage from "react-modal-image";

export default class WorkspaceSelect2 extends Component {
	constructor(props) {
		super(props);
		this.state = {
			expanded: false,
			toggled: false,
			spaces_num: 0
		};
	}
    getSpaceImage(space) {
        var image = Loading;
        if(!this.props.spaces_images) return image;
        if(!space) return image;
        this.props.spaces_images.forEach((_space)=> {
            if(space.id === _space.id) {
                if(_space.image) image = _space.image;
            }
        });    
        return image;

    }
	render() {
		var workspace = this.props.workspace;
        var image = workspace.subcategories[0]?this.getSpaceImage(workspace.subcategories[0].spaces[0]): null;
        var spaces_count = 0;
        workspace.subcategories.forEach((sc) => {
            sc.spaces.forEach((space)=> {if(space.quantity) spaces_count+=space.quantity});
        });
        var scrollHeight = 0;
        if(workspace.subcategories) {
            scrollHeight = 5+(36*workspace.subcategories.length);
            if(this.state.expanded) {
                workspace.subcategories.forEach((sc)=>{
                    if(sc.id === this.state.expanded) {
                        scrollHeight += sc.spaces.length>0?3+(58*sc.spaces.length): 0;

                    }
                });
            }

        }
        if(scrollHeight > this.props.maxHeight) scrollHeight = this.props.maxHeight;
		return (
            <div className="workspace-select vertical-align-top">
                <div className={"workspace-select-header"+(spaces_count?" active":"")}>
                    <p className="title">{workspace.name}</p>
                </div>
                {!this.props.showPicture?null:<ModalImage
                  small={image}
                  large={image}
                  alt=""
                  className="workspace-select-img"
                  imageBackgroundColor="white"
                  hideDownload={true}
                  hideZoom={true}
                />}
                <Scrollbar style={{height: scrollHeight }}>

                	{workspace.subcategories?workspace.subcategories.map((sc) => {
                        var subcategory_spaces_count = 0;
                        sc.spaces.forEach((space)=> {if(space.quantity) subcategory_spaces_count+=space.quantity});
                        return (
                        <div className={"workspace-select-subcategory"}>    
                            <div className={"workspace-select-subcategory-toggle"} onClick={()=>this.setState({expanded: this.state.expanded===sc.id?false:sc.id})}>
                                <div className={"workspace-select-subcategory-spaces-count"}>{subcategory_spaces_count}</div>
                                <p>{sc.name}</p>
                                <img className={"workspace-arrow-icon"+(this.state.expanded===sc.id?" rotate180":"")} src={arrowDown} alt="" />
                            </div>
                            {this.state.expanded===sc.id?
                                <div className={"workspace-subcategory-spaces"+(this.state.expanded===sc.id?" expanded":"")}>
                                    {sc.spaces?sc.spaces.map((m,i)=>{
                                        var image = this.getSpaceImage(m);
                                        var html = <div  className="workspace-select-more-item" key={i}>
                                        <div 
                                            className="workspace-select-more-img"
                                            style={{textAlign: "center"}}
                                        >
                                        <ModalImage
                                          small={image}
                                          large={image}
                                          alt=""
                                          className="workspace-select-more-img"
                                          imageBackgroundColor="white"
                                          hideDownload={true}
                                          hideZoom={true}

                                        />   
                                        </div>                                       
                                            <input 
                                                disabled={false&&!workspace.toggled} 
                                                className="custom-number-input small" type="number" 
                                                value={m.quantity?m.quantity:0} onChange={(e)=> {
                                                this.props.updateSpacesCount(workspace, sc, m, e.target.value);
                                            }} />
                                            </div>;
                                        return(
                                            (workspace.name === "Sala Reunión" || workspace.name === "Puestos Trabajo Privado")?
                                            <Tooltip
                                                placement="top"
                                                trigger={"hover"}
                                                defaultVisible={false}                                                
                                                overlay={
                                                    (workspace.name === "Sala Reunión")?
                                                    <span>
                                                       Capacidad: {sc.people_capacity} Personas                                       
                                                    </span>:
                                                    <span>
                                                       Este privado tiene {sc.area} m<sup>2</sup>
                                                    </span>
                                                }>
                                                {html}
                                            </Tooltip>:html      
                                        );
                                    }):null}
                            </div>:null}   
                        </div>);
                    }):null}                	
                </Scrollbar>
            </div>);
	}
}
