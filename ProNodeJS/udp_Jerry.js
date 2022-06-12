
let dgram = require('dgram')
let sendPort = 20100
let recvPort = 30000

let buff = Buffer.from("Hello UDP! I am jerry")
let g_sendCnt = 0;
let g_int = 0;

let sendSock = dgram.createSocket('udp4')
let recvSock = dgram.createSocket('udp4')
recvSock.on('message',(msg,rinfo)=>{
    console.log(`${rinfo.address}:${rinfo.port}> ${msg.toString()} [${rinfo.size} bytes]`)
})

recvSock.bind(recvPort,()=>{
    console.log(`UDP socket open at: ${recvSock.address().address}:${recvSock.address().port}`);
});

g_int = setInterval(()=>{
    if (++g_sendCnt == 5){
        clearInterval(g_int)
    }
    sendSock.send(buff,0,buff.length,sendPort,"localhost")
},500)

