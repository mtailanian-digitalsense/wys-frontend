import React, { Component, Fragment } from "react";
import { Link } from "react-router-dom";

import LoadingFull from "../LoadingFull";

import {generateWorkspacesM2, getSpace} from "../../api.js";

import WorkspacesSelect from "../WorkspacesSelect";
export default class ProjectM2SpacesSet2 extends Component {
    constructor(props) {
        super(props);
        this.state = {
            initial_render: true
        };
    }
    componentDidMount() {
        this.generateWorkspaces();
    }
    generateWorkspaces() {
        this.setState({workspaces: "loading"})
        var data = {        
            "collaboration_level": parseInt(this.props.params.collaboration_level),
            "hotdesking_level": parseInt(this.props.params.hotdesking_level),
            "num_of_workers": parseInt(this.props.params.num_of_workers),
            "area": parseInt(this.props.params.area)           
        };
        var min_bathrooms = 0;
        generateWorkspacesM2(data, (error, result)=> {
            if(error) {
                return alert("error");
            }
            if(result) {
                console.log("wtf2-> ",result)
                result.workspaces.forEach((w)=> {
                    w.subcategories.forEach((s) => {
                        let amount = 0;
                        if(s.spaces && s.spaces.length > 0) {
                            s.selectedSpace = s.spaces[0];
                            s.spaces.forEach((sp) => {
                                amount += sp.quantity
                            })
                            s.generated_quantity = amount;
                            s.quantity = amount;
                        } else {
                            s.selectedSpace = null;
                            s.generated_quantity = 0;
                            s.quantity = 0;
                        }
                        if(s.generated_quantity > 0) s.toggled = true;
                        if(s.name === "Baños") {
                            s.spaces.forEach((s)=>{
                                min_bathrooms += s.quantity;
                            });
                            //min_bathrooms = s.selectedSpace.quantity;
                        }
                    });
                });
                
                this.setState({workspaces: result.workspaces, min_bathrooms, initial_render: false}, () => {
                    this.loadSpacesImages();         
                    //this.props.setSpacesArea(this.calculateSpacesArea());

                });
            }
        });
    }
    loadSpacesImages() {
        var spaces_images = [];
        var workspaces = [...this.state.workspaces];
        workspaces.forEach((workspace) => {
            workspace.subcategories.forEach((sub) => {
                sub.spaces.forEach((space) => {
                    spaces_images.push({id: space.id});
                });                
            });                
        });
        this.setState({spaces_images}, () => {
            spaces_images.forEach((space)=> {
                getSpace(space.id, (error, result) => {
                    
                    if(error) return console.log("error cagando space", space, error);
                    this.addSpaceImage(space.id, result.model_3d, result.height*result.width);
                   /*  if(this.props.m2_data) {
                        console.log("get generated-> ", this.props.m2_data)
                        this.props.m2_data.m2_generated_data.workspaces.forEach((saved_ws) => {
                            if(saved_ws.space_id === space.id) {
                                if (space.id === 5885) {
                                    console.log("getSpace-> ", saved_ws)
                                }
                                this.updateSubWorkspaceValues(space.id, saved_ws.quantity);
                            }

                        });
                    } */

                });
            });                   
        });
    }
    updateSubWorkspaceValues(space_id, quantity) {
        var workspaces = [...this.state.workspaces];
        workspaces.forEach(ws=> {
                ws.subcategories.forEach(sws=> {

                    if(sws.selectedSpace.id === space_id) sws.quantity = quantity;
                });
         })
        this.setState({workspaces});
        this.props.setSpacesArea(this.calculateSpacesArea());


    }
    addSpaceImage(space_id, base64_image, area) {
        var spaces_images = [...this.state.spaces_images];
        spaces_images.forEach((space) =>{
            if(space.id === space_id) {
                space.image = base64_image;
                space.area = area;
            }
        });
        this.setState({spaces_images});
    }
    selectSpace(workspace, space) {        
        var workspaces = [...this.state.workspaces];
        workspaces.forEach(ws=> {
            if(ws.id === workspace.main_id) {
                ws.subcategories.forEach(sws=> {
                        if(sws.id === workspace.id) sws.selectedSpace = {id: space};
                });
            }
         })
        this.setState({workspaces});
        this.props.setSpacesArea(this.calculateSpacesArea());
    }
    calculateSpacesArea() {
        var sum = 0;
        this.state.workspaces.forEach(ws=> {
            ws.subcategories.forEach(sws=> {
                    if(sws.toggled) {
                        this.state.spaces_images.forEach((space) => {
                            if(space.id === sws.selectedSpace.id) {
                                sum += ((sws.quantity-sws.generated_quantity)*(space.area?space.area:0));
                            }
                        });
                    } else if(sws.quantity) {
                        this.state.spaces_images.forEach((space) => {
                            if(space.id === sws.selectedSpace.id) {
                                sum += ((sws.quantity)*(space.area?space.area:0));
                            }
                        });
                    }
            });
         })    
        return sum;
    }
    updateSpaceCount(workspace, subcategory, space, count) 
    {
        //console.log("aca", workspace, subcategory, space, count);
        if (count < 0) return;
        if (count === '') count = 0;
        var workspaces = [...this.state.workspaces];
        workspaces.forEach(ws=> {
            if(ws.id === workspace.id) {
                ws.subcategories.forEach(sws=> {
                        if(sws.id === subcategory.id) {
                            if(sws.name === "Baños") {
                                var total = 0; //baños
                                //checkeamos ue no pase el minimo
                                sws.spaces.forEach(s=> {
                                    if(s.id === space.id) {
                                        total += parseInt(count);
                                    } else {
                                        total += s.quantity;
                                    }
                                });
                                if(total < this.state.min_bathrooms) return; //se suspende
                            }
                            let totalQty = 0;
                            sws.spaces.forEach(s=> {
                                    if(sws.name === "Baños") {
                                    }
                                    if(s.id === space.id) s.quantity = parseInt(count);
                                    totalQty += s.quantity;
                            });
                            sws.quantity = parseInt(totalQty);
                        }
                });
            }
         })
        this.setState({workspaces});
        this.props.setSpacesArea(this.calculateSpacesArea());
        

    }
    toggleSubworkspace(workspace) 
    {
        var workspaces = [...this.state.workspaces];
        workspaces.forEach(ws=> {
            if(ws.id === workspace.main_id) {
                ws.subcategories.forEach(sws=> {
                        if(sws.id === workspace.id) sws.toggled = !sws.toggled;
                });
            }
         })
        this.setState({workspaces});
        this.props.setSpacesArea(this.calculateSpacesArea());
        

    }
    save() {
        var workspaces = [...this.state.workspaces];
        //se quitan las subcategorias sin personas seleecionadas
        workspaces.forEach(ws=> {
                ws.subcategories = [...ws.subcategories];/*.filter(sws=> {
                    sws.quantity = sws.quantity;
                    if(sws.selectedSpace) sws.space_id = sws.selectedSpace.id;    

                        return sws.quantity > 0;
                });*/
         });
        //workspaces = workspaces.filter(w=>w.subcategories.length>0);
        this.props.saveM2(workspaces);

    }
    
    render() {
        var project = this.props.project;
        if (project === "loading" || this.state.workspaces === "loading") return <LoadingFull />;
        return (
              <Fragment>
                    <WorkspacesSelect 
                        workspaces={this.state.workspaces}
                        toggleSubworkspace={this.toggleSubworkspace.bind(this)}
                        selectSpace={this.selectSpace.bind(this)} 
                        updateSpaceCount={this.updateSpaceCount.bind(this)}
                        spaces_images={this.state.spaces_images}
                        maxHeight={100}
                    />                    
                    <div className="page-btns-area flex space-between">
                        <Link
                            className="button is-transparent is-rounded is-dark-line"
                            to={"/proyecto/" + (project?project.id:"") + "/calculo_de_area"}>
                            Volver
                        </Link>
                        <Link
                            onClick={() => {this.save()}}
                            className="button is-green is-rounded"
                            to={"#"}>
                            Finalizar
                        </Link>
                    </div>
                </Fragment>
              
        );
    }
}
