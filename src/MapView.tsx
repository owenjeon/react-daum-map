import React, {RefObject} from "react"
import ReactDOM from "react-dom"
import {Provider} from 'mobx-react'
import _ from 'lodash'

import {Control} from "./modules/Control"

export class MapView extends React.PureComponent<Props, any>{

    static defaultProps = {
        onMapReady:_=>{},
        onRegionChange:_=>{},
        onRegionChangeComplete:_=>{}
    }
    private mapEle:RefObject<any> = React.createRef()
    private controls = new Map();
    public store:any = {}

    componentDidMount(){
        const {center: {lat, lng}, level} = this.props.initialOption;
        this.store.map = new daum.maps.Map(this.mapEle.current, {
            center: new daum.maps.LatLng(lat, lng),
            level
        })
        this.initMap()
        this.forceUpdate()
    }

    componentDidUpdate(prevProps){
        this.setMinMax()
        this.setControl()
        this.updateCenter(prevProps)
    }

    render(){
        const {customMapStyle, className} = this.props
        return(
            <Provider mapStore={this.store}>
                <React.Fragment>
                    <div ref={this.mapEle} style={customMapStyle} className={className}/>
                    {this.store.map && ReactDOM.createPortal(
                        this.props.children,
                        this.store.overlay,
                    )}
                    <Control controls={this.props.controls}/>
                </React.Fragment>
            </Provider>
        )
    }

    setControl(){
        this.props.controls.forEach(v => {
            this.controls.set(v.control, Object.assign({}, v, {status:this.controls.has(v.control) ? 'override': 'new'}))
        })
        this.controls.forEach((v, k)=>{
            if(v.status === 'old'){
                this.controls.delete(k);
                this.store.map.removeControl(k, v.position);
                return;
            }
            if(v.status === 'new') this.store.map.addControl(k, v.position);
            v.status = 'old';
        })
    }

    initMap(){
        const map = this.store.map;
        this.setControl();
        this.getOverlayLayer();
        this.setMinMax();
        this.props.onMapReady(this.regionObj);
        daum.maps.event.addListener(map, 'bounds_changed', () => this.props.onRegionChange(this.regionObj));
        daum.maps.event.addListener(map, 'idle', () => this.props.onRegionChangeComplete(this.regionObj));
    }

    get regionObj(){
        const map = this.store.map;
        return {bounds: MapView.matchBoundsKey(map.getBounds()), zoomLevel: map.getLevel(), center: MapView.mathCenterKey(map.getCenter())};
    }

    getOverlayLayer(){
        const m = new daum.maps.AbstractOverlay()
        m.setMap(this.store.map)
        this.store.overlay = m.getPanels().overlayLayer
        m.setMap(null)
    }

    updateCenter(prevProps){
        const {center} = this.props;
        if(center && !_.isEqual(prevProps.center, center)){
            this.store.map.setCenter(new daum.maps.LatLng(center.lat, center.lng));
        }
    }

    setMinMax(){
        this.props.maxZoomLevel && this.store.map.setMinLevel(this.props.maxZoomLevel);
        this.props.minZoomLevel && this.store.map.setMaxLevel(this.props.minZoomLevel);
    }

    static matchBoundsKey(bounds){
        const swLatLng = bounds.getSouthWest();
        const neLatLng = bounds.getNorthEast();
        return {n:neLatLng.getLat(), e:neLatLng.getLng(), s:swLatLng.getLat(), w:swLatLng.getLng()};
    }

    static mathCenterKey(center){
        return {lat:center.getLat(), lng: center.getLng()};
    }
}

type latLng = {lat: number,lng: number}
type bounds = { n: number, e: number, s: number, w: number }

type mapPositionInfo = {
    bounds: bounds
    zoomLevel: number
    center: latLng
}

interface Props {
    initialOption: { center: latLng, level?: number }
    maxZoomLevel?: number
    minZoomLevel?: number
    onMapReady?: (info:mapPositionInfo) => void
    onRegionChange?: (info:mapPositionInfo) => void
    onRegionChangeComplete?: (info:mapPositionInfo) => void
    className?: string
    customMapStyle?: any
    controls?: { control: Function, position: any}[],
    center?: {lat: number, lng: number}
}