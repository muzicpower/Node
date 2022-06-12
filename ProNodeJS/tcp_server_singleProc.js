let net = require('net')
let port = 20000

var g_sendCnt = 0;
var h_int = 0;
function intvSend(sock, data, n){

    h_int = setInterval(()=>{
        sock.write(`${++g_sendCnt}: ${data}`)

        if (g_sendCnt == n){
            clearInterval(h_int)
            //sock.end(); //server driven closing
            g_sendCnt = 0;
            h_int = 0;
        }
    },500)
}

function onData(sock){ return (data)=>{
        let cInfo = sock.remoteAddress + ':' + sock.remotePort
        console.log(`from ${cInfo}: ${data.toString()}`)
    }
}
function onEnd(sock){ return (data)=>{
    let cInfo = sock.remoteAddress + ':' + sock.remotePort
    console.log(`received end from client. Closing connection.. ${cInfo}`)
    sock.end();
}}
let tcpServer = net.createServer({allowHalfOpen:false},sock=>{//same as tcpServer.on('connection', CB)
    //net.Socket
    let strClientInfo = sock.remoteAddress + ':' + sock.remotePort
    console.log('connection from: ' + strClientInfo)
    let msg ='<!DOCTYPE html><html><head></head><body>Welcome to my server</body></html>';
    //sock.write(msg) 
    //sock.end(msg) //send msg and half-close socket. sock.write to keep connection fully open
    intvSend(sock, msg, 7)
    sock.on('data', onData(sock))
    sock.on('end', onEnd(sock))
})
tcpServer.listen(port, 'localhost', ()=>{//same as CB in tcpServer.on('listening', CB)
    console.log(`listening on port ${tcpServer.address().port}, ${tcpServer.address().family}`) 
})

tcpServer.on('error', err=>{
    if (err.code == 'EADDRINUSE')
        console.log('Port is already in use')
})

