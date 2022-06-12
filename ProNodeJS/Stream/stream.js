var fs = require("fs");
var zlib = require("zlib");

var Stream = require('stream');
let stream = new Stream();

//1. timing of optional callback function argument of stdout.write
    //write and then.. sometime later callback function invoked
    //process.stdout.write('test\n', ()=>{console.log('inside cb of write');});
    //console.log('end of file');

//2. readable stream: nothing more than event message handling
/*
stream.readable = false; //still works, because it's just a flag
stream.on('data_arrive', input=>{console.log(input.toString());})
stream.on('data_end', input=>{console.log(input.toString());})

let cnt = 0;
let h_int=setInterval(()=>{
    let msg = 'Life is good'
    stream.emit('data_arrive', Buffer.alloc(msg.length, msg, 'utf8'));

    if (++cnt == 5){
        let msg = 'end of emitting--'
        stream.emit('data_end', Buffer.alloc(msg.length, msg, 'utf8'));
        clearInterval(h_int);
    }
}, 1000);
*/

//3. pipe() implementation: 
    //stream.writable = true;
    //stream.pipe(stream);

    //src:'event catcher'
    //dst:'writer' or 'action' in response to event
    //pipe: connecting those two entities(event <--> action)
    //this is why stdout.pipe(stdin) does not work
    //because stdin does not have write function defined
/*
Stream.prototype.write = (input)=>{console.log('write called: ' + input)}; 
stream.__proto__.end = (input)=>{console.log('end called')}; //same as Stream.prototype.end. Class.prototype.xxx == instance.__proto__.xxx
Stream.prototype.myPipe = function(dst){ //to use 'this', method must be defined using 'function' keyword (arrow function won't work)
    this.on('data', (input)=>{dst.write('@@@'+input);});
    this.on('end', (input)=>{dst.end('!'+input);});
};
let testMsg = 'This is stream Test';
stream.myPipe(stream);
stream.emit('data', Buffer.alloc(testMsg.length,testMsg,'utf8')); 
stream.emit('end');

let testMsg2 = 'Another Msg';
let str2 = new Stream();
str2.myPipe(str2);
stream.emit('data', Buffer.alloc(testMsg2.length,testMsg2,'utf8')); 
stream.emit('end');
*/

//4. implementing stdout -> stdin : not solved yet
//process.stdin.pipe(process.stdout); // pipe is a method of 'readable' object, so stdin -> stdout : readable -> writable ok
//process.stdout.pipe(process.stdin); // writable -> readable : does not work because pipe() is not a function of writable(stdout)

// when there is user input msg 'xxx' == process.stdin.emit('data', 'xxx')  : 'data' predefined event name
    // catch via: process.stdin.on('data', input=>{})
// Same logic, when there is output msg 'yyy': == process.stdout.emit('????', 'yyy') 
    // catch via: process.stdout.on('????', input=>{})

//process.stdout.write('test to stdout'); // what message is invoked?
//process.stdout.emit('????', 'test to stdout');
//can't understand its behavior
let cnt = 0; 
process.stdout.on('data', output=>{
    //console.log('triggered' + cnt++);
    process.stderr.write(`*${cnt++}*` + output);
    //process.stdin.emit('data', output); // now stdout.pipe(stdin) is accomplished!
})


//console.log('How to become a Software Engineer?') /// why this does not work?
//process.stdout.emit('data', 'AMZN')


//testcode for stdout -> stdin piping
/*
let randArray = []
for (let i = 0; i < 5; i++)
    randArray.push(Math.floor(Math.random()*100));
console.error(randArray); 

// stdout - pipe - stdin 
process.stdin.on('data', input=>{console.error('! ' + input)});

let cnt = 0;
let inth = setInterval(()=>{
    let randNum = randArray[cnt++];
    process.stdout.write(""+randNum);
    if (cnt == randArray.length)
        exit(0);
        //clearInterval(inth);
},1000);
*/

//5. readStream vs readFile 
/*
let fs = require('fs');
let filename = __dirname + '/data.txt';

let nCnt = 0;
fs.readFile(filename, data=>{
    console.log('readFile # ' + nCnt++);  //invoked just once
})

let rfsCnt = 0;
let rfstream = fs.createReadStream(filename);
rfstream.on('data', input=>{
    console.log('rfstream #' + rfsCnt++); //invoked ~20 times making it more responive but slow
});
*/
var fs = require("fs");
//var stream;

//6. event 'open' for readStream, writeStream and piping together
/*
let fstrRead = fs.createReadStream(__dirname + "/data.txt")
fstrRead.on("open", function(fd) {
    fs.fstat(fd, function(error, stats) {
        if (error) console.error("fstat error: " + error.message);
        else console.log(stats);
    });
});
let fstrWrite = fs.createWriteStream(__dirname + '/pipeOut.txt');
fstrWrite.on("open", fd=>{console.log('fd: ' + fd)});
fstrWrite.on("finish", ()=>{console.log('bytes written: ' + fstrWrite.bytesWritten)});
fstrRead.pipe(fstrWrite);
*/

//7.Gzip/GUnzip
/*
let instr = fs.createReadStream(__dirname+'/zip_in.txt');
let gzip = zlib.createGzip();
let outstr = fs.createWriteStream(__dirname + '/zip_out.gz.txt');
instr.pipe(gzip).pipe(outstr);

let comp = fs.createReadStream(__dirname+'/zip_out.gz.txt');
let gunzip = zlib.createGunzip();
//let uncomp = fs.createWriteStream(__dirname+'/zip_uncomp.txt');
comp.pipe(gunzip).pipe(process.stdout);
*/