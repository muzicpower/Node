/* Async-------------------------------------------------------------------------------------------------
//Parallel key points: 
    1. know how to use serial part and parallel part using callback.
    2. know how to ensure total operaion is complete
        - leaf counting was used

//Serial key points: 
    1. defining cb correctly was the hard part
        - being invoked when 'all siblings of the same level' are completed, not just a particular node of the tree
    2. once CB is corectly defined recursively, how CB should be constructed when going down vertically becomes clear

*/

let internetPages = {
"www.myHome.com": {url: "www.myHome.com", content: "This is welcome page", links:["careers","about","contact"], delay:0},
    careers:{url:"careers", content: "We have opening positions!", links:["swe","pm"], delay:700},
        swe:{url:"swe", content: "swe is the most important role", links:["fe","be"], delay:1000},
            fe:{url:"fe", content: "able to html,css,js,react", links:[], delay:700},
            be:{url:"be", content: "express,nodejs,mongoDB", links:[], delay:300},
        pm:{url:"pm", content: "pm plays important role in our company", links:[], delay:500},

    about:{url: "about", content: "We are aspiring SWE prep studeuts", links:[], delay:100},
    contact:{url: "contact", content: "You can reach us by following links", links:["phone","email"], delay:50},
        phone:{url:"phone", content: "this is my phone number: xxx-xxx-xxxx", links:[], delay:2000},
        email:{url:"email", content: "this is email:xxx@xxx.xxx", links:[], delay:300},
}
let savedPages = {}

function downloadPageAsync(url, cb){ //(cb(err, result))
    let delay = internetPages[url].delay;
    setTimeout(()=>{
        if (!internetPages[url]) return cb( new Error('page not found url: ' + url), null)
        console.log(JSON.stringify(internetPages[url], null, 2)) //debug
        cb(null, internetPages[url])
    },delay)
}

let savePagesParaAsync = ((_leafCnt = 0, _totalLeaves = 1)=>{return (url,cb)=>{ //breadth first search in async 
    if (!savedPages[url]) {
        downloadPageAsync(url, (err, result)=>{
            if (err) return console.log(`download error at url ${url}, ${err}`)
            savedPages[url] = result   //save
            
            result.links.forEach(i=>{savePagesParaAsync(i,cb)})

            if (result.links.length) _totalLeaves += result.links.length -1
            else if(++_leafCnt == _totalLeaves) cb()
        })
    }}
})()

let savePagesSeriAsync = (urlList, idx, cb)=>{
    if (idx == urlList.length) return cb()
    
    let url = urlList[idx]
    if (!savedPages[url]){
        downloadPageAsync(url, (err, result)=>{
            if (err) return console.log(`download error at url ${url} with error[${err}]`)
            savedPages[url] = result //save

            if (result.links.length == 0) savePagesSeriAsync(urlList, idx+1, cb)
            else savePagesSeriAsync(result.links,0,()=>{savePagesSeriAsync(urlList, idx+1, cb)})
        })
    }
}

/*
savePagesParaAsync("www.myHome.com", ()=>{
    console.log("----------Parallel Async-------------")
    console.log(JSON.stringify(savedPages, null, 2))
})
*/

savePagesSeriAsync(["www.myHome.com"],0, ()=>{
    console.log("----------Serial Async-----------------------")
    console.log(JSON.stringify(savedPages, null, 2))
})


/*------------------------------------------------------------------------------------------
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