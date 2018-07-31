import React from "react"
import {ControlPosition, zoomControl} from "../controls"
import {inject} from "mobx-react"

@inject('mapStore')
export class Control extends React.Component<Props & {mapStore: {map:any}}>{

    private controls;
    componentDidMount(){
        console.log('componentDidMount')
    }
    componentDidUpdate(){
        console.log('componentDidUpdate')
    }
    render(){
        return null;
    }

    setControl(){
        this.props.controls.forEach(v => {
            this.controls.set(v.control, Object.assign({}, v, {status:this.controls.has(v.control) ? 'override': 'new'}))
        })
        this.controls.forEach((v, k)=>{
            if(v.status === 'old'){
                this.controls.delete(k);
                this.props.mapStore.map.removeControl(k, v.position);
                return;
            }
            if(v.status === 'new') this.props.mapStore.map.addControl(k, v.position);
            v.status = 'old';
        })
    }
}

interface Props {
    controls: {control: any, position: any, status?: 'new' | 'old' | 'override'}[],

}