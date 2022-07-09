import React from 'react'

export class AppClass extends React.Component{
	constructor(){
        super()
        //this.state
        //this.setState
    }
    setQuery(e){
        e.preventDefault()
    }
    componentDidMount(){
    }
    componentDidUpdate(){
    }
    render(){
        return <h1>hello react and {this.props.name} </h1>
    }
}

export function AppFunc({name}){
    return <h1>Exported and still working? {name}</h1>
}

//export default App;