import React, { Component } from 'react';
import {Route, Switch, Redirect} from "react-router-dom";
import Home from './Home.js';
import Project from './Project.js';
import CompareProjects from "./CompareProjects";
export default class UserLogged extends Component {	
	constructor(props) {
		super(props);
		this.state = {
		};
	}
	
	
	render() {
		return (	          
			<Switch>          
	            <Route key={Date.now()} exact path="/inicio"
	                render={(data)=> {
	                  	return( 
	                  		<Home 
	                  			redirect={this.props.redirect}
                            	toggleMainLoading={this.props.toggleMainLoading}
	                  			 />);
	                }
	            }/>
	            <Route key={Date.now()} exact path="/inicio/comparar"
	                render={(data)=> {
	                  	return( 
	                  		<CompareProjects
	                  			redirect={this.props.redirect}
                            	toggleMainLoading={this.props.toggleMainLoading}
	                  			 />);
	                }
	            }/>
	            <Route path="/proyecto/:id"
	                render={(data)=> {
						var project_id = parseInt(data.match.params.id);  
						
 	                  	return(
	                  		<Project 
	                  				project_id={project_id}
	                  			redirect={this.props.redirect}
                  				location={this.props.location}
                  				 />);
	                }
	            }/>	            
	            <Route path="*">
		                <Redirect to={"/inicio"} />
		        </Route>	             
    		</Switch>	          
		);
	}
}