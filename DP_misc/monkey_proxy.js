

class A{
	constructor(name){this.name = name}
	say(msg){console.log(`${msg}! I am ${this.name}`)}

}


let a = new A('monkey');
a.say('aaa')

a.say = ((obj)=>{return (msg)=>{console.log(`new function I am ${obj.name}, ${msg}`)}})(a)
a.name = 'lion'
a.say('bbb')
