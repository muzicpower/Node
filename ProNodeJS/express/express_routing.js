
/*

Key points of Express study: last update 6/5/2022

1. .use()
    - when url is not specified, same as .use('/')
    - url is cascading
        - use('/abc',) is called for ALL url that starts with '/abc' (ex. '/abc/def', '/abc/xy/z'...) 
    - next('route') is same as next()
    - next('router') moves control to the next router 

2. .get()
    - must have explicit url
    - url requires exact match
        - .get('/abc') is NOT invoked when url is '/abc/def' or '/abc/def/xyz'..
    - next('route') actually moves control to the next 'route'(next call of get(...)) and is not the same as next()
        - unless its called at the very last callback of given get()
    - next('router') moves control to the next router

3. router can be nested in another router

4. analogy
    - app       ~= root directory (bottom most)
        - app = [router|handler]+
    - router    ~= directory (app can have multiple routers, routers can be nested in another router, etc)
        - router =[router|handler]+
    - handler   ~= file

5. generic nature of .use(...)
    - use : generic, represents ALL methods, and cascading url
    - get,post: exact, specific. There is no generic nature at all. URL should be exactly matched  

6. middle wares are executed sequentially

7. how to end control cycle?
    - <NOT CALLING next()> terminates execution. it is like 'return' in function.
    - <NOT CALLING next()> lets control to jump to the end of app middleware stack
    - by reaching to the end of app middleware stack after executing all handlers(middlewares)  

    - .send? - No. Control still proceeds after res.send is called.
        -however, sending more than once throws error
    - next('route') or next('router')? - No. It simply moves to the next control point
        -if that means the end of middleware stack, the req/res cycle ends.

8. What does that mean by being in the same 'route'?
    - when .get(url1, f1, f2, f3); .get(url1, f4, f5); .get(url2, f6, f7)
    - (f1,f2,f3) are in the same route and (f4,f5) are in another same route and so are (f6,f7)
    - f2's next() == f3, f3's next() == f4, f5's next == f6
    - f2's next('route') == f4
    - f4's next('route') != f6 because f6 and f4 has different url

9. How to catch exception?
    - by adding handler (err, req, res, next)

10. How to generate exception?
    - throw new Error
    - next('other than route or router')

11. express().listen() is same as http.createServer().listen

12. try to read usr/lib/express source code, total 3.5k lines


Refs:
1. https://stackoverflow.com/questions/58105027/node-js-express-why-nextroute-does-not-lead-to-the-next-route
2. https://medium.com/analytics-vidhya/nodejs-express-source-code-explanation-c1770ac9c989
3. https://expressjs.com/en/guide/using-middleware.html
*/  

let express = require('express')
let app = express()
let rMeat = express.Router(),
        rBeef = express.Router(),
        rBeefFresh = express.Router(),
        rChicken = express.Router(),
    rVege = express.Router(),
    rFruit = express.Router();

let ml = (msg, nextArg = '')=>{
    return (req, res, next)=>{
        console.log(msg)
        if (typeof nextArg !== 'boolean')
            next(nextArg)
        }
    }

//rMeat
// beef
rBeef.use(ml('you are on Beef section'))
rBeef.use('/NewYork', ml('NewYork-1'),ml('NewYork-2'),ml('NewYork-3'))
rBeef.use('/NewYork',ml('NewYork-4'),ml('NewYork-5'),ml('NewYork-6'))

//another router
rBeefFresh.use('/NewYork',ml('NewYork-7-Fresh'),ml('NewYork-8-Fresh'))

rBeef.use('/RibEye', ml('RibEye-1'), ml('RibEye-2'), ml('RibEye-3'))
rBeef.use('/RibEye', ml('RibEye-4'), ml('RibEye-5'))

rBeef.use('/Sirloin', ml('Sirloin-1'), ml('Sirloin-2'))
rBeef.use('/Sirloin', ml('Sirloin-3'), ml('Sirloin-4'))

// chicken
rChicken.use(ml('Chicken section'))
rChicken.get('/Breast', ml('Breast-1'), ml('Breast-2'))
rChicken.get('/Breast', ml('Breast-3'), ml('Breast-4'))

rChicken.get('/Thigh', ml('Thigh-1'),ml('Thigh-2'))
rChicken.get('/Thigh', ml('Thigh-3'),ml('Thigh-4'))

rChicken.use('/Wing', ml('Wing-1'), ml('Wing-2'), ml('Wing-3'), ml('Wing-4'))
rChicken.use('/Wing', ml('Wing-5'), ml('Wing-6'))
rChicken.use('/Wing', ml('Wing-7'), ml('Wing-8'), ml('Wing-9'))

//meat assembly
rMeat.use(ml('welcome to meat corner'))

rMeat.use('/Beef', ml('other Beef-0'))
rMeat.use('/Beef', rBeef)
rMeat.use('/Beef', ml('other Beef-1'),ml('other Beef-2'))
rMeat.use('/Beef', rBeefFresh)

rMeat.use('/Chicken', rChicken, ml('other chiecken-1'))
rMeat.use('/Chicken', ml('other chiecken-2'))

//rVege
rVege.use(ml('Vege corner'))
rVege.use('/Tomato', ml('cherry'), ml('vine') )
rVege.use('/Potato', ml('gold'), ml('sweet') )
//rVege.use(ml('other vege-3'))
rVege.use('/Crucifix', ml('broccoli'),ml('couli'),ml('cabbage') )

//rFruit
rFruit.use(ml('Fruit corner'))
rFruit.use('/Orange', ml('naval'), ml('cara'))
rFruit.use('/Apple', ml('envy'), ml('pink lady','router'), ml('fuji'), ml('sugarbee'))
rFruit.use('/Grape', ml('red'), ml('black'), ml('green'))

app.use('/',ml('---------------------------------------'))
app.use('/',ml('app-1'),ml('app-2'))
app.use('/Meat',rMeat)
app.use('/', ml('app-3'),ml('app-4'),ml('app-5'))
app.use('/Vege',rVege)
app.use('/',ml('app-6'))
app.use('/Fruit', rFruit)
app.use('/', ml('app-7'), ml('app-8'))

app.listen(30000)