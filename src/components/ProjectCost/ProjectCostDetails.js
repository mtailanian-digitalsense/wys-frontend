import React, { Component, Fragment } from "react";
import { Link } from "react-router-dom";
import arrowDownWhite  from "../../img/arrow-down-white.png"

export default class ProjectCostDetails extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selected: null,
            //opened: 2,

        };
    }   
    componentDidMount() {
        this.props.getEstimatedPriceDetail();
    }
    toggleOpened(cost) {
        if(!this.state.opened || this.state.opened !== cost.id) this.setState({opened: cost.id});
       else this.setState({opened: null});
    }
    calculatesubcategoriesTotal(cost) {
        if(!cost.subcategories) return 0;
        var total = 0;
        cost.subcategories.forEach((subcost)=> {
            total += subcost.value;
        });
        return total;
    }
    renderCosts() {
        if(!this.props.costs) return;

        var costs = [
            {
                id: 1,
                name: "Costo de diseño",
                value: this.props.costs.design.value
            },
            {
                id: 3,
                name: "Costo de construcción",
                subcategories: [],
            },
            {
                id: 2,
                name: "Honorarios profesionales",
                subcategories: [],
            }
        ];
        this.props.costs.categories.forEach((cat) => {
            if(cat.code === "BASE" && cat.type !=="B" && cat.name!== "BASE CONSTRUCCIÓN") {
                
                if(cat.subcategories && cat.subcategories.length) {
                    
                    cat.subcategories.forEach(sc=> {
                        costs[2].subcategories.push({name: cat.name + " " + sc.name, value: sc.value*this.props.rate});

                    });
                } else {
                    console.log(cat.name);
                    costs[2].subcategories.push({name: cat.name, value: cat.value*this.props.rate})
                }

            } else {
                    costs[1].subcategories.push({name: cat.name, value: cat.value*this.props.rate})
            }
        });
        var rows = [];
        costs.forEach((cost, i) => {
            var cost_value = 0;
            if(cost.subcategories&&cost.subcategories.length) cost_value = Math.round(this.calculatesubcategoriesTotal(cost));
            else if(cost.value) cost_value = cost.value;
            var  costStyle = "costs-table-cost" + ((this.state.opened === cost.id)?" opened":"");
            if(cost.subcategories && cost.subcategories.length) costStyle += " pointer";
            rows.push(
                <div className={costStyle} onClick={() => this.toggleOpened(cost)}>
                    <strong>{cost.name}</strong> ({this.props.selectedCurrency})
                    <div className="costs-table-cost-total">{
                        /*this.calculatesubcategoriesTotal(cost).toLocaleString("de")*/}
                        {cost_value.toLocaleString("de")} {this.props.selectedCurrency} 
                        
                            {!cost.subcategories?<div className="costs-table-cost-no-arrow"></div>:<div className="costs-table-cost-arrow"><img src={arrowDownWhite}/></div>}
                          
                    </div>
                </div>);
            if(!cost.subcategories) return;
            if(this.state.opened !== cost.id) return;

            rows.push(
                    <div className="costs-table-subcost header">
                        <div className="costs-table-subcost-value"><strong>Tópico</strong></div>
                        <div className="costs-table-subcost-value"><strong>Costos directos</strong> ({this.props.selectedCurrency})</div>
                    </div>);
            var subcategories_rows = [];
            cost.subcategories.forEach((subcost)=> {
                subcategories_rows.push(
                        <div className="costs-table-subcost">
                            <div className="costs-table-subcost-value">{subcost.name}</div>
                            <div className="costs-table-subcost-value">{subcost.value?roundTwoDecimals(subcost.value).toLocaleString("de"):0}</div>
                        </div>);
            });
            rows.push(<div className="flex-1">
            {/*    <Scrollbar style={{ width: "100%", flex: 1, display: "flex"}}>*/}
                <div style={{ width: "100%", flex: 1, display: "flex", flexDirection: "column"}}>{subcategories_rows}</div>
            {/*</Scrollbar>*/}
            </div>);
        });
        return rows;
    }    
    render() {
        var project = this.props.project;
        if (!project || project === "loading") return null;
        return(
        <Fragment>
            
            <div className="content flex-1">
            <div className="costs-table">
             {this.renderCosts()}
             </div>
               
           </div>
               <div className="actions-area  flex space-between">
                    <Link
                            className="button is-transparent is-rounded is-dark-line"
                            to={"/proyecto/" + (project?project.id:"") + "/estimador_de_costos"}>
                            Volver
                        </Link>
                    <div
                        onClick={() => this.props.finish()}                        
                        className={"button is-rounded is-green"}>
                        Finalizar
                   </div>
               </div>
            
            </Fragment>);
    }
}
function roundTwoDecimals(num) {
    return Math.round((num + Number.EPSILON) * 100) / 100;
}