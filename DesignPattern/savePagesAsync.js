/* 
//Part 1. callback 
//Parallel key points: 
    1. know how to use serial part and parallel part using callback.
    2. know how to ensure total operaion is complete
        - leaf counting was used

//Serial key points: 
    1. defining cb correctly was the hard part
        - being invoked when 'all siblings of the same level' are completed, not just a particular node of the tree
    2. once CB is corectly defined recursively, how CB should be constructed when going down vertically becomes clear

//Part 2. promise
//Parallel: ok
//Serial: dirty code: OldReso
    - Make it elegant : need more thinking

*/

let internetPages = {
"www.myHome.com": {url: "www.myHome.com", content: "This is welcome page", links:["careers","contact","about"], delay:0},
    careers:{url:"careers", content: "We have opening positions!", links:["swe","pm"], delay:700},
        swe:{url:"swe", content: "swe is the most important role", links:["fe","be"], delay:1000},
            fe:{url:"fe", content: "able to html,css,js,react", links:["react","angular"], delay:700},
                react:{url:"react", content: "react is pretty good", links:[], delay:300},
                angular:{url:"angular", content: "Angular best framework for fe", links:[], delay:200},
            be:{url:"be", content: "express,nodejs,mongoDB", links:[], delay:300},
        pm:{url:"pm", content: "pm plays important role in our company", links:[], delay:500},

    about:{url: "about", content: "We are aspiring SWE prep studeuts", links:[], delay:100},
    contact:{url: "contact", content: "You can reach us by following links", links:["phone","email"], delay:50},
        phone:{url:"phone", content: "this is my phone number: xxx-xxx-xxxx", links:[], delay:200},
        email:{url:"email", content: "this is email:xxx@xxx.xxx", links:[], delay:300},
}

//Part 1. callback-----------------------------------------------------------------------------------
/*
function downloadPageAsync(url, cb){ //(cb(err, result))
    let delay = internetPages[url].delay;
    setTimeout(()=>{
        if (!internetPages[url]) return cb( new Error('page not found url: ' + url), null)
        console.log(JSON.stringify(internetPages[url], null, 2)) //debug
        cb(null, internetPages[url])
    },delay)
}

let cbRunner = ((_leafCnt = 0, _totalLeaves = 1)=>{return (numNodes,cb)=>{
    if (numNodes) _totalLeaves += numNodes -1
    else if(++_leafCnt == _totalLeaves) cb()
}})()

let savePagesParaAsync = ((_savedPages={})=>{return (url,cb)=>{ //breadth first search in async 
    if (!_savedPages[url]) {
        downloadPageAsync(url, (err, page)=>{
            if (err) return cb(`download error at url ${url}, E: ${err}`,null)
            _savedPages[url] = page   //save
            page.links.forEach(i=>{savePagesParaAsync(i,cb)})
            cbRunner(page.links.length, ()=>{cb(null,_savedPages)})            
        })
    }
    else{
        _savedPages[url].links.forEach(i=>{savePagesParaAsync(i,cb)})
        cbRunner(_savedPages[url].links.length, ()=>{cb(null,_savedPages)})
    }
}})()

let savePagesSeriAsync = ((_savedPages={})=>{return (urlList, idx, cb)=>{
    if (idx == urlList.length) return cb(null,_savedPages)
    
    let url = urlList[idx]
    if (!_savedPages[url]){
        downloadPageAsync(url, (err, page)=>{
            if (err) return cb(`download error at url ${url}, E: [${err}]`,null)
            _savedPages[url] = page //save
            savePagesSeriAsync(page.links,0,()=>{savePagesSeriAsync(urlList, idx+1, cb)})
            //if (result.links.length == 0) savePagesSeriAsync(urlList, idx+1, cb)
            //else savePagesSeriAsync(result.links,0,()=>{savePagesSeriAsync(urlList, idx+1, cb)})
        })
    }
    else savePagesSeriAsync(_savedPages[url].links,0,()=>{savePagesSeriAsync(urlList, idx+1, cb)})
}})()


savePagesParaAsync("www.myHome.com", (err,result)=>{
    if (err) return console.log(err)
    console.log("----------Parallel Async-------------")
    console.log(JSON.stringify(result, null, 2))
})


savePagesSeriAsync(["www.myHome.com"],0, (err,result)=>{
    if (err) return console.log(err)
    console.log("----------Serial Async----------------")
    console.log(JSON.stringify(result, null, 2))
})
*/


//Part 2. Promise ------------------------------------------------------------------------------------------
function downloadPagePromise(url){ //(cb(err, result))
    return new Promise((res,rej)=>{
        let delay = internetPages[url].delay;
        setTimeout(()=>{
            if (!internetPages[url]) rej('page not found url: ' + url)
            else res(internetPages[url])
            console.log(JSON.stringify(internetPages[url], null, 2)) //debug
        },delay)
    })
}

let cbRunnerPromise = ((_leafCnt = 0, _totalLeaves = 1)=>{return (numNodes,cb)=>{
    if (numNodes) _totalLeaves += numNodes -1
    else if(++_leafCnt == _totalLeaves) cb()
}})()

let savePagesParaPromise = ((_savedPages = {})=>{return (url)=>{
    return new Promise((reso,rej)=>{
        if (!_savedPages[url]) {
            downloadPagePromise(url)
            .then(page=>{
                _savedPages[url] = page   //save
                page.links.forEach(i=>{savePagesParaPromise(i)
                    .then(result=>{reso(result)}, reject=>{rej(reject)})})
                cbRunnerPromise(page.links.length, ()=>reso(_savedPages))            
            },err=>{rej(`download error at url ${url}, E: ${err}`)})
        }
        else{
            _savedPages[url].links.forEach(i=>{savePagesParaPromise(i)
                .then(result=>{reso(result)},reject=>{rej(reject)})})
            cbRunnerPromise(_savedPages[url].links.length, ()=>reso(_savedPages))
        }
    }) 
}})()

//somehow it's working but very dirty code: fix it later
//OldReso is to keep the row-uniform resolve object
let savePagesSeriPromise = ((_savedPages={})=>{return (urlList, idx, oldReso)=>{
    return new Promise((reso,rej)=>{
        if (!oldReso) oldReso = reso;
        if (idx == urlList.length)return oldReso(_savedPages)
            
        let url = urlList[idx]
        if (!_savedPages[url]){
            downloadPagePromise(url)
            .then (page=>{
                _savedPages[url] = page //save
                savePagesSeriPromise(page.links,0,null).then(r=>{ savePagesSeriPromise(urlList,idx+1, oldReso)
                })
            },err=>{rej(`download error at url ${url}, E: [${err}]`)})
        }
        else // not implemented because the logic is so dirty
        ;
    })
}})()

/*
savePagesSeriPromise(["www.myHome.com"],0, null)
.then(  result=>{console.log("Seri Promise: ------------------");console.log(result);},
        error=>{console.log(error)})
*/

savePagesParaPromise("www.myHome.com")
.then(  result=>{ console.log("Para Promise: ------------------");console.log(result);},
        error=>{console.log(error)})




/*------------------------------------------------------------------------------------------

//1. which resolve take effect?
function C(){return new Promise((res,rej)=>{
    res(()=>{console.log('____ccc___')})
})}

function B(){return new Promise((res,rej)=>{
    //res('bbb')
})}

function A(){
    return new Promise((res,rej)=>{
        B().then(result=>{res(result)}) //even if B is called first, if res is not called innermost part of B, C will take over res
        C().then(result=>{res(result)})
    })
}
//A().then(res=>{res()})


//Sync
function downloadPage(url){
    if (!internetPages[url]) throw new Error('page not found url: ' + url) 
    return internetPages[url]
}
function savePages(url){ //stores all pages into pageVector
    if (!savedPages[url]) savedPages[url] = downloadPage(url)
    savedPages[url].links.forEach(i=>{savePages(i)})
}
savePages("www.myHome.com")
console.log(JSON.stringify(savedPages, null, 2))


*/