
//https://mongoosejs.com/

//let url = "mongodb://drla:1234@localhost:30000/testMyLib"  //mongod --bind_ip 0.0.0.0 --port 30000
//let url = "mongodb://localhost/admin"                     //'default local server'
let url = "mongodb+srv://rla:1234@cluster0.wxzlo.mongodb.net"
const mongoose = require('mongoose')

mongoose.connect(url, (error, conn)=>{
    let db = conn.useDb('sample_training').db //;console.log(`db: ${db.databaseName}`)
    /*
    let admin = new mongoose.mongo.Admin(db)
    admin.listDatabases((err,result)=>{console.log(result.databases)})
    db.listCollections().toArray((err,collections)=>{console.log(collections)})
    db.collection('grades').findOne({},(err,result)=>{console.log(result)})
    */
    
    {//aggregate on sample_mflix db
        let db = conn.useDb('sample_mflix').db
        let coll = db.collection('movies')
        let pipe = [{'$match':{year: 2009}}, {'$project':{_id:0, title:1, year:1, imdb:1}},{'$sort':{'imdb.rating':-1}},{'$limit':5}]
        coll.aggregate(pipe).toArray((err,result)=>{
            if(err)console.log('aggregate error')
            result.forEach(i=>{console.log(`title: ${i.title}, year: ${i.year}, imdb: ${i.imdb.rating}`)})
        })
        //.exec((err,result)=>{})
    }

    {//insertion on test db
        let db = conn.useDb('test').db
        let coll = db.collection('users')
        coll.insertOne({fname:'Manning', lname:'ExpressInAction',name:'Evan Hahn'},(err,res)=>{
            if (err) console.log(`error occurred during insertion: ${err}`)
            else console.log(`insertion success:`)
            //conn.close()
        })
    }
    
    /*
    {//deletion
        let db = conn.useDb('test').db
        let coll = db.collection('users')
        coll.deleteOne({fname:'Manning'}, (err,res)=>{
            if (~err) console.log(`deletion success`)
            conn.close();
        })
    }
    */
    
//  conn.close();
})

/*
//mongoose.Schema and mongoose.model

let userSchema = mongoose.Schema({
    username: {type: string, required: true, unique: true},
    displayName: string,
    password: {type: string, required: true},
    createdAt: {type: Date, default: Date.now},
    bio: string
})
userSchema.methods.getName = ()=>this.displayName || this.username
userSchema.methods.checkPassword = (guess, done)=>{
    bcrypt.compare(guess, this.password, (err, isMatch)=>{
        done(err, isMatch)
    })
}
userSchema.pre("save", function(done){
    let user = this;
    if (!user.isModified("password"))
        return done()
    else{
        let bcrypt = require('bcrypt-nodejs')
        let SALT_FACTOR = 10
        bcrypt.genSalt(SALT_FACTOR, (err,salt)=>{
            bcrypt.hash(user.password, salt, ()=>{},(err, hashedpassword)=>{
                if(err) return done(err)
                user.password = hashedpassword;
                done()
            })
        })
    }
})

let User = mongoose.model("User",userSchema) 
//module.exports = User;
//attach your schema to model with a tag 'User'. Now User acts as 'collection'
//later in the code :

User.find(...)
let newUser = new User({...})
newUser.save(err=>{
    close db connection if appropriate
    next()
})

*/