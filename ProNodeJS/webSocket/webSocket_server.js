/*
WebSocket vs TCP vs UDP
It depends on your exact use case:

WebSockets are established by first doing a HTTP connection and then upgrading this to the WebSocket protocol.
 Thus the overhead needed to exchange the first message considerably higher than with simple sockets. 
 But if you just keep the connection open and exchange all messages through a single established socket 
 then this does not matter much.
There is a small performance overhead because of the masking. But these are mainly simple computations (XOR) 
so they should not matter much.
It takes a little bit more bandwidth because of the framing. But this should not really matter much.

On the positive side it works much better (but not always perfect) together with existing firewalls and proxies 
so it integrates easier into existing infrastructures. You can also use it more easily with TLS because 
this is just WebSocket upgrade inside HTTPS instead of inside HTTP.
Thus if you must integrate into existing infrastructure with firewalls and proxies then WebSockets might be the better choice. 
If your application is performance heavy and needs every tiny bit of bandwidth, processor time and the lowest (initial) latency 
then plain sockets are better.

Apart from that if latency is really a problem (like with real time audio) then you might better not use any TCP based protocol, 
like TCP sockets or WebSockets. In this case it might be better to use UDP and deal with the potential packet loss, 
reordering and duplication inside your application.
*/

//server that combines WebSocket and normal http server
/*
Refs:

1. https://en.wikipedia.org/wiki/WebSocket

2. https://javascript.info/websocket

3. https://socket.io/docs/v4/
    - ws Server
        - import { WebSocketServer } from "ws";
        - const server = new WebSocketServer({ port: 3000 });
    - ws Client
        - const socket = new WebSocket("ws://localhost:3000");

//<script src="../node_modules/ws/lib/websocket.js"></script>     
*/
let port = ~~process.argv[2]

let http = require('http')
let nstatic = require('node-static')
let fileServ = new nstatic.Server('./data')

let serv = http.createServer((req,res)=>{
    fileServ.serve(req,res);
    console.log('http connection esta')

    req.on('data', data=>{
        console.log('http onData')
    })
    req.on('end', ()=>{
        console.log('http end')
    })    
//for aws, 'private ip' should be put rather than 'localhost' or 'public ip'
}).listen(port, "localhost",()=>{console.log(`listening on port ${port}`)})

let wsServer = new (require('ws').Server)(
    {
        server: serv  //not necessary. can go without http server object       
        //port: port
    }
)

wsServer.on('connection', ws=>{
    console.log('ws connection esta')
    ws.on('message', (message,flags)=>{
        console.log(`ws recv:${message}`)
        ws.send('>>>'+message+'<<<', flags)
    })
    ws.on('close', ()=>{
        console.log('ws close')
    })
    ws.on('error', error=>{
        console.log(`ws error:${error}`)
    })
})

