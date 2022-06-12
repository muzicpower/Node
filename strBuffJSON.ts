
//import {Buffer} from 'node:buffer';
declare var require: any;
var Buffer = require('buffer').Buffer;

let str = 'This is pretty example';
console.log(str);

let buf= Buffer.from(str);
console.log(buf);

let jstr = JSON.stringify(buf);
console.log(jstr);


let buf2 = Buffer.from(JSON.parse(jstr).data);
console.log(buf2);

let str2 = buf2.toString();
console.log(str2);

