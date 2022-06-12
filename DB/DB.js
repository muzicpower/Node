//////////////////////////////////////////////////////////////////////
// MongoDB
//////////////////////////////////////////////////////////////////////

let connstr = "mongodb://drla:1234@localhost:30000/testMyLib"  //mongod --bind_ip 0.0.0.0 --port 30000
//let connstr = "mongodb://localhost/admin"                     //'default local server'
//let connstr = "mongodb+srv://rla:1234@cluster0.wxzlo.mongodb.net/sample_mflix"

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


////////////////////////////////////////////////////////////////////
// MySQL 
////////////////////////////////////////////////////////////////////

let mysql = require('mysql')
/*
let connection = mysql.createConnection(
    {
        "host":"localhost",
        "user":"rla",
        "password":"1234",
        "database":"test"
    }
)
connection.connect(err=>{
    if(err) return console.log(`connect err:${err}`)

    let sql = `SELECT * FROM users limit 2`
    connection.query(sql, (err, results)=>{
        if (err) return console.log(`query error:${err}`)
        console.log(results)
    })    
    connection.end(err=>{if(err)console.log(`end error:${err}`)})
})
*/
/*
let pool = mysql.createPool(
    {
        "host":"localhost",
        "user":"rla",
        "password":"1234",
        "database":"test"
    }
)
pool.getConnection((err, connection)=>{
    if (err) return console.log(`error:${err}`)
    
    // db work
    let sql = `SELECT * FROM users limit 4`
    connection.query(sql, (err, results)=>{
        if (err) return console.log(`query error:${err}`)
        console.log(results)
        connection.release()// return back to pool
        pool.end()
    })

})
*/