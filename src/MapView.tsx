import React from "react"
import ReactDOM from "react-dom"
import {Provider} from 'mobx-react'

export class MapView extends React.PureComponent<any, any>{

    static defaultProps = {
        onMapReady:_=>{},
        onRegionChange:_=>{},
        onRegionChangeComplete:_=>{}
    }
    private mapEle:any = React.createRef()
    public store:any = {}

    componentDidMount(){
        //todo zoom 방식이 아니라 delta 방식으로 바꾸어야 함(react-native-maps와 호환을 위해..)
        const {center: {lat, lng}, zoomLevel} = this.props.initialOption;
        this.store.map = new daum.maps.Map(this.mapEle.current, {
            center: new daum.maps.LatLng(lat, lng),
            level: zoomLevel
        })
        this.initMap()
        this.forceUpdate()
    }

    componentDidUpdate(){
        this.setMinMax()
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
                </React.Fragment>
            </Provider>
        )
    }

    initMap(){
        const map = this.store.map;
        map.addControl(new daum.maps.MapTypeControl(), daum.maps.ControlPosition.TOPRIGHT);
        map.addControl(new daum.maps.ZoomControl(), daum.maps.ControlPosition.RIGHT);
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