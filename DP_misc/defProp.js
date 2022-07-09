
class A{
constructor(age){
	this['age'] = age  //this.age or this.say
	this["say"] = function (){ console.log(`saying mya age: ${this.age}`)}
	}
}
let a = new A(45)

a.say()
a["say"]()
