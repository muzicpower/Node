
class A{
	grade = 'A+'
	
	constructor(){
	this.name = 'no name'
	this.addr = 'marine'
	}
	say(){ console.log('hello')}
	walk(){ console.log('walking')}
}

let a = new A()
//a["say"]()
//a.walk()
//A.prototype["say"]()
//A.prototype["walk"]()

for (const prop in a)console.log(`prop: ${prop}`)
console.log(Object.getOwnPropertyNames(A.prototype))

//for (const prop in a.__proto__)console.log(`prop: ${prop}`)
//for (const prop in A.prototype)console.log(`prop: ${prop}`)
