
let dns = require('dns')

let dname = "yahoo.com" 

/*
dns.lookup(dname, 4, (error, addr, fam)=>{  //single addr returned
    if(!error)
    console.log(`${dname} -> ${addr}`)
})
*/

dns.resolve(dname, 'A', (error, addr)=>{  // multiple IPs returned
    console.log(`${dname}:`)
    addr.forEach(item=>{
        dns.reverse(item, (err, r_dname)=>{  //back to domain name
            console.log(`${item} -> ${r_dname}`)
        })
    })
})
