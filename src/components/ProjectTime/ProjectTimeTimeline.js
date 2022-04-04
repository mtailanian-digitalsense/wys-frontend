import React, { Component, Fragment } from "react";
import { Link } from "react-router-dom";
import Odometer from 'react-odometerjs';
import Scrollbar from "react-scrollbars-custom";
import SimpleSelect from "../SimpleSelect";
import arrowDownBlack from "../../img/arrow-down-black.png";

var block_width = 55 + 2;
var orders = [
    //{singular: "día", plural: "días", factor: 1},
    {singular: "semana", plural: "semanas", factor: 1},
    {singular: "mes", plural: "meses", factor: 1/4}

];

export default class ProjectTimeTimeline extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selected: null,
            filter_type: {singular: "mes", plural: "meses", factor: 1/4}
        };

    }   
    componentDidMount() {
        this.props.calculateTimeDetailed();
        window.addEventListener("resize", this.updateHeight.bind(this));
        this.updateHeight();
    }
    componentDidUpdate(prevProps) {
        if(this.props.tasks !== prevProps.tasks) this.updateHeight();
    }
    getBlocksNumber(factor) {
        if(!factor) factor = this.state.filter_type.factor;
        if(!this.props.tasks) return 0;        
        var blocks_number = 0;
        this.props.tasks.forEach((task)=> {
            if(!task.subtasks) return;
            task.subtasks.forEach((stask)=> {
                if(stask.end_day > blocks_number) blocks_number = stask.end_day;
            });
        });
        return blocks_number*factor;

    }
    getTaskMinBlock(task) {
        var value = null;
        task.subtasks.forEach((stask)=> {
            if(value===null || stask.start_day < value) value = stask.start_day;
        });
        return value;
    }
    getTaskMaxBlock(task) {
        var value = 0;
        task.subtasks.forEach((stask)=> {
            if(stask.end_day > value) value = stask.end_day;
        });
        return value;

    }
    generateHeaderBlocks(num, blockName) {
        var blocks = [];
        for(var i = 0; i<num;i++) {
            blocks.push(
            <div key={i} className="time-timeline-row-block" style={this.state.full?null:{width: this.getBlockWidth()}}>
                <div className="block-name">{blockName}</div>
                <div className="block-num">{i+1}</div>
                
            </div>);
        }
        return blocks;
    }
    generateBlocks(num) {
        var blocks = [];
        for(var i = 0; i<num;i++) {
            blocks.push(<div key={i} className="time-timeline-row-block" style={this.state.full?null:{width: this.getBlockWidth()}}></div>);
        }
        return blocks;
    }
    generateRowBar(start, end, is_milestone) {
        //start = start*this.state.filter_type.factor;
        //end = end*this.state.filter_type.factor;
        //var width = (this.getBlocksNumber()*(this.state.full?block_width:this.getBlockWidth()));
        var width = (this.state.full?block_width:(this.getBlockWidth()+3));
        var left = start===0?0:(start)*width;
        width = (end - start)*width; 
        left = left*this.state.filter_type.factor;
        width = width*this.state.filter_type.factor + 2;

        return (<div className={"time-timeline-row-bar" + (is_milestone? " milestone": "")} style={{left, width: is_milestone?null:width }}></div>);
    }
    updateHeight() {
       const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0)*0.8;
       this.setState({hide: true, height: 0, width: 0}, () => {
            var total = 235 + (this.getBlocksNumber()*(block_width));
           this.setState({ height: this.div.clientHeight, width: this.div.clientWidth, hide:false, full: ((vw - total)<100) }, () => {

           });
       });
    }   
    renderTimeline(scrollbarWidth) {
        if(!this.props.tasks) return null;

        var blocks_number = this.getBlocksNumber();
        var rows = [];
        this.props.tasks.forEach((task)=> {            
            if(!task.subtasks) return;
            var start_day = this.getTaskMinBlock(task);
            var end_day = this.getTaskMaxBlock(task);
            rows.push(
                <div key={task.id} className="time-timeline-row pointer" style={{width:scrollbarWidth}} onClick={()=>{this.props.toggleExpandedTask(task)}}>
                    <div className="time-timeline-row-block time-timeline-row-name"><p>{task.name}</p>
                    <div className={"timeline-arrow" + (task.expanded?" expanded":"")}><img src={arrowDownBlack}/></div>

                    </div>
                    <div className="time-timeline-row-blocks">
                        {this.generateBlocks(blocks_number)}
                        {this.generateRowBar(start_day, end_day)}                        
                    </div>

                </div>
            );
            if(task.expanded) {
            task.subtasks.forEach((stask)=> {

               rows.push(
                <div key={task.id+"-"+stask.id} className="time-timeline-row subtask"  style={{width:scrollbarWidth}}>
                    <div className="time-timeline-row-block time-timeline-row-name"><p>{stask.name}</p></div>
                    <div className="time-timeline-row-blocks">
                        {this.generateBlocks(blocks_number)}
                        {this.generateRowBar(stask.start_day, stask.end_day, stask.is_milestone)}

                    </div>
                </div>
            );
            });
            }
        });
        return (
            <div className="time-timeline">
                <div className="time-timeline-row time-timeline-header-row"  style={{width:scrollbarWidth}}>
                    <div className="time-timeline-row-block time-timeline-row-name"><p>
                        Resumen del proceso<br/>
                        Semanal de los proyectos

                    </p></div>
                    <div className="time-timeline-row-blocks">
                        {this.generateHeaderBlocks(blocks_number, this.state.filter_type.singular)}
                    </div>

                </div>
                {rows}
            </div>
        );

    }
    getBlockWidth() {
         const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0)*0.8;
        return ((vw - 235)/this.getBlocksNumber())-4;
    }
    render() {
        var project = this.props.project;
        if (!project || project === "loading") return null;
        var scrollbarWidth = 235 + (this.getBlocksNumber()*(this.state.full?block_width:(this.getBlockWidth()+2)));
        return (
            <Fragment>
            <div className="heading-content"  ref={ div => { this.div = div; } }>
                <div className="project-tool-info">
                    <h2 className="tool-name">Estimador de plazos</h2>                
                    <h1 className="subtool-name">
                        Estimador de plazos
                    </h1>
                </div>               
                <div className="m2-heading-area">         
                      <div className="inline-block float-right margin-right-50">
                          <p className="uppercase">Plazo del proyecto</p>
                          <Odometer value={this.props.weeks*this.state.filter_type.factor} format="(.ddd),d" /> 
                          <p className={"mts uppercase"}>{this.state.filter_type.plural}</p>
                      </div>
                  <div className="inline-block float-right margin-right-50">

                    <p className="category-text uppercase">Ver plazos por</p>
                  <SimpleSelect 
                    options={orders} 
                    labelAttr="singular"                    
                    selected={this.state.filter_type}
                    className="inline-block"
                    toggleOption={(option)=>{this.setState({filter_type: option}, () => {this.updateHeight()})}} label={this.state.filter_type?this.state.filter_type.singular:"Seleccionar"} />
                    </div>
                    </div>
            </div>
            <Scrollbar className="timeline-scroll" style={{ width: "80%", maxWidth: "80%", display: "flex", flex: 1, margin: "0 auto"}}>
            	{this.renderTimeline(scrollbarWidth)}
            </Scrollbar>
               
                <div className="actions-area  flex space-between">
                    <Link
                            className="button is-transparent is-rounded is-dark-line"
                            to={"/proyecto/" + (project?project.id:"") + "/estimador_de_plazos"}>
                            Volver
                        </Link>
                    <div
                        onClick={() => this.props.finish()}                        
                        className={"button is-rounded is-green"}>
                        Finalizar
                   </div>
               </div>
            
            </Fragment>

              
        );
    }
}