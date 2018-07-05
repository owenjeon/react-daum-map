import React, { Component } from 'react'
import {render} from 'react-dom'

import {MapView, AbstractMarker, Marker} from "../src"
import marker from './marker_mock.json'
import './basic.pcss'
import {ControlPosition, mapTypeControl, zoomControl} from "../src/controls"
class RoomsMap extends Component{
    state = {
        controls: [
            {control: zoomControl, position: ControlPosition.RIGHT},
            {control: mapTypeControl, position: ControlPosition.TOPRIGHT}
        ]
    }
    render(){
        return(
            <div className='mapArea'>
                <MapView
                    initialOption={{
                        center: {lat:37.46864206034225,lng:126.93997450658118}, level:2
                    }}
                    minZoomLevel={10}
                    onMapReady={e=>console.log('onMapReady')}
                    onRegionChangeComplete={e=>console.log('onRegionChangeComplete')}
                    className={'map'}
                    controls={this.state.controls}
                >
                    {marker.map( (item, i) =>
                        <AbstractMarker coordinate={{latitude: item.lat, longitude: item.lng}} className={'cluster '+this.getCircleSize(item.count)} key={i}>
                            {item.count}
                        </AbstractMarker>
                    )}
                    <Marker coordinate={{latitude: 37.46864206034225, longitude: 126.93997450658118}} />
                </MapView>
                <div style={{position:'absolute', zIndex:10, bottom:10}}>
                    <button onClick={this.toggleControl}>Control 편집</button>
                </div>
            </div>
        );
    }

    private toggleControl = (()=>{
        let flag = 0;
        const c = [
            {control: zoomControl, position: ControlPosition.RIGHT},
            {control: mapTypeControl, position: ControlPosition.TOPRIGHT}
        ]
        return () => {
            this.setState({controls: [c[(flag++)%2]]})
        }
    })()

    private getCircleSize(cnt){
        switch (cnt.toString().length){
            case(1): return 's'
            case(2): return 'm'
            case(3):default: return 'l'
        }
    }
}

render(<RoomsMap/>, document.getElementById('root'));