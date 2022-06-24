/*
http://expressjs.com/en/resources/middleware.html

Helmet: hacking prevention

connect-ratelimit
response-time
connect-asset: compiles and minifies js and css file
compression

//------------------------------------------------------------------------------------------
//when 'localhost' or '127.0.0.1' is specified after port, connection is not established from wsl
//when '0.0.0.0' is used, connection is ok. Looks like it's 'binding_ip' (accepting address)

//req & res augmentation by express
    - req.params.userId ('/abc/:userId'...)
    - req.ip === '10.x.x.x'  '172.16.x.x.'  '192.168.x.x.'
    - res.status(404).send('~~~')

//morgan
//express.static
//path: takes care of / or \ which depends on OS (windows, linux, etc)

//bcrypt-nodejs
    let bcrypt = require('bcryptjs')
    let SALT_FACTOR = 10

    let plainPwd = 'abcde'
    let hashedPwd;

    bcrypt.genSalt(SALT_FACTOR, (err, salt)=>{bcrypt.hash(plainPwd, salt,(err, hash)=>{hashedPwd = hash;})})

    or
    //hashed = await bcrypt.hash(plainPwd, 10)
    or
    //bcrypt.hash(plainPwd,10,(err,hash)=>{hashedPwd = hash;})

    let guessPwd ='abcdee'
    setTimeout(()=>{
            bcrypt.compare(guessPwd, hashedPwd, (err,isMatch)=>{
                    if (isMatch) console.log('matched')
                    else console.log('NOT matched')
            })
    },500)

//connect-flash : https://www.npmjs.com/package/connect-flash
    let flash = require('connect-flash')
    app.use(flash())
    - populates req.flash()

    req.flash('key1','value1')
    req.flash('key1') // returns 'value1'

    app.configure(function() {
    app.use(express.cookieParser('keyboard cat'));
    app.use(express.session({ cookie: { maxAge: 60000 }}));
    app.use(flash());
    });

//express-session
    skipped and moved on to login_passport as majority of the functions are redundant (passport is built on top of expression-session)
    https://www.npmjs.com/package/express-session#compatible-session-stores
    https://www.npmjs.com/package/connect-mongo

//body-parser
    let bodyParser = require('body-parser')
    let app = require('express')()

    app.use(bodyParser.urlencoded({extended: false})) //== use querystring for parsing (Default: true == use qs for parsing)
    app.use(bodyParser.json())

    //route-specific
    app.post('/urlEncoded',bodyParser.urlencoded({extended: false}), (req,res)=>{req.body.xxx})
    app.post('/jsonEncoded',bodyParser.json(),(req,res)=>{req.body.xxx})


    //in the browser: submit with input name 'box1'
    //=> req.body.box1 == 'text input content' 

    bodyParser.raw()
    bodyParser.text()

//https
    certification
        -openssl req -new -key privatekey.pem -out request.pem
        -https://letsencrypt.org
    generate private key 
        -openssl genrsa -out privatekey.pem 1024
*/

