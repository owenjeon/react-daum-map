import React, { Component } from 'react'
import {render} from 'react-dom'

import {MapView, AbstractMarker, Marker} from "../src"
import marker from './marker_mock.json'
import './basic.pcss'
class RoomsMap extends Component{
    render(){
        return(
            <div className='mapArea'>
                <MapView
                    initialOption={{
                        center: {"lat":37.46864206034225,"lng":126.93997450658118}, zoomLevel:2
                    }}
                    minZoomLevel={10}
                    onMapReady={e=>console.log('onMapReady')}
                    onRegionChangeComplete={e=>console.log('onRegionChangeComplete')}
                    className={'map'}
                >
                    {marker.map( (item, i) =>
                        <AbstractMarker coordinate={{latitude: item.lat, longitude: item.lng}} className={'cluster '+this.getCircleSize(item.count)} key={i}>
                            {item.count}
                        </AbstractMarker>
                    )}
                    <Marker coordinate={{latitude: 37.46864206034225, longitude: 126.93997450658118}} />
                </MapView>
            </div>
        );
    }

    private getCircleSize(cnt){
        switch (cnt.toString().length){
            case(1): return 's'
            case(2): return 'm'
            case(3):default: return 'l'
        }
    }
}

render(<RoomsMap/>, document.getElementById('root'));