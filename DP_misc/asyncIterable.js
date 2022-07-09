
let a = process.stdin;

(async()=>{
	for await (const chunk of a)
		console.log(`data: ${chunk}`);
})()
