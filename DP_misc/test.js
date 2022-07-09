
const A_CHAR = 65
const Z_CHAR = 90
function createAlphabetIterator(){
	let res = {
		_value: A_CHAR,
		_done:  false,
		next(){
			res._done = res._value === Z_CHAR? true : false
			if (!res._done)res._value++
			return {
				done: res._done,
				value: res._value
			}
		}
	}
	return res;	
}


let it = createAlphabetIterator();

for (let k = 0; k < 30; k++){
	console.log(`iterator: ${it._value}`)
	it.next();
}

console.log(`---------------`)

for (let i = createAlphabetIterator(); !i._done ; i.next())
	console.log(`iter: ${i._value}`)
