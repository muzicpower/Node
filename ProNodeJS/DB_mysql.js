/*
Ref: https://www.npmjs.com/package/mysql

1. find Window's ip from /etc/resolv.conf
 - https://stackoverflow.com/questions/72318354/cant-connect-to-mysql-server-from-wsl
   That is not working, because WSL2 is running with a virtual network (vNIC) that is created by 
   the Windows Virtual Machine Platform (a subset of Hyper-V). Inside WSL2, localhost is the address of the vNIC.
   The simplest solution would be to get an ip address of your windows and connect to the database with this address instead of localhost.
   Unfortunately the IP will change every time you run your linux. WSL stores your windows host IP in /etc/resolv.conf file.
    So you can modify /etc/hosts to map winhost to the host IP dynamically. 
    To achieve this add the following lines at the end of ~/.bashrc file:

    export winhost=$(cat /etc/resolv.conf | grep nameserver | awk '{ print $2 }')
    if [ ! -n "$(grep -P "[[:space:]]winhost" /etc/hosts)" ]; then
            printf "%s\t%s\n" "$winhost" "winhost" | sudo tee -a "/etc/hosts"
    fi

    then run: source ~/.bashrc
    Now instead of localhost use winhost. Please let me know if this has helped you

2. For remote access (AWS MySQL)
    open /etc/mysql/mysql.conf.d/mysqld.cnf
    bind-address = 0.0.0.0  (default 127.0.0.1) 

3. ER_NOT_SUPPORTED_AUTH_MODE: Client does not support authentication protocol requested by server; consider upgrading MySQL client
    - this occurs when client does not support caching_sha2_password
    
    - SET GLOBAL validate_password.length = 4;
    - SET GLOBAL validate_password.policy = 0;
    - ALTER USER 'rla' IDENTIFIED WITH mysql_native_password BY '1234';

*/

let mysql = require('mysql')

let connection = mysql.createConnection(
    {
        //"host":"172.30.112.1",      // wsl -> Windows     /etc/resolv.conf
        "host":"3.82.20.219",       // wsl -> aws 22.04

        "user":"rla",
        "password":"1234",
        "database":"test"
    }
)
connection.connect(err=>{
    if(err) return console.log(`connect err:${err}`)

    let sql = `SELECT * FROM users`
    connection.query(sql, (err, results)=>{
        if (err) return console.log(`query error:${err}`)
        console.log(results)
    })    
    connection.end(err=>{if(err)console.log(`end error:${err}`)})
})

/*
let pool = mysql.createPool(
    {
        //"host":"172.30.112.1",      // wsl -> Windows /etc/resolv.conf
        //"host":"34.205.33.181",   // wsl -> aws 18.04 
       "host":"3.82.20.219",   // wsl -> aws 22.04
        
        "user":"rla",
        "password":"1234",
        "database":"test",
    }
)
pool.getConnection((err, connection)=>{
    if (err) return console.log(`error:${err}`)
    
    // db work
    let sql = `SELECT * FROM users`
    connection.query(sql, (err, results)=>{
        if (err) return console.log(`query error:${err}`)
        console.log(results)
        connection.release()// return back to pool
        pool.end()
    })
})
*/