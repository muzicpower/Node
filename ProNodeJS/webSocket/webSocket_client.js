
//this works on Ubuntu but not on Windows (connection closed without even reaching the server)
//wsock.html works on Chrome browser tho

let port = ~~process.argv[2]
let WebSocket = require('ws')

let ws = new WebSocket('ws://3.82.20.219:' + port) //wsl->aws
//let ws = new WebSocket('ws://localhost:' + port) //wsl->wsl
//let ws = new WebSocket('ws://172.30.112.1:' + port) //not working


ws.on('open', ()=>{
    ws.send('Hello WebSocket!')
})

ws.on('error', (error)=>{
    console.log(`error:${error}`)
})

ws.on('message', (data, flag)=>{
    console.log(`recv:${data}`)
    ws.close()
})

/* //legacy code
// same client code as in ubuntu:: webSocket_client.js but connection fails without sending data in Windows

let port = ~~process.argv[2]
let  WebSocket = require('ws')

//let ws = new WebSocket('ws://3.82.20.219:'+port) //aws -> aws 
let ws = new WebSocket('ws://localhost:'+port) //windows -> wsl

ws.onopen = ()=>{
    ws.send('Hello WebSocket!')
}
ws.onmessage = (event)=>{
    console.log(`recv:${event.data}`)
    ws.close()
}
ws.onclose = (event)=>{
    if (event.wasClean)console.log(`connection closed cleanly ${event.code}:${event.reason}`)
    else console.log(`connection closed with some problem`)
}
ws.onerror = (error)=>{console.log(`error:${JSON.stringify(error)}`)}


let port = 25000
let http = require('http')

function getMsg(){

return 'In publishing and graphic design, Lorem ipsum is a placeholder text commonly \
used to demonstrate the visual form of a document or a typeface without relying on \
meaningful content. Lorem ipsum may be used as a placeholder before final copy is \
available.'

return require('querystring').stringify(
    {
        foo: "bar",
        baz: [1,2,3]    //creates 'foo=bar&baz=1&baz=2&baz=3'
    }
)
}
let msgBody = getMsg();
let req = http.request(
    {
        hostname:'localhost',
        port: port,
        method: 'GET',
        path: '/london/joe?key1=val1&key2=val2&state=Illinois',
        headers: 
            {
                'Host':'localhost:25000',
                'Content-Type':'application/x-www-form-urlencoded',
                'Content-Length': Buffer.byteLength(msgBody) //important
            }
    },
    (res)=>{
        //header info
        console.log(`${res.httpVersion} ${res.statusCode}:${res.statusMessage}`)
        let headers = res.headers
        if (headers)
            for (key in headers)
                console.log(`${key}:${headers[key]}`)
        
        //body
        res.setEncoding('utf8') //no need to Buffer.toString()
        res.on('data', data=>{console.log('----' + data)}) 
        res.on('end', ()=>{console.log('****')})
        res.on('error', error=>{console.log(`__error__:${error}`)})
    })

req.write(msgBody)
req.end() //actual sending of message(request) happens here, not in http.request

//make client using request module
*/