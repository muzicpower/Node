
process.stdout.write('cwd:' + process.cwd());
process.stdout.write('env:' + JSON.stringify(process.env));
process.stdout.write('argv:' + process.argv);
process.stderr.write('child error test')

process.on('message', (msg)=>{
    process.stdout.write('child rcv msg: ' + JSON.stringify(msg))
    msg.count++;
    process.send(msg);
})

process.on('disconnect', ()=>{process.stdout.write('disconnected!')})