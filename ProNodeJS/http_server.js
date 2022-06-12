
//ToDo:
/* 
- 1. upgrade to multi-proc structure. i.e. main + worker process
- 2. make another version using connect module
        - let connect = require('connect')
        - app = connect()
        - app.use(connect.bodyParser())
        - app.use(connect.cookieParser())
        - app.use(xxxx)
        - app.use(CB) of my own
        - http.createServer(app).listen(port)
*/

let http = require('http')
let qs = require('querystring')

let server = http.createServer((req, res)=>{//req: http.IncomingMessage, req: http.ServerResponse
    //client info
    console.log(`. . . . ${req.socket.remoteAddress}:${req.socket.remotePort}, method:${req.method}, url:${req.url}, ver:${req.httpVersion}`)

    //header info
    console.log(`headers:`)
    for (let key in req.headers)
        console.log(`${key} : ${req.headers[key]}`)

    //sending must be done inside on('end') CB to ensure all the necessary data are transmitted
    if (typeof req.__msgBody === 'undefined') req.__msgBody = ''
    req.on('data', data=>{
        //debug
        console.log('onData')
        req.__msgBody += data.toString()
    })
    req.on('end', ()=>{ //would this be called in case of 'GET' where there is no body content? 
        //debug
        console.log('>>'+req.__msgBody+'<<')
        
        res.writeHead(200,'OK',
        {
            'Content-Type' : 'text/html',
            //'Content-Type' : 'text/plain',
            //same as setting cookies 3 times at once
            /*
            'Set-Cookie' :  ['name=Colin; Expires=Sat, 10 Jan 2035 20:00:00 GMT; Domain=foo.com; HttpOnly; Secure',
                             'foo=bar; Max-Age=3600',
                             'path=/abc/def'],
            */
        })

        switch(req.method){
            case 'GET': {
                //url & query info
                let urlQuery = require('url').parse(req.url, true).query
                if (urlQuery)
                    for (let key in urlQuery)
                        console.log(`${key} : ${urlQuery[key]}`)
        
                res.write('Hello <strong>HTTP!</strong>')
                res.write(req.__msgBody)
                res.end('^^end-msg^^')
                break;
            }
            case 'POST':{
                let msgBody = qs.parse(req.__msgBody)

                for (let key in msgBody)
                    res.write(key + ':' + msgBody[key])
                
                res.end()
                break;
            }
        }        
    })

})

server.listen(~~process.argv[2], 'localhost',()=>{
    console.log(`server started: ${server.address().address}:${server.address().port}`)
})

///////////////////////////////////////////////////////////////////////////////////////////
//misc topics
//////////////////////////////////////////////////////////////////////////////////////////

//1. print all status codes
/*
for(let i = 0; i < 700; i++)
    if(http.STATUS_CODES[i])
        console.log(`${i} : ${http.STATUS_CODES[i]}`)
*/

//2. createServer CB vs onConnection : onConnection is invoked first?
/*
const server = require('http').createServer((req,res)=>{
    if (req.url === '/'){
        res.write('Hello World, from NodeJS');
        res.end();
    }
    if (req.url === '/api/courses'){
        res.write(JSON.stringify([1,2,3]));
        res.end();
    }
    console.log(`log -- 1`)
}).listen(~~process.argv[2], ()=>{console.log(`listening on port ${~~process.argv[2]}`)})

server.on('connection', (socket) => {console.log('Newly connected');});
*/