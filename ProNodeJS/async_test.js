//https://caolan.github.io/async/v3/docs.html
var async = require('async');

function f_1(){
    console.log('f_1');
    return 1;
}
function f_2(){
    console.log('f_2');
    //throw new Error('f_2 error @#$#%');
    return 2;
}
function f_3(){
    console.log('f_3');
    return 3;
}

console.log('**************');

/*
//async.series([f1,f2,f3...],cb)
async.series([
    cb=>{
        setTimeout(()=>{
            f_1();
            cb(null, 10);
        },3000);
    },
    cb=>{
        setTimeout(()=>{
            f_2();
            cb(new Error('f2 error occurred T_T'), 20);
            cb(null, 20);

        },2000);

    },
    cb=>{
        setTimeout(()=>{
            f_3();
            cb(null,30);

        },1000);

    }],
    (err,res)=>{
        if(err) console.log('error: ' + err);
        else res.forEach((ele,i)=>{console.log(i+'th return: ' + ele);} );
    }
);
*/
/*
async.waterfall([
    (cb)=>{
        setTimeout(()=>{
            f_1();
            cb(null, 300, 400);
        },300);
    },
    (a1,a2, cb)=>{
        setTimeout(()=>{
            f_2();
            cb(null, a1*a1 + a2*a2);
        },200);
    },
    (a1, cb)=>{
        setTimeout(()=>{
            f_3();
            cb(null,Math.sqrt(a1));
        },100);
    }],
    (err,res)=>{
        if(err) console.log('__error: ' + err);
        else console.log(res); //prints 500
    }
);
*/
/*
async.parallel({
    il: (cb)=>{
        setTimeout(()=>{
            f_1();
            cb(null, 10);
        },300);
    },
    ee: (cb)=>{
        setTimeout(()=>{
            f_2();
            //cb(new Error('f2 error occurred T_T'), 20);
            cb(null, 20);
        },200);
    },
    sam: (cb)=>{
        setTimeout(()=>{
            f_3();
            cb(null,30);
        },100);

    }},
    (err,res)=>{
        if(err) console.log('__error: ' + err);
        else console.log(res);
});
*/
/*
async.parallelLimit({
    il: (cb)=>{
        setTimeout(()=>{
            f_1();
            cb(null, 10);
        },300);
    },
    ee: (cb)=>{
        setTimeout(()=>{
            f_2();
            //cb(new Error('f2 error occurred T_T'), 20);
            cb(null, 20);
        },200);
    },
    sam: (cb)=>{
        setTimeout(()=>{
            f_3();
            cb(null,30);
        },100);
    }}, 1 ,   //max number of parallel process
    (err,res)=>{
        if(err) console.log('__error: ' + err);
        else console.log(res);
    });
*/
/*
let queue = async.queue((task, cb)=>{
    console.log(task);
    cb('cb: ' + task.id); //error report: cb == 2nd argment of queue.push
},4);

let i = 0;
setInterval(()=>{
    queue.push({id:i++},arg=>{console.log('myCB arg: ' + + arg);})
},500);
*/

/*
let idx = 0;
async.whilst( //until
    (cb)=>{
        console.log('condition func');
        cb(null, idx<5);
    },
    (cb)=>{
        setTimeout(()=>{
            console.log('idx: ' + idx++);
            //if (idx == 3)      //this is like breaking the loop
            //    cb('ABC___');
            cb(null);
        },800);
    },
    (err)=>{
        console.log('end of while loop: ' + err);
    }
);
*/
