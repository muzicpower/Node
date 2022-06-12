/*
 - mongod storage location: C:\data\db

- there are 2 servers:

    - 1.default server
        - does not require mongod
        - Windows (DB.js) can connect using 'localhost' and without specifying port (default port 27017)
        - wsl2 cannot connect to
            - "mongodb://172.30.112.1:27017/admin"                //default server. cannot connect from wsl
            - "mongodb://rla:1234@172.30.112.1:27017/mylib"       //default server. cannot connect from wsl
        - contains mylib and rla:1234, which are created through MongoDBCompass connection (mongodb://localhost:27017/)

    - 2.mongod --bind_ip 0.0.0.0 --port 30000
        - both wsl2 and Windows can connect
        - (x) mylib,    rla:1234
        - (o) testMylib, drla:1234
        - drla has access only to testMylib so if testMyLib is not specified in connStr, authentication fails
        - mongod is more explicit as to where I am connecting to by specifying port
        - can be connected via MongoDBCompass as well by specifying port

- solution:
        - run mongod --port 30000 --bind_ip 0.0.0.0
        - run mongo --port 30000  && make tables and user account
        - connect "mongodb://drla:1234@172.30.112.1:30000/testMyLib"

*/
//let connstr = "mongodb://drla:1234@172.30.112.1:30000/testMyLib" //wsl -> Windows
//      on Windows: mongod --bind_ip 0.0.0.0 --port 30000
//      on wsl: /etc/resolv.conf

//let connstr = "mongodb://3.82.20.219:30000"     //wsl -> AWS
//let connstr = "mongodb+srv://rla:1234@cluster0.wxzlo.mongodb.net/sample_mflix"  //wsl -> cloud ok

let mongoose = require('mongoose')
let conn = mongoose.createConnection(connstr)  //mongoose.connect(connstr); let conn = mongoose.connection

//mongoose.Schema
//mongoose.model

conn.on('open', (error)=>{
    if(error)console.log('error on open')
    else console.log('connection esta')

    new (mongoose.mongo.Admin)(conn.db).listDatabases((err,result)=>{
        console.log(conn.db.databaseName)
        if (err) console.log('Admin error')
        else console.log(result.databases)
    })
    conn.db.listCollections().toArray((err,names)=>{
         conn.close()
         console.log(names)
     })
})
conn.on('error', ()=>{console.log(`connection error`)})


//////////////////////////////////////////////////////////////////////////////////////
/*
let Schema = mongoose.Schema
let PersonSchema = new Schema({
    SSN: String,
    LastName: String,
    FirstName: String,
    Gender: String,
    City: String,
    State: String,
    Vehicles: [{
            VIN: Number,
            Type: String,
            Year: Number
        }]
})

let connection = mongoose.createConnection("mongodb://username:password@localhost/dbname")

let Person = connection.model("Person", PersonSchema)

// in other file, when using this module, let Person = require('DB_Mongo.js').getModel(mongoose.createConnection(---))
// module.exports = {
//     getModel : function getModel(connection){
//         return connection.model("Person", PersonSchema)
//     }
// }

connection.on('open', ()=>{
    console.log('connection esta')

    let p1 = new Person({
        SSN: '123-45-6789',
        LastName: 'Boon',
        FirstName: 'Babo',
        Gender:'M',
        City:'Chicago',
        State:'IL',
        Vehicles: [{VIN: 12345, Type:'Truck', Year: 2005},{VIN: 56789, Type:'Sedan', Year: 2010}]
    })
    person.foo = 'bar' //won't be inserted as it is not specified in schema
    person.save(err=>{
        connection.close()
        if(err) return console.log(err)
        else console.log('successfully saved')
    })

    connection.close()
})

*/