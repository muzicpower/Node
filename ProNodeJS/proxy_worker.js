
let port = ~~process.argv[2]

require('http').createServer((req,res)=>{
    console.log(`pid:${process.pid} url:${req.url}`)
    res.writeHead(200).end('hello world')
}).listen(port, ()=>{
    console.log(`pid:${process.pid} listening on port: ${port}`)
})