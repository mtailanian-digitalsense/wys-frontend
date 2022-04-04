import React from "react";
import logo from "../img/logo-wys.svg";
import HeaderUser from "./HeaderUser.js";
import {Link, Switch, Route} from "react-router-dom";
import iconTape from "../img/icon-tape-measure.svg";
import iconSearch from "../img/icon-home-search.svg";
import iconBlueprint from "../img/icon-blueprint.svg";
import iconCost from "../img/icon-cost.svg";
import iconTime from "../img/icon-time.svg";
import iconTapeBlack from "../img/icon-tape-measure-black.svg";
import iconSearchBlack from "../img/icon-home-search-black.svg";
import iconBlueprintBlack from "../img/icon-blueprint-black.svg";
import iconCostBlack from "../img/icon-cost-black.svg";
import iconTimeBlack from "../img/icon-time-black.svg";
import iconCheck from "../img/check_icon.svg";
import {getProjectInfo} from "../api.js";

export default class Header extends React.Component {

    constructor(props) {
        super(props);
            this.state = {};
    }
    componentDidMount() {
        this.checkProject();
    }
    componentDidUpdate(prevProps) {
        if(prevProps.location.pathname !== this.props.location.pathname) this.checkProject();
    }

    checkProject() {
        var location = this.props.location.pathname;
        var locationArr = location.split("/");

        var id = locationArr[2];
        if(Number.isInteger(parseInt(id))) {
            getProjectInfo(id, (error, result) => {
                if(error) {
                    return console.log("error loading projectinfo", error);
                }
                this.setState({progress: result});
            });   

        }
    }
    render() {



        const props = this.props;
    return (
        <div className="header-site">
            <div className="container header-container">
                <Link to={"/"}>
                    <div className="brand-area">
                        <img className="logo" src={logo} alt="Logo" />
                    </div>
                </Link>
                <Switch>
                    <Route path="/proyecto/:id/:module"
                        render={(data)=> {                      
                            var id = data.match.params.id;  
                            var section = "";
                            if(props.location.pathname.split("calculo_de_area").length > 1) section = "calculo_de_area";
                            if(props.location.pathname.split("busqueda_de_edificio").length > 1) section = "busqueda_de_edificio";
                            if(props.location.pathname.split("layout").length > 1) section = "layout";
                            if(props.location.pathname.split("estimador_de_costos").length > 1) section = "cost";
                            if(props.location.pathname.split("estimador_de_plazos").length > 1) section = "time";
                            var m2Link = "/proyecto/"+ id + "/calculo_de_area"
                             + ((this.state.progress && this.state.progress.m2)!==""?"/done":"");
                             var searchLink = "/proyecto/"+ id + "/busqueda_de_edificio"
                             + ((this.state.progress && this.state.progress.location)!==""?"/done":"");
                             var layoutLink = "/proyecto/"+ id + "/layout"
                             + ((this.state.progress && this.state.progress.layout)!==""?"/done":"");
                             var costLink = "/proyecto/"+ id + "/estimador_de_costos"
                             + ((this.state.progress && this.state.progress.price)!==""?"/done":"");
                             var timeLink = "/proyecto/"+ id + "/estimador_de_plazos"
                             + ((this.state.progress && this.state.progress.time)!==""?"/done":"");
                               return(
                                   <div className={"header-custom-section-links " + section} style={{fontSize: "10px"}}>
                                       <Link className={"header-custom-section-link"+(section==="calculo_de_area"?" active":"")}  
                                            to={m2Link}>                                           
                                           <img alt="" src={section==="calculo_de_area"?iconTape:iconTapeBlack} />
                                            <p>Cálculo de area!</p>
                                            {section==="calculo_de_area"?null:(this.state.progress && this.state.progress.m2)!==""?<img className="done-icon" src={iconCheck} />:null }
                                        </Link>
                                        <Link className={"header-custom-section-link"+(section==="busqueda_de_edificio"?" active":"")} 
                                        to={searchLink}>
                                          <img alt="" src={section==="busqueda_de_edificio"?iconSearch:iconSearchBlack} />

                                            <p>Búsqueda de edificio</p>
                                            {section==="busqueda_de_edificio"?null:(this.state.progress && this.state.progress.location)!==""?<img className="done-icon" src={iconCheck} />:null }
                                        </Link>
                                        <Link className={"header-custom-section-link"+(section==="layout"?" active":"")} 
                                        to={layoutLink}>
                                           <img alt="" src={section==="layout"?iconBlueprint:iconBlueprintBlack} />

                                            <p>Layout</p>
                                            {section==="layout"?null:(this.state.progress && this.state.progress.layout)!==""?<img className="done-icon" src={iconCheck} />:null }
                                        </Link>
                                        <Link className={"header-custom-section-link"+(section==="cost"?" active":"")} 
                                        to={costLink}>
                                           <img alt="" src={section==="cost"?iconCost:iconCostBlack} />

                                            <p>Estimador de Costos</p>
                                            {section==="cost"?null:(this.state.progress && this.state.progress.price)!==""?<img className="done-icon" src={iconCheck} />:null }
                                        </Link>
                                        <Link className={"header-custom-section-link"+(section==="time"?" active":"")} 
                                        to={timeLink}>
                                           <img alt="" src={section==="time"?iconTime:iconTimeBlack} />

                                            <p>Estimador de Plazos</p>
                                            {section==="time"?null:(this.state.progress && this.state.progress.time)!==""?<img className="done-icon" src={iconCheck} />:null }
                                        </Link>
                                    </div>
                                  );
                        }
                    }/>    
                </Switch>
                
                {props.user?<HeaderUser user={props.user} doLogout={props.doLogout} />:null}
            </div>
        </div>
    );
    }
}