

/*
//1. promise & then

console.log('before'); //omitting semi colon caused error
//Promise.resolve('start')
//Promise.reject('start')

(new Promise((resolve, reject)=>{reject('alright'); console.log('inside reject---')}))
.then(  resolve=>{  console.log('resolve 1:' + resolve)
                    throw new Error('error1')}, 
        reject=>{   console.log('rejected: ' + reject)
                    //throw new Error('error___1') 
                    //return Promise.reject('rejrej')
                    return new Promise((res,rej)=>{rej('another reject')})
                    //return 'okokok'     
                    //return Promise.resolve('okokok')
    })
.then(  resolve=>{  console.log('resolve 2: ' + resolve)}, 
        reject=>{   console.log('reject 2: '+ reject )
                    return 'ok'})
.then(  resolve=>{  console.log('resolve 3:' + resolve)},
        rej=>{ console.log('reject 3')})

console.log('after');

//2. destructuring with '...'
function A(...args){
    console.log('A: ' + args)       // toString flattens multi nested array. So this does not reflect true structure of args
    console.log([args,100])         
    console.log([...args, 200])     // '...' destructures only one level of nesting. No complete flattening
    console.log(...[...args, 300])  // same as console.log(...args,300)
}
A(1,[[2],3],4)
let k = [[1,2],3,[4,[5,[6,7,8]]]]
console.log(''+k)
*/
//3. converting CB based function to Promise based
/* 
key points: when to use (return Promise.resolve/reject vs return new Promise((res,rej)=>{})
0. in order to continue with '.then', we have to use 'return' either with new Promise or Promise.resolve/reject
1. Promise.resolve/reject can be used when we know if it's resolve/reject at present time(sync.)
2. new Promise((res,rej)=>{}) is used when we don't know if it's resolve/reject at present time.
    Inside (res,rej)=>{}, anything can be executed even if it is another time point(async.)
    - in this example,as inside cb of cbAPI
    - Inside (res,rej)=>{}, all that matters is whether res or rej is called, regardless of time it's called
3. use of ...args 

let newArg = [arg, (err, res)=>{
        if (err) return Promise.reject(err)
        return Promise.resolve(res)
}]
return cbAPI(newArg) //wrong: cbAPI has no return value. Thus cannot continue with '.then' 
*/
/*             
function promisefy(cbAPI){ return function promisedfied(...arg){
    return new Promise((res,rej)=>{
        let newArg = [...arg,
        (err,result)=>{
            if(err) rej(err)
            else res(result)
        }]
        cbAPI(...newArg)
    })
    }
}
*/


//4. Async & Await
//await == guarantee of order or execution. BUT all within the defined async function
//that is why the order of execution is disrupted when compared to function outside async function
//async function implicitly returns promise
/*
function p(msg, msec){
    return new Promise((resolve,reject)=>{setTimeout(()=>{resolve(msg)},msec)})
}
    
console.log('start');

(async ()=>{
    console.log(`before`)
    console.log(`round 1: ${await p('alright', 2000)}`)
    console.log(`mid`)
    console.log(`round 2: ${await p('ok ok', 3000)}`)
    console.log('after')
    return 'this is return value of async'
})().then(result=>{console.log(result)})

console.log('end');

*/
let pgen = ()=>{
    return new Promise((res,rej)=>{})
}
let test = (()=>{return async(arg)=>{
    await pgen()
    console.log('hello')
}})()

test()