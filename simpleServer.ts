
declare var require : any;
let port = 5003;
let server = require('http').createServer();

server.on('request', (req,res)=>{
	console.log('request');
	res.writeHead(200,'OK',{'Content-Type':'text/plain'});
	res.end('hello bastard!');
});

server.on('connection',()=>{ console.log('connection');});
server.listen(port,()=>{console.log('listen');});

console.log('server listening at port: ' + port);

