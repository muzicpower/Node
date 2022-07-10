import React from 'react'
import logo from './logo.svg'
import './app.css'
import axios from 'axios'

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
        return (
        <div>
            <img src={logo} className = 'App-logo'/>
            <h1>Exported and still working? {this.props.name}</h1>
        </div>
        );
    }
}
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
function MyList({items, hDel}){
    return items
    .map((item,idx)=>{ return(
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

const SearchBox = ({hSearchSubmit, hSearchCand, searchCand, searchTerm, children})=>{ //children: keyword
    return( // <></> == binder so that there can be multiple top-level elements
        <> 
            <label htmlFor="search">{children} </label>
            <input type="text" onChange={event=>hSearchCand(event.target.value)} value={searchCand}/> &nbsp; &nbsp;&nbsp;
            <button onClick={hSearchSubmit}> Submit </button>
            <br/><br/>
            <p> Searching for {searchTerm} </p>
        </>
    )
}

const useSemiPersistentState = (key, initVal)=>{ //encapsulate state with getter/setter and localStorage and useEffect
    let [val, setState] = React.useState(localStorage.getItem(key)||initVal)
    React.useEffect(()=>{localStorage.setItem(key,val)},[val])
    return [val, setState]
}

export function AppFunc({name}){
    const [searchCand, setSearchCand] = React.useState(localStorage.getItem('searchTerm')||'React');
    const [searchTerm, setSearchTerm] = useSemiPersistentState('searchTerm',searchCand);
    function reducer(state,action ){
        switch (action.type){
            case 'LOAD_START':      return {data:state.data, loading:true, err:false};
            case 'LOAD_COMPLETE':   return {data:action.payload, loading:false, err:false};
            case 'LOAD_ERROR':      return {data:state.data, loading:false, err:true};
            case 'DEL_ITEM':        return {data:state.data.filter(i=>i.objectID !== action.payload),loading:false,err:false};    
            default:                throw new Error();
        }
    }
    const [itemList, dispatchList] = React.useReducer(reducer, {data:[], loading:true, err:false})

    function requestLoading(searchTerm, msec){
        dispatchList({type:'LOAD_START'})
        /*
        //1. local + delay
        let filteredItemList = itemListInit.filter(i=>i.title.toLowerCase().includes(searchTerm.toLowerCase()));
        (new Promise((resolve,reject)=>{setTimeout(()=>{resolve({data:{stories:filteredItemList}})},msec)}))     
        .then(result=>{dispatchList({type:'LOAD_COMPLETE', payload:result.data.stories})})
        .catch(error=>{dispatchList({type:'LOAD_ERROR'})})
        */
        /*
        //2. fetch
        fetch(`https://hn.algolia.com/api/v1/search?query=${searchTerm}`)
        .then(result=>result.json())
        .then(result=>{dispatchList({type:'LOAD_COMPLETE', payload:result.hits})})
        .catch(error=>{dispatchList({type:'LOAD_ERROR'})})
        */
        //3. axios
        axios.get(`https://hn.algolia.com/api/v1/search?query=${searchTerm}`)
        .then(result=>{dispatchList({type:'LOAD_COMPLETE', payload:result.data.hits})})
        .catch(error=>{dispatchList({type:'LOAD_ERROR'})})
    }    
    React.useEffect(()=>{requestLoading(searchTerm,300)},[])

    function hSearchCand(value){setSearchCand(value)}
    function hSearchSubmit(){
        setSearchTerm(searchCand)
        requestLoading(searchCand,300)
    }
    function hDel(objectID){dispatchList({type:'DEL_ITEM',payload:objectID})}

    return(
        itemList.err?       <h1> error in loading</h1> :
        itemList.loading?   <h2> data loading...</h2> : 
        <div>
            <SearchBox hSearchSubmit = {hSearchSubmit} hSearchCand={hSearchCand} searchCand={searchCand} searchTerm={searchTerm}>
                <strong>Search: </strong>
            </SearchBox>
            <MyList items={itemList.data} hDel = {hDel}/>
            <img src={logo} className = 'App-logo'/>
        </div>
    ); 
}

//export default App;


/*
1. React.useRef() 

imperative React
const inputRef = React.useRef()

if (inputRef.current) inputRef.current.focus()

<Tagxxx ref = inputRef> //ref: keyword  

2. React.useCallback()
*/