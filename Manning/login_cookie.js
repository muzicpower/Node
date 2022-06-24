/*
Login Server w/ Cookies

0. Purpose
    - to implement login system for specific directory ('/workspace') using cookies 

1. How to set cookies:
    - res.setHeader('Set-Cookie',`key1=val1; path=/; expires=${new Date(+1hr or 30min)}`)
    
    - Cookies are included for every request only for those sub-paths of spceified path('/' in this case)

    - seems impossible to set multiple keys 'key1=val1; key2=val2;...'
        - calling multipe setHeader lets the last call to override previous ones
        >> solved: by using res.cookie

    - seems impossible to set multiple paths
        >> solved: possible with multiple calls of res.cookie with different path: 

2. How to delete cookies:
    - res.setHeader('Set-Cookie',`key1=deleted; path=/; expires=${new Date()}`)
    - deleted should be used, path should be specified

// ----------------------------------------------------------------------------------------
3. ToDo: resolved
    - setting expires=${new Date(+30min from now on)} does not work as I intended
    - try require('cookie').serialize('token', token, maxAge=30*60*1000) //30min to milliseconds
    >> res.cookie('token',token,{signed:true, maxAge:30*60*1000}) works

4. easy way
    - res.cookie : makes cookie
        - multiple key=value pair is possible with different expiration
    - res.clearCookie : destroys cookie
*/

//https://expressjs.com/en/4x/api.html#req.cookies

let port = ~~process.argv[2]    
let enableLogin = 1;
let loginBoard = {};

let app = require('express')()
app.use(require('cookie-parser')('secret cat')) //use secret

app.get('/workspace/login',(req,res)=>{
    if (req.signedCookies && loginBoard[req.signedCookies.token]){ //already logged in
        res.send(`you are already logged in. Logout first`)
    }
    else if (enableLogin){
        let token = 1 + Math.floor(Math.random()*100000)
        loginBoard[token] = 'yes Logged in'
        res.cookie('token',token,{path:'/workspace', signed: true ,maxAge:60000})
        //res.cookie('tekken','tagMatch',{path:'/lobby', signed: true ,maxAge:30000})
        
        res.send(`login success`)
    }
    else res.send(`login failed`)
    //debug
    console.log(`req.cookie: ${JSON.stringify(req.signedCookies)}, loginBoard: ${JSON.stringify(loginBoard)}`)
})
app.get('/workspace/logout',(req,res)=>{
    delete loginBoard[req.signedCookies.token]
    res.clearCookie('token',{path:'/workspace'})
    res.send(`logout success`)
    //debug
    console.log(`req.cookie: ${JSON.stringify(req.signedCookies)}, loginBoard: ${JSON.stringify(loginBoard)}`)
})

app.get('/workspace',(req,res)=>{
    if (!req.signedCookies || !loginBoard[req.signedCookies.token]) res.send(`NOT authorized`)
    else res.send('At your service, sir!!')
    //debug
    console.log(`req.cookie: ${JSON.stringify(req.signedCookies)}, loginBoard: ${JSON.stringify(loginBoard)}`)
})
app.get('/workspace/room1',(req,res)=>{
    if (!req.signedCookies || !loginBoard[req.signedCookies.token]) res.send(`NOT authorized`)
    else res.send('you are in room1')
    //debug
    console.log(`req.cookie: ${JSON.stringify(req.signedCookies)}, loginBoard: ${JSON.stringify(loginBoard)}`)
})
app.get('/lobby', (req,res)=>{
    res.send('you are at the Lobby')
    //debug
    console.log(`req.cookie: ${JSON.stringify(req.signedCookies)}, loginBoard: ${JSON.stringify(loginBoard)}`)
})

app.get('/', (req,res)=>{
    res.send('Root directory')
    //debug
    console.log(`req.cookie: ${JSON.stringify(req.signedCookies)}, loginBoard: ${JSON.stringify(loginBoard)}`)
})

app.listen(port,()=>{console.log(`listening on ${port}`)})

/*



let expTime = new Date(); expTime.setMinutes(expTime.getMinutes()+30) //30 min expire
console.log(expTime)
console.log(new Date())

app.get('/enable',(req,res)=>{res.send(`login enabled: ${enableLogin=1}`)})
app.get('/disable', (req,res)=>{res.send(`login disabled: ${enableLogin=0}`)})
app.get('/status',(req,res)=>{res.send(`enableLogin: ${enableLogin}`)})
*/