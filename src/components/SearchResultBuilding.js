import React, {Component} from 'react';
import building_placeholder from "../img/img_edificio.jpg";


export default class SearchResultBuilding extends Component {
    render() {
        var b = this.props.building;
        var building = {};
        if(b.security_lvl !== undefined) building = b;
        else if(b.building && b.building.security_lvl !== undefined) building = b.building;

         var floor = (building.floors&&building.floors.length)?building.floors[0]:b;
        var mt_value = floor?parseInt(floor.rent_value/floor.m2): "-";
        var building_image = (building.building_images&&building.building_images[0])?building.building_images[0].link:null;
        if(!building_image || building_image === "") building_image = building_placeholder;
        return (
            <div className={"item "+ (this.props.selected?" selected":"") + (building.hover?" hovered":"")}>
                <img className="building-image" src={building_image} alt="" />
                <div className="building-data">
                    <p className="building-class">{building.category}</p>
                    <p className="building-name">{building.name}</p>
                    <p className="building-address">{building.street}</p>
                    <p className="building-rent-value">VALOR RENTA {mt_value} USD/m<sup>2</sup></p>
                    <p className="building-area">AREA {floor.m2} m<sup>2</sup></p>
                </div>
                <div className="building-details-button" onClick={() => this.props.openBuildingDetails(b)}>
                    <p>Ver detalles</p>
                </div>
                <div className="building-toggle">
                   <div 
                             onMouseEnter={()=>{this.props.updateBuildingHover(b, true)}}
                             onMouseLeave={()=>{this.props.updateBuildingHover(b, false)}}
                            onClick={()=>this.props.toggleBuilding(b)} 
                            className={"toggle-circle big"+(this.props.selected?" check":"")} />
                </div>
            </div>
        );
    }
}