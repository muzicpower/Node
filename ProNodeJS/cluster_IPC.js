
/*
//key points
1. IPC
    - worker proc: process.send(msg)  --->  primary proc: cluster.on('message', (worker, msg)) or worker.on('message', msg)
    - primary proc: worker.send(msg)  --->  worker proc: process.on('message', msg) or cluter.worker.on('message', msg)
2.
*/
let cluster = require('cluster')
let nCPU = 4 //require('os').cpus().length //gives 8 for my dell laptop

if (cluster.isPrimary){ //<-> cluster.isWorker

    //setup primary
    cluster.on('fork',(worker)=>{console.log(`attempting to fork for worker ${worker.id}`)})
    cluster.on('online',(worker)=>{console.log(`fork finished for worker ${worker.id}`)})

    cluster.on('message', (worker, msg)=>{ console.log(`worker ${worker.id} recv:${msg}`)}) // ~= w.on('message')
    cluster.on('disconnect', (worker)=>{console.log(`worker ${worker.id} pid:${worker.process.pid} IPC shutdown`)}) // ~= w.on('disconnect')
    cluster.on('exit', (worker, code, sig)=>{console.log(`worker ${worker.id} pid:${worker.process.pid} exited with code:${code} sig:${sig}`)}) // ~= w.on('exit')

    //fork and setup each worker handler from primary's stand point
    for (let i = 0; i < nCPU; i++){
        //cluster.setupPrimary({ filename:__filename , args : ['arg1', 'arg2',..] , silent: false})
        let w = cluster.fork() // typeof w === Worker class
        console.log(`worker id:${w.id}, pid:${w.process.pid} is created`)

        w.on('message', msg=>{console.log(`worker ${w.id} sent msg ${msg}`)}) //when primary received msg from worker w, invoked by process.send(msg) in worker process)
        w.on('disconnect', ()=>{console.log(`worker ${w.id} disconnecting`)})
        w.on('exit', ()=>{console.log(`worker ${w.id} exiting`)})
    }

    console.log(`------------fork complete---------------------------`)

    //take action on selective workers
    for (let idx in cluster.workers){ //only available in primary proc whereas cluster.worker (without 's') is only available in worker proc
        w = cluster.workers[idx]
        console.log(`idx:${idx} worker id:${w.id} pid:${w.process.pid}`)

        w.send(`###-${idx*10}-###`) //w.send(msg, sendHandle, CB) (sending msg to worker)

        //w.kill (killing this specific worker) == w.process.kill
        //w.disconnect (shutting down IPC for the specific worker)
    }

    console.log(`------about to kill all-------------------`)
    setTimeout(()=>{
        cluster.disconnect(()=>{console.log(`all workers are terminated`)})
    },500)

}
else{ //worker proc
    process.send(`<<Sir! worker ${cluster.worker.id} is ready>>`)
    process.on('message', msg=>{ process.send(`<<Sir! worker ${cluster.worker.id} received ${msg}>>`)})
    //cluster.worker.on('message', msg=>{})
}