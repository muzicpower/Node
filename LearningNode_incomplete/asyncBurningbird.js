
//declare var require: any;
let port = 10004;

require('http').createServer((req, res)=>{
	// demultiplex according to req

	// respond
	let name = require('url').parse(req.url, true).query.name;

	if (name === undefined) name = 'world';
	if (name == 'burningbird') {
		let fs = require('fs');
		let file = 'img.png'
		fs.stat(file, (err,stat)=>{
			if(err){
				console.error(err);
				res.writeHead(200, {'Content-Type':'text/plain'})
				.end('Sorry, burningbird is not around right now\n');
			}
			else{
				//1. sync 
				//res.contentType = 'image/png';
				//res.contentLength = stat.size;
				//res.end(fs.readFileSync(file), 'binary');

				//2. async
				//fs.readFile(file,(err,data)=>{res.end(data,'binary');});

				//3. async w/ single call and chaining
				fs.readFile(file,(err,data)=>{
					res.writeHead(200,'OK',{'Content-Type': 'image/png',
											'Content-Length': stat.size})
					.end(data,'binary');});
			}
		});	
	}
	else{
		res.writeHead(200, 'OK',{'Content-Type':'text/plain'})
		.end('Hello ' + name + ' again\n');
	}
}).listen(port);

console.log(`Server listening at port ${port}`);
