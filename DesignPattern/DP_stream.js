
/*
1. readable stream: implements Readable abstract class
    - pipe(writableStream)
    - on('readable')
    - read()
    - on('data')
    - on('end')
    - setEncoding('utf8')
*/
//--------------------------------------------------------------------------
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
    - 'readable' event and readable.read is called to retrieve data 
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

//1.3 Async iterators: not understood yet
/*
(async ()=>{
    for await(const chunk of process.stdin)
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
stdinStream.setEncoding('utf8').on('data',input=>{
    console.log(`data: ${input}`)
}).on('end', ()=>{console.log(`end of StdinStream`)})
*/
/*
stdinStream.setEncoding('utf8').on('readable',()=>{
    let chunk
    while (chunk = stdinStream.read()){
        console.log(`data: ${chunk.trim().toUpperCase()}`)
    }
})
console.log(`enter something please:`)
*/
/*
1.5 Readable.from: object array -> stream 
*/
/*
let readIter = Readable.from([{name:'kim', addr:'Seoul'},{name:'lee', addr:'NewYork'},{name:'Wilson',addr:'Chicago'}])
readIter.on('data', input=>{
    console.log(`data: ${JSON.stringify(input,null,2)}`)
}).on('end', ()=>{console.log('end of Readable.from')})
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

//2.2 writable customization
/*
import {Writable} from 'stream'
class StdoutStream extends Writable{
    constructor(...options){
        super({...options,objectMode: true})
    }
    _write(chunk, encoding,cb){
        process.stdout.write(`###${chunk.toString()}###\n`)
        cb() //if this is omitted, next write does not call _write
    }
}

let a = new StdoutStream()
a.write('hello world')
a.write('this stream chapter is really good')
*/

/*
3. pipe chaning
import { createReadStream, createWriteStream } from 'fs'
createReadStream('test_2.js')
.pipe(createWriteStream('test_2_copy.js'))
.on('finish', ()=>{console.log('copy finished')})


//process.stdin.pipe(process.stdout)
//process.stdout.pipe(process.stdin)

*/


/*
4. path module
import {basename, join} from 'path'
let filepath = `c:/user/smk/myfile.gif`
console.log(basename(filepath)) //get rid of directory path
console.log(join('abc:','def')) //joins with '/' in between

5. chance module
import Chance from 'chance'
const chance = new Chance()
let randomString = chance.string({length: 10})
if (chance.bool({likelihood:5})){ xxx }
*/