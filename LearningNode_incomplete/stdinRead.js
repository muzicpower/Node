

process.stdin.setEncoding('utf8');
console.log('enter:');
/*
process.stdin.on('data',input=>{
	process.stdout.write(input.toString().toUpperCase());		
	if (input.toString().trim() == 'exit') process.exit(0);
});
*/

//
process.stdin.on('readable',()=>{
	let readLine = process.stdin.read();

	process.stdout.write(readLine.toUpperCase());		
	if (readLine.trim() === 'exit') process.exit(0);

	process.stdin.read(); //to remove null character in buffer
	//otherwise,the process won't be in pause and thus will terminate
});
