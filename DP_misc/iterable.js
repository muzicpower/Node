
//(async()=>{ for await(const chunk of process.stdin) console.log(`data: ${chunk}`)})()

class AIterable{
	constructor (data){this._data = data }

	[Symbol.iterator](){ //defines iterable 
		let _data = this._data
		let _cursor = 0;
		return{			//iterator 
			next(){
				if (_data.length == _cursor) return {done: true}
				else return {done: false, value: _data[_cursor++]}
			}
		}
	}
}

let a = new AIterable([1,{addr:'marine',zip:60613},3,4,{name:'kim', age:45}])

for (const i of a)
	console.log(`iter value: ${JSON.stringify(i)}`)

for (const j of a)
	console.log('second iter: ' + JSON.stringify(j))
