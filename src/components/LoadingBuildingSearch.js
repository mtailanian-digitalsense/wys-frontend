import React, { Component} from "react";
import buildingSearchImg from "../img/building-search.png";

export default class LoadingBuildingSearch extends Component {
    constructor(props) {
      super(props);    
      this.state = {
          done: false
      };
    }
    componentDidMount() {
        setTimeout(()=> this.setState({done: true}), 0);

    }
    render() {
        return (
            <div className={"loading-building-search" + (this.state.done?" done":"")}>
                <img alt="" className="loading-building-search-image" src={buildingSearchImg} />
                <div className="loading-building-search-progress-container">
                    <div className="loading-building-search-progress"></div>

                </div>
                <div className="loading-building-search-text">Buscando...</div>
            </div>
        );
    }
}