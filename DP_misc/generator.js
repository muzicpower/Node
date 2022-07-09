


function* myGen(){
	yield 'orange'
	yield 'strawberry'
	yield 'apple'
	yield 'banana'
	//return 'banana'
}

for (i of myGen())
	console.log(`res: ${i}`)


let j = myGen()
console.log(j.next())
console.log(j.next())
console.log(j.next())
console.log(j.next())
console.log(j.next())
