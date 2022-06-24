
/*
augmentation by express
1. send: 
    - arg1: number == status code, default 200
    - arg2: 
        - string -> Content-Type: text/html
        - Buffer -> Content-Type: application/octet-stream
        - object -> Content-Type: JSON
2. If no router matches -> default 404 is sent
3. Know the url parsing
    - req.url vs req.baseUrl vs req.originalUrl vs req.params.productID

*/  

let mw = (option) => {
    return (req,res,next)=>{
        res.send('<!DOCTYPE html><html><head></head><body><strong>hello express with Router</strong></body></html>')
        console.log(`req received`)
        //next(), next('route'), next('router')
    }
}

let app = require('express')()
let router = require('express').Router()

//router.use(mw('optionList'))
router.get('/abc/:productId', (req,res,next)=>{
    res.send("Requested " + req.url + "##" + req.baseUrl + '##' + req.originalUrl+'##'+req.params.productId)
    next()
})

app.use('/route1', router)
//app.get('/xyz',router,f1,f2)

require('http').createServer(app).listen(~~process.argv[2],()=>{console.log(`listening on port ${~~process.argv[2]}`)})

