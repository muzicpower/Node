
//declare var global : any;
//console.log(global)
declare var process : any;
process.stdin.setEncoding('utf8');
console.log('enter something:');

process.stdin.on('readable',()=>{
	let readLine = process.stdin.read();
	process.stdout.write(readLine.toUpperCase());		
	if (readLine.trim() === 'exit') process.exit(0);

	process.stdin.read();
	//to remove null character in buffer
	//otherwise,the process won't be in pause and thus will terminate
});
