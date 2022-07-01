
//let process = require('process');

function fibo(n){ return n < 3? n : fibo(n-1) + fibo(n-2) }
function fiboIter(n){
	let a = b =  1;
	while(--n){
		let tmp = a+b;
		a = b;
		b = tmp;	
	}
	return b;
}
let fiboSeed = 41

function cbInvoker(arg,cb){ process.nextTick(()=>{ cb(null, fibo(arg));});}


cbInvoker(fiboSeed, (err, result)=>{
	if(err) console.log('error occurred');
	else console.log(`fiboSeed: ${fiboSeed}, val: ${result}`);
});

console.log(`fiboIter: ${fiboIter(fiboSeed)}`);

//key point: CB is executed later than fiboIter because it is invoked through eventQ (=== callback)