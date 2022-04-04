import React, { Component, Fragment } from 'react';
import {Route, Switch} from "react-router-dom";

import Login from './Login';
import Register from './Register';
import ConfirmEmail from './ConfirmEmail';
import PasswordRecover from './PasswordRecover';
import PopupPasswordRecoverForm from './PopupPasswordRecoverForm';
import PopupConfirmEmail from './PopupConfirmEmail';


export default class UserGuest extends Component {
	constructor(props) {
		super(props);
		this.state = {
  			rrss_login_data: null,
  			popupPasswordRecoverForm: null,
  			popupConfirmEmail: null

		};
	}
	setPopupPasswordRecoverForm(popupPasswordRecoverForm) {
		this.setState({popupPasswordRecoverForm})
	}
	setPopupConfirmEmail(popupConfirmEmail) {
		this.setState({popupConfirmEmail})
	}

	render() {
		return (
			<Fragment>
				<Switch>
					<Route exact path="/login">						
						<Login 
							processLogin={this.props.processLogin} 
							toggleMainLoading={this.props.toggleMainLoading}					
							/>
					</Route>			
					<Route exact path="/register">
						<Register 						
							redirect={this.props.redirect}
							toggleMainLoading={this.props.toggleMainLoading}						
						 />
					</Route>	
					<Route exact path="/email_confirmation/:token" render={(data)=>
						<ConfirmEmail 						
							redirect={this.props.redirect}
							token={data.match.params.token}
							toggleMainLoading={this.props.toggleMainLoading}
							setPopupConfirmEmail={this.setPopupConfirmEmail.bind(this)}
						 />
					 }/>
					 <Route exact path="/password_recover/:token" render={(data)=>
						<PasswordRecover 						
							redirect={this.props.redirect}
							token={data.match.params.token}
							toggleMainLoading={this.props.toggleMainLoading}
							setPopupPasswordRecoverForm={this.setPopupPasswordRecoverForm.bind(this)}
						 />
					 }/>
				</Switch>
                {this.state.popupPasswordRecoverForm ? 
                	<PopupPasswordRecoverForm 
						redirect={this.props.redirect}
                		params={this.state.popupPasswordRecoverForm} 
						toggleMainLoading={this.props.toggleMainLoading}
						setPopupPasswordRecoverForm={this.setPopupPasswordRecoverForm.bind(this)}						
						onDismiss={() => this.setPopupPasswordRecoverForm(null)}
                		onConfirm={() => this.props.redirect("/login")} /> 
        			:null
        		}
        		{this.state.popupConfirmEmail ? 
                	<PopupConfirmEmail 
                		params={this.state.popupConfirmEmail} 
						toggleMainLoading={this.props.toggleMainLoading}
						setPopupPasswordRecoverForm={this.setPopupConfirmEmail.bind(this)}						
						onDismiss={() => this.setPopupConfirmEmail(null)}
						onConfirm={() => this.setPopupConfirmEmail(null)} /> 
        			:null
        		}
			</Fragment>
			);
	}
}
