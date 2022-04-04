import React, { Component, Fragment } from "react";
import { Switch, Route } from "react-router-dom";
import SectionHeaderSlider from "../SectionHeaderSlider";

import ProjectCostParams from './ProjectCostParams.js';
import ProjectCostDetails from './ProjectCostDetails.js';
import LoadingFull from '../LoadingFull';


import Odometer from 'react-odometerjs';
import PopupCustomArea from '../PopupCustomArea';

import {  getProjectM2Data,getExchange, 
     getProjectPricesCategories, 
     getProjectEstimatedPrice, getProjectEstimatedPriceDetail, 
     generateWorkspacesM2, saveEstimatedPrice, getSavedEstimatedPrice,
     pricesExists, pricesWorkspacesExists, getAvailableCurrencies} from "../../api.js";

export default class ProjectCost extends Component {
    constructor(props) {
        super(props);
        this.state = {        
          total_cost: 0,
          loading: true,
          areaPopup: false,
          selectedCurrency: "USD",
          rate: 1,
          medition_type: 'mt2',
          medition_value: 0,
          medition_original: 0,
          params: {
          },
        };
    }
    componentDidMount() {
        this.props.redirect("/proyecto/" + this.props.project_id + "/estimador_de_costos");
        if(this.props.project && typeof this.props.project !== "string") {
          this.loadData();
         
        }
    }
    componentDidUpdate(prevProps, prevState) {
      if((!prevProps.project ||typeof prevProps.project === "string") && this.props.project && this.props.project.id) {
        this.loadData();   

      }
    }
    loadData2() {
      alert("loading data");
      pricesExists(this.props.project_id, () => {});
      /*
      al cargar la interfaz del estimador de costo y preguntas 
      por esta api, si te devuelve yes es porque ya guardaste un 
      egistro ahí y procedes a hacer el /load/{project_id}; 
      (getSavedEstimatedPrice) 
      en caso de que diga no, haces la carga con el /create*/
      pricesWorkspacesExists(this.props.project_id, () => {});
      //YES OR NO
      /*sabes si el usuario pasó por el modulo m2, 
      Yes =>, haces la carga de workspaces como venías 
      haciéndolo. 
      No =>      
      distinguir 
      si es un proyecto /api/prices/exists/{project_id} == yes 
      o si es no, y seguir según lo establecido en la api anterior.*/
    }
    loadData() {
      getAvailableCurrencies((error, result)=> {
        var currencies = [];
        for(var currency in result) {
          currencies.push(currency);
        }
        this.setState({currencies: currencies}, () => {
            getSavedEstimatedPrice(this.props.project_id, (error, result)=> {
                if(result && result.value) {
                    return this.setState({params: {m2: result.m2},workspaces: result.workspaces, country: result.country, total_cost: result.value, categories: result.categories, loading: false});
                } else {
                  this.loadM2Data((error, m2) => {
    
                    getProjectPricesCategories((error, result) => {
                        if(error) {
    
                        }
                        var categories = result.categories.map((cat)=>{
                            return {...cat, resp:"normal"}
                        });
                        this.setState({categories, areaPopup:m2===0}, () => {
                            this.getEstimatedPrice();
                        });
                    });
                  });
    
                } 
            });
        });
      });
        

        
    }
    loadData3() {
        this.setState({loading: true});
        getSavedEstimatedPrice(this.props.project_id, (error, result)=> {
            var custom_m2 = 0;
            var custom_workspaces = 0;
            if(result && result.value) {
                var custom_m2 = result.m2;
                var custom_workspaces = result.workspaces;
                this.setState({country: result.country, total_cost: result.value, categories: result.categories, loading: false});

            }
            this.loadM2Data((error, saved_m2, saved_workspaces) => {
              this.setState({params: {m2: saved_m2?saved_m2:custom_m2}, workspaces: saved_workspaces?saved_workspaces:custom_workspaces });
              getProjectPricesCategories((error, result) => {
                  if(error) {

                  }
                  var categories = result.categories.map((cat)=>{
                      return {...cat, resp:"normal"}
                  });
                  this.setState({categories}, () => {
                      this.getEstimatedPrice();
                  });
              });
            });

            
        });

        
    }
    loadM2Data2(cb) {
        getProjectM2Data(this.props.project.id, (error, result)=> {
            if(error) { 
                console.log("ERROR", error);
                   return this.setState({areaPopup: true});
                   //if(!this.state.params.m2) this.setParameter("m2", 600);
                  //return cb();
                }
                else if(result) {
                    var m2 = Math.round(result?result.m2_generated_data.area:0);
                    this.setParameter("m2", m2);
                    var data = {        
                        "collaboration_level": 40,
                        "hotdesking_level": 85,
                        "num_of_workers": Math.round(m2/6.4),
                        "area": m2
                    };
                    generateWorkspacesM2(data, (error, result)=> {            
                        if(error) {
                          cb(error);
                          return console.log("error obteniendo m2 values");
                        }
                        var workspaces = [];
                        //result.workspaces.map((w, i)=>{return {...w, space_id: w.subcategories[0].spaces[0].id }});
                        result.workspaces.forEach((w, i)=>{
                            workspaces = workspaces.concat(w.subcategories);
                            
                        });
                        workspaces = workspaces.map((w, i) => {
                            return {...w, space_id: w.spaces[0].id, quantity: 1}
                        });
                            cb(null, m2, workspaces);
                    });
                    return cb();
                } else {

                  cb();

                }
                //alert("error inesperado");

        });
    }
    loadM2Data(cb) {
        getProjectM2Data(this.props.project.id, (error, result)=> {
            if(error || !result) { 
                console.log("ERROR", error);
                   this.setState({workspaces: []});
                   if(!this.state.params.m2) this.setParameter("m2", 0);
                  return cb(null, 0);
                }
                else if(result) {
                    var m2 = Math.round(result.m2_generated_data.area);
                    this.setState({medition_original: result.m2_generated_data.area})
                    this.setParameter("m2", m2);
                    var data = {        
                        "collaboration_level": 40,
                        "hotdesking_level": 85,
                        "num_of_workers": Math.round(m2/6.4),
                        "area": m2
                    };
                    generateWorkspacesM2(data, (error, result)=> {            
                        if(error) return console.log("error obteniendo m2 values");
                        var workspaces = [];
                        //result.workspaces.map((w, i)=>{return {...w, space_id: w.subcategories[0].spaces[0].id }});
                        result.workspaces.forEach((w, i)=>{
                            workspaces = workspaces.concat(w.subcategories);
                            
                        });
                        workspaces = workspaces.map((w, i) => {
                            return {...w, space_id: w.spaces[0].id, quantity: 1}
                        });
                        this.setState({workspaces}, ()=> {
                            cb();
                        });
                    });
                    return cb();
                } else {
                  cb();

                }
                //alert("error inesperado");

        });
    }
      
    finish() {
      this.setState({loading: true});
      var data = {
            "project_id": this.props.project.id,
          "categories": this.state.categories.map((cat)=>{
            return cat;
          }),
          "m2": this.state.params.m2?this.state.params.m2:0,
          "value": this.state.total_cost, 
          "country": "CHILE",
          "workspaces": this.state.workspaces
        };
      saveEstimatedPrice(data, (error, result) => {
        this.props.redirect("/proyecto/"+this.props.project.id+"/estimador_de_costos/done");
      });
    } 
    updateCategoryResp(cat, resp) {
        var categories = [...this.state.categories];
        var new_cat = null;
        var i_cat = null;
        categories.forEach((_cat, i) => {
            if(cat.id === _cat.id) {
                i_cat = i;
                new_cat = {..._cat, resp};
            }
        });
        categories[i_cat] = new_cat;
        this.setState({categories}, () => {
            this.getEstimatedPrice();
        });
    }
    getEstimatedPrice() {
        this.setState({loading: true});

        var data = {
          "categories": this.state.categories.map((cat)=>{
            return cat;
          }),
          "m2": this.state.params.m2?this.state.medition_type === "ft2" ? Math.round(this.state.params.m2 / 10.764) : this.state.params.m2 :0,
          "country": "CHILE",
          "workspaces": this.state.workspaces
        };
        getProjectEstimatedPrice(data, (error, result) => {
            if(error) {
                return console.log("error", error);
            }
            this.setState({total_cost: result.value, loading: false});
        });
    }
    getEstimatedPriceDetail2() {
      
      var result = {"categories":
      this.state.categories,
      "country":"CHILE",
      "design":{"id":16,"name":"COSTOS DE DISENO","value":20.0},
      "m2":913.319,"value":9203436.1197875,
      };

     
            this.setState({detail: result});
        
    }
    getEstimatedPriceDetail() {
        if(!this.state.categories) return;
        this.setState({loading: true});

        var data = 
        {
          "categories": this.state.categories.map((cat)=>{
            return cat;
          }),
          "m2": this.state.params.m2?this.state.params.m2:0,
          "country": "CHILE",
          "workspaces": this.state.workspaces
        };
        getProjectEstimatedPriceDetail(data, (error, result) => {
            if(error) {
                return console.log("error", error);
            }
            this.setState({detail: result, loading: false});
        });
    }
    setParameter(parameter, value, cb) {
        var params = { ...this.state.params };
        params[parameter] = value;
        this.setState({ params }, cb);
    }
    calculateCostsTotal() {
        return this.state.total_cost*this.state.rate;
        /*if(!this.state.costs) return 0;
        var total = 0;
        this.state.costs.forEach((cost)=> {
            total += this.calculateSubcostsTotal(cost);

        });
        
        return total;*/
    }
    calculateSubcostsTotal(cost) {
        if(!cost.subcosts) return 0;
        var total = 0;
        cost.subcosts.forEach((subcost)=> {
            total += subcost.value;
        });
        return total*this.state.rate;
    }
    averageCost() {
        if(!this.state.total_cost || !this.state.params.m2) return 0;
        return this.state.rate*this.state.total_cost/parseInt(this.state.params.m2);
    }
    newM2Value(value) {
        this.setState({loading: true});

        this.setParameter("m2", parseInt(value), ()=> {
            var data = {        
                "collaboration_level": 40,
                "hotdesking_level": 85,
                "num_of_workers": Math.round(value/6.4),
                "area": parseInt(value)           
            };
            generateWorkspacesM2(data, (error, result)=> {            
                if(error) return console.log("error obteniendo m2 values");
                var workspaces = [];
                //result.workspaces.map((w, i)=>{return {...w, space_id: w.subcategories[0].spaces[0].id }});
                result.workspaces.forEach((w, i)=>{
                    workspaces = workspaces.concat(w.subcategories);
                    
                });
                workspaces = workspaces.map((w, i) => {
                    return {...w, space_id: w.spaces[0].id, quantity: 1}
                });
                this.setState({workspaces}, ()=> {
                    this.getEstimatedPrice();
                    //return this.setParameter("m2", Math.round(result.area), );

                });
            });

        });
    }    
    renderCurrencies() {
      var options = [];
        if(!this.state.currencies) return options;
        this.state.currencies.forEach((currency) => {
            options.push(<option key={currency} value={currency}>{currency}</option>);
        });
        return options;
    }
    changeCurrency(currency) {
      
      this.setState({selectedCurrency: currency});
      getExchange(currency, (error, result) => {
        this.setState({rate: result.rate});
      });
    }
    render() {
        var project = this.props.project;
        if (!project || project === "loading") return null
        //if(this.state.loading) return <LoadingFull />;

        
        return (
            <Fragment>
                {this.state.loading?<LoadingFull />:null}
                <SectionHeaderSlider
                    section="cost"
                    options={[
                        "/proyecto/" + project.id + "/estimador_de_costos",
                        "/proyecto/" + project.id + "/estimador_de_costos/details"
                    ]}
                    selectedOption={this.props.location.pathname}
                />
                <div className="main-content-logged cost">   
                    <div className="heading-content"  style={{flex: 0}}>
                        <div className="project-tool-info">
                            <h2 className="tool-name">Estimador de costo total</h2>                
                            <Switch>
                              <Route exact path="/proyecto/:id/estimador_de_costos">
                                        <h1 className="subtool-name">
                                            CÁLCULO DE COSTO TOTAL
                                        </h1>
                              </Route>
                              <Route exact path="/proyecto/:id/estimador_de_costos/details">
                                        <h1 className="subtool-name">
                                            Detalle de costo
                                        </h1>
                              </Route>
                          </Switch>
                            
                        </div>   
                        <div className="m2-heading-area">
                              <div className="inline-block float-right margin-right-50">
                                  <p className="uppercase">Costo total</p>
                                  <Odometer value={parseInt(this.calculateCostsTotal())} format="(.ddd),dd" /> 
                                    <select className="select-input" style={{marginLeft: 20}} value={this.state.selectedCurrency} 
                                    onChange={(e) => {
                                        this.changeCurrency(e.target.value);
                                    }}>
                                        {this.renderCurrencies()}
                                    </select>
                              </div>
                        </div>
                                
                    </div>
                    <div className="heading-content"  style={{flex: 0}}>
                        <div className="m2-heading-area">
                            <div className="inline-block float-right margin-right-50 pointer" onClick={()=>{this.setState({areaPopup: true})}}>
                                <p className="uppercase">Area estimada</p>
                                <Odometer value={this.state.params.m2?Math.round(this.state.params.m2):0} format="(.ddd),dd" /> 
                                <p className={"mts"}>({this.state.medition_type === "ft2" ? "ft" : "m"}2)</p>
                                <p className="mts-modify-legend">Click para modificar</p>
                            </div>
                          </div>  
                        <div className="m2-heading-area">
                          <div className="inline-block float-right margin-right-50">
                                  <p className="uppercase">Costo Estimado {this.state.medition_type === "ft2" ? "ft" : "m"}<sup>2</sup></p>
                                  <Odometer value={parseInt(this.averageCost())} format="(.ddd),dd" /> 
                                  <p className={"mts uppercase"} style={{marginLeft: "20px", marginRight: "26px"}}>{this.state.selectedCurrency}</p>
                           </div>
                        </div>
                        
                    </div>                 
                    <Switch>
                        <Route exact path="/proyecto/:id/estimador_de_costos"
                          render={(data)=> {                
                              return(
                                  <ProjectCostParams     
                                      categories={this.state.categories}
                                      updateCategoryResp={this.updateCategoryResp.bind(this)}
                                      project={project} />
                                  );
                          }
                        }/>
                        <Route exact path="/proyecto/:id/estimador_de_costos/details"
                          render={(data)=> {                
                              return(
                                  <ProjectCostDetails   
                                      costs={this.state.detail? this.state.detail:null}
                                      finish={this.finish.bind(this)}
                                      getEstimatedPriceDetail={this.getEstimatedPriceDetail.bind(this)}
                                      rate={this.state.rate}
                                      selectedCurrency={this.state.selectedCurrency}
                                      project={project} />
                                  );
                          }
                        }/>  
                    </Switch>
                </div>
                {this.state.areaPopup ? (
                    <PopupCustomArea
                        currentValue={Math.round(this.state.params.m2)}
                        project_id={project.id}
                        onChangeMedition={(type, val) => this.setState({medition_type: type})}
                        meditionType={this.state.medition_type}
                        onDismiss={(value) => {
                            if(value) {
                                this.newM2Value(this.state.meditionType === "ft2" ? Math.round(value / 10.764) : value);
                                
                            }
                            this.setState({ areaPopup: false });
                        }
                        }
                    />
                ) : null}
                 
            </Fragment>
                
        );
    }
}
