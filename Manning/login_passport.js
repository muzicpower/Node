/*
http://www.passportjs.org/concepts/authentication/downloads/html/
https://stackoverflow.com/questions/29066348/passportjs-serializeuser-and-deserializeuser-execution-flow
https://www.youtube.com/watch?v=-RCnNyD0L-s
https://medium.com/swlh/set-up-an-express-js-app-with-passport-js-and-mongodb-for-password-authentication-6ea05d95335c

- passport manages session with the following:
    - passport.authenticate() -> body-parser -> CB from new LocalStrategy(CB)
    - req.logIn(userObj, CB): sets req.user = userObj
    - req.isAuthneticated()
    - req.user
    - req.logout()

- how to access args of 'done': https://github.com/jaredhanson/passport-local/issues/4
    - passport.authenticate('local',option,CB(arg1, arg2, arg3))
        - {arg1,arg2,arg3} = done(arg1, arg2, arg3) from new LocalStrategy()

    - passport.authenticate() returns function, not its execution
    - thus, in order to invoke CB of LocalStrategy: passport.authenticate()(req,res,next) 

    - original option: { successRedirect: '/workspace', failureRedirect: '/', failureMessage: true,}

ToDo:
2. session DB: use connect-mongo or mongoose
    - current implementation: SessionUserObjMgr : memory based
    - can be changed to 
        - MongoDB based manually, with TTL indexing
        - mongoose
    - https://medium.com/swlh/set-up-an-express-js-app-with-passport-js-and-mongodb-for-password-authentication-6ea05d95335c

    -store:require('connect-mongo').create(option)

    -where to keep user Obj?
        -session memory
            - might consume memory when concurrent user increase
                -but if we use mongodb for session management this won't be true
            - faster than DB
                - we are using MongoDB for session management
            - need a way to store userObj to (logged in) session
                - can be done at CB of passport.authenticate('',option,CB)

            - https://stackoverflow.com/questions/29066348/passportjs-serializeuser-and-deserializeuser-execution-flow
            - convenient: session management is done by connect-mongo 
            - overall better solution

        -separate DB <- we are uging connect-mongo for session
            - won't consume memory significantly
            - but slow
            - implement database access code for each serialize/deserialize

3. main DB: use mongodb or mongoose with bcrypt

4. implement front end page
    - body-parser

*/

let app = require('express')()
let passport = require('passport')
let LocalStrategy = require('passport-local').Strategy

const SessionUserObjMgr = (_storage=>{return (mode, id=-1)=>{ //1. create new user 2. delete user 3. retrieve user: id
    switch(mode){
        case 'create':
            let id_ = 1+Math.floor(Math.random()*10000)
            let userObj = {id:id_, name:`wilson - ${id_}`, addr:`addr : ${id_}`}
            _storage[id_] = userObj
            return userObj

        case 'delete':
            delete _storage[id]
            return null
        case 'read':
            return _storage[id]
        case 'print':
            console.log(`${JSON.stringify(_storage)}`)
            return null
    }
}})({})

//app.use(require('morgan')('common'))
//app.use(require('body-parser').urlencoded({extended:false})) //
app.use((req,res,next)=>{ //body-parser simulator
    if (!req.body) req.body = {}
    req.body.user_name = 'Mr.Stark'
    req.body.pass_word = 'fidelio'
    next()
})
app.use(require('express-session')({ //session == core part of passport 
    secret: 'alkdjfalskdjfalskdjfasdlkjavkm', //signed cookie
    resave: true,
    saveUninitialized: true,
    //store: mongodb or mongoose
}))

passport.use('localLoginStrat'/*default 'local'*/,new LocalStrategy(
    {
        usernameField: "user_name", //telling passport which field name to look for from req.body 
        passwordField: "pass_word", //default: "username", "password"
        passReqToCallback: true
    },
    (req, username, pwd, done)=>{ // username == req.body.user_name , pwd == req.body.pass_word : populated by bodyParser
        let isLoginSuccessful = true
        console.log(`inside local arg1: ${username}, arg2: ${pwd}, sessionId: ${req.session.id}`) //debug
    
        if (isLoginSuccessful)
            return done(null, SessionUserObjMgr('create'), {msg:"Hooray login success"})
        else
            return done(null, false, {message:'login failed'})
 }))
passport.serializeUser((userObj, done)=>{return done(null, userObj.id)})
passport.deserializeUser((id, done)=>{
    SessionUserObjMgr('print') //debug
    return done(null, SessionUserObjMgr('read', id))
}) 

app.use(passport.initialize())
app.use(passport.session())

app.get('/login', 
    (req,res,next)=>{
        if (req.isAuthenticated())res.send('already logged in')
        else next();
    },
    (req,res,next)=>{
        console.log(`before passport.authenticate`) //debug
        function postAuth(err,user,info){ //{err,user,info} == done(arg1,arg2,arg3) from new LocalStrategy
            console.log(`err: ${JSON.stringify(err)}, user:${JSON.stringify(user)} info:${JSON.stringify(info)}`)
            if (!user){
                console.log(`error: ${info.message}`)
                res.redirect('/')
            }
            else{
                req.logIn(user,err=>{//new session is determined at this point 
                    console.log(`after authenticate sessionid: ${req.session.id}`) //debug
                   
                    if(err)next(err);
                    else return res.redirect('/workspace')
                })
            }                            
        }
        passport.authenticate('localLoginStrat',postAuth)(req,res,next) //passport.authenticate wont be executed without this
    }
)
app.get('/logout', (req,res)=>{
    SessionUserObjMgr('delete', req.user.id)
    req.logout(()=>{res.redirect('/')})
})
app.get('/workspace', (req,res)=>{
    console.log(`workspace sessionid: ${req.session.id}`) //debug
    if (req.isAuthenticated())res.send(`At your service Sir! userdata: ${JSON.stringify(req.user)}`)
    else res.send(`NOT authorized`)
})
app.get('/', (req,res)=>{
    console.log(`root dir sessionid: ${req.session.id}`) //debug
    res.send(`Welcome to the world`)
})
app.listen(~~process.argv[2],()=>{console.log(`listening ${~~process.argv[2]}`)})
