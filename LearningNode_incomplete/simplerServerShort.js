

//declare var require: any;
let http = require('http');

let port = 10000;

http.createServer((req, res)=>{
	res.writeHead(200,{'Content-Type':'text/plain'});
	res.end('Hello World\n');
}).listen(port);

console.log(`Server listening at port ${port}`);
