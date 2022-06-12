
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
