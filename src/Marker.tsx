import React from "react"
import {inject} from "mobx-react"
import {CustomMarker} from "./CustomMarker"

export const Marker = (props) => {
    const Comp = props.children ? CustomMarker : BasicMarker
    return <Comp {...props}/>
}

@inject('mapStore')
export class BasicMarker extends React.Component<any> {
    private map;
    private marker;

    constructor(props){
        super(props);
        this.map = props.mapStore.map;
    }

    componentDidMount(){
        const {latitude, longitude} = this.props.coordinate;
        this.marker = new daum.maps.Marker({
            map: this.map,
            title: this.props.title,
            image: this.props.image,
            position: new daum.maps.LatLng(latitude, longitude)
        });
        this.marker.setMap(this.map)
    }

    getSnapshotBeforeUpdate(){
        const {latitude, longitude} = this.props.coordinate;
        this.marker.position = new daum.maps.LatLng(latitude, longitude)
    }

    componentWillUnmount(){
        this.marker.setMap(null)
    }

    render(){
        if(!this.map) return null;
        return (
            null
        )
    }
}