import React from "react"
import {ControlPosition, zoomControl} from "../controls"

export class Control extends React.Component<Props>{
    componentDidMount(){
        console.log('componentDidMount')
    }
    componentDidUpdate(){
        console.log('componentDidUpdate')
    }
    render(){
        return null;
    }
}

interface Props {
    controls: {control: any, position: any, status?: 'new' | 'old' | 'override'}[]
}