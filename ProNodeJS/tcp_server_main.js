//last update: 6/4/2022
//1. keypoint: sending socket object through IPC
//2. problem: how can I guarantee child's process.on('message') is executed before child.send('newConne',sock)? 
//  -> solved: make process pool first before creating server object and assign socket once connectoin is made

let net = require('net')
let cp = require('child_process')

let port = 20000
let workerPool = []
let maxWorker = 4
let server = null

function initWorker(num){
    for (let i = 0; i < num; i++){
        let worker = cp.fork(__dirname+'/tcp_server_worker.js',{stdio:"pipe"})
        worker.stdout.on('data', data=>{console.log(`${worker.pid}.out> ${data}`)})
        worker.stderr.on('data', data=>{console.log(`${worker.pid}.err> ${data}`)})
        worker.on('exit',    (code, signal)=>{console.log(`${worker.pid}.ext> exit: ${code} sig: ${signal}`)})
        worker.on('close',   (code, signal)=>{console.log(`${worker.pid}.clo> close: ${code} sig: ${signal}`)})
        worker.on('message', onMsg(worker, workerPool))
        //console.log(`worker pid:${worker.pid} stdin:${worker.stdin} stdout:${worker.stdout} stderr:${worker.stderr}`)
        workerPool.push(worker)
    }
}
function onMsg(_worker, _workerPool){return (msg)=>{ //handler for worker.send()
    console.log(`${_worker.pid}.msg> ${msg}`)
    if(msg === 'workFinished'){ // msg from worker process
        _workerPool.push(_worker);
        console.log(`worker retrived, workerPool size: ${_workerPool.length}`)        
    }
}}
function onNewConn(sock){
    if (workerPool.length > 0) workerPool.pop().send('newConn',sock) //sending msg + sock object to worker process via IPC 
    else sock.end(); //No available worker proc, ending connection
    console.log('workerPool size: ' + workerPool.length)
}

//execution starts here
initWorker(maxWorker);  

server = net.createServer({allowHalfOpen:false},sock=>{// event 'connection', net.Socket object
    console.log('connection from: ' + sock.remoteAddress + ':' + sock.remotePort)
    onNewConn(sock)
})
server.listen(port, 'localhost', ()=>{// event 'listening'
    console.log(`listening on port ${server.address().port}, ${server.address().family}`) 
})