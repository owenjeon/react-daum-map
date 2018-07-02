import React from "react"
import {inject} from "mobx-react"

@inject('mapStore')
export class AbstractMarker extends React.PureComponent<any>{
    ele:any;
    marker;
    map;

    constructor(props){
        super(props);
        this.map = props.mapStore.map;
    }

    componentDidMount(){
        const {latitude, longitude} = this.props.coordinate;
        this.marker = new AbstractMarkers(this.ele, new daum.maps.LatLng(latitude, longitude))
        this.marker.setMap(this.map);
    }

    componentWillUnmount(){
        this.marker.setMap(null);
        this.props.mapStore.overlay.appendChild(this.ele);
    }

    componentDidUpdate(){
        const {latitude, longitude} = this.props.coordinate;
        this.marker.position = new daum.maps.LatLng(latitude, longitude)
        this.marker.draw();
    }

    render(){
        const {coordinate, mapStore, _ref, ...props} = this.props
        if(!this.map) return null;
        return(
            <div ref={ele => {
                if(_ref) _ref(ele);
                this.ele = ele;
            }} {...props}>{this.props.children}</div>
        )
    }
}



class AbstractMarkers extends (daum.maps.AbstractOverlay as { new(): any; }){
    constructor(node, position){
        super()
        this.position = position;
        this.node = node;
        this.node.style.position = 'absolute';
        this.node.style.whiteSpace = 'nowrap';
    }

    draw(){
        const projection = this.getProjection()
        const point = projection.pointFromCoords(this.position)
        this.node.style.left = (point.x) + "px"
        this.node.style.top = (point.y) + "px"
    }
    onAdd(){
        // this.getPanels().overlayLayer.appendChild(this.node)
    }
    onRemove(){
        // this.node.parentNode.removeChild(this.node);
    }
}