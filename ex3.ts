
//declare var global : any;
//console.log(global)
declare var process : any;

process.stdin.setEncoding('utf8');

process.stdin.on('readable',()=>{
	let readLine = process.stdin.read();

	if (readLine !== null){
		process.stdout.write(readLine.toUpperCase());		

		if (readLine.trim() == 'exit'){
			process.stdout.write('good bye\n');
			process.exit(0);
		}
		process.stdin.read(); 
	//this reads null charater which makes process to go into 'listening mode' waiting for another 'readable' event
	}
});
