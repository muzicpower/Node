
//declare var require:any;
let E = require('events').EventEmitter;

class MyE extends E{};

let m = new MyE();
let cnt = 0;

MyE.prototype.myFunc = (arg)=>{console.log(arg);}

m.on('eve', ()=>{m.myFunc(cnt++)});


let intv = setInterval(()=>{m.emit('eve');},500);
setTimeout(()=>clearInterval(intv),5000);
