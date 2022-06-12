
/*
Ref:
https://www.npmjs.com/package/http-proxy

Key Points:
1.  - start (nWorker) of servers from proxy_workers.js 
    - start only 'proxy init' portion
    - each server has its own process
or

2.  - go with 'worker init' + 'proxy init' all in the same process
    - useful for quick run

*/



let proxyPort = ~~process.argv[2]
let basePort = 9000
let nWorker = 6
let cnt = 0;

/*
//worker init
{
    let namedFunc = _name=>{
        return (req,res)=>{
            console.log(`name: ${_name} pid:${process.pid} url:${req.url}`)
            res.writeHead(200).end(`Hello! sent from ${_name}`)
        }
    }
 
    for (let port = basePort; port < basePort+nWorker; port++)
        require('http').createServer(namedFunc('serv #'+(port-basePort)))
        .listen(port, ()=>{console.log(`pid:${process.pid} listening on port: ${port}`)})
}
*/
//proxy init
let proxy = require('http-proxy').createProxyServer({})
require('http').createServer((req,res)=>{ //proxy itself is a webserver which delegates task to upstream servers
    console.log(`connection to proxy cnt: ${cnt}`)
    proxy.web(req,res,{target:'http://localhost:' + (basePort+(cnt=(cnt+1)%nWorker))}, err=>{}) //internal port: upstream server
    //proxy.on('error', error=>{})

}).listen(proxyPort, ()=>{console.log(`listening on port: ${proxyPort}`)}) //proxy port: end-user interface

