
let cp = require('child_process')
/*
cp.exec('ls -al',{cwd:__dirname} ,(err, stdout, stderr)=>{
    if(err)console.log(err)
    
    console.log('----stdout------------')
    process.stdout.write(stdout)
    console.log('----stderr------------')
    process.stdout.write(stderr)
})
*/
/*
cp.execFile('ls', ['-al'], {cwd: '/bin'}, (err, stdout, stderr)=>{
    if(err)console.log(err) 
    
    console.log('----stdout------------')
    process.stdout.write(stdout)
    console.log('----stderr------------')
    process.stdout.write(stderr)
})
*/

//let child = cp.spawn('find',['/']); //no extra shell prompt. less expensive than cp.exec
let child = cp.fork(
    __dirname+'/IPC_child.js',
    ['arg1','arg2','arg3'],
    {
        stdio:"pipe", //otherwise child.stdout == null
        cwd:"/",
        env: {key1:"val1", key2:"val2"}
    }
)
console.log(`child info: pid:${child.pid} stdin:${child.stdin} stdout:${child.stdout} stderr:${child.stderr}`)

child.stdout.on('data', data=>{console.log(`${child.pid}.out> ${data}`)})
child.stderr.on('data', data=>{console.log(`${child.pid}.err> ${data}`)})

child.on('error', (data)=>{console.log(`${process.pid}.Error]:${data}`)})
    //this handler is invoked when parents keep sending messages after child process died
    //which is not the case when child simply console.error('xxx') 

child.on('exit',(code, signal)=>{console.log(`${child.pid}.ext> exit: ${code} sig: ${signal}`)})
child.on('close',(code, signal)=>{console.log(`${child.pid}.clo> close: ${code} sig: ${signal}`)})

let g_msg = {count: 0}
child.on('message',msg=>{
    console.log('parent recv msg: ' + JSON.stringify(msg))
    g_msg.count = msg.count;
})

let intCnt = 0;
let h_int = setInterval(()=>{
    g_msg.count++
    console.log('parent send msg: ' + JSON.stringify(g_msg))
    if (child.connected)
        child.send(g_msg)

    if (++intCnt == 5){
        //child.disconnect();
        clearInterval(h_int) //very important
        console.log(`child<${child.pid}> terminates in 1 sec..`)
        setTimeout(()=>{child.kill('SIGTERM')}, 1000)
    }
},500)

//child.on('disconnect', ()=>{console.log(`${child.pid}.dis> disconnected`)})

