/* 
part 1. convert sync -> async

*/

function cb(res){console.log(`fibo: ${res}`)}
function fibo(n){return n<3? n : fibo(n-1) + fibo(n-2);}

function s2aNextTick(func,a, cb){ process.nextTick(()=>{cb(func(a))})}
function s2aSetImmediate(func, a, cb){setImmediate(()=>{cb(func(a))})}
function s2aSetTimeout(func, a, cb){setTimeout(()=>{cb(func(a))})}


function s2aPromise(func, a, cb){
	Promise.resolve().then(()=>{cb(func(a))})
	//new Promise(r=>r()).then(()=>{cb(func(a))})
}
async function s2aAwait(func, a, cb){ //'async' keyword == make it 'async' after await 
	//await (()=>{console.log('await part')})()
	await {}	// dummy sync part
	cb(func(a)) 	// async part : put your async code here 
}

//------------------------------------------------------------------------------------------

console.log('before')


//cb(fibo(41))   //sync
//s2aNextTick(fibo,41, cb)
//s2aSetImmediate(fibo,41,cb)
//s2aSetTimeout(fibo,41,cb)

s2aPromise(fibo,41,cb)
//s2aAwait(fibo,41, cb)

console.log('after')


/*
part 2. how to convert async -> sync ?
- can we retrieve CB's that's already queued before control reached the end of the code? 
    - this seems impossible
    - once a certain CB is put into event Q, there is no way to process that CB before the control reach the end of the current operation

- Thus, the only way to make it synchronous is to NOT queue CB's in the first place.
- It looks impossible to convert a async to sync just by wrapping it with keywords such as await or promise because async already sent CB into event Q

*/