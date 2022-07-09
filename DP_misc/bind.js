

class A{
	constructor(){this.age = 100}
	say(){console.log('my age: ' + this.age);}
}

let a = new A()

a.say() //A.prototype.say(a)

let k = A.prototype.say.bind(a)
k()

A.prototype.say.bind(a)()

A.prototype.walk = ()=>{console.log('my walking age: ' + this.age)}
A.prototype.walk.bind(a)()
