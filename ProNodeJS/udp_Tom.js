
let dgram = require('dgram')
let sendPort = 30000
let recvPort = 20100

let buff = Buffer.from("This is Tom jaja")
let g_sendCnt = 0;
let g_recvCnt = 0;
let g_int = 0;

let sendSock = dgram.createSocket('udp4')
let recvSock = dgram.createSocket('udp4')

recvSock.on('message',(msg,rinfo)=>{
    console.log(`${rinfo.address}:${rinfo.port}> ${msg.toString()} [${rinfo.size} bytes]`)
    if (++g_recvCnt == 4)
        g_int = setInterval(()=>{
            if (++g_sendCnt == 8){
                clearInterval(g_int)
            }
            sendSock.send(buff,0,buff.length,sendPort,"127.0.0.1")
        },500)
    
})
recvSock.bind(recvPort,()=>{
    console.log(`UDP socket open at: ${recvSock.address().address}:${recvSock.address().port}`);
});

