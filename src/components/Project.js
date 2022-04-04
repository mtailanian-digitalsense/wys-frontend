import React, { Component } from 'react';
import {Switch, Route} from 'react-router-dom'; 
import ProjectHome from './ProjectHome.js';
import ProjectM2Done from './ProjectM2/ProjectM2Done.js';
import ProjectSearchDone from './ProjectSearch/ProjectSearchDone.js';
import ProjectLayoutDone from './ProjectLayout/ProjectLayoutDone.js';

import ProjectTimeDone from './ProjectTime/ProjectTimeDone.js';
import ProjectCostDone from './ProjectCost/ProjectCostDone.js';


import ProjectM2 from './ProjectM2/ProjectM2.js';
import ProjectSearch from './ProjectSearch/ProjectSearch.js';
import ProjectLayout from './ProjectLayout/ProjectLayout.js';
import ProjectCost from './ProjectCost/ProjectCost.js';
import ProjectTime from './ProjectTime/ProjectTime.js';


export default class Project extends Component {
	render() {
		return (
			<Switch>
				<Route key={Date.now()} exact path="/proyecto/:id"
	                render={(data)=> {						
 	                  	return(
	                  		<ProjectHome 
                  				project={{id: this.props.project_id}} />);
	                }
	            }/>
	            <Route path="/proyecto/:id/calculo_de_area/done"
	                render={(data)=> {			
	                	var project_id = parseInt(data.match.params.id);  				

 	                  	return(
	                  		<ProjectM2Done
                  				location={this.props.location}
                  				project_id={project_id}
                  				project={{id: this.props.project_id}} />);
	                }
	            }/>	  
	            <Route path="/proyecto/:id/calculo_de_area"
	                render={(data)=> {		
	                	var project_id = parseInt(data.match.params.id);  				

 	                  	return(
	                  		<ProjectM2 
                  				location={this.props.location}
                  				project={{id: this.props.project_id}}
	                  			redirect={this.props.redirect}
	                  			project_id={project_id}
                  				 />);
	                }
	            }/>	 
	            <Route path="/proyecto/:id/busqueda_de_edificio/done"
	                render={(data)=> {			
	                	var project_id = parseInt(data.match.params.id);  				

 	                  	return(
	                  		<ProjectSearchDone
                  				location={this.props.location}
                  				project_id={project_id}
                  				project={{id: this.props.project_id}} />);
	                }
	            }/>	     
	            <Route path="/proyecto/:id/busqueda_de_edificio"
	                render={(data)=> {		
	                	var project_id = parseInt(data.match.params.id);  				
 	                  	return(
	                  		<ProjectSearch
                  				location={this.props.location}
	                  			redirect={this.props.redirect}
                  				project={{id: this.props.project_id}}
                  				project_id={project_id} />);
	                }
	            }/>	    
	            <Route path="/proyecto/:id/layout/done"
	                render={(data)=> {			
	                	var project_id = parseInt(data.match.params.id);  				

 	                  	return(
	                  		<ProjectLayoutDone
                  				location={this.props.location}
                  				project_id={project_id}
                  				project={{id: this.props.project_id}} />);
	                }
	            }/>	     
	            <Route path="/proyecto/:id/layout"
	                render={(data)=> {		
	                	var project_id = parseInt(data.match.params.id);  				
 	                  	return(
	                  		<ProjectLayout
                  				location={this.props.location}
	                  			redirect={this.props.redirect}
                  				project={{id: this.props.project_id}}
                  				project_id={project_id} />);
	                }
	            }/>
	            <Route path="/proyecto/:id/estimador_de_costos/done"
	                render={(data)=> {			
	                	var project_id = parseInt(data.match.params.id);  				

 	                  	return(
	                  		<ProjectCostDone
                  				location={this.props.location}
                  				project_id={project_id}
                  				project={{id: this.props.project_id}} />);
	                }
	            }/>		      
	            <Route path="/proyecto/:id/estimador_de_costos"
	                render={(data)=> {		
	                	var project_id = parseInt(data.match.params.id);  				
 	                  	return(
	                  		<ProjectCost
                  				location={this.props.location}
	                  			redirect={this.props.redirect}
                  				project={{id: this.props.project_id}}
                  				project_id={project_id} />);
	                }
	            }/>	   
	            <Route path="/proyecto/:id/estimador_de_plazos/done"
	                render={(data)=> {			
	                	var project_id = parseInt(data.match.params.id);  				

 	                  	return(
	                  		<ProjectTimeDone
                  				location={this.props.location}
                  				project_id={project_id}
                  				project={{id: this.props.project_id}} />);
	                }
	            }/>	    	            	    
	            <Route path="/proyecto/:id/estimador_de_plazos"
	                render={(data)=> {		
	                	var project_id = parseInt(data.match.params.id);  				
 	                  	return(
	                  		<ProjectTime
                  				location={this.props.location}
	                  			redirect={this.props.redirect}
                  				project={{id: this.props.project_id}}
                  				project_id={project_id} />);
	                }
	            }/>
			</Switch>
		);
	}
}
