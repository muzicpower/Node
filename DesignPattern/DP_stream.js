
/*

0. Know atomized unit in stream
    - ex. writable._write(chunk,enc,done) : this 'chunk' could be object, or string , or binary data
    - ex. readable.on('readable')  ...readable.read() : what unit is the return value of read()
    - ex. readable.on('data', data=>{...}) : in what unit is data passed on?
    - basic types for unit of stream: binary / string / object
    - know well
        - done callback when overriding _write or _transform
        - simplified construction
        - pipe(writableStream, {end:false/true})

1. readable stream: implements Readable abstract class
    - pipe(writableStream)
    - on('readable')
    - read()
    - on('data')
    - on('end')
    - setEncoding('utf8')
*/

/*
1.1 Flowing mode of readable stream
    - 'data' event and data is already in CB argument   
    - arg contains everything including '\0' (ex. 'abc\n\0')
    - buffer is flushed and empty, and in pause mode, waiting for more data
*/
/*
process.stdin
.setEncoding('utf8')
.on('data',input=>{
	process.stdout.write(input.toUpperCase());	
	if (input.trim() == 'exit') process.exit(0);
})
.on('end',()=>{console.log('end of stream')})
console.log('enter something:')
*/

/*
1.2 non-flowing mode of readable stream
    - 'readable' event and readable.read() is called to retrieve data 
    -  type 'abc' and enter => 'abc\n\0' => read() returns 'abc\n' and '\0' remains in buffer.
    -  when '\0' remains in buffer and control reaches the end, it is interpreted as no more data coming and program terminates
*/
/*
process.stdin
.setEncoding('utf8')
.on('readable',()=>{ 
    let chunk = 0
    while(chunk = process.stdin.read()){ //read is called twice: once for 'abc\n' and another for '\0' 
        process.stdout.write(chunk.toUpperCase()) //no need to call chunk.toString() because of setEncoding('utf8')
        if (chunk.trim() === 'exit') process.exit(0)
    }
})
.on('end',()=>{console.log(`end of stream`)})
console.log('enter something:')
*/

//1.3 Async iterators: kinda underestood
/*
(async ()=>{
    for await(const chunk of process.stdin) //stream is inherently CB-based, so using await after declaring async makes sense
        process.stdout.write(`${chunk.toString().toUpperCase()}`)
})()
console.log('enter something:')
*/

/*
1.4 customizing of readable
*/
import {Readable} from 'stream'

// class MyReadable extends Readable{
//     constructor(option){
//         super(option)
//         this.emittedBytes = 0
//     }
//     _read(size){
//         console.log(`_read size: ${size}`)
//         let data = 'abcd'
//         this.emittedBytes += data.length
//         this.push(data,'utf8')
//         this.push(null) //without null, _read will be called indefinitely
//     }
// }
// let m = new MyReadable()
// m.setEncoding('utf8')
// .on('data', input=>{
//     console.log(`data:[${input}]`)
// })
// .on('end', ()=>{console.log('end of MyReadable')})

//all readable streams begin in paused mode => switch to flow mode by 1. add 'data' event handler 2. stream.resume()
/*
class StdinStream extends Readable{
    constructor(){
        super()
        this.buff = 0
        process.stdin.setEncoding('utf8').on('data', input=>{
            this.buff = `<<${input.trim()}>>`
            this._read()
        })
    }
    _read(size){ //must be implemented: similar to 'pure' virtual function in c++
        if (this.buff){
            this.push(this.buff, 'utf8') //.push seem to generate 'data' or 'readable' event
            //this.push(null) //this generates 'end' event no more 'data' events are generated
            this.buff = 0
        }
    }
}
let stdinStream = new StdinStream()
*/
/*
stdinStream.setEncoding('utf8')
.on('data',input=>{ console.log(`data: ${input}`)})
.on('end', ()=>{console.log(`end of StdinStream`)})
console.log(`enter something please:`)
*/
/*
stdinStream.setEncoding('utf8')
.on('readable',()=>{
    for (let chunk; chunk = stdinStream.read();)
        console.log(`data: >>${chunk.trim().toUpperCase()}<<`)
})
console.log(`enter something please:`)
*/
/*
1.5 Readable.from: object array -> stream 
*/
/*
Readable.from([{name:'kim', addr:'Seoul'},{name:'lee', addr:'NewYork'},{name:'Wilson',addr:'Chicago'}])
.on('data', input=>{console.log(`data: ${JSON.stringify(input,null,2)}`)})
.on('end', ()=>{console.log('end of Readable.from')})
*/
/*
(async ()=>{
    for await(const i of Readable.from([{name:'kim', addr:'Seoul'},{name:'lee', addr:'NewYork'},{name:'Wilson',addr:'Chicago'}]))
        console.log(`${JSON.stringify(i,null,4)}`)
})()
*/

/*
2. Writable Streams
    -write(): returns false when size exceeds highWaterMark limit
        - when buffer is emptied, 'drain' even is generated 
        - writable.once('drain', ()=>{/write more data..})
    -end()  ---> 'finish' event on Readable stream

*/
/*
process.stdout.write('a')
process.stdout.write('b')
process.stdout.write('c')
process.stdout.end('-end-')
process.stdout.on('finish', ()=>{console.log('writing to stdout is complete')})

*/

//2.1 backpressure and 'drain' event
/*
import {createServer} from 'http'
import Chance from 'chance'

const chance = new Chance()
const server = createServer((req,res)=>{
    res.writeHead(200, {'Content-Type':'text/plain'})
    function writeMore(){
        while(chance.bool({likelihood: 95})){
            if (!res.write(`${chance.string({length:16*1024-1})}\n`)){
                console.log('back pressure')
                return res.once('drain', writeMore) //excellent logic here
            }
        }
        res.end('\n\n')
    }
    writeMore()
    res.on('finish', ()=>console.log('All data sent----------------'))
}).listen(8080, ()=>{console.log('listening on http://localhost:8080')})
*/
//2.2 writable customization

import {Writable} from 'stream'
class StdoutStream extends Writable{
    constructor(tag='##',manualDone=false, ...options){
        super({...options,objectMode: true})
        this._done = null
        this.tag = tag
        this.manualDone = manualDone
    }

    _write(chunk, encoding,done){
        process.stdout.write(this.tag+chunk.toString().trim().toUpperCase()+this.tag+'\n')
        if (this.manualDone)this._done = done
        else done() //if this is omitted, subsequent ._write() becomes pending 
    }
}

let a = new StdoutStream('##',true)
a.write('hello world')
a.write('this stream chapter is really good')
a.write('stream is so elegant')
a._done()
//a._done()
//everything here is sync
console.log('end of sync control')

/*
//pipe forking
process.stdin.pipe(new StdoutStream('**'))
process.stdin.pipe(new StdoutStream('$$$'))
*/

//3 Transform stream 

import {Transform} from 'stream'
/*
class MyTrans extends Transform{
    constructor(){
        super()
        this.counter = 0
    }
    _transform(chunk, encode, done){
        console.log(`counter: ${this.counter++}`)
        this.push(chunk.toString().toUpperCase()) //this generates 'read' or 'readable' event
        done() // most important thing to understand
    }
    _flush(done){ // Transform.end() invokes _transform() and _flush() sequentially
                // how to pass this.counter through CB?
        done()
    }
}
*/
/*
let mytrans = new MyTrans()
mytrans
.on('data',input=>{console.log(`data: ${input}`)})
.on('finish', (err)=>{console.log(`end of stream`)})
.pipe(process.stdout)  //late piping: connect first and then write 

mytrans.write('hihihi',()=>{console.log('first CB')})
mytrans.end('hello', ()=>{console.log(`second CB`)})
*/

//process.stdin.pipe(new MyTrans()).pipe(process.stdout)
//process.stdin.pipe(process.stdout)
/*
import {createReadStream, createWriteStream} from 'fs'
let byteCounter = ((_totalByte=0)=>{return delta=>{return _totalByte+=delta}})()

createReadStream('./data.txt')
.pipe(new MyTrans())
    .on('data',input=>{byteCounter(input.toString().length)}) //monitoring, data gathering
    .on('finish', ()=>{console.log(`total bytes: ${byteCounter(0)}`)})
.pipe(createWriteStream('./data_upper.txt'))
    .on('finish', ()=>{console.log(`transform finished`)})
*/

/*
4. import { PassThrough } from 'stream'
    - for monitoring, data gathering purpose: 

5. Late Piping: connect first and write later 

6. lazy stream: create stream obj when first _read or _write is called
    - module 'lazystream'

7. error handling in pipe / stream
    - stream.destroy()
    - on('error', error handler) but only on single stream object
    - pipeline(str1, str2, str3,..,cb): handles errors for ALL streams in the pipeline 

*/

/* stream expansion
[8]. task stream in serial: file concatenation p.204

    - Readable.from : [file1, file2, file3...] => destFile
    - createReadStream / createWriteStream : file#x -> destFile
    - readable.pipe(writable, {end:false}) : do not close writable when readable ends (because there are multiple readables coming up)

[9]. task stream in parallel: URL status monitoring p.209
    - file1: url1, url2, url3, ...
    - module 'split'
    - check status each link in parallel and output the result
    
    9.1 + limited concurrency(parallelism)
        - use 'done' judiciously from _transform(data, enc, done)

    9.2 + ordered
        - use 'parallel-transform' module

// piping patterns
10. combining multiple streams in serial
    - 'pumpify' module
    - returns a 'single stream' compared to pipeline or pipe chaining

11. forking a stream
    - src.pipe(dst1); src.pipe(dst2); src.pipe(dst3); ...
    - bottleneck effect by one of dst's backpressure
    - put PassThrough stream as a placeholder and retrieve later

[12]. merging streams : merge multiple files by unit of line
    - src1.pipe(dst); src2.pipe(dst); src3.pipe(dst); ...
    - dst stream creation: {end: false}
    - dst.end() by the last src stream to finish 
    - to 'atomize' the unit of streaming by a line, use src_n.pipe(split(line=>line+'\n')).pipe(dst,{end:false})
    - For 'ordered' merging, use 'multistream' module

[13]. mux / demux
    - define header
    - know Buffer operation(alloc,write,copy) for header
    - carefully design orders of .read() for parsing headers on the server side
        - thinking when data is only partially available and it will have to resume later
        - .read(size) seems to be all or nothing operation in terms of specified 'size'

    - try object stream to make it easier in terms of size processing
    - ref. ternary-stream

*/

/*
MISC

1. path module
import {basename, join} from 'path'
let filepath = `c:/user/smk/myfile.gif`
console.log(basename(filepath)) //get rid of directory path
console.log(join('abc:','def')) //joins with '/' in between

2. chance module
import Chance from 'chance'
const chance = new Chance()
let randomString = chance.string({length: 10})
if (chance.bool({likelihood:5})){ xxx }

3. split module

4. import { fork } from 'child_process'

5. import { connect } from 'net'

6.
    Buffer.alloc // ==  factory function returning Buffer object
    Buffer.writeUInt8
    Buffer.writeUInt32BE
    chunk.copy(buff, offset)
    writableStrea.write()
*/