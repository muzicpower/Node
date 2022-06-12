/*
Refs:
1. https://socket.io/get-started/chat
    - const { Server } = require("socket.io");

2. https://socket.io/docs/v4/
    - ws Server
        - import { WebSocketServer } from "ws";
        - const server = new WebSocketServer({ port: 3000 });
    - ws Client
        - const socket = new WebSocket("ws://localhost:3000");
    
    - Server
        - import { Server } from "socket.io";
        - const io = new Server(3000);
    - client
        - import { io } from "socket.io-client";
        - const socket = io("ws://localhost:3000");

    - Features
        - 0. Socket.IO indeed uses WebSocket for transport when possible, 
            it adds additional metadata to each packet
        - 1. HTTP long-polling fallback
        - 2. Automatic reconnection
        - 3. Packet buffering
    - timeout from server : socket.timeout(5000).emit("hello", "world", (err, response) 
    - broadcast : io.emit('my msg to broadcast') (not socket object)
    - multicast : io.to('group name').emit('multicast msg')
    - multiplex : io.of("/admin").on("connection", socket => )

*/


let port = ~~process.argv[2]

let http = require('http')
let socketio = require('socket.io')
let nstatic = require('node-static')
let fileServ = new nstatic.Server('./data')

let serv = http.createServer((req,res)=>{
    //res.sendFile(__dirname + '/index.html');
    console.log('http connection esta')
    fileServ.serve(req,res);
}).listen(port, "localhost", ()=>{console.log(`listening on port ${port}`)})

let io = socketio(serv)

io.on('connection', sock=>{
    console.log('sockio connection esta')
    sock.on('clientMsg', data=>{
        console.log(`sockio recv:${data}`)
        // how to broadcast?
        sock.emit('serverMsg','##' + data + '##')
    })
    sock.on('disconnect', ()=>{
        console.log('sockio disconnect')
    })
    sock.on('error', error=>{
        console.log(`sockio error:${error}`)
    })
})

console.log(process.cwd())
