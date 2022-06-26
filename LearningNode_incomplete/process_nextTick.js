
//declare var require :any;

let process = require('process');

function fib(n){
	if (n <3) return n;
	else return fib(n-1) + fib(n-2);
}

function fibIter(n){
	if (n < 3) return n;
	let a = 1;
	let b = 1;
	let cnt = 1;
	while(cnt++ < n)
	{
		let tmp = a+b;
		a = b;
		b = tmp;	
	}
	return b;
}

function A(){}
A.prototype.doSomething = function(a,f){

	if (typeof a !== 'number') a = null;
	if (typeof f !== 'function') f = null;
	if(a == null)
		f(new Error('null argument error'),null);
	
	process.nextTick(()=>{ f(null, fib(a));});}


let x = new A();
let fibSeed =  41;

x.doSomething(fibSeed, (err, fibVal)=>{
	if(err)
		console.log('error occurred');
	else
		console.log('fib ' + fibSeed + ' = ' + fibVal);
	});

console.log('fib '+fibSeed+ ' = ' + fibIter(fibSeed)+ ' iterative');
