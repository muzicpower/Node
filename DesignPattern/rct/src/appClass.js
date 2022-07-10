
import React from 'react'
import axios from 'axios'

import logo from './logo.svg'
import './app.css'

class Search extends React.Component{
	constructor(){
        super()
        this.state ={
            sCand:localStorage.getItem('searchTerm')||'React',
            sTerm:localStorage.getItem('searchTerm')||'React',
            isLoading: false,
            isError: false,
            sResult:[]
        }
        //this._requestLoading();
    }
    //setState(){}
    setQuery(e){e.preventDefault()}
    componentDidMount(){this._requestLoading();}
    componentDidUpdate(){}

    _setState({sCand,sTerm,isLoading,isError,sResult}){
        sCand && (this.state.sCand = sCand);
        sTerm && (this.state.sTerm = sTerm);
        isLoading && (this.state.isLoading = isLoading);
        isError && (this.state.isError = isError);
        sResult && (this.state.sResult = sResult);
    }
    _dispatcher(action){
        switch(action.type){
        case 'LOAD_START':      return this.setState({isloading:true, isError:false});
        case 'LOAD_COMPLETE':   return this.setState({sResult:action.payload, isLoading:false, isError:false});
        case 'LOAD_ERROR':      return this.setState({isLoading:false, isError:true});
        case 'DEL_ITEM':        return this.setState({sResult:this.state.sResult.filter(i=>i.objectID !== action.payload)});    
        default:                throw new Error('undefined dispatch option' + action.type);
        }
    }
    _requestLoading(){
        let mode = 'AXIOS';

        this._dispatcher ({type:'LOAD_START'});
        switch(mode){
        case 'LOCAL':
            const initList = [
                {
                    title : 'React',
                    url: 'https://reactjs.org/',
                    author: 'Jordan Walke',
                    num_comments: 3,
                    points: 4,
                    objectID: 0,
                },
                {
                    title : 'Redux',
                    url: 'https://redux.js.org/',
                    author: 'Dan Abramov, Andrew Clark',
                    num_comments: 2,
                    points: 5,
                    objectID: 1,
                },
                {
                    title : 'Angular',
                    url: 'https://reactjs.org/',
                    author: 'Google',
                    num_comments: 32,
                    points: 41,
                    objectID: 2,
                },
                {
                    title : 'NextJS',
                    url: 'https://reactjs.org/',
                    author: 'Next Messiah',
                    num_comments: 334,
                    points: 421,
                    objectID: 3,
                },
                {
                    title : 'Express',
                    url: 'https://reactjs.org/',
                    author: 'Express Genius',
                    num_comments: 30,
                    points: 42,
                    objectID: 4,
                },            
            ] 
            let delay = 400
            let filteredItemList = initList.filter(i=>i.title.toLowerCase().includes(this.state.sTerm.toLowerCase()));

            (new Promise(resolve=>{setTimeout(()=>{resolve({hits:filteredItemList})},delay)}))     
            .then(result=>{this._dispatcher({type:'LOAD_COMPLETE', payload:result.hits})})
            .catch(error=>{this._dispatcher({type:'LOAD_ERROR'})})
            break;
        case 'FETCH':
            fetch(`https://hn.algolia.com/api/v1/search?query=${this.state.sTerm}`)
            .then(result=>result.json())
            .then(result=>{this._dispatcher({type:'LOAD_COMPLETE', payload:result.hits})})
            .catch(error=>{this._dispatcher({type:'LOAD_ERROR'})})
            break;
        case 'AXIOS':
            axios.get(`https://hn.algolia.com/api/v1/search?query=${this.state.sTerm}`)
            .then(result=>{this._dispatcher({type:'LOAD_COMPLETE', payload:result.data.hits})})
            .catch(error=>{this._dispatcher({type:'LOAD_ERROR'})})
            break;
        }
    }
    _onClick(){
        this._setState({sTerm:this.state.sCand, isLoading:true})
        this._requestLoading()
    }
    _renderSearchResult(){
        return(
        this.state.sResult.map((item,idx)=>{ return(
            <div key = {item.objectID}>
                <a href={item.url} target="_blank">title: {item.title}</a> &nbsp;
                <span>  autor: <b>{item.author}</b></span>
                <span>  comments: {item.num_comments}</span>
                <span>  points: {item.points}</span> &nbsp; &nbsp;&nbsp;
                <button onClick={()=>{this._dispatcher({type:'DEL_ITEM',payload:item.objectID})}}> del </button>
                <br/><br/>
            </div>
        )}))
    }
    _renderSearchBox(){
        return (<>
        <label htmlFor="search">{this.props.children} </label>
        <input type="text" onChange={event=>this.setState({sCand:event.target.value})} value={this.state.sCand}/> &nbsp; &nbsp;&nbsp;
        <button onClick={this._onClick.bind(this)}> Submit </button>
        <br/><br/>
        <p> Searching for {this.state.sTerm} </p>
        </>)
    }
    render(){
        //console.log(`state: ${JSON.stringify(this.state,null,2)}`)
        return (
            <>
            {this._renderSearchBox()} 
            {this._renderSearchResult()}
            <img src={logo} className = 'App-logo'/>
            <h1>Exported and still working? {this.props.name}</h1>
            </>
        );
    }
}

export default Search;