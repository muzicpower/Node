
//declare var global : any;
//console.log(global)

process.stdin.setEncoding('utf8');
console.log('enter:');

process.stdin.on('data',input=>{
	process.stdout.write(input.toString().toUpperCase());		
	if (input.toString().trim() == 'exit') process.exit(0);
});
