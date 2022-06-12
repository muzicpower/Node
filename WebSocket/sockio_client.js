//install socket.io-client module in addition to socket.io

let port = ~~process.argv[2]
const io = require("socket.io-client");

//let socket = io.connect("http://3.82.20.219:"+port) // windows -> aws
let socket = io.connect("http://localhost:"+port) // windows -> aws


socket.on("serverMsg", data=>{
    console.log(data)
    socket.close(); 
})

socket.emit("clientMsg", "This is from Windows after installing socket.io-client");

