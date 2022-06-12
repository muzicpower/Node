

//process.argv.forEach((arg, idx)=>console.log(idx+' : '+arg));


process.stdin.setEncoding('utf8');

process.stdin.on('data', (data)=>{
        console.log('you entered: ' + data);
        //process.stdin.pause(); this terminates the program
})

console.log('enter something: ');
//process.stdin.resume(); //I don't know what this does. Can't see the effect
//process.stdin.pause(); //this terminates program

