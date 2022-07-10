
/*
//Road2React 2nd pass
0.  React.useState
    React.useReducer
    React.useEffect

1. React.useRef() 
    imperative React
    const inputRef = React.useRef()
    if (inputRef.current) inputRef.current.focus()
    <Tagxxx ref = inputRef> //ref: reserved word  

2. React.useCallback() + React.useEffect()

*/

import React from 'react'
import logo from './logo.svg'
import './app.css'
import axios from 'axios'

function MyList({items, hDel}){
    return items.map((item,idx)=>{ return(
            <div key = {item.objectID}>
                <a href={item.url} target="_blank">
                    title: {item.title}
                </a> &nbsp;
                <span>autor: <b>{item.author}</b></span>
                <span>  comments: {item.num_comments}</span>
                <span>  points: {item.points}</span> &nbsp; &nbsp;&nbsp;
                <button onClick={()=>{hDel(item.objectID)}}> del </button>
                <br/><br/>
            </div>
        )})
}

const SearchBox = ({hsSubmit, hsCand, sCand, sTerm, children})=>{ //children: reserved
    return( // <></> == binder for multiple top-level elements
        <> 
            <label htmlFor="search">{children} </label>
            <input type="text" onChange={event=>hsCand(event.target.value)} value={sCand}/> &nbsp; &nbsp;&nbsp;
            <button onClick={hsSubmit}> Submit </button>
            <br/><br/>
            <p> Searching for {sTerm} </p>
        </>
    )
}

const useSemiPersistentState = (key, initVal)=>{ //encapsulate state with getter/setter and localStorage and useEffect
    let [val, setState] = React.useState(localStorage.getItem(key)||initVal)
    React.useEffect(()=>{localStorage.setItem(key,val)},[val])
    return [val, setState]
}

function requestLoading(searchTerm, dispatcher, mode){
    dispatcher({type:'LOAD_START'})
    
    switch (mode){
        case 'LOCAL'://1. local + delay
            const itemListInit = [
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
            let filteredItemList = itemListInit.filter(i=>i.title.toLowerCase().includes(searchTerm.toLowerCase()));

            (new Promise((resolve,reject)=>{setTimeout(()=>{resolve({data:{stories:filteredItemList}})},delay)}))     
            .then(result=>{dispatcher({type:'LOAD_COMPLETE', payload:result.data.stories})})
            .catch(error=>{dispatcher({type:'LOAD_ERROR'})})
            break;
        case 'FETCH':
            fetch(`https://hn.algolia.com/api/v1/search?query=${searchTerm}`)
            .then(result=>result.json())
            .then(result=>{dispatcher({type:'LOAD_COMPLETE', payload:result.hits})})
            .catch(error=>{dispatcher({type:'LOAD_ERROR'})})
            break;
        case 'AXIOS':
            axios.get(`https://hn.algolia.com/api/v1/search?query=${searchTerm}`)
            .then(result=>{dispatcher({type:'LOAD_COMPLETE', payload:result.data.hits})})
            .catch(error=>{dispatcher({type:'LOAD_ERROR'})})
            break;
    }
}
function reducer(state,action ){
    switch (action.type){
        case 'LOAD_START':      return {data:state.data, loading:true, err:false};
        case 'LOAD_COMPLETE':   return {data:action.payload, loading:false, err:false};
        case 'LOAD_ERROR':      return {data:state.data, loading:false, err:true};
        case 'DEL_ITEM':        return {data:state.data.filter(i=>i.objectID !== action.payload),loading:false,err:false};    
        default:                throw new Error();
    }
}

function AppFunc({name}){
    const [searchCand, setSearchCand] = React.useState(localStorage.getItem('searchTerm')||'React');
    const [searchTerm, setSearchTerm] = useSemiPersistentState('searchTerm',searchCand);
    const [itemList, dispatchList] = React.useReducer(reducer, {data:[], loading:true, err:false})
 
    React.useEffect(()=>{requestLoading(searchTerm,dispatchList,'AXIOS')},[])

    function hSearchCand(value){setSearchCand(value)}
    function hSearchSubmit(){
        setSearchTerm(searchCand)
        requestLoading(searchCand, dispatchList,'AXIOS')
    }
    function hDel(objectID){dispatchList({type:'DEL_ITEM',payload:objectID})}

    return(
        itemList.err?       <h1> error in loading</h1> :
        itemList.loading?   <h2> data loading...</h2> : 
        <div>
            <SearchBox hsSubmit ={hSearchSubmit} hsCand={hSearchCand} sCand={searchCand} sTerm={searchTerm}>
                <strong>Search: </strong>
            </SearchBox>
            <MyList items={itemList.data} hDel = {hDel}/>
            <img src={logo} className = 'App-logo'/>
        </div>
    ); 
}

export default AppFunc;

/*

function MyList({items, hDel}){
    return items.map((item,idx)=>{ return(
            <div key = {item.objectID}>
                <a href={item.url} target="_blank">
                    title: {item.title}
                </a> &nbsp;
                <span>autor: <b>{item.author}</b></span>
                <span>  comments: {item.num_comments}</span>
                <span>  points: {item.points}</span> &nbsp; &nbsp;&nbsp;
                <button onClick={()=>{hDel(item.objectID)}}> del </button>
                <br/><br/>
            </div>
        )})
}

const SearchBox = ({hsSubmit, hsCand, sCand, sTerm, children})=>{ //children: reserved
    return( // <></> == binder for multiple top-level elements
        <> 
            <label htmlFor="search">{children} </label>
            <input type="text" onChange={event=>hsCand(event.target.value)} value={sCand}/> &nbsp; &nbsp;&nbsp;
            <button onClick={hsSubmit}> Submit </button>
            <br/><br/>
            <p> Searching for {sTerm} </p>
        </>
    )
}

const useSemiPersistentState = (key, initVal)=>{ //encapsulate state with getter/setter and localStorage and useEffect
    let [val, setState] = React.useState(localStorage.getItem(key)||initVal)
    React.useEffect(()=>{localStorage.setItem(key,val)},[val])
    return [val, setState]
}

function requestLoading(searchTerm, dispatcher, mode){
    dispatcher({type:'LOAD_START'})
    
    switch (mode){
        case 'LOCAL'://1. local + delay
            const itemListInit = [
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
            let filteredItemList = itemListInit.filter(i=>i.title.toLowerCase().includes(searchTerm.toLowerCase()));

            (new Promise((resolve,reject)=>{setTimeout(()=>{resolve({data:{stories:filteredItemList}})},delay)}))     
            .then(result=>{dispatcher({type:'LOAD_COMPLETE', payload:result.data.stories})})
            .catch(error=>{dispatcher({type:'LOAD_ERROR'})})
            break;
        case 'FETCH':
            fetch(`https://hn.algolia.com/api/v1/search?query=${searchTerm}`)
            .then(result=>result.json())
            .then(result=>{dispatcher({type:'LOAD_COMPLETE', payload:result.hits})})
            .catch(error=>{dispatcher({type:'LOAD_ERROR'})})
            break;
        case 'AXIOS':
            axios.get(`https://hn.algolia.com/api/v1/search?query=${searchTerm}`)
            .then(result=>{dispatcher({type:'LOAD_COMPLETE', payload:result.data.hits})})
            .catch(error=>{dispatcher({type:'LOAD_ERROR'})})
            break;
    }
}
function reducer(state,action ){
    switch (action.type){
        case 'LOAD_START':      return {data:state.data, loading:true, err:false};
        case 'LOAD_COMPLETE':   return {data:action.payload, loading:false, err:false};
        case 'LOAD_ERROR':      return {data:state.data, loading:false, err:true};
        case 'DEL_ITEM':        return {data:state.data.filter(i=>i.objectID !== action.payload),loading:false,err:false};    
        default:                throw new Error();
    }
}

function AppFunc({name}){
    const [searchCand, setSearchCand] = React.useState(localStorage.getItem('searchTerm')||'React');
    const [searchTerm, setSearchTerm] = useSemiPersistentState('searchTerm',searchCand);
    const [itemList, dispatchList] = React.useReducer(reducer, {data:[], loading:true, err:false})
 
    React.useEffect(()=>{requestLoading(searchTerm,dispatchList,'AXIOS')},[])

    function hSearchCand(value){setSearchCand(value)}
    function hSearchSubmit(){
        setSearchTerm(searchCand)
        requestLoading(searchCand, dispatchList,'AXIOS')
    }
    function hDel(objectID){dispatchList({type:'DEL_ITEM',payload:objectID})}

    return(
        itemList.err?       <h1> error in loading</h1> :
        itemList.loading?   <h2> data loading...</h2> : 
        <div>
            <SearchBox hsSubmit ={hSearchSubmit} hsCand={hSearchCand} sCand={searchCand} sTerm={searchTerm}>
                <strong>Search: </strong>
            </SearchBox>
            <MyList items={itemList.data} hDel = {hDel}/>
            <img src={logo} className = 'App-logo'/>
        </div>
    ); 
}

export default AppFunc;


*/