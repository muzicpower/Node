/* 
part 1. convert sync -> async
    - same as "how to send a certain code block to eventQ so that it would be executed after all other sync code blocks are finished"

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
part 2. how to convert async -> sync ? (await == guarantee of order ins ASYNC dimension (event Q))
- can we retrieve CB's that's already queued before control reached the end of the code? 
    - once a certain CB is put into event Q, there is no way to process that CB before the control reach the end (of sync operation)

    - setTimeout(()=>{console.log('time is up')}, 500)
      fibo(45) //takes 10 seconds
    - above code always results in fibo(45) first and 'time is up' last
    - this proves that no CB's in the eventQ is never gets fetched before current sync code block is finished

- Thus, the only way to make it synchronous is to NOT queue CB's in the first place.
- await is not making something sync, but more about guaranteeing the order of execution (like, (stmt1), promise.then(stmt2)) in ASYNC dimension
- ex. 
  await stmt1
  stmt2
    - now stmt2 is automatically in async dimension (event Q)
    - everything after await statement is automatically queued into eventQ and the order is guaranteed (stmt2 after stmt1)

*/