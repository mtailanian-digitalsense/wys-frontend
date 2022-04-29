import React, { Component, Fragment } from "react";
import { Link } from "react-router-dom";
import { ChromePicker } from 'react-color';
import moveIconWhite from '../../img/layout-tools-move-white.svg';
import moveIconBlack from '../../img/layout-tools-move-black.svg';
import zoneIconWhite from '../../img/layout-tools-zone-white.svg';
import zoneIconBlack from '../../img/layout-tools-zone-black.svg';
import editIconWhite from '../../img/layout-tools-edit-white.svg';
import editIconBlack from '../../img/layout-tools-edit-black.svg';
import {getSpacesCategories} from "../../api.js";  
import Scrollbar from "react-scrollbars-custom";
import {getProjectInfo, getProjectM2ByFloor} from "../../api.js";

var PolyBool = require('polybooljs');
export default class ProjectLayoutPositions extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dragged: null,
            draggingStart: null,
            lastMove: null,
            tool: "zoning", //zoning //moving //modify
            subMenuDelta:0,
            MenuWithChromeH:390,
            MenuWithScrollH:290,
            sidebarM2:null,
            sidebarM2People:null,
            show_workers:true,
        };
    }
    componentDidMount() {
      //this.context = this.canvas.getContext('2d');
      if(this.props.generated_layout) {
        getSpacesCategories(this.props.generated_layout, (error, result) => {
          this.setState({categories: result});

        });
        var img = new Image();
        img.src = this.props.generated_layout.selected_floor.image_link;
        img.onload = () => {
         this.setState({layout_dimensions: {width: img.width, height: img.height}});
        }        
      }
      this.sidebarM2Data();
      this.startMoveContext();
    }
    componentWillUnmount() {
        this.endMoveContext();
    }
    componentDidUpdate(prevProps) {
      if(this.canvas) this.drawCanvasDEFINITIVO();
      if(this.props.generated_layout && !prevProps.generated_layout) {
        getSpacesCategories(this.props.generated_layout, (error, result) => {
          this.setState({categories: result});

        });
      }
      console.log('LOG', this.state, this.props);
    }
    sidebarM2Data() {
        if(this.state && !this.state.sidebarM2 && Number.isInteger(parseInt(this.props.project.id))) {
            getProjectInfo(this.props.project.id, (error, result) => {
                if(error) {
                    this.setState({sidebarM2: ''});
                    setTimeout(this.sidebarM2Data, 1000);
                    return;
                }
                this.setState({projectData: result});
                if(this.state.projectData.m2){
                  this.setState({sidebarM2: this.state.projectData.m2});
                }else{
                  getProjectM2ByFloor(this.props.project.id, (error, result) =>{
                    this.setState({show_workers: false});
                    if(!error && result.m2){
                      this.setState({sidebarM2: result.m2});
                    }
                  })
                }
            });
        }
    }

    startMoveContext() {
      window.addEventListener("mouseup", (e) => {
           if(!this.state.dragged) return;
           var space = this.state.dragged;
           var proportion = this.getProportion();
           var moveDiffX =  this.state.lastMove.x - this.state.draggingStart.x;
           var moveDiffY =  this.state.lastMove.y - this.state.draggingStart.y;
           var x = space.position_x + (moveDiffX/proportion);
           var y = space.position_y + (moveDiffY/proportion);
           var new_position = {x: x, y: y}; 
           //ACA SE DEBE CHECKEAR SI COLISIONA
           var collision = false;
           this.props.generated_layout.workspaces.forEach((space, i) => {
              if(space.id === this.state.dragged.id) return;
              var relative_pos_x = space.position_x - (space.width/2);
             var relative_pos_y = space.position_y - (space.height/2);
             var x = relative_pos_x;
             var y =relative_pos_y;

              var d_relative_pos_x = this.state.dragged.position_x - (this.state.dragged.width/2);
              var d_relative_pos_y = this.state.dragged.position_y - (this.state.dragged.height/2);
              var d_x = d_relative_pos_x + (moveDiffX/proportion);
              var d_y = d_relative_pos_y + (moveDiffY/proportion);

              if(collisionDetection(
                {...space, position_x: x, position_y: y}, 
                {...this.state.dragged, position_x: d_x, position_y: d_y})) 
                collision = true; 
           });
           if(layoutCollisionDetection(this.state.dragged, this.props.generated_layout.floor_elements, this.getProportion(), moveDiffX, moveDiffY)) collision = true;   
           if(!collision) this.props.updateSpacePosition(this.state.dragged.id, new_position);
           this.setState({dragged: null, lastMove: null, draggingStart: null});
        });
        window.addEventListener("mousemove", (e) => {
           if(!this.state.dragged) return;
           this.setState({lastMove: {x: e.clientX, y: e.clientY}});
        });
        this.updateHeight();
        window.addEventListener("resize", this.updateHeight.bind(this));
    }
    filterReplacementsContext(space, orig_items){
      let items  = JSON.parse(JSON.stringify(orig_items));;
      var proportion = this.getProportion();
      items.subcategories = items.subcategories.filter((item, k) => {
        var collision = false;
        var item_space = item.spaces[0];
        this.props.generated_layout.workspaces.forEach((workspace, i) => {
          if(workspace.id === space.id) return;
          var x = workspace.position_x - (workspace.width/2);
          var y = workspace.position_y - (workspace.height/2);
          var d_x = space.position_x - (item_space.width/2);
          var d_y = space.position_y - (item_space.height/2);

          if(collisionDetection(
            {...workspace, position_x: x, position_y: y}, 
            {...space, height: item_space.height, width: item_space.width, position_x: d_x, position_y: d_y})){
            collision = true;
            return; 
          }
        });

        if(layoutCollisionDetection({...space, height: item_space.height, width: item_space.width}, this.props.generated_layout.floor_elements, proportion, 0, 0)) collision = true;
        return !collision;
      });
      return items;
    }
    endMoveContext() {
       //window.removeEventListener("resize");
       //window.removeEventListener("mouseup");
       //window.removeEventListener("mousemove");
       console.log("cerrados los eventos");

    }    
    updateHeight() {
       this.setState({hide: true, height: 0, width: 0}, () => {
           this.setState({ height: this.div.clientHeight, width: this.div.clientWidth, hide:false }, ()=> {
            const canvas = document.getElementById('mycanvas');
            if(!canvas) return;
             var context = canvas.getContext('2d');
            context.canvas.width = this.div.clientWidth;
            context.canvas.height = this.div.clientHeight;
           });
       });
    }   
    rotateSpace(rotating_space) {
      var new_rotation = "90";
      if(rotating_space.rotation === "90") new_rotation = "180";
      else if(rotating_space.rotation === "180") new_rotation = "270";
      else if(rotating_space.rotation === "270") new_rotation = "0";

      var collision = false;
      this.props.generated_layout.workspaces.forEach((space, i) => {
          if(space.id === rotating_space.id) return;
          var relative_pos_x = space.position_x - (space.width/2);
          var relative_pos_y = space.position_y - (space.height/2);
          var x = relative_pos_x;
          var y =relative_pos_y; 
          var d_relative_pos_x = rotating_space.position_x - (rotating_space.width/2);
          var d_relative_pos_y = rotating_space.position_y - (rotating_space.height/2);
          var d_x = d_relative_pos_x;
          var d_y = d_relative_pos_y;

          if(collisionDetection(
            {...space, position_x: x, position_y: y}, 
            {...rotating_space, position_x: d_x, position_y: d_y, rotation: new_rotation})) collision = true;
       });
        if(layoutCollisionDetection({...rotating_space, rotation: new_rotation}, this.props.generated_layout.floor_elements, this.getProportion(), 0, 0)) collision = true;

       if(!collision) this.props.rotateSpace(rotating_space.id);
       else alert("El lugar es muy pequeño para rotar el espacio");
    }
    renderSpaces(proportion) {
       var moveDiffX = 0;
       if(this.state.dragged) moveDiffX =  this.state.lastMove.x - this.state.draggingStart.x;
       var moveDiffY = 0;
       if(this.state.dragged) moveDiffY =  this.state.lastMove.y - this.state.draggingStart.y;
       return this.props.generated_layout.workspaces.map((space, i) => {
           var dragged = this.state.dragged && this.state.dragged.id === space.id;
           var relative_pos_x = space.position_x - (space.width/2);
           var relative_pos_y = space.position_y - (space.height/2);
           var x = dragged? relative_pos_x + (moveDiffX/proportion):relative_pos_x;
           var y =dragged? relative_pos_y + (moveDiffY/proportion):relative_pos_y;
           var selected = this.state.selected&& this.state.selected.id === space.id;
           var collision = false;
           if(this.state.dragged
            && !dragged ) {
              var d_relative_pos_x = this.state.dragged.position_x - (this.state.dragged.width/2);
              var d_relative_pos_y = this.state.dragged.position_y - (this.state.dragged.height/2);
              var d_x = d_relative_pos_x + (moveDiffX/proportion);
              var d_y = d_relative_pos_y + (moveDiffY/proportion);
              if(collisionDetection({...space, position_x: x, position_y: y}, {...this.state.dragged, position_x: d_x, position_y: d_y})) collision = true;

           }

           return (
            <Fragment key={i+"_"+space.id}>
               <div  
               className={
                "layout-positions-space no-select" 
                + (dragged?" dragged":"") 
                + (selected?" selected":"") 
                + (this.state.tool==="zoning"?" zoning":" moving") 

                + " rotate-" + space.rotation}
               onMouseDown={(e) => {
                if(this.state.tool !== "moving") return;
                this.setState({
                   dragged: space, 
                   draggingStart: {x: e.clientX, y: e.clientY},
                   lastMove: {x: e.clientX, y: e.clientY}})}}
                onClick={(e)=> {
                if(this.state.tool === "modify"){
                  let menuH = this.state.MenuWithScrollH; //altura menu scroll
                  let layoutH = this.state.layout_dimensions.height*proportion;
                  this.setState({
                    subMenuDelta: layoutH<=menuH?-y*proportion:(y*proportion <= layoutH-menuH?0:(layoutH-menuH)-y*proportion),
                  })
                }else{
                  this.setState({
                   subMenuDelta: 0,
                  });
                }
                if(this.state.tool !== "zoning" && this.state.tool !== "modify") return;
                this.setState({
                 selected: space,
                 show_colorpicker: false   
                 });
              }}
               style={{
                   backgroundImage: collision?undefined:'url('+ space.image + ')',
                   backgroundColor: collision?"red":undefined,

                   left: x *proportion,
                   top: y*proportion,
                   width: space.width * proportion,
                   height: space.height* proportion,
                   borderColor: this.state.tool==="zoning"?(space.color.length===6?"#"+space.color:space.color):undefined
                   //transform: "rotate(" + space.rotation + "deg)"
                }} >
                  <div className={"layout-positions-space-rotate"} 
                    onClick={(e)=>{
                      e.stopPropagation();
                      e.preventDefault();
                      this.rotateSpace(space)}}></div>
                </div>
                {!selected?null:
                  <div className="zoning-popup"
                    style={{
                       left: x *proportion +((x *proportion > 220)?( -250): ((space.width*proportion) + 40)),
                       top: y*proportion+this.state.subMenuDelta,
                    }}>
                    <div className="zoning-popup-header">
                      <p>INDICA LA ZONA</p>
                      <div className="zoning-popup-header-button" 
                      onClick={()=>{this.setState({selected: null})}}>+</div>
                    </div>
                    <div className="zoning-popup-input-area">
                      <div className="color-selector" onClick={
                        ()=>{
                          let menuH = this.state.MenuWithChromeH; //altura menu chrome
                          let layoutH = this.state.layout_dimensions.height*proportion;
                          this.setState({
                            show_colorpicker: !this.state.show_colorpicker, 
                            subMenuDelta: layoutH<=menuH?-y*proportion:(y*proportion <= layoutH-menuH?0:(layoutH-menuH)-y*proportion),
                          })
                        }
                      }>
                        <div className="color-selector-color" style={{backgroundColor: space.color?(space.color.length===6?"#"+space.color:space.color):"#CCCCCC"}}>
                        </div>
                      </div>
                      <input value={space.alias} onChange={(e)=>{this.props.setSpaceAlias(space.id, e.target.value)}} />
                    </div>
                    {this.state.show_colorpicker?<ChromePicker color={ space.color?(space.color.length===6?"#"+space.color:space.color):"#000000" }
          onChangeComplete={(color)=>this.props.setSpaceColor(space.id, color.hex)} />:null}
                  </div>} 
                  {!(selected && this.state.tool === "modify")?null:
                  <div className="zoning-popup"
                    style={{
                       left: x *proportion +((x *proportion > 220)?( -250): ((space.width*proportion) + 40)),
                       top: y*proportion+this.state.subMenuDelta,
                    }}>
                    <div className="zoning-popup-header">
                      <p>Tipo de Espacio de Trabajo</p>
                      <div className="zoning-popup-header-button" 
                      onClick={()=>{this.setState({selected: null, category_selected: null})}}>+</div>
                    </div>
                    <div className="spaces-categories-popup-content">
                    <Scrollbar style={{height: "240px" }}>
                    {!this.state.categories || this.state.category_selected?null:this.state.categories.map(c=> {
                      
                      return (
                        <div key={c.id} onClick={()=> {this.setState({category_selected: this.filterReplacementsContext(space, c)})}}>
                          <div className={"spaces-categories-popup-category"  + (c.subcategories.filter((sc)=> {
                            var found = false;
                            sc.spaces.forEach((s)=>{if(s.id===this.state.selected.space_id) found=true});
                            return found;
                          }).length>0?" selected":"")}><strong>{c.name}</strong></div>
                      
                        </div>);
                    })}
                    {!this.state.category_selected?null:<div>
                      <div  className="subcategory-back" onClick={()=>{this.setState({category_selected: null})}}>Volver</div>
                      {this.state.category_selected.subcategories.length==0?
                        <div>
                          No hay espacios disponibles de esta categoría, para esta ubicación.
                        </div>:
                        this.state.category_selected.subcategories.map((s)=> {
                          return (
                            <div key={s.id} className="subcategory-name">
                              {s.name}
                              {s.spaces.map(a=> {
                                return(
                                <div  key={a.id} className={"spaces-categories-popup-category spaces-categories-popup-space" + (a.id === this.state.selected.space_id?" selected":"")}>
                              <img
                                   onClick={()=> {this.props.changeSpace(space.id, a, (new_space)=>{this.setState({selected: new_space})})}}
                                  src={a.model_3d}
                                  large={a.model_3d}
                                  alt=""
                                  className="workspace-select-more-img"
                              

                                /></div>   
                                  );
                              })}
                            </div>);  
                        })
                      }
                    </div>}
                    </Scrollbar>
                    </div>                    
                  </div>} 
                </Fragment>
           )
       });
    }
    getProportion() {
      var proportion = 1;
      if(this.state.layout_dimensions) {
        if(this.state.layout_dimensions.width > this.state.width) {
          proportion = this.state.width/this.state.layout_dimensions.width;
        }
        if((this.state.layout_dimensions.height*proportion) > this.state.height) {
          proportion = this.state.height/this.state.layout_dimensions.height;
        }
      }
      return proportion;
    }
    drawCanvasDEFINITIVO() {
      //return;
      const ctx = this.canvas.getContext('2d');
      ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      ctx.fillStyle = "black";
      ctx.lineWidth = "0.1";
      var proportion2 = this.getProportion();
      var dragged = null;
      if(!this.state.dragged || !this.props.generated_layout || !this.props.generated_layout.floor_elements) return;     
      if(this.props.generated_layout && this.props.generated_layout.floor_elements) {               
          var moveDiffX =  this.state.lastMove.x - this.state.draggingStart.x;
          var moveDiffY =  this.state.lastMove.y - this.state.draggingStart.y;
          var space = this.state.dragged;
          if(space.rotation !== "0" && space.rotation !== "180") {          
            dragged = {regions: [[
              [space.position_x + (moveDiffX/proportion2) - (space.height/2),space.position_y + (moveDiffY/proportion2) - (space.width/2)], 
              [space.position_x + (moveDiffX/proportion2) + (space.height/2),space.position_y + (moveDiffY/proportion2)- (space.width/2)], 
              [space.position_x + (moveDiffX/proportion2)+ (space.height/2),space.position_y + (moveDiffY/proportion2) +  (space.width/2)], 
              [space.position_x + (moveDiffX/proportion2) - (space.height/2),space.position_y + (moveDiffY/proportion2) + (space.width/2)]]
              ]};
          } else {         
            dragged = {regions: [[
              [space.position_x + (moveDiffX/proportion2) - (space.width/2),space.position_y + (moveDiffY/proportion2) - (space.height/2)], 
              [space.position_x + (moveDiffX/proportion2) + (space.width/2),space.position_y + (moveDiffY/proportion2)- (space.height/2)], 
              [space.position_x + (moveDiffX/proportion2)+ (space.width/2),space.position_y + (moveDiffY/proportion2) +  (space.height/2)], 
              [space.position_x + (moveDiffX/proportion2) - (space.width/2),space.position_y + (moveDiffY/proportion2) + (space.height/2)]]
              ]};
           }
          var floor_elements = [...this.props.generated_layout.floor_elements];
          var envIntersection = generateEnvIntersection(floor_elements);
          var envSection = getEnvSection(floor_elements); 
          envIntersection.forEach((inter, i) => {if(i===2)floor_elements.push(inter)});
          floor_elements.forEach((element) => {         
            if(element.name === "WYS_AREA_UTIL")return;      
            if(element.name === "WYS_SHAFT") return;
            if(element.name === "WYS_ENTRANCE") return;
            if(element.name === "WYS_PLANT_EXTERIOR_ENV") return;
            if(element.name === "WYS_PLANT_EXTERIOR"){             
             this.drawPlantaExterior(ctx, element, dragged, envSection);
            } else {
             this.drawPlantaInterior(ctx, element, dragged);  
            }

          });
      }
    }
    drawPlantaInterior(ctx, element, dragged) {
      var proportion = 1;
      //proportion = 1;
      proportion = this.getProportion();
      var current = regionToPolyBool({...element});
      var intersect = PolyBool.intersect(dragged, current);
      if(intersect && intersect.regions.length ) {

        ctx.beginPath();
        ctx.fillStyle = "#FF0000"; 
        ctx.strokeStyle = "transparent";        

        element.points.forEach((point, i)=> {
          if(i===0) ctx.moveTo(point.position_x*proportion, point.position_y*proportion);
          else ctx.lineTo(point.position_x*proportion, point.position_y*proportion);
        });
        ctx.stroke();
        ctx.closePath();
        ctx.fill();
      }
    }
    drawPlantaExterior(ctx, element, dragged, envSection) {
      var proportion = this.getProportion();      
      var current = regionToPolyBool(element);
      var intersect = fullIntersect(dragged, current);
      if(!intersect) {
        ctx.fillStyle = "#FF0000"; 
        ctx.strokeStyle = "transparent";
        ctx.beginPath();
        envSection.points.forEach((point, i)=> {
          if(i===0) ctx.moveTo(point.position_x*proportion, point.position_y*proportion);
          else ctx.lineTo(point.position_x*proportion, point.position_y*proportion);
        });
        ctx.stroke();
        ctx.closePath();
        ctx.fill()
        ctx.beginPath();
        element.points.forEach((point, i)=> {
          if(i===0) ctx.moveTo(point.position_x*proportion, point.position_y*proportion);
          else ctx.lineTo(point.position_x*proportion, point.position_y*proportion);
        });
        ctx.stroke();
        ctx.closePath();
        ctx.globalCompositeOperation='destination-out';
        ctx.fill();
        ctx.globalCompositeOperation='source-over';
      }
    }
    render() {
        var project = this.props.project;
        if (!project || project === "loading") return null;
        var proportion = this.getProportion();
        var hide = this.state.hide || !this.state.layout_dimensions;
        return (
          <div className={"layout-positions-sidebar-wrapper"+(this.state.tools_expanded?"":" closed")}>
            <div className={"layout-positions-sidebar-wrapper-content"}>            
              <div className="flex flex-1 width-100pct" style={{height: "calc(100% - 110px)"}}>
                <div>
                  <div onClick={()=>{
                      if(this.state.tool !== "zoning") 
                        this.setState({tool: "zoning"})
                    }} className={"layout-tool" + (this.state.tool=== "zoning"?" selected":"")}>
                    <div className="layout-tool-img" style={{backgroundImage: "url(" + (this.state.tool=== "zoning"?zoneIconWhite:zoneIconBlack) + ")"}}></div>
                    Zonificar
                  </div>
                  <div onClick={()=>{
                    if(this.state.tool !== "moving") 
                      this.setState({tool: "moving", selected: null})}} className={"layout-tool" + (this.state.tool=== "moving"?" selected":"")}>
                    <div className="layout-tool-img" style={{backgroundImage: "url(" + (this.state.tool=== "moving"?moveIconWhite:moveIconBlack)+")"}}></div>
                    Mover
                  </div>
                  <div onClick={()=>{
                    if(this.state.tool !== "modify") 
                      this.setState({tool: "modify", selected: null})}} className={"layout-tool" + (this.state.tool=== "modify"?" selected":"")}>
                    <div className="layout-tool-img" style={{backgroundImage: "url(" + (this.state.tool=== "modify"?editIconWhite:editIconBlack)+")"}}></div>
                    Modificar
                  </div>
                </div>
                <div className="flex flex-1 flex-column">
                  <div className="layout-top-edit-button-container flex">
                    <p className="flex-1">Indica los espacios en los cuales estarán los espacios seleccionados </p>
                  </div>
                  <div className="content" ref={ div => { this.div = div; } }>
                    <div>
                      {hide?null:
                      <div className="layout-positions-container no-select"
                        style={{
                          backgroundImage: 'url('+ this.props.generated_layout.selected_floor.image_link + ')',
                          width: this.state.layout_dimensions.width*proportion+"px",
                          height: this.state.layout_dimensions.height*proportion+"px"
                        }}>
                        <canvas id="mycanvas" width={this.state.layout_dimensions.width*proportion} height={this.state.layout_dimensions.height*proportion} className="layout-positions-objects-canvas" style={{
                          //width: this.state.layout_dimensions.width*proportion+"px",
                          //height: this.state.layout_dimensions.height*proportion+"px"
                          width: "100%",
                          height: "100%"
                        }} ref={ canvas => { this.canvas = canvas; if(canvas) {canvas.width =  this.state.layout_dimensions.width*proportion; canvas.height = this.state.layout_dimensions.height*proportion;}} } />
                          {this.renderSpaces(proportion)}
                      </div>}
                    </div>
                  </div>
                </div>
              </div>
              <div className="page-btns-area flex space-between width-100pct">
                  <Link
                      className="button is-transparent is-rounded is-dark-line"
                      to={"/proyecto/" + (project?project.id:"") + "/layout"}>
                      Rehacer
                  </Link>
                  <Link
                      onClick={() => {this.props.save()}}
                      className="button is-green is-rounded"
                      to={"#"}>
                      Finalizar
                  </Link>
              </div>          
            </div>
            <div className={"layout-positions-sidebar"}>
              <div className={"layout-positions-sidebar-content"}>
                <div className={"layout-positions-sidebar-title"}>Espacio de trabajo</div>
                {(this.state.sidebarM2)?
                  <div className={"layout-positions-sidebar-data"}><strong>Metraje</strong> {Math.round((this.state.sidebarM2 + Number.EPSILON) * 100) / 100} mt<sup>2</sup></div>:
                  <div className={"layout-positions-sidebar-data"}><strong>Metraje</strong> {this.state.sidebarM2===null?'No Disponible':'Cargando'}</div>}
                {(this.state.sidebarM2 && this.props.workers_number && this.state.show_workers)?
                  <div className={"layout-positions-sidebar-data"}><strong>Metraje por persona</strong> {(Math.round((this.state.sidebarM2/ this.props.workers_number + Number.EPSILON) * 100) / 100)} mt<sup>2</sup></div>:
                  <div className={"layout-positions-sidebar-data"}><strong>Metraje por persona</strong> No Disponible</div>}
                {(this.state.sidebarM2 && this.props.workers_number && this.state.show_workers)?
                  <div className={"layout-positions-sidebar-data"}><strong>Cantidad de personas</strong> {this.props.workers_number}</div>:
                  <div className={"layout-positions-sidebar-data"}><strong>Cantidad de personas</strong> No Disponible</div>}
                
                {/*
                <div className={"layout-positions-sidebar-data"}><strong>Oficinas Privadas</strong> 8 personas</div>
                <div className={"layout-positions-sidebar-data"}><strong>Planta abieta</strong> 90 personas</div>
                <div className={"layout-positions-sidebar-data"}><strong>Recepción</strong> 4 personas</div>
                <div className={"layout-positions-sidebar-zones-title"}>Zonas seleccionadas</div>
                */}
              </div>

                <div className={"layout-positions-sidebar-toggle"} onClick={()=> {
              this.setState({tools_expanded: !this.state.tools_expanded}, ()=> {setTimeout(()=>this.updateHeight(), 500)});
            }}>
                  {!this.state.tools_expanded?"Mostrar Detalles": "Ocultar Detalles"}
                </div>
            </div>
          </div>
              
        );
    }
}

function collisionDetection(space1, space2) {
  if(!space1 || !space2) return false;
  var rect1 = null;
  var rect2 = null; 
  var rotated = null;
  if(space1.rotation !== "0" && space1.rotation !== "180") {
    rotated = rotatePoint(
      space1.position_x, 
      space1.position_y, 
      space1.position_x + (space1.width/2), 
      space1.position_y + (space1.height/2), 90);
    rect1 = {x: rotated[0]-space1.height, y: rotated[1], width: space1.height, height: space1.width};    
  } else {
    rect1 = {x: space1.position_x, y: space1.position_y, width: space1.width, height: space1.height};
  }
  if(space2.rotation !== "0" && space2.rotation !== "180") {
    rotated = rotatePoint(
      space2.position_x, 
      space2.position_y, 
      space2.position_x + (space2.width/2), 
      space2.position_y + (space2.height/2), 90);
    rect2 = {x: rotated[0]-space2.height, y: rotated[1], width: space2.height, height: space2.width};    
  } else {
    rect2 = {x: space2.position_x, y: space2.position_y, width: space2.width, height: space2.height};
  }
  
  if (rect1.x < rect2.x + rect2.width &&
    rect1.x + rect1.width > rect2.x &&
    rect1.y < rect2.y + rect2.height &&
    rect1.height + rect1.y > rect2.y) {
    return true;
  }
  
  return false;
}
function rotatePoint(x, y, centerx, centery, degrees) {
    var newx = (x - centerx) * Math.cos(degrees * Math.PI / 180) - (y - centery) * Math.sin(degrees * Math.PI / 180) + centerx;
    var newy = (x - centerx) * Math.sin(degrees * Math.PI / 180) + (y - centery) * Math.cos(degrees * Math.PI / 180) + centery;
    return [newx, newy];
}
function regionToPolyBool(region) {
  return {regions: [region.points.map(p=>[p.position_x, p.position_y])]}; 
}
function PolyToRegion(name, poly) {
  return poly.regions.map((region) => {
    return {
      name,
      points: region.map((points) => {
        return {position_x: points[0], position_y: points[1]}
      })
    }

  });
}
function generateEnvIntersection(floor_elements) {
  var exterior = null;
  var env = null;
  floor_elements.forEach((element)=> {
      if(element.name === "WYS_PLANT_EXTERIOR_ENV") env = element;
      if(element.name === "WYS_PLANT_EXTERIOR") exterior = element;
  });
  var exteriorPoly = regionToPolyBool(exterior);
  var envPoly = regionToPolyBool(env);
  var intersect = PolyBool.xor(exteriorPoly, envPoly);
  return PolyToRegion("INTERSECTIONS", intersect);

}
function getEnvSection(floor_elements) {
  var env = null;
  floor_elements.forEach((element)=> {
      if(element.name === "WYS_PLANT_EXTERIOR_ENV") env = element;
  });
  return env;

}
function fullIntersect(dragged, current) {
  if(!dragged) return null;
  var intersect = PolyBool.intersect(dragged, current); 
  return samePoints(dragged.regions[0], intersect.regions[0]);
}
function samePoints(poly1, poly2) {
  if(!poly1 || !poly2 || poly1.length !== poly2.length) return false;
  var foundPoints = 0;
  poly1.forEach((p) => {
    poly2.forEach((p2) => {
      if(p[0] === p2[0] && p[1] === p2[1]) foundPoints++;
    });

  });
  return foundPoints === poly1.length;
}
function layoutCollisionDetection(draggedSpace, floor_elements, proportion, moveDiffX, moveDiffY) {
  if(!draggedSpace) return false;
  var space = draggedSpace;
  var dragged = null;
  var intersected = false;
  if(space.rotation !== "0" && space.rotation !== "180") {          
    dragged = {regions: [[
      [space.position_x + (moveDiffX/proportion) - (space.height/2),space.position_y + (moveDiffY/proportion) - (space.width/2)], 
      [space.position_x + (moveDiffX/proportion) + (space.height/2),space.position_y + (moveDiffY/proportion)- (space.width/2)], 
      [space.position_x + (moveDiffX/proportion)+ (space.height/2),space.position_y + (moveDiffY/proportion) +  (space.width/2)], 
      [space.position_x + (moveDiffX/proportion) - (space.height/2),space.position_y + (moveDiffY/proportion) + (space.width/2)]]
      ]};
  } else {         
    dragged = {regions: [[
      [space.position_x + (moveDiffX/proportion) - (space.width/2),space.position_y + (moveDiffY/proportion) - (space.height/2)], 
      [space.position_x + (moveDiffX/proportion) + (space.width/2),space.position_y + (moveDiffY/proportion)- (space.height/2)], 
      [space.position_x + (moveDiffX/proportion)+ (space.width/2),space.position_y + (moveDiffY/proportion) +  (space.height/2)], 
      [space.position_x + (moveDiffX/proportion) - (space.width/2),space.position_y + (moveDiffY/proportion) + (space.height/2)]]
      ]};
  }    
  var floor_elements = [...floor_elements];
  floor_elements.forEach((element) => {
    let old_in = intersected;
    var current = regionToPolyBool(element);
    if(element.name === "WYS_AREA_UTIL"        
      ||  element.name === "WYS_PLANT_EXTERIOR_ENV") return;
    if(element.name === "WYS_PLANT_EXTERIOR"){

      var intersect = fullIntersect(dragged, current);
      if(!intersect) intersected = true;
    } else {
      var intersect = dragged?PolyBool.intersect(dragged, current):null;

      if(intersect && intersect.regions.length ) {
        intersected = true;
      }
    }
  });
  return intersected;
}