let net = require('net')
let port = 20000

sock = net.connect(
    {
        port:port,
        host:'localhost',
        allowHalfOpen: true // if false, upon server sending 'end', both sides are closed without calling end on client side 
    },
    ()=>{console.log(`connection established: `)
})

sock.on('data', data=>{ //event 'data'
    console.log(`data recv: ${data.toString()}`)
    sock.write('###' + data.toString().substring(0,18))
})

sock.on('end', ()=>{ console.log(`on end. sending end`); sock.end()})
sock.on('close', ()=>{console.log('on close. bidirectional shutdown')})
sock.setTimeout(3000,()=>{console.log(`3 sec elapsed. sending end to server..`); sock.end()})
