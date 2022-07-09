

function fibo(n){ return n < 3? n : fibo(n-1)+fibo(n-2);}

setTimeout(()=>{console.log('time is up')},800)
console.log(fibo(43))
