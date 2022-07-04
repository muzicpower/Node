
//let EE = require('events').EventEmitter;

class EE{
    #CB
    constructor(){this.#CB = {}}
    on(msg, cb){ this.#CB[msg] = cb}
    emit(msg){ if (this.#CB[msg]) setImmediate(this.#CB[msg])} // eventQ priority rank: nextTick > setImmediate > setTimer 

    //once
    //remove
}

class MyEE extends EE{
    #name
    #cnt
    constructor(name){
        super()
        this.#name = name
        this.#cnt = 0
    }
    getCounter(){return `name: ${this.#name}, cnt: ${this.#cnt++}`}
}


let m = new MyEE('kim')
const EVENT = 'event_1'

//m.on(EVENT, ()=>{console.log(m.getCounter())})

process.nextTick(()=>{
    for (let i = 0; i < 5; i ++)
    m.emit(EVENT)
})

m.on(EVENT, ()=>{console.log(m.getCounter())})


//let h = setInterval(()=>{m.emit(EVENT)}, 500);
//setTimeout(()=>{clearInterval(h);}, 3000);
