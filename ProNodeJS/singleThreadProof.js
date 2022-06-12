
let cnt = 0;
setInterval(()=>{
	cnt++; 
	console.log('***');

	if(cnt==5)
		while(1);
}, 1000);

setInterval(()=>{
	cnt++; 
	console.log('___');
}, 1000);

//-------------------------------------------
let fs = require('fs');

fs.readFile('singleThreadProof.js','utf8',(err,data)=>{
	if (err) console.log(err);
	console.log(data);
	exit(0);
	});

for (let cnt = 0; cnt<10000;cnt++)
	process.stdout.write(' '+cnt);
//no matter how long it takes only after for loop is finished, even handler is processed.
//if for loop never finished, then async handler NEVER gets called
//this is due to SINGLE THREAD nature of NodeJS
