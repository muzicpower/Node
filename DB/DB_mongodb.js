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
//let url = "mongodb://drla:1234@172.30.112.1:30000/testMyLib" //wsl -> Windows
//      on Windows: mongod --bind_ip 0.0.0.0 --port 30000
//      on wsl: /etc/resolv.conf
let url = "mongodb+srv://rla:1234@cluster0.wxzlo.mongodb.net"  
const MongoClient = require('mongodb').MongoClient;

MongoClient.connect(url, (err,conn)=>{
    if(err) console.log('error occurred in connect')

    const db = conn.db('sample_mflix')
    const coll = db.collection('movies')
    
    let pipe = [{'$match':{year: 2009}}, {'$project':{_id:0, title:1, year:1 , imdb:1}},{'$sort':{'imdb.rating':-1}},{'$limit':5}]
    qRes = coll.aggregate(pipe) //qRes: cursor object : each, hasNext, next, toArray
    //qRes = coll.find({year:2001},{projection:{_id:0, title:1, year:1, imdb:1}}).limit(5) 
    
    qRes.toArray((err,result)=>{
        if(err)console.log('find error')
        result.forEach(i=>{console.log(`title: ${i.title}, year: ${i.year} imdb:${i.imdb.rating}`)})
        conn.close()
    })
    
})


