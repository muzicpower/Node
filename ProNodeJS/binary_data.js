//3types for binary data
//1. Buffer
//2. ArrayBuffer
//3. TypedArray

let buf0 = Buffer.alloc(20);
let buf1 = Buffer.from([1,2,3,4]);
let buf2 = Buffer.from("kimSung");
console.log(buf0); console.log(buf0.length); console.log(buf0.byteLength); //can't see the difference
console.log(buf1); console.log(buf1.length); console.log(buf1.byteLength);
console.log(buf2); console.log(buf2.length); console.log(buf2.byteLength);

//most important
console.log(buf2.toString());
console.log(buf2.toJSON()); // data -> JSON
console.log(JSON.stringify(buf2)); // data -> JSON -> stringify
console.log(JSON.stringify(buf2.toJSON())); //data ->JSON->JSON->stringify

let buf3 = Buffer.alloc(30);
buf3.write('abcdefg');
console.log(buf3.toString());


/*
//only subarray is shared
let v1 = new Uint16Array([1,2,3,4]);
let v2 = v1.subarray(0);  //shared
let v3 = new Uint16Array(v1); 

v2[0] = 100;

console.log(v1);
console.log(v2);
console.log(v3);

//---------------------------------------------------
let ab = new ArrayBuffer(8);
let v_0 = new Int32Array(ab); 
let v_1 = v_0.subarray(0); //shared

v_0[0] = 13;
v_0[1] = 777;

ab[0] = 1;
ab[1] = 2;
ab[2] = 3;
ab[3] = 4;
ab[4] = 5;
ab[5] = 6;
ab[6] = 7;
ab[7] = 8;

console.log(ab);
console.log(v_0);
console.log(v_1);
*/