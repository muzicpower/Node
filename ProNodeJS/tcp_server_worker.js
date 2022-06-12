
let intvSend = (()=>{ //another example of closure
    let _cnt = 0;
    let _hintv = 0;
    return (sock, data, n, mSec) => {
        _hintv = setInterval(()=>{
            sock.write(`${++_cnt}: ${data}`)
            if (_cnt == n){
                clearInterval(_hintv)
                _hintv = 0
                _cnt = 0
                //sock.end() //server driven closing
                //sock.setTimout(10000,()=>{sock.end()})
            }
        },mSec)
    }
})()

function onData(sock){ return (data)=>{
    let cInfo = sock.remoteAddress + ':' + sock.remotePort
    console.log(`${cInfo}] ${data.toString()}`)
}
}
function onEnd(sock){ return ()=>{
    let cInfo = sock.remoteAddress + ':' + sock.remotePort
    console.log(`${cInfo}] received end from client. Closing connection..`)
    sock.end()
}}
function onClose(sock){ return ()=>{
    let cInfo = sock.remoteAddress + ':' + sock.remotePort
    console.log(`${cInfo}] connection closed. Process terminating..`)
    process.send('workFinished') //IPC: report to master
    //process.exit(0);
}}

function genData(){
    return '<!DOCTYPE html><html><head></head><body>Welcome to my server</body></html>'
}
//execution starts here
process.on('message', (msg,sock)=>{ //IPC: from master 
    if(msg === 'newConn'){
        sock.on('data', onData(sock))
        sock.on('end', onEnd(sock))
        sock.on('close', onClose(sock))
        intvSend(sock, genData(), 7, 500)
    }
})

process.stdout.write('worker ready for socket')