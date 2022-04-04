import { Component } from 'react';
import {confirmEmail} from '../../api.js';
export default class ConfirmEmail extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}
	componentDidMount() {
		this.props.toggleMainLoading(true);
		confirmEmail(this.props.token, (error, result)=> {
			this.props.toggleMainLoading(false);			
			this.props.redirect("/login");
            if (error) {                
                return this.props.setPopupConfirmEmail({step: "error", failedMessage: "Error inesperado, vuelva a intentar más tarde"});
            }
            if(result.status_code === 1005) {
                return this.props.setPopupConfirmEmail({step: "error", failedMessage: "El código de verificación es invalido"});                    
            }          
            
			this.props.setPopupConfirmEmail({step: "ok"});
			
		});
	}
	render() {
		return null;
	}
}
