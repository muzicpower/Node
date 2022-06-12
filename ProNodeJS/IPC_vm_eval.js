let vm = require('vm')

//1. vm.runInNewContext & eval
let code = 'console.log(msg); msg="modified msg"; newMsg="brand new msg";'
let stackTrace='stackTrace_#1'

//let msg = 'hi vm'
//var msg = 'hi vm'
msg = 'hi vm'
let sandbox_0 = {console: console, msg: msg}

//vm.runInThisContext(code, filenameForStacktrace) //runs only with global variables
//eval(code) //runs well with local variables
vm.runInNewContext(code, sandbox_0, stackTrace)

console.log(`msg: ${msg}`)
console.log (`msg:  ${sandbox_0.msg}\nnewMsg: ${sandbox_0.newMsg}`)


//2. createScript
let sandbox_1 = {i:0}
let sandbox_2 = {i:20}
let scpt = vm.createScript("i++;","stackTrace_#2")

for(let j = 0; j <10; j++){
    scpt.runInNewContext(sandbox_1)
    
    if(j&1)
        scpt.runInNewContext(sandbox_2)
}

console.log(sandbox_1)
console.log(sandbox_2)