
function generateMsg(){
/*
return 'In publishing and graphic design, Lorem ipsum is a placeholder text commonly \
used to demonstrate the visual form of a document or a typeface without relying on \
meaningful content. Lorem ipsum may be used as a placeholder before final copy is \
available.'
*/
return require('querystring').stringify(
    {
        foo: "bar",
        baz: [1,2,3]    //creates 'foo=bar&baz=1&baz=2&baz=3'
    }
)
}

let msgBody = generateMsg();
let req = require('http').request(
    {
        hostname:'localhost',
        port: ~~process.argv[2],
        method: 'GET',
        path: '/london/joe?key1=val1&key2=val2&state=Illinois',
        headers: 
            {
                'Host':'localhost:'+~~process.argv[2],
                'Content-Type':'application/x-www-form-urlencoded',
                'Content-Length': Buffer.byteLength(msgBody) //important
            }
    },
    (res)=>{
        //header info
        console.log(`${res.httpVersion} ${res.statusCode}:${res.statusMessage}`)
        
        if (res.headers)
            for (key in res.headers)
                console.log(`${key}:${res.headers[key]}`)
        
        //body
        res.setEncoding('utf8') //no need to Buffer.toString()
        res.on('data', data=>{console.log('----' + data)}) 
        res.on('end', ()=>{console.log('****')})
    })

req.write(msgBody)
req.end() //actual sending of message(request) happens here, not in http.request

//make client using request module 