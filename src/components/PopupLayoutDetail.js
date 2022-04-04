import React, { Component, Fragment} from "react";
import Popup from "./Popup.js";
import {getLayout} from "../api.js"
import LoadingFull from './LoadingFull';

export default class PopupLayoutDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    componentDidMount() {
        getLayout(this.props.project.id, (error, result)=> {
            if(error) {
                return console.log("error getLayout", error);
            }
            var img = new Image();
            img.src = result.selected_floor.image_link;
            img.onload = () => {
             this.setState({generated_layout: result, layout_dimensions: {width: img.width, height: img.height}});
             this.updateHeight();
                window.addEventListener("resize", this.updateHeight.bind(this));
            }        
        });

    }
    renderSpaces(proportion) {
       var moveDiffX = 0;
       if(this.state.dragged) moveDiffX =  this.state.lastMove.x - this.state.draggingStart.x;
       var moveDiffY = 0;
       if(this.state.dragged) moveDiffY =  this.state.lastMove.y - this.state.draggingStart.y;
       return this.state.generated_layout.workspaces.map((space, i) => {
           var dragged = this.state.dragged && this.state.dragged.id === space.id;
           var relative_pos_x = space.position_x - (space.width/2);
           var relative_pos_y = space.position_y - (space.height/2);
           var x = dragged? relative_pos_x + (moveDiffX/proportion):relative_pos_x;
           var y =dragged? relative_pos_y + (moveDiffY/proportion):relative_pos_y;
           var selected = false;
           
            
           return (
            <Fragment key={i+"_"+space.id}>
               <div  
               className={
                "layout-positions-space no-select" 
                + (dragged?" dragged":"") 
                + (selected?" selected":"") 
  

                + " rotate-" + space.rotation}
              
               style={{
                   backgroundImage:'url('+ space.image + ')',
                   left: x *proportion,
                   top: y*proportion,
                   width: space.width * proportion,
                   height: space.height* proportion,
                }} >
                
                </div>
                
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
    render() {
        var proportion = this.getProportion();
        var generated_layout = this.state.generated_layout;
        var hide = this.state.hide || !this.state.layout_dimensions;
        if(!generated_layout) return <LoadingFull />
        return (
            <Popup onDismiss={this.props.onDismiss}>
                <div ref={ div => { this.div = div; } }>
                   
                      {hide?null:
                      <div className="layout-positions-container no-select"
                        style={{
                          backgroundImage: 'url('+ generated_layout.selected_floor.image_link + ')',
                          width: this.state.layout_dimensions.width*proportion+"px",
                          height: this.state.layout_dimensions.height*proportion+"px"
                        }}>
                        
                          {this.renderSpaces(proportion)}
                      </div>}
                   
                </div>
            </Popup>
        );
    }
}
