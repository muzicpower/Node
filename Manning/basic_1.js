
//require('http').createServer((req,res)=>{res.end('hello http: ' + req.url)})
//listen(port,()=>{console.log(`listening on ${port}`)})


let port = ~~process.argv[2]
const express = require('express')
const morgan = require('morgan')
let app = express()


app.use(morgan('dev')) //combined, common, dev, short, tiny
app.use('/download',express.static(__dirname + '/public')) //static: must go with .use (.get won't work)

/*
let router = express.Router()
router.get('/helloWorld',(req,res)=>{
    res.send(`from router#1: url: ${req.url}, baseUrl: ${req.baseUrl} originalUrl: ${req.originalUrl}`)
})
app.use('/rt1',router)
*/

app.set("views",__dirname)
app.set("view engine", "ejs")

app.get('/ejs', (req,res)=>{
    res.render('index',{message:"Welcome to EJS test page!"})
})

//catch errors thrown by throw new Error('this is error from query router')
app.use((err,req,res,next)=>{console.log(`<<err>>: ${err}`)})

app.use('/',(req,res)=>{
    let filepath = __dirname + '/index.html'
    require('fs').stat(filepath,(err,stat)=>{
        if (err) res.status(500).send('internal server error')
        else res.sendFile(filepath)
    })
    //res.status(404).send(`File you requested is not found : ${req.ip}`)
})

app.listen(port,()=>{console.log(`listening on ${port}`)}) // == require('http').createServer(app, CB).listen(port,CB)

/*---------------------------------------------------------------------------------------
//EJS
    https://ejs.co/
    app.set('view engine', 'ejs')
    app.set('views', __dirname)  //views: keyword, mounting arg2 as base directory to search for files
    app.get('/ejsTest',(req,res)=>{res.render('index',{message:'hello ejs!!!'})}) // ./views/index.ejs 

//information transfer from server logic to EJS
    app.locals.attr1 = xxx
    res.locals.attr2 = yyy
    res.render('filename',{attr3: zzz})
    => attr1, attr2, attr3 can be used in EJS file which returns value of xxx,yyy,zzz respectively

//Jade & Pug
    https://jade-lang.com/api
    https://pugjs.org/language/doctype.html

//build app using 
    -ForecastIO     : latitude,longitude -> weather
    -Zippity-do-dah : zip -> latitude,longitude
    -practice more views (ejs) for dynamic page production



//test verb routing
    app.get('/CRUD', (req,res)=>{res.send(`just received GET`)})
    app.post('/CRUD', (req,res)=>{res.send(`received POST`)})
    app.put('/CRUD', (req,res)=>{res.send(`OK ok it's put`)})
    app.delete('/CRUD',(req,res)=>{res.send(`Delete? are you serious?`)})

    in WSL2, curl http://172.22.224.1:port/CRUD -XGET | -XPUT | -XPOST | -XDELETE

//Routing
    1.colon
        app.get('/time/:country/:region', (req,res)=>{res.send({  "your request for country" : req.params.country, "region" : req.params.region})})
        app.get('/random/:min/:max', (req,res)=>{
            let max = parseInt(req.params.max), min = parseInt(req.params.min)
            if (max <= min) res.status(404).send('bad request')
            elseres.json({"random" : min + Math.floor(Math.random()*(max-min+1)),})})

        app.get('/homePage/:userName/profile',(req,res,next)=>{
            res.send(`Welcome to ${req.params.userName}'s page`)})

    2. regular expression
        app.get(/^\d{3}-\d{3}-\d{4}$/, (req,res)=>{ // new RegExp('abc$') or /abc$/ 
        console.log(`original url: ${req.originalUrl}`)
        res.send(req.originalUrl)})
    
    3. req.query vs url.searchParams
        app.get('/query', (req,res,next)=>{
        console.log(`q: ${JSON.stringify(req.query)}`)
        let keyArray = Object.keys(req.query)
        //keyArray.forEach(i=>{console.log(`${i} -> ${req.query[i]}`)})
        for (let i = 0; i < keyArray.length; i++) console.log(`${keyArray[i]}:${req.query[keyArray[i]]}`)
        res.send(req.query)

        //console.log(`url: ${req.url}, base url: ${req.baseUrl}, org url: ${req.originalUrl}`)
        //let full = `${req.protocol}://${req.get('host')}${req.originalUrl}` //make a full url
        //let url = new URL(full) // require('url').URL is global
        //url.searchParams.forEach((val,key,searchParams)=>{console.log(`key: ${key} val: ${val} equal?: ${url.searchParams === searchParams}`)})
        })

//RegEx practice: followings are working fine here but not working in .get('regEx',...)
    let str = '4343-234-3245'
    console.log(/^abc/.test(str))
    console.log(/\babc/.test(str))
    console.log(/^\d{3}-\d{3}-\d{4}$/.test('d433-234-2345'))

//print all global variables
    function gVarList() {return Object.getOwnPropertyNames(this);} //what does 'this' refer to?
    console.log(gVarList())

//url parsing
    let url = new URL('http://www.abc.com:8080/subdir?key1=val1&key2=val2&key3=val3#exHash')
    console.log(url.searchParams.toString())
    console.log(url.protocol)
    console.log(url.host)
    console.log(url.hostname)
    console.log(url.port)
    console.log(url.pathname)
    console.log(url.search)
    console.log(url.hash)

//custom logger
    function myLogger(req,res,next){
        console.log(`[${new Date()}] ${req.method} url: ${req.url} `);
        next();
    }
    app.use(myLogger)

//custom static 
    const myStatic = (subdir)=> { return (req,res,next)=>{
    let filePath = __dirname + subdir + req.url

    require('fs').stat(filePath, (err, stat)=>{
        if (err) next()
        else if (stat.isFile()) res.sendFile(filePath)
        else next()
    })
    }}
    app.use('/download', myStatic('/public'))

//custom authentication: basically either next()(auth success) or ending connection by res.end() when fail
app.use((req,res,next)=>{
    if ((new Date()).getSeconds()%10  < 5){
        console.log('you passed the authentication')
        next()
    }
    else{
        console.log(`user failed authentication. `)
        res.end('your connection timing is wrong. Try again later')
    }
})  


---------------------------------------------------------------------------------------*/