import React, { Component, Fragment, useEffect } from "react";
import { Link } from "react-router-dom";
import PopupBuildingDetail from "../PopupBuildingDetail.js";
import Scrollbar from "react-scrollbars-custom";
import { GoogleMap, LoadScript, Marker} from '@react-google-maps/api';
import markerIcon from "../../img/map-marker.png";
import markerRemoveIcon from "../../img/map-marker-remove.png";
import markerActiveIcon from "../../img/map-marker-active.png";
import MultipleSelect from "../MultipleSelect";
import { Range } from 'react-range';
import TooltipIcon from "../TooltipIcon.js";
import PopupCategory from "../PopupCategory.js";
import SearchResultBuilding from "../SearchResultBuilding";
export default class ProjectSearchResults extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }
    
    updateBuildingHover(b, value) {

    }
    
    renderBuildings() {
        if(!this.props.buildings) return null;
        return this.props.buildings.sort((a, b) => a.building.name.toLowerCase() > b.building.name.toLowerCase() ? 1 : -1).map((b, i) => {
            return <SearchResultBuilding 
                        key={b.id}
                        building={b} 
                        selected={b.selected}
                        toggleHover={(value)=>this.updateBuildingHover(b, value)}
                        openBuildingDetails={(building)=>this.setState({buildingDetails: building})}
                        updateBuildingHover={this.props.updateBuildingHover}
                        toggleBuilding={this.props.toggleBuilding} />;
        })
    }   
    renderListFilters() {
      var label ="Categoría";
      if(this.props.classFilterOptions.length === 1) 
        label = this.props.classFilterOptions[0];
      if(this.props.classFilterOptions.length === 2) 
        label = this.props.classFilterOptions[0] + ", " +  this.props.classFilterOptions[1];

      return(
        <div className="project-search-list-filters">
          <p className="category-text">Filtrar por</p>
          <MultipleSelect 
            options={["Clase A", "Clase B", "Clase C"]} 
            selectedOptions={this.props.classFilterOptions}
            toggleOption={this.props.toggleClassFilterOption} label={label} />
           <div className="filter-tooltip-container">
          <TooltipIcon onClick={() => this.setState({categoryPopup: true})} />
          </div>
          <p className="price-text">Rango<br/> de precio</p>
           <div className="filter-range-container">

          <Range                       
              step={this.props.resultsFilter.step} 
              min={this.props.resultsFilter.min} 
              max={this.props.resultsFilter.max}
              values={[this.props.resultsFilter.value]}
              onChange={values => {this.props.setFilterParameter("value", values[0])}}
              renderTrack={({ props, children }) => (
                <div
                  {...props}
                  style={{...props.style}}
                  className="range-track-price-filter"
                >
                  {children}
                </div>
              )}
              renderThumb={({ props, isDragged }) => (
                <div
                  {...props}
                  style={{...props.style}}
                  className={"range-thumb-price-filter"+(isDragged?' dragged':'')}
                >
                <div className="range-label-price-filter">
              {this.props.resultsFilter.value} USD/m<sup>2</sup>
              </div>
            </div>
              )}
            />
            </div>
          <div className="project-search-list-filters-button" onClick={()=> {this.props.applySelectedFilter()}}>Aplicar</div>

        </div>
       );
    } 
    render() {
        var project = this.props.project;
        if (!project || project === "loading") return null;
    
        return (
            <Fragment>
            <div className="heading-content">
                <div className="project-tool-info">
                    <h2 className="tool-name">Búsqueda de edificio</h2>
                    <h1 className="subtool-name">
                        {this.props.buildings?this.props.buildings.length:" - "} inmuebles encontrados
                    </h1>
                    <h2 className="tool-name">Selecciona tus favoritos para compararlos</h2>
                    
                    
                </div>
            </div>
            {this.renderListFilters()}
            <div className="content">
                <div className="building-search-results-columns">
                    <div className="building-search-results-list">
                        <Scrollbar style={{ width: "100%", height: "100%"}}>
                            {this.renderBuildings()}

                        </Scrollbar>
                    </div>
                    <div className="building-search-results-map">
                        <Map buildings={this.props.buildings} toggleBuilding={this.props.toggleBuilding} />
                    </div>
                </div>
                <div className="page-btns-area flex space-between">
                    <Link
                        className="button is-transparent is-rounded is-dark-line"
                        to={"/proyecto/" + (project?project.id:"") + "/busqueda_de_edificio"}>
                        Volver
                    </Link>
                    <Link
                        className="button is-green is-rounded"
                        to={"/proyecto/" + (project?project.id:"") + "/busqueda_de_edificio/comparar"}>
                        Continuar
                    </Link>
                </div>
            </div>
            {this.state.buildingDetails ? (
                    <PopupBuildingDetail
                      building={this.state.buildingDetails}
                        onDismiss={() =>
                            this.setState({ buildingDetails: null })
                        }
                    />
                ) : null}
            {this.state.categoryPopup ? (
                    <PopupCategory
                        onDismiss={() =>
                            this.setState({ categoryPopup: false })
                        }
                    />
                ) : null}
            </Fragment>
        );
    }
}


const containerStyle = {
  height: '400px'
};

const center = { lat: -33.4241548, lng: -70.6141026 };

function Map(props) {
  const [map, setMap] = React.useState(null)
  const onLoad = React.useCallback(function callback(map) {  
    setMap(map);
    updateBounds(map);
  }, []); 
  const onUnmount = React.useCallback(function callback(map) {
    setMap(null)
  }, []);
  useEffect(() => {
      updateBounds(map);
  }, [props.buildings]);
  function updateBounds(map) {
      if(!props.buildings) return;
      if(!window.google) return;
      const bounds = new window.google.maps.LatLngBounds();
      props.buildings.forEach((b) => {
        var building = null;
            if(b.gps_location) building = b;
            else if(b.building && b.building.gps_location) building = b.building;
            if(building) {
              var latlngArray = building.gps_location.split(",");
              var position = {lat: parseFloat(latlngArray[0]), lng: parseFloat(latlngArray[1])};
              bounds.extend(position);
              
            }
      });
        map.fitBounds(bounds);
    setMap(map);
  }
  function renderMarkers() {
        if(!props.buildings) return null;        
        return props.buildings.map((b, i) => {
            var icon = {url: markerIcon};
            if(b.selected) icon.url = markerActiveIcon;
            if(b.selected && b.hover) icon.url = markerRemoveIcon;
            var building = null;
            if(b.gps_location) building = b;
            else if(b.building && b.building.gps_location) building = b.building;
            if(!building) return null;
            var latlngArray = building.gps_location.split(",");
            var position = {lat: parseFloat(latlngArray[0]), lng: parseFloat(latlngArray[1])};
            return (<Marker
              key={b.id}
              position={position}
              icon={icon} 
              onClick={()=>{if(!b.selected) props.toggleBuilding(b)}}
            />);
            
        })
    }     
  return (
    <LoadScript
      googleMapsApiKey="AIzaSyD0p2UYSQf5z10PtOD63wVs8gLbEhxP8FM"
    >
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={10}
        onLoad={onLoad}
        onUnmount={onUnmount}
      >
        { renderMarkers() }
      </GoogleMap>
    </LoadScript>
  )
}