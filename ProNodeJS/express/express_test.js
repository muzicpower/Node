
let express = require('express')
let app = express()

let ml = (msg, nextArg = '')=>{
    return (req, res, next)=>{
        console.log(msg)
        if (typeof nextArg !== 'boolean')
            next(nextArg)
        }
    }

app.use((req,res,next)=>{
    console.log('-----------------')
    res.send('Hello Express!')
    next()
})
app.use(ml('  use mw - 1'))

app.get('/ttt',
    ml('get /ttt #1.0'),
    ml('get /ttt #1.1','route'),
    ml('get /ttt #1.2'),
    ml('get /ttt #1.3')
    )
app.get('/', ml('%%%%%'))
app.get('/ttt', ml('####'))

app.use(ml('  use mw - 2'))

app.get('/', ml('get / #2'))
app.get('/', ml('get / #3'))

app.use(ml('  use mw - 3'))

app.get('/123', ml('get /123 #1'))

app.use(ml('  use mw - 4'))

app.get('/123/456', ml('get /123/456 #1'))

app.use(ml('  use mw - 5'))

app.get('/abc', ml('get /abc #1'))

app.use(ml('  use mw - 6'))

app.use((err,req,res,next)=>{console.log('   Error routine')})

let port = 26000
app.listen(port, ()=>{console.log(`listening on port ${port}`)})


