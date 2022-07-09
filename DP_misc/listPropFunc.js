

function Boof(name, addr){
	this.name = name
	this.addr = addr
	this.say = ()=>{console.log(`hi my name is ${this.name}`)}
	this.walk = ()=>{console.log(`I (${this.name}) am walking at ${this.addr}`)} 
} 

let a = new Boof('kim','Marine')
a.say()
a.walk()

for (const prop in a)
	console.log(`prop: ${prop}`)


function factory(){
	return {
		fname:"wilson",
		lname:"noah",
		street:()=>{console.log('this is street')},
		zip(){console.log('this is zip')}
	}
}

let b= factory()

for (const prop in b) console.log('b prop: ' + prop)
