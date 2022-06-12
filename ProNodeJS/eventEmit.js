
let EventEmitter = require('events').EventEmitter;

//0.basic event emitter
const emt = new (require('events'))();
emt.on('messageLogged', function(arg){console.log('Listener called', arg);});
emt.emit('messageLogged', {id: 1, url: 'http://'});

//1. emit chaining
let em = new EventEmitter();
em.on('my_msg', ((_cnt)=>{
    return arg=>{
        console.log('cnt ' + _cnt++ + ', arg: ' + arg);
        if (_cnt<5) em.emit('my_msg', _cnt*100);
    }})(0) //now cnt is hidden by closure
)
em.emit('my_msg', 17);

//2. inheriting EventEmitter
/*
function myEmit(){
    //EventEmitter.call(this); //parent constructor. This makes 'emit' and 'on' method valid for subclass
    this.addUser = arg=>{this.emit('AU', arg);} //member function creation
}
require('util').inherits(myEmit, EventEmitter); //inheritance through 'function' ~= 'extends' in class def
*/

class myEmit extends EventEmitter{
    constructor(){super()} //'this' is  passed on to super() implicitly ?
    addUser(arg){this.emit('AU', arg)}
}

let myE = new myEmit();
myE.on('AU', arg=>{console.log(`recv: ${arg}`);})
myE.addUser(2022);


