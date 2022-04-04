import React, { Component} from "react";
import Popup from "./Popup.js";
import { GoogleMap,  Marker } from "@react-google-maps/api";
import markerIcon from "../img/map-marker.png";
import ExpandableContent from "./ExpandableContent";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from 'react-responsive-carousel';
import building_placeholder from "../img/img_edificio.jpg";

export default class PopupBuildingDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    render() {
        var b = this.props.building;
        var building = null;
        if(b.building) building = b.building;
        else building = b;
        if(!building) return null;


        var building_images = [];
        if(building.building_images) building_images = building.building_images;
        else if(building.building && 
            building.building.building_images) building_images = building.building.building_images;
        
        var planta = null;
        if(b.image_link) planta = b.image_link;
        else if(b.building && b.building.image_link) planta = b.building.image_link;
        else if(building.floors && building.floors.length>0) planta = building.floors[0].image_link;
        else if(building.building.floors && building.building.floors.length>0) planta = building.building.floors[0].image_link;
        building_images = building_images.filter((b)=>{
            if(b.link && b.link.length) return true;
            return false;
        });
        return (
            <Popup onDismiss={this.props.onDismiss}>
                <div className="popup-heading">
                    <h3>Búsqueda de edificio</h3>
                    <h4>{building.name}</h4>
                </div>
                <div className="popup-columns">
                    <div className="popup-col">
                        <div className="popup-data">
                            {building.building_year?<div className="row">
                                <div className="data-label">
                                    <p>Año del edificio</p>
                                </div>
                                <div className="data">
                                    <p>{building.building_year}</p>
                                </div>
                            </div>:null}
                            {building.elevators_number?<div className="row">
                                <div className="data-label">
                                    <p>Ascensores</p>
                                </div>
                                <div className="data">
                                    <p>{building.elevators_number}</p>
                                </div>
                            </div>:null}
                            {building.total_floors?
                            <div className="row">
                                <div className="data-label">
                                    <p>Total de pisos</p>
                                </div>
                                <div className="data">
                                    <p>{building.total_floors}</p>
                                </div>
                            </div>:null}
                            {building.total_floors?<div className="row">
                                <div className="data-label">
                                    <p>Pisos disponibles</p>
                                </div>
                                <div className="data">
                                    <p>{building.total_floors}</p>
                                </div>
                            </div>:null}
                            {building.parking_number?<div className="row">
                                <div className="data-label">
                                    <p>Estacionamientos disponibles</p>
                                </div>
                                <div className="data">
                                    <p>{building.parking_number}</p>
                                </div>
                            </div>:null}
                            <div className="row">
                                <div className="data-label">
                                    <p>Planta Tipo</p>
                                </div>
                                <div className="data">
                                    <p>{building.planta_tipo?"Sí":"No"}</p>
                                </div>
                            </div>
                            <div className="row">
                                <div className="data-label">
                                    <p>Agilidad de la Administración</p>
                                </div>
                                <div className="data">
                                    <p>{!building.adm_agility?"Normal":""}</p>
                                    <p>{building.adm_agility === "low" ?"Lento":""}</p>
                                    <p>{building.adm_agility === "normal" ?"Normal":""}</p>
                                    <p>{building.adm_agility === "high" ?"Rápido":""}</p>

                                </div>
                            </div>
                            {building.renters.length>0?
                            <div className="row">
                                <div className="data-label">
                                    <p>Empresas Actuales</p>
                                </div>
                                <div className="data">
                                    {building.renters.map((renter) => (
                                        <p>{renter.name}</p>
                                    ))}
                                </div>
                            </div>:null}
                        </div>
                    </div>
                    <div className="popup-col">
                        <div className="media-content">
                            {(!building_images||!building_images.length)?null:<Carousel renderThumbs={()=>null}>
                            {building_images.map((image) => (
                                <img alt="" src={image.link} />
                            ))}
                            </Carousel>}
                            <ExpandableContent
                                title="Ubicación"
                                onChanged={(change) => {
                                    /*alert(change)*/
                                }}
                            >
                                <Map building={building} />
                            </ExpandableContent>
                            <ExpandableContent
                                title="Planta"
                                onChanged={(change) => {
                                    /*alert(change)*/
                                }}
                            >
                                <img alt=""
                                    className="building-detail-popup-planta"
                                    src={
                                        planta                                         
                                    }
                                />
                            </ExpandableContent>
                        </div>
                    </div>
                </div>
            </Popup>
        );
    }
}

const containerStyle = {
    height: "400px",
};



function Map(props) {
    const [map, setMap] = React.useState(null);
    const onLoad = React.useCallback(function callback(map) {
        setMap(map);
    }, []);
    const onUnmount = React.useCallback(function callback(map) {
        setMap(null);
    }, []);

    
    var center = { lat: -33.4241548, lng: -70.6141026 };
    var b = props.building;
    var building = null;
    if(b.gps_location) building = b;
    else if(b.building && b.building.gps_location) building = b.building;
    var latlngArray = b.gps_location.split(",");
    var position = {
        lat: parseFloat(latlngArray[0]),
        lng: parseFloat(latlngArray[1]),
    };
    center = position;
    var icon = { url: markerIcon };
    return (
        
        <GoogleMap
            mapContainerStyle={containerStyle}
            center={center}
            zoom={15}
            onLoad={onLoad}
            onUnmount={onUnmount}
        >
            <Marker key={b.id} position={position} icon={icon} />
        </GoogleMap>
       
    );
}
