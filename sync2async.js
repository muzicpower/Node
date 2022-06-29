/* 
part 1. convert sync -> async

*/

function cb(res){console.log(`fibo: ${res}`)}
function fibo(n){return n<3? n : fibo(n-1) + fibo(n-2);}

function s2aNextTick(func,a, cb){ process.nextTick(()=>{cb(func(a))})}
function s2aPromise(func, a, cb){(()=>Promise.resolve())().then(()=>{cb(func(a))})}

async function s2aAwait(func, a, cb){ //'async' keyword == make it 'async' after await 
	await (()=>{console.log('await part')})()
	//await {}	// dummy sync part
	cb(func(a)) 	// async part : put your async code here 
}

//------------------------------------------------------------------------------------------

console.log('before')


//cb(fibo(41))   //sync
//s2aNextTick(fibo,41, cb)
//s2aPromise(fibo,41,cb)
s2aAwait(fibo,41, cb)

console.log('after')


/*
part 2. how to convert async -> sync ?


*/