
declare var require : any;
let E = require('events').EventEmitter;

let event1 = 'aaa';
let cnt = 0;

class MyEmitter extends E{
}

let em = new MyEmitter();

em.on(event1, ()=>{console.log('cnt: ' + cnt++);});

//let intv = setInterval(()=>{em.myEmit()}, 500);
let intv = setInterval(()=>{em.emit(event1)}, 500);

setTimeout(()=>{clearInterval(intv);}, 3000);
